#!/bin/bash

# Render Backend Deployment Script
# This script helps you prepare and test your backend before deploying to Render

echo "🚀 linkr Backend - Render Deployment Helper"
echo "==========================================="
echo ""

# Step 1: Check if we're in the correct directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found. Please run this script from the backend directory."
    exit 1
fi

echo "✅ Found main.py"
echo ""

# Step 2: Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

echo ""

# Step 3: Activate virtual environment and install dependencies
echo "📦 Installing dependencies from requirements.txt..."
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

# Step 4: Test the application locally
echo "🧪 Testing the application locally..."
echo ""
echo "Starting server at http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""
echo "Once the server is running, visit:"
echo "  📄 API Docs: http://localhost:8000/docs"
echo "  🧪 Test endpoint: http://localhost:8000/"
echo ""

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
