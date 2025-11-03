@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: SME Tally - Offline Package Preparation Script
:: ============================================================================
:: Run this script on a computer WITH internet to create an offline installer
:: ============================================================================

color 0E
title SME Tally - Prepare Offline Package

echo.
echo ============================================================================
echo              SME TALLY - OFFLINE PACKAGE PREPARATION
echo ============================================================================
echo.
echo This script will prepare a complete offline installation package.
echo Run this on a computer WITH internet access.
echo.

:: Check for Node.js
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Install Node.js and try again.
    pause
    exit /b 1
)

echo [STEP 1/5] Installing all dependencies...
call npm install
if %errorLevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed!
echo.

echo [STEP 2/5] Building application...
call npm run build
if %errorLevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Application built!
echo.

echo [STEP 3/5] Creating offline cache directory...
if not exist "offline-cache" mkdir offline-cache
echo [OK] Offline cache directory created!
echo.

echo [STEP 4/5] Packaging dependencies...
echo This may take several minutes depending on your system...
echo.

:: Package node_modules using PowerShell compression
powershell -command "Compress-Archive -Path 'node_modules' -DestinationPath 'offline-cache\node_modules.zip' -CompressionLevel Optimal -Force"
if %errorLevel% neq 0 (
    echo [ERROR] Failed to package dependencies!
    pause
    exit /b 1
)

for %%A in (offline-cache\node_modules.zip) do set size=%%~zA
set /a size_mb=!size! / 1024 / 1024
echo [OK] Dependencies packaged! Size: !size_mb! MB
echo.

echo [STEP 5/5] Creating distribution package...

:: Create distribution directory
if not exist "smetally-offline-installer" mkdir smetally-offline-installer

:: Copy necessary files
xcopy /E /I /Y "client" "smetally-offline-installer\client" >nul
xcopy /E /I /Y "server" "smetally-offline-installer\server" >nul
xcopy /E /I /Y "shared" "smetally-offline-installer\shared" >nul
xcopy /E /I /Y "dist" "smetally-offline-installer\dist" >nul
xcopy /E /I /Y "offline-cache" "smetally-offline-installer\offline-cache" >nul

copy package.json smetally-offline-installer\ >nul
copy package-lock.json smetally-offline-installer\ >nul
copy tsconfig.json smetally-offline-installer\ >nul
copy vite.config.ts smetally-offline-installer\ >nul
copy tailwind.config.ts smetally-offline-installer\ >nul
copy drizzle.config.ts smetally-offline-installer\ >nul
copy postcss.config.js smetally-offline-installer\ >nul
copy install.cmd smetally-offline-installer\ >nul
copy start.cmd smetally-offline-installer\ >nul
copy OFFLINE_INSTALL.md smetally-offline-installer\README.md >nul

if exist "README.md" copy README.md smetally-offline-installer\ >nul

echo [OK] Files copied to distribution package!
echo.

echo ============================================================================
echo                    OFFLINE PACKAGE READY!
echo ============================================================================
echo.
echo The offline installer package is ready in: smetally-offline-installer\
echo.
echo Package Contents:
echo   - Application source code
echo   - Pre-built distribution files
echo   - Packaged dependencies (node_modules.zip)
echo   - Installation scripts (install.cmd, start.cmd)
echo   - Documentation (README.md)
echo.
echo Next Steps:
echo   1. Copy 'smetally-offline-installer' folder to USB drive or DVD
echo   2. On the offline computer, run: install.cmd
echo   3. Follow the installation wizard
echo.
echo Optional: Add Node.js installer
echo   - Download: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
echo   - Save to: smetally-offline-installer\node-installer\
echo.
echo Optional: Add PostgreSQL installer (for data persistence)
echo   - Download: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
echo   - Save to: smetally-offline-installer\postgres-installer\
echo.
echo ============================================================================
echo.

:: Ask if user wants to create a ZIP of the entire package
set /p CREATE_ZIP="Create a ZIP file of the entire package? (Y/N): "
if /i "!CREATE_ZIP!"=="Y" (
    echo.
    echo Creating ZIP file...
    powershell -command "Compress-Archive -Path 'smetally-offline-installer' -DestinationPath 'smetally-offline-installer.zip' -CompressionLevel Optimal -Force"
    if %errorLevel% equ 0 (
        for %%A in (smetally-offline-installer.zip) do set zip_size=%%~zA
        set /a zip_size_mb=!zip_size! / 1024 / 1024
        echo [OK] ZIP package created: smetally-offline-installer.zip (!zip_size_mb! MB)
    ) else (
        echo [ERROR] Failed to create ZIP file
    )
)

echo.
echo Press any key to exit...
pause >nul
