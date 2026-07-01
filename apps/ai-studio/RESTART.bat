@echo off
echo.
echo ===============================================
echo   Stopping All Servers...
echo ===============================================
taskkill /F /IM node.exe >nul 2>&1

echo.
echo   Cleaning WhatsApp Session...
if exist "backend\session" rd /s /q "backend\session"

echo.
echo ===============================================
echo   Starting Backend with New API Key...
echo ===============================================
start "VP Backend" cmd /k "cd backend && npm start"

timeout /t 10 /nobreak >nul

echo.
echo ===============================================
echo   Starting Frontend...
echo ===============================================
start "VP Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ===============================================
echo   Vision Point AI Studio - READY!
echo ===============================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   Opening browser...
echo ===============================================

timeout /t 3 /nobreak >nul
start http://localhost:3000

pause
