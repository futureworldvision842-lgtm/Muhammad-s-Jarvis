@echo off
:: ============================================================
::   JARVIS  -  OPTIONAL BOTS / AGENTS
::   Fetches the external open-source bots so the FULL ecosystem
::   runs: Moltbot (clawdbot), Odysseus AI server, Ollama model.
::   Run this AFTER install.bat.  All are optional - JARVIS core
::   works without them.
:: ============================================================
title JARVIS Extras
chcp 65001 >nul
setlocal enableextensions
cd /d "%~dp0"

echo.
echo   ============================================================
echo      JARVIS  -  INSTALLING OPTIONAL BOTS / AGENTS
echo   ============================================================
echo.

:: ---- Moltbot (clawdbot gateway) ----
echo [1/3] Moltbot (clawdbot) ...
where npm >nul 2>&1
if %errorlevel%==0 (
  call npm install -g clawdbot && echo     -^> clawdbot installed. Supervisor will run "clawdbot gateway".
) else (
  echo     [!] npm not found - install Node.js, then: npm install -g clawdbot
)

:: ---- Odysseus AI server (public repo) ----
echo [2/3] Odysseus AI server ...
where git >nul 2>&1
if %errorlevel%==0 (
  if not exist "bots" mkdir bots
  if not exist "bots\odysseus\app.py" (
    git clone --depth 1 https://github.com/pewdiepie-archdaemon/odysseus.git "bots\odysseus"
  ) else ( echo     -^> already present )
  if exist "bots\odysseus\requirements.txt" (
    ".venv\Scripts\python.exe" -m pip install -r "bots\odysseus\requirements.txt"
  )
  echo     -^> Odysseus ready (supervisor runs it on port 7000).
) else (
  echo     [!] git not found - install Git, then re-run this.
)

:: ---- Ollama local model (offline brain) ----
echo [3/3] Ollama local model ...
where ollama >nul 2>&1
if %errorlevel%==0 (
  echo     Pulling a small local model (llama3.2) - Ctrl+C to skip ...
  call ollama pull llama3.2
) else (
  echo     [!] Ollama not installed. Get it from https://ollama.com/download
  echo         then run:  ollama pull llama3.2
)

echo.
echo   ------------------------------------------------------------
echo    Hermes agent (optional, advanced) is a separate install:
echo      https://github.com/NousResearch  ^(Hermes agent^)
echo    skills\hermes.py auto-detects it once 'hermes' is on PATH.
echo   ------------------------------------------------------------
echo    Done. Run run.bat - the supervisor now also launches any
echo    of these bots that got installed.
echo   ============================================================
echo.
pause
