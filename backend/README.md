# linkr Backend

FastAPI backend for QR code generation using Python.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - API information
- `POST /generate-qr` - Generate QR code (returns base64 encoded image)
- `GET /generate-qr-image/{url}` - Generate QR code and return as PNG file

## Usage

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`
