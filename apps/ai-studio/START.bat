@echo off
echo.
echo ===============================================
echo   Vision Point AI Studio - Starting...
echo ===============================================
echo.

cd /d "e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete"

echo [1/2] Starting Backend Server...
start "VP Backend" cmd /k "cd backend && npm start"

timeout /t 8 /nobreak >nul

echo [2/2] Starting Frontend Development Server...
start "VP Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ===============================================
echo   Vision Point AI Studio Started!
echo ===============================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   Two windows have been opened:
echo   1. Backend (Node.js server with WhatsApp bot)
echo   2. Frontend (React development server)
echo.
echo   Opening browser in 3 seconds...
echo ===============================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

pause
