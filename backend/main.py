from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, HttpUrl
import qrcode
import io
import base64
from typing import Union, List, Optional
import re
import os
import zipfile
import csv
import tempfile
from PIL import Image
import math

app = FastAPI(title="linkr API", description="QR Code Generation API", version="1.0.0")

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Railway deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Additional CORS middleware for Railway
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

class URLRequest(BaseModel):
    url: str
    foreground_color: str = "#000000"
    background_color: str = "#ffffff"
    format: str = "png"
    error_correction: str = "H"
    size: str = "medium"
    border: int = 4

class BatchURLRequest(BaseModel):
    urls: List[str]
    foreground_color: str = "#000000"
    background_color: str = "#ffffff"
    format: str = "png"
    error_correction: str = "H"
    size: str = "medium"
    border: int = 4

class QRResponse(BaseModel):
    qr_code: str  # Base64 encoded PNG
    formatted_url: str

class BatchQRResponse(BaseModel):
    qr_codes: List[dict]  # List of {url: str, qr_code: str, success: bool, error?: str}
    zip_file: Optional[str] = None  # Base64 encoded ZIP file

def get_error_correction_level(level: str):
    """Map string error correction level to qrcode constant"""
    mapping = {
        'L': qrcode.constants.ERROR_CORRECT_L,
        'M': qrcode.constants.ERROR_CORRECT_M,
        'Q': qrcode.constants.ERROR_CORRECT_Q,
        'H': qrcode.constants.ERROR_CORRECT_H,
    }
    return mapping.get(level.upper(), qrcode.constants.ERROR_CORRECT_H)

def get_box_size(size: str):
    """Map string size to box_size value"""
    mapping = {
        'small': 5,
        'medium': 10,
        'large': 15,
    }
    return mapping.get(size.lower(), 10)

def validate_logo_file(file: UploadFile) -> Image.Image:
    """Validate and process logo file for embedding in QR code"""
    ALLOWED_FORMATS = {'PNG', 'JPG', 'JPEG', 'SVG+XML'}
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
    MAX_LOGO_SIZE = 500  # Max pixels
    
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Logo file size exceeds 2MB limit")
    
    # Check file type
    if file.content_type not in ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']:
        raise HTTPException(status_code=400, detail="Unsupported file format. Use PNG, JPG, or SVG")
    
    try:
        # Read the file
        file_content = file.file.read()
        file.file.seek(0)  # Reset file pointer
        
        # Handle SVG files - create a placeholder since we don't have cairosvg
        if file.content_type == 'image/svg+xml':
            # For SVG, create a simple placeholder image
            img = Image.new('RGBA', (200, 200), (255, 255, 255, 0))
        else:
            # Open image for PNG/JPG
            img = Image.open(io.BytesIO(file_content))
        
        # Convert to RGBA if necessary
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Validate dimensions
        if img.width > MAX_LOGO_SIZE or img.height > MAX_LOGO_SIZE:
            # Resize while maintaining aspect ratio
            img.thumbnail((MAX_LOGO_SIZE, MAX_LOGO_SIZE), Image.Resampling.LANCZOS)
        
        return img
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing logo file: {str(e)}")

def remove_background_from_image(logo: Image.Image) -> Image.Image:
    """Remove background from logo image, keeping only the main content"""
    # Convert to RGBA if needed
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Get pixel data
    pixels = logo.load()
    width, height = logo.size
    
    # Detect background color from corners
    # Sample from multiple corners to find the background color
    corner_samples = []
    sample_size = min(width, height) // 8
    
    # Top-left
    for i in range(sample_size):
        for j in range(sample_size):
            corner_samples.append(pixels[i, j])
    
    # Top-right
    for i in range(width - sample_size, width):
        for j in range(sample_size):
            corner_samples.append(pixels[i, j])
    
    # Bottom-left
    for i in range(sample_size):
        for j in range(height - sample_size, height):
            corner_samples.append(pixels[i, j])
    
    # Bottom-right
    for i in range(width - sample_size, width):
        for j in range(height - sample_size, height):
            corner_samples.append(pixels[i, j])
    
    if not corner_samples:
        return logo
    
    # Get most common color from corners (background)
    from collections import Counter
    color_counts = Counter(corner_samples)
    bg_color = color_counts.most_common(1)[0][0] if color_counts else (255, 255, 255, 255)
    
    # Convert bg_color to handle both RGB and RGBA
    if isinstance(bg_color, int):
        bg_color = (bg_color, bg_color, bg_color, 255)
    elif len(bg_color) == 3:
        bg_color = bg_color + (255,)
    
    bg_r, bg_g, bg_b = bg_color[0], bg_color[1], bg_color[2]
    
    # Create new image with transparency
    new_logo = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    new_pixels = new_logo.load()
    
    # Process each pixel
    for x in range(width):
        for y in range(height):
            pixel = pixels[x, y]
            
            # Handle different pixel formats
            if isinstance(pixel, int):
                r = g = b = pixel
                a = 255
            elif len(pixel) == 3:
                r, g, b = pixel
                a = 255
            elif len(pixel) == 4:
                r, g, b, a = pixel
            else:
                r = g = b = a = 255
            
            # Calculate color distance from background
            distance = abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b)
            
            # If color is close to background, make transparent
            if distance < 50:
                new_pixels[x, y] = (r, g, b, 0)
            else:
                new_pixels[x, y] = (r, g, b, a)
    
    return new_logo

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def embed_logo_on_qr(qr_image: Image.Image, logo: Image.Image, background_color: str = "#ffffff", position: str = "center") -> Image.Image:
    """Embed a logo into the QR code with a background box matching the QR background"""
    # Remove background from logo
    logo = remove_background_from_image(logo)
    
    # Calculate logo size (18% of QR code)
    qr_width, qr_height = qr_image.size
    max_logo_size = int(min(qr_width, qr_height) * 0.18)
    
    # Resize logo while maintaining aspect ratio
    logo_aspect = logo.width / logo.height if logo.height > 0 else 1
    if logo.width > max_logo_size or logo.height > max_logo_size:
        if logo_aspect > 1:
            new_width = max_logo_size
            new_height = int(max_logo_size / logo_aspect)
        else:
            new_height = max_logo_size
            new_width = int(max_logo_size * logo_aspect)
        logo = logo.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Ensure logo is RGBA
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Convert QR to RGB if needed
    if qr_image.mode != 'RGB':
        qr_image = qr_image.convert('RGB')
    
    # Calculate center position
    center_x = (qr_width - logo.width) // 2
    center_y = (qr_height - logo.height) // 2
    
    # Create background box with padding around logo
    padding = 10
    box_width = logo.width + (padding * 2)
    box_height = logo.height + (padding * 2)
    box_x = center_x - padding
    box_y = center_y - padding
    
    # Convert background color from hex to RGB
    bg_color = hex_to_rgb(background_color)
    
    # Draw background box
    qr_pixels = qr_image.load()
    for x in range(max(0, box_x), min(qr_width, box_x + box_width)):
        for y in range(max(0, box_y), min(qr_height, box_y + box_height)):
            qr_pixels[x, y] = bg_color
    
    # Paste the logo on top of the background box
    qr_image.paste(logo, (center_x, center_y), logo)
    
    return qr_image

def validate_and_format_url(url: str) -> str:
    """Validate and format URL, adding https:// if needed"""
    url = url.strip()
    
    # Check if URL already has a protocol
    if url.startswith(('http://', 'https://')):
        return url
    
    # Add https:// if no protocol
    formatted_url = f"https://{url}"
    
    # Basic URL validation pattern
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    if not url_pattern.match(formatted_url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    return formatted_url

@app.get("/")
async def root():
    return {"message": "linkr QR Code Generator API", "version": "1.0.0"}

@app.post("/validate-logo")
async def validate_logo(logo: UploadFile = File(...)):
    """Validate logo file for QR code embedding"""
    try:
        logo_image = validate_logo_file(logo)
        return {
            "valid": True,
            "width": logo_image.width,
            "height": logo_image.height,
            "message": "Logo is valid for embedding"
        }
    except HTTPException as e:
        return {
            "valid": False,
            "error": e.detail
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }

@app.post("/generate-qr", response_model=QRResponse)
async def generate_qr(
    url: str = Form(...),
    foreground_color: str = Form("#000000"),
    background_color: str = Form("#ffffff"),
    format: str = Form("png"),
    error_correction: str = Form("H"),
    size: str = Form("medium"),
    border: int = Form(4),
    logo: Optional[UploadFile] = File(None)
):
    """Generate QR code for the provided URL with optional logo embedding"""
    try:
        # Validate and format the URL
        formatted_url = validate_and_format_url(url)
        
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,  # Controls the size of the QR Code
            error_correction=get_error_correction_level(error_correction),  # Error correction level
            box_size=get_box_size(size),  # Size of each box in pixels
            border=border,  # Border size in boxes
        )
        
        # Add data to QR code
        qr.add_data(formatted_url)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color=foreground_color, back_color=background_color)
        
        # Embed logo if provided
        if logo:
            logo_image = validate_logo_file(logo)
            qr_image = embed_logo_on_qr(qr_image, logo_image, background_color)
        
        # Convert to base64 based on format
        img_buffer = io.BytesIO()
        
        if format.lower() == 'png':
            qr_image.save(img_buffer, format='PNG')
            mime_type = "image/png"
        elif format.lower() == 'jpg' or format.lower() == 'jpeg':
            # Convert to RGB for JPEG (remove alpha channel)
            rgb_image = qr_image.convert('RGB')
            rgb_image.save(img_buffer, format='JPEG', quality=95)
            mime_type = "image/jpeg"
        elif format.lower() == 'svg':
            # For SVG, create a basic QR code first and then convert to SVG with custom colors
            import qrcode.image.svg as qr_svg_factory
            
            # Create QR code data matrix
            qr_svg = qrcode.QRCode(
                version=1,
                error_correction=get_error_correction_level(error_correction),
                box_size=get_box_size(size),
                border=border,
            )
            qr_svg.add_data(formatted_url)
            qr_svg.make(fit=True)
            
            # Get the QR code matrix
            matrix = qr_svg.get_matrix()
            
            # Create custom SVG with proper colors
            box_size = get_box_size(size)
            border_size = border
            width = height = (len(matrix) + border_size * 2) * box_size
            
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<rect width="{width}" height="{height}" fill="{background_color}"/>'''
            
            # Add QR code squares
            for row_idx, row in enumerate(matrix):
                for col_idx, module in enumerate(row):
                    if module:  # Black module
                        x = (col_idx + border_size) * box_size
                        y = (row_idx + border_size) * box_size
                        svg_content += f'<rect x="{x}" y="{y}" width="{box_size}" height="{box_size}" fill="{foreground_color}"/>'
            
            svg_content += '</svg>'
            
            img_base64 = base64.b64encode(svg_content.encode()).decode()
            return QRResponse(
                qr_code=f"data:image/svg+xml;base64,{img_base64}",
                formatted_url=formatted_url
            )
        elif format.lower() == 'pdf':
            # For PDF, convert to RGB first then save
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            from reportlab.lib.utils import ImageReader
            import tempfile
            import os
            
            # Convert QR code to RGB and save as temporary image
            rgb_image = qr_image.convert('RGB')
            temp_img = io.BytesIO()
            rgb_image.save(temp_img, format='PNG')
            temp_img.seek(0)
            
            # Create PDF in memory instead of using temporary file
            pdf_buffer = io.BytesIO()
            c = canvas.Canvas(pdf_buffer, pagesize=letter)
            
            # Add image to PDF
            img_reader = ImageReader(temp_img)
            
            # Center the QR code on the page
            page_width, page_height = letter
            qr_size = 300
            x = (page_width - qr_size) / 2
            y = (page_height - qr_size) / 2
            
            c.drawImage(img_reader, x, y, width=qr_size, height=qr_size)
            
            # Add title
            c.setFont("Helvetica-Bold", 16)
            title_x = page_width / 2
            title_y = y + qr_size + 50
            c.drawString(title_x - 30, title_y, "QR Code")  # Approximate centering
            
            # Add URL text
            c.setFont("Helvetica", 10)
            url_text = f"URL: {formatted_url}"
            url_y = y - 30
            # For long URLs, truncate if necessary
            if len(url_text) > 80:
                url_text = url_text[:77] + "..."
            text_width = c.stringWidth(url_text, "Helvetica", 10)
            url_x = (page_width - text_width) / 2
            c.drawString(url_x, url_y, url_text)
            
            c.save()
            
            # Get PDF data and encode to base64
            pdf_buffer.seek(0)
            pdf_data = pdf_buffer.read()
            img_base64 = base64.b64encode(pdf_data).decode()
            
            return QRResponse(
                qr_code=f"data:application/pdf;base64,{img_base64}",
                formatted_url=formatted_url
            )
        else:
            # Default to PNG
            qr_image.save(img_buffer, format='PNG')
            mime_type = "image/png"
        
        img_buffer.seek(0)
        
        # Encode to base64
        img_base64 = base64.b64encode(img_buffer.read()).decode()
        
        return QRResponse(
            qr_code=f"data:{mime_type};base64,{img_base64}",
            formatted_url=formatted_url
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating QR code: {str(e)}")

@app.post("/generate-qr-batch", response_model=BatchQRResponse)
async def generate_qr_batch(request: BatchURLRequest):
    """Generate QR codes for multiple URLs and return as ZIP file"""
    try:
        results = []
        successful_qrs = []
        
        for i, url in enumerate(request.urls):
            try:
                # Validate and format the URL
                formatted_url = validate_and_format_url(url)
                
                # Create QR code instance
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=get_error_correction_level(request.error_correction),
                    box_size=get_box_size(request.size),
                    border=request.border,
                )
                
                # Add data to QR code
                qr.add_data(formatted_url)
                qr.make(fit=True)
                
                # Create QR code image
                qr_image = qr.make_image(fill_color=request.foreground_color, back_color=request.background_color)
                
                # Convert to bytes
                img_buffer = io.BytesIO()
                qr_image.save(img_buffer, format='PNG')
                img_buffer.seek(0)
                
                # Store successful QR code data
                qr_data = {
                    'url': formatted_url,
                    'qr_bytes': img_buffer.getvalue(),
                    'index': i
                }
                successful_qrs.append(qr_data)
                
                results.append({
                    'url': formatted_url,
                    'qr_code': base64.b64encode(img_buffer.getvalue()).decode(),
                    'success': True
                })
                
            except Exception as e:
                results.append({
                    'url': url,
                    'success': False,
                    'error': str(e)
                })
        
        # Create ZIP file if there are successful QR codes
        zip_base64 = None
        if successful_qrs:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for qr_data in successful_qrs:
                    # Create filename from URL
                    url_parts = qr_data['url'].replace('https://', '').replace('http://', '').split('/')
                    filename = f"{url_parts[0]}_{qr_data['index'] + 1}.png"
                    # Sanitize filename
                    filename = re.sub(r'[^\w\-_\.]', '_', filename)
                    zip_file.writestr(filename, qr_data['qr_bytes'])
            
            zip_buffer.seek(0)
            zip_base64 = base64.b64encode(zip_buffer.read()).decode()
        
        return BatchQRResponse(
            qr_codes=results,
            zip_file=zip_base64
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating batch QR codes: {str(e)}")

@app.post("/generate-qr-batch-csv")
async def generate_qr_batch_csv(
    file: UploadFile = File(...),
    foreground_color: str = Form("#000000"),
    background_color: str = Form("#ffffff"),
    format: str = Form("png"),
    error_correction: str = Form("H"),
    size: str = Form("medium"),
    border: int = Form(4)
):
    """Generate QR codes from CSV file and return as ZIP file"""
    try:
        # Read CSV file
        content = await file.read()
        content_str = content.decode('utf-8')
        
        # Parse CSV
        urls = []
        csv_reader = csv.reader(io.StringIO(content_str))
        for row in csv_reader:
            if row and row[0].strip():  # Skip empty rows
                urls.append(row[0].strip())
        
        if not urls:
            raise HTTPException(status_code=400, detail="No valid URLs found in CSV file")
        
        # Create batch request
        batch_request = BatchURLRequest(
            urls=urls,
            foreground_color=foreground_color,
            background_color=background_color,
            format=format,
            error_correction=error_correction,
            size=size,
            border=border
        )
        
        # Generate QR codes
        results = []
        successful_qrs = []
        
        for i, url in enumerate(batch_request.urls):
            try:
                # Validate and format the URL
                formatted_url = validate_and_format_url(url)
                
                # Create QR code instance
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=get_error_correction_level(batch_request.error_correction),
                    box_size=get_box_size(batch_request.size),
                    border=batch_request.border,
                )
                
                # Add data to QR code
                qr.add_data(formatted_url)
                qr.make(fit=True)
                
                # Create QR code image
                qr_image = qr.make_image(fill_color=batch_request.foreground_color, back_color=batch_request.background_color)
                
                # Convert to bytes
                img_buffer = io.BytesIO()
                qr_image.save(img_buffer, format='PNG')
                img_buffer.seek(0)
                
                # Store successful QR code data
                qr_data = {
                    'url': formatted_url,
                    'qr_bytes': img_buffer.getvalue(),
                    'index': i
                }
                successful_qrs.append(qr_data)
                
                results.append({
                    'url': formatted_url,
                    'qr_code': base64.b64encode(img_buffer.getvalue()).decode(),
                    'success': True
                })
                
            except Exception as e:
                results.append({
                    'url': url,
                    'success': False,
                    'error': str(e)
                })
        
        # Create ZIP file if there are successful QR codes
        if successful_qrs:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for qr_data in successful_qrs:
                    # Create filename from URL
                    url_parts = qr_data['url'].replace('https://', '').replace('http://', '').split('/')
                    filename = f"{url_parts[0]}_{qr_data['index'] + 1}.png"
                    # Sanitize filename
                    filename = re.sub(r'[^\w\-_\.]', '_', filename)
                    zip_file.writestr(filename, qr_data['qr_bytes'])
            
            zip_buffer.seek(0)
            
            return StreamingResponse(
                io.BytesIO(zip_buffer.read()),
                media_type="application/zip",
                headers={"Content-Disposition": "attachment; filename=qr_codes_batch.zip"}
            )
        else:
            raise HTTPException(status_code=400, detail="No QR codes could be generated from the provided URLs")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV file: {str(e)}")

@app.get("/generate-qr-image/{url:path}")
async def generate_qr_image(url: str):
    """Generate QR code and return as PNG image"""
    try:
        # Validate and format the URL
        formatted_url = validate_and_format_url(url)
        
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        
        # Add data to QR code
        qr.add_data(formatted_url)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        img_buffer = io.BytesIO()
        qr_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return StreamingResponse(
            io.BytesIO(img_buffer.read()),
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=qr_code.png"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating QR code: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
