@echo off
:: ============================================================
::   JARVIS  -  START EVERYTHING
::   Launches the supervisor, which brings up the voice GUI,
::   dashboard, phone remote and WhatsApp bridge, and keeps
::   them all alive (auto-restarts anything that dies).
:: ============================================================
title JARVIS
chcp 65001 >nul
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo [X] Not installed yet. Run install.bat first.
  pause & exit /b 1
)

if not exist "config\api_keys.json" (
  echo [X] config\api_keys.json missing. Run install.bat, then add your Gemini key.
  pause & exit /b 1
)

echo Starting JARVIS ecosystem ...
".venv\Scripts\python.exe" bootstrap\supervisor.py
