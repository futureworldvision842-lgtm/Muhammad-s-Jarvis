@echo off
echo Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing dependencies. Please check your Node.js installation.
    pause
    exit /b %errorlevel%
)

echo.
echo Starting development server...
call npm run dev

