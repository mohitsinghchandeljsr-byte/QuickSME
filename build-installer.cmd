@echo off
setlocal EnableDelayedExpansion

:: ============================================================================
:: SME Tally - Windows Installer Build Script
:: ============================================================================

color 0A
title SME Tally - Building Windows Installer

echo.
echo ============================================================================
echo              SME TALLY - WINDOWS INSTALLER BUILD
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
echo [OK] Node.js found: 
node --version

:: Check if makensis is available
where makensis >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] NSIS (makensis) not found in PATH
    echo.
    echo Please install NSIS from: https://nsis.sourceforge.io/
    echo.
    echo Download: https://sourceforge.net/projects/nsis/files/latest/download
    echo.
    echo After installation, add NSIS to your PATH:
    echo   C:\Program Files (x86)\NSIS
    echo.
    pause
    exit /b 1
)
echo [OK] NSIS found

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

:: Check if LICENSE file exists
if not exist "LICENSE" (
    echo [INFO] Creating LICENSE file...
    echo MIT License > LICENSE
    echo. >> LICENSE
    echo Copyright (c) 2024 Mohit Singh Chandel >> LICENSE
    echo. >> LICENSE
    echo Permission is hereby granted, free of charge, to any person obtaining a copy >> LICENSE
    echo of this software and associated documentation files (the "Software"), to deal >> LICENSE
    echo in the Software without restriction, including without limitation the rights >> LICENSE
    echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell >> LICENSE
    echo copies of the Software, and to permit persons to whom the Software is >> LICENSE
    echo furnished to do so, subject to the following conditions: >> LICENSE
    echo. >> LICENSE
    echo The above copyright notice and this permission notice shall be included in all >> LICENSE
    echo copies or substantial portions of the Software. >> LICENSE
    echo. >> LICENSE
    echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR >> LICENSE
    echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, >> LICENSE
    echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE >> LICENSE
    echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER >> LICENSE
    echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, >> LICENSE
    echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE >> LICENSE
    echo SOFTWARE. >> LICENSE
    echo [OK] LICENSE file created
)

echo.
echo ============================================================================
echo [INFO] Building Windows Installer...
echo ============================================================================
echo.

:: Build the installer
makensis installer.nsi

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installer build failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Installer built successfully!
echo.

:: Check if installer was created
if exist "SMETally-Setup-1.0.0.exe" (
    echo [OK] Installer created: SMETally-Setup-1.0.0.exe
    
    :: Calculate SHA256 hash
    echo.
    echo [INFO] Calculating SHA256 hash...
    echo.
    
    for /f "skip=1 tokens=*" %%a in ('certutil -hashfile SMETally-Setup-1.0.0.exe SHA256') do (
        if not defined HASH (
            set "HASH=%%a"
            set "HASH=!HASH: =!"
        )
    )
    
    echo SHA256 Hash: !HASH!
    echo.
    
    :: Update WinGet manifest
    echo [INFO] Updating WinGet manifest...
    
    powershell -Command "(Get-Content winget-manifest\MohitSinghChandel.SMETally.installer.yaml) -replace 'REPLACE_WITH_ACTUAL_SHA256_HASH', '!HASH!' | Set-Content winget-manifest\MohitSinghChandel.SMETally.installer.yaml"
    
    echo [OK] WinGet manifest updated with SHA256 hash
    echo.
    
    :: Show file info
    echo ============================================================================
    echo                    INSTALLER INFORMATION
    echo ============================================================================
    echo.
    echo File: SMETally-Setup-1.0.0.exe
    for %%I in (SMETally-Setup-1.0.0.exe) do echo Size: %%~zI bytes
    echo SHA256: !HASH!
    echo.
    echo ============================================================================
    echo.
    echo NEXT STEPS:
    echo -----------
    echo 1. Upload SMETally-Setup-1.0.0.exe to GitHub Releases
    echo    https://github.com/mohitsinghchandeljsr-byte/smetally/releases
    echo.
    echo 2. Update the InstallerUrl in:
    echo    winget-manifest\MohitSinghChandel.SMETally.installer.yaml
    echo.
    echo 3. Submit to WinGet repository:
    echo    https://github.com/microsoft/winget-pkgs
    echo.
    echo 4. Users can then install via:
    echo    winget install MohitSinghChandel.SMETally
    echo.
    echo ============================================================================
    
) else (
    echo [ERROR] Installer file not found!
    pause
    exit /b 1
)

echo.
pause
