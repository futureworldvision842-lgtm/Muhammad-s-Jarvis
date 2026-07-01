@echo off
echo.
echo ================================================
echo   Vision Point AI Studio - FINAL START
echo ================================================
echo.

REM Kill all node processes
echo [1/4] Stopping old servers...
taskkill /F /IM node.exe >nul 2>&1

REM Clean session
echo [2/4] Cleaning WhatsApp session...
if exist "e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete\backend\session" (
    rd /s /q "e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete\backend\session"
)

echo.
echo [3/4] Starting Backend Server...
echo        API: ModelsLab (Gemini 2.5 Pro)
echo        Port: 5000
echo.

start "VP Backend" cmd /k "cd /d ""e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete\backend"" && npm start"

timeout /t 10 /nobreak >nul

echo [4/4] Starting Frontend Server...
echo        Port: 3000
echo.

start "VP Frontend" cmd /k "cd /d ""e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete\frontend"" && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ================================================
echo   ✅ Vision Point AI Studio Started!
echo ================================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   API Provider: ModelsLab (Gemini 2.5 Pro)
echo   WhatsApp: Will auto-connect (scan QR code)
echo.
echo ================================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

pause
