@echo off
setlocal EnableDelayedExpansion

:: ============================================================================
:: SME Tally - Setup Package Creator
:: Creates a minimal portable package with just the essentials
:: ============================================================================

color 0A
title SME Tally - Creating Setup Package

echo.
echo ============================================================================
echo              SME TALLY - SETUP PACKAGE CREATOR
echo ============================================================================
echo.

:: Check if dist folder exists
if not exist "dist\index.js" (
    echo [ERROR] Application not built! Please run: npm run build
    pause
    exit /b 1
)

echo [OK] Application build found

:: Create package directory
set "PACKAGE_NAME=SMETally-Setup-1.0.0"
set "PACKAGE_DIR=%TEMP%\%PACKAGE_NAME%"

echo.
echo [INFO] Creating package structure...
if exist "%PACKAGE_DIR%" rmdir /s /q "%PACKAGE_DIR%" 2>nul
mkdir "%PACKAGE_DIR%"

:: Copy only essential files (avoiding locked source files)
echo [INFO] Copying essential files...
xcopy /e /i /q "dist" "%PACKAGE_DIR%\dist" >nul
copy "package.json" "%PACKAGE_DIR%\" >nul
copy "start.cmd" "%PACKAGE_DIR%\" >nul

:: Create portable launcher
echo [INFO] Creating launcher...
(
echo @echo off
echo :: SME Tally Portable Launcher
echo title SME Tally - Portable Edition
echo color 0A
echo echo.
echo echo ============================================================================
echo echo              SME TALLY ACCOUNTING SOFTWARE
echo echo ============================================================================
echo echo.
echo echo [INFO] Starting SME Tally...
echo echo [INFO] Open browser and go to: http://localhost:5000
echo echo.
echo echo [INFO] Press Ctrl+C to stop the server
echo echo ============================================================================
echo echo.
echo node dist\index.js
echo echo.
echo echo [INFO] Server stopped.
echo pause
) > "%PACKAGE_DIR%\Start-SME-Tally.cmd"

:: Create README
echo [INFO] Creating documentation...
(
echo SME Tally v1.0.0 - Setup Package
echo =================================
echo.
echo QUICK START:
echo ------------
echo 1. Extract this ZIP file
echo 2. Double-click "Start-SME-Tally.cmd"
echo 3. Open browser to: http://localhost:5000
echo.
echo REQUIREMENTS:
echo -------------
echo - Windows 10/11 (64-bit)
echo - Node.js 18+ (https://nodejs.org/)
echo.
echo FILES:
echo ------
echo - dist/              : Compiled application
echo - Start-SME-Tally.cmd: Launcher script
echo - package.json       : Package info
echo.
echo FEATURES:
echo ---------
echo - No installation required
echo - No admin privileges needed
echo - Portable - runs from any folder
echo.
echo For support: https://github.com/mohitsinghchandeljsr-byte/smetally
echo.
echo (c) 2024 Mohit Singh Chandel
) > "%PACKAGE_DIR%\README.txt"

echo [OK] Package structure created

:: Create ZIP using PowerShell with error handling
echo.
echo [INFO] Creating ZIP archive...
set "ZIP_PATH=%CD%\%PACKAGE_NAME%.zip"

powershell -Command "$ErrorActionPreference = 'Stop'; try { Compress-Archive -Path '%PACKAGE_DIR%\*' -DestinationPath '%ZIP_PATH%' -Force; Write-Host '[OK] ZIP created successfully' } catch { Write-Host '[ERROR] Failed to create ZIP:' $_.Exception.Message }"

:: Check if ZIP was created
if exist "%ZIP_PATH%" (
    echo.
    echo [OK] Setup package created: %PACKAGE_NAME%.zip
    for %%I in ("%ZIP_PATH%") do echo [INFO] Size: %%~zI bytes
    
    :: Calculate SHA256
    echo.
    echo [INFO] SHA256 Hash:
    certutil -hashfile "%ZIP_PATH%" SHA256 | findstr /v "CertUtil" | findstr /v "SHA256"
    
    :: Move to current directory
    move "%ZIP_PATH%" "." >nul 2>&1
) else (
    echo [ERROR] Failed to create ZIP file
)

:: Cleanup
rmdir /s /q "%PACKAGE_DIR%" 2>nul

echo.
echo ============================================================================
echo                    SETUP PACKAGE CREATED SUCCESSFULLY
echo ============================================================================
echo.
echo File: %PACKAGE_NAME%.zip
echo.
echo NEXT STEPS:
echo -----------
echo 1. Distribute %PACKAGE_NAME%.zip to users
echo 2. Users extract and run Start-SME-Tally.cmd
echo 3. Access application at http://localhost:5000
echo.
echo ============================================================================
echo.

pause
