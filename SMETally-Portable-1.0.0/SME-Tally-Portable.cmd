@echo off
:: SME Tally Portable Launcher
:: This script launches SME Tally without installation

title SME Tally - Portable
color 0A

echo ============================================================================
echo              SME TALLY - PORTABLE MODE
echo ============================================================================
echo.
echo [INFO] Starting SME Tally in portable mode...
echo [INFO] Server will start on: http://localhost:5000
echo.
echo [INFO] Press Ctrl+C to stop the server
echo ============================================================================
echo.

node dist\index.js

echo.
echo ============================================================================
echo [INFO] Server stopped.
echo ============================================================================
pause
