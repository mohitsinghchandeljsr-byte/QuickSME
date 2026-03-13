@echo off
setlocal

:: ============================================================================
:: SME Tally - Application Startup Script
:: ============================================================================

color 0A
title SME Tally - Accounting Application

echo.
echo ============================================================================
echo                        SME TALLY - STARTING
echo ============================================================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo Please run install.cmd first to set up the application.
    echo.
    pause
    exit /b 1
)

:: Check if build exists
if not exist "dist" (
    echo [ERROR] Application not built!
    echo Please run install.cmd first to build the application.
    echo.
    pause
    exit /b 1
)

:: Set production environment
set NODE_ENV=production

echo [INFO] Starting SME Tally Accounting Application...
echo [INFO] Server will start on: http://localhost:5000
echo.
echo [INFO] Press Ctrl+C to stop the server
echo ============================================================================
echo.

:: Start the application
node dist/index.js

:: If the application exits
echo.
echo ============================================================================
echo [INFO] Application stopped.
echo.
pause
