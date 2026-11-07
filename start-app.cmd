@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 was not found. Opening index.html directly in your browser.
  start "" "%~dp0index.html"
  exit /b 0
)

start "Japanese cooking app server" /min python -m http.server 8000 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000"
endlocal
