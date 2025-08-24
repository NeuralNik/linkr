@echo off
echo Starting linkr application...
echo.

echo Starting Python backend...
cd backend
start cmd /k "python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting frontend...
cd ..
start cmd /k "pnpm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo Backend API docs will be available at: http://localhost:8000/docs
echo.
pause
