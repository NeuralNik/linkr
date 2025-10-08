@echo off
REM Render Backend Deployment Script for Windows
REM This script helps you prepare and test your backend before deploying to Render

echo.
echo 🚀 linkr Backend - Render Deployment Helper
echo ===========================================
echo.

REM Step 1: Check if we're in the correct directory
if not exist "main.py" (
    echo ❌ Error: main.py not found. Please run this script from the backend directory.
    exit /b 1
)

echo ✅ Found main.py
echo.

REM Step 2: Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

echo.

REM Step 3: Activate virtual environment and install dependencies
echo 📦 Installing dependencies from requirements.txt...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo ✅ All dependencies installed successfully!
echo.

REM Step 4: Test the application locally
echo 🧪 Testing the application locally...
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
echo Once the server is running, visit:
echo   📄 API Docs: http://localhost:8000/docs
echo   🧪 Test endpoint: http://localhost:8000/
echo.

REM Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
