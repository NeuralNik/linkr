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

@app.post("/generate-qr", response_model=QRResponse)
async def generate_qr(request: URLRequest):
    """Generate QR code for the provided URL"""
    try:
        # Validate and format the URL
        formatted_url = validate_and_format_url(request.url)
        
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,  # Controls the size of the QR Code
            error_correction=get_error_correction_level(request.error_correction),  # Error correction level
            box_size=get_box_size(request.size),  # Size of each box in pixels
            border=request.border,  # Border size in boxes
        )
        
        # Add data to QR code
        qr.add_data(formatted_url)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color=request.foreground_color, back_color=request.background_color)
        
        # Convert to base64 based on format
        img_buffer = io.BytesIO()
        
        if request.format.lower() == 'png':
            qr_image.save(img_buffer, format='PNG')
            mime_type = "image/png"
        elif request.format.lower() == 'jpg' or request.format.lower() == 'jpeg':
            # Convert to RGB for JPEG (remove alpha channel)
            rgb_image = qr_image.convert('RGB')
            rgb_image.save(img_buffer, format='JPEG', quality=95)
            mime_type = "image/jpeg"
        elif request.format.lower() == 'svg':
            # For SVG, create a basic QR code first and then convert to SVG with custom colors
            import qrcode.image.svg as qr_svg_factory
            
            # Create QR code data matrix
            qr_svg = qrcode.QRCode(
                version=1,
                error_correction=get_error_correction_level(request.error_correction),
                box_size=get_box_size(request.size),
                border=request.border,
            )
            qr_svg.add_data(formatted_url)
            qr_svg.make(fit=True)
            
            # Get the QR code matrix
            matrix = qr_svg.get_matrix()
            
            # Create custom SVG with proper colors
            box_size = get_box_size(request.size)
            border = request.border
            width = height = (len(matrix) + border * 2) * box_size
            
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<rect width="{width}" height="{height}" fill="{request.background_color}"/>'''
            
            # Add QR code squares
            for row_idx, row in enumerate(matrix):
                for col_idx, module in enumerate(row):
                    if module:  # Black module
                        x = (col_idx + border) * box_size
                        y = (row_idx + border) * box_size
                        svg_content += f'<rect x="{x}" y="{y}" width="{box_size}" height="{box_size}" fill="{request.foreground_color}"/>'
            
            svg_content += '</svg>'
            
            img_base64 = base64.b64encode(svg_content.encode()).decode()
            return QRResponse(
                qr_code=f"data:image/svg+xml;base64,{img_base64}",
                formatted_url=formatted_url
            )
        elif request.format.lower() == 'pdf':
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
