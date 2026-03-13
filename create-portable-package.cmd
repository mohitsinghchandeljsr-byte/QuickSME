@echo off
setlocal EnableDelayedExpansion

:: ============================================================================
:: SME Tally - Portable Package Creator
:: Creates a portable ZIP package and MSI installer alternative
:: ============================================================================

color 0A
title SME Tally - Creating Portable Package

echo.
echo ============================================================================
echo              SME TALLY - PORTABLE PACKAGE CREATOR
echo ============================================================================
echo.

:: Check prerequisites
echo [INFO] Checking prerequisites...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Check if 7-Zip is available (optional)
set "ZIP_TOOL=powershell"
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    set "ZIP_TOOL=7zip"
    echo [OK] 7-Zip found (will use for compression)
) else (
    echo [INFO] 7-Zip not found, will use PowerShell for compression
)

:: Check if dist folder exists
if not exist "dist\index.js" (
    echo [INFO] Application not built. Building now...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
) else (
    echo [OK] Application already built
)

echo.
echo ============================================================================
echo [INFO] Creating portable package structure...
echo ============================================================================
echo.

:: Create package directory
set "PACKAGE_DIR=SMETally-Portable-1.0.0"
if exist "%PACKAGE_DIR%" rmdir /s /q "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%"

:: Copy essential files
echo [INFO] Copying application files...

xcopy /e /i /q "dist" "%PACKAGE_DIR%\dist" >nul
xcopy /e /i /q "server" "%PACKAGE_DIR%\server" >nul
xcopy /e /i /q "shared" "%PACKAGE_DIR%\shared" >nul
xcopy /e /i /q "client" "%PACKAGE_DIR%\client" >nul
xcopy /e /i /q "migrations" "%PACKAGE_DIR%\migrations" >nul
copy "package.json" "%PACKAGE_DIR%\" >nul
copy "start.cmd" "%PACKAGE_DIR%\" >nul

:: Create portable launcher
echo [INFO] Creating portable launcher...
(
echo @echo off
echo :: SME Tally Portable Launcher
echo :: This script launches SME Tally without installation
echo.
echo title SME Tally - Portable
echo color 0A
echo.
echo echo ============================================================================
echo echo              SME TALLY - PORTABLE MODE
echo echo ============================================================================
echo echo.
echo echo [INFO] Starting SME Tally in portable mode...
echo echo [INFO] Server will start on: http://localhost:5000
echo echo.
echo echo [INFO] Press Ctrl+C to stop the server
echo echo ============================================================================
echo echo.
echo.
echo node dist\index.js
echo.
echo echo.
echo echo ============================================================================
echo echo [INFO] Server stopped.
echo echo ============================================================================
echo pause
) > "%PACKAGE_DIR%\SME-Tally-Portable.cmd"

:: Create README for portable version
echo [INFO] Creating README...
(
echo SME Tally v1.0.0 - Portable Edition
echo ===================================
echo.
echo This is a portable version of SME Tally that requires no installation.
echo.
echo REQUIREMENTS:
echo -------------
echo - Windows 10/11 (64-bit)
echo - Node.js 18+ (https://nodejs.org/)
echo.
echo HOW TO USE:
echo -----------
echo 1. Extract this ZIP file to any folder
echo 2. Double-click "SME-Tally-Portable.cmd"
echo 3. Open browser and go to: http://localhost:5000
echo.
echo OR run manually:
echo   node dist\index.js
echo.
echo FILES INCLUDED:
echo ---------------
echo - dist/           : Compiled application
echo - server/         : Server-side code
echo - client/         : Client-side code
echo - shared/         : Shared schemas
echo - migrations/     : Database migrations
echo - package.json    : Package configuration
echo - start.cmd       : Windows launcher
echo.
echo PORTABLE FEATURES:
echo ------------------
echo - No installation required
echo - No registry changes
echo - No admin privileges needed
echo - Can run from USB drive
echo - Leaves no traces on host computer
echo.
echo SUPPORT:
echo --------
echo GitHub: https://github.com/mohitsinghchandeljsr-byte/smetally
echo Issues: https://github.com/mohitsinghchandeljsr-byte/smetally/issues
echo.
echo LICENSE: MIT
echo.
echo (c) 2024 Mohit Singh Chandel
) > "%PACKAGE_DIR%\README-PORTABLE.txt"

echo [OK] Portable package structure created

echo.
echo ============================================================================
echo [INFO] Creating ZIP archive...
echo ============================================================================
echo.

:: Create ZIP using available tool
if "%ZIP_TOOL%"=="7zip" (
    echo [INFO] Using 7-Zip for compression...
    7z a -tzip "SMETally-Portable-1.0.0.zip" "%PACKAGE_DIR%" -mx=9 >nul
) else (
    echo [INFO] Using PowerShell for compression...
    powershell -Command "Compress-Archive -Path '%PACKAGE_DIR%' -DestinationPath 'SMETally-Portable-1.0.0.zip' -Force"
)

if exist "SMETally-Portable-1.0.0.zip" (
    echo [OK] ZIP archive created: SMETally-Portable-1.0.0.zip
    for %%I in (SMETally-Portable-1.0.0.zip) do echo [INFO] Size: %%~zI bytes
) else (
    echo [ERROR] Failed to create ZIP archive!
    pause
    exit /b 1
)

:: Calculate SHA256 hash
echo.
echo [INFO] Calculating SHA256 hash...
for /f "skip=1 tokens=*" %%a in ('certutil -hashfile SMETally-Portable-1.0.0.zip SHA256') do (
    if not defined HASH (
        set "HASH=%%a"
        set "HASH=!HASH: =!"
    )
)
echo SHA256: !HASH!

:: Cleanup
echo.
echo [INFO] Cleaning up temporary files...
rmdir /s /q "%PACKAGE_DIR%" >nul 2>&1

echo.
echo ============================================================================
echo                    PORTABLE PACKAGE CREATED SUCCESSFULLY
echo ============================================================================
echo.
echo File: SMETally-Portable-1.0.0.zip
for %%I in (SMETally-Portable-1.0.0.zip) do echo Size: %%~zI bytes
echo SHA256: !HASH!
echo.
echo DISTRIBUTION OPTIONS:
echo ---------------------
echo.
echo 1. DIRECT DOWNLOAD:
echo    - Upload SMETally-Portable-1.0.0.zip to GitHub Releases
echo    - Users download, extract, and run SME-Tally-Portable.cmd
echo.
echo 2. WINGET (RECOMMENDED):
echo    - Create installer using build-installer.cmd
echo    - Submit to Microsoft WinGet repository
echo    - Users install: winget install MohitSinghChandel.SMETally
echo.
echo 3. MICROSOFT STORE:
echo    - Convert to MSIX package
echo    - Submit to Microsoft Store
echo.
echo 4. CHOCOLATEY:
echo    - Create Chocolatey package
echo    - Submit to chocolatey.org
echo.
echo ============================================================================
echo.

pause
