; SME Tally Windows Installer Script
; NSIS (Nullsoft Scriptable Install System)
; Creates a professional Windows installer for SME Tally

!include "MUI2.nsh"
!include "LogicLib.nsh"

; Application Information
!define APP_NAME "SME Tally"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Mohit Singh Chandel"
!define APP_WEB_SITE "https://github.com/mohitsinghchandeljsr-byte/smetally"
!define APP_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\SMETally.exe"
!define APP_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
!define APP_UNINST_ROOT_KEY "HKLM"

; Installer Settings
Name "${APP_NAME}"
OutFile "SMETally-Setup-1.0.0.exe"
InstallDir "$PROGRAMFILES64\SMETally"
InstallDirRegKey HKLM "${APP_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

; Modern UI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Welcome Page
!define MUI_WELCOMEPAGE_TITLE "Welcome to SME Tally Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of SME Tally.$\r$\n$\r$\nSME Tally is an ultra-fast, keyboard-friendly accounting application for Indian SMEs.$\r$\n$\r$\nClick Next to continue."

; License Page
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Language
!insertmacro MUI_LANGUAGE "English"

; Sections
Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Create directories
  CreateDirectory "$INSTDIR\dist"
  CreateDirectory "$INSTDIR\dist\public"
  CreateDirectory "$INSTDIR\node_modules"
  CreateDirectory "$INSTDIR\server"
  CreateDirectory "$INSTDIR\shared"
  CreateDirectory "$INSTDIR\client"
  CreateDirectory "$INSTDIR\migrations"
  
  ; Copy main application files
  File "dist\index.js"
  File "package.json"
  File "start.cmd"
  File "LICENSE"
  
  ; Copy dist/public folder (static files)
  SetOutPath "$INSTDIR\dist\public"
  File /r "dist\public\*.*"
  
  ; Copy essential node_modules (production dependencies only)
  SetOutPath "$INSTDIR\node_modules"
  File /r "node_modules\express\*.*"
  File /r "node_modules\@neondatabase\*.*"
  File /r "node_modules\@octokit\*.*"
  File /r "node_modules\@hookform\*.*"
  File /r "node_modules\@jridgewell\*.*"
  File /r "node_modules\@radix-ui\*.*"
  File /r "node_modules\@tanstack\*.*"
  File /r "node_modules\@types\*.*"
  File /r "node_modules\class-variance-authority\*.*"
  File /r "node_modules\clsx\*.*"
  File /r "node_modules\cmdk\*.*"
  File /r "node_modules\connect-pg-simple\*.*"
  File /r "node_modules\date-fns\*.*"
  File /r "node_modules\drizzle-orm\*.*"
  File /r "node_modules\drizzle-zod\*.*"
  File /r "node_modules\embla-carousel-react\*.*"
  File /r "node_modules\express-session\*.*"
  File /r "node_modules\framer-motion\*.*"
  File /r "node_modules\html2canvas\*.*"
  File /r "node_modules\input-otp\*.*"
  File /r "node_modules\jspdf\*.*"
  File /r "node_modules\lucide-react\*.*"
  File /r "node_modules\memorystore\*.*"
  File /r "node_modules\next-themes\*.*"
  File /r "node_modules\openai\*.*"
  File /r "node_modules\passport\*.*"
  File /r "node_modules\passport-local\*.*"
  File /r "node_modules\postgres\*.*"
  File /r "node_modules\react\*.*"
  File /r "node_modules\react-day-picker\*.*"
  File /r "node_modules\react-dom\*.*"
  File /r "node_modules\react-hook-form\*.*"
  File /r "node_modules\react-icons\*.*"
  File /r "node_modules\react-resizable-panels\*.*"
  File /r "node_modules\recharts\*.*"
  File /r "node_modules\tailwind-merge\*.*"
  File /r "node_modules\tailwindcss-animate\*.*"
  File /r "node_modules\tw-animate-css\*.*"
  File /r "node_modules\vaul\*.*"
  File /r "node_modules\wouter\*.*"
  File /r "node_modules\ws\*.*"
  File /r "node_modules\zod\*.*"
  File /r "node_modules\zod-validation-error\*.*"
  
  ; Copy server files
  SetOutPath "$INSTDIR\server"
  File /r "server\*.*"
  
  ; Copy shared files
  SetOutPath "$INSTDIR\shared"
  File /r "shared\*.*"
  
  ; Copy client files
  SetOutPath "$INSTDIR\client"
  File /r "client\*.*"
  
  ; Copy migrations
  SetOutPath "$INSTDIR\migrations"
  File /r "migrations\*.*"
  
  ; Create Start Menu shortcuts
  CreateDirectory "$SMPROGRAMS\SMETally"
  CreateShortcut "$SMPROGRAMS\SMETally\SME Tally.lnk" "$INSTDIR\start.cmd" "" "$INSTDIR\dist\public\favicon.png" 0
  CreateShortcut "$SMPROGRAMS\SMETally\Uninstall.lnk" "$INSTDIR\uninst.exe"
  
  ; Create Desktop shortcut
  CreateShortcut "$DESKTOP\SME Tally.lnk" "$INSTDIR\start.cmd" "" "$INSTDIR\dist\public\favicon.png" 0
  
  ; Register application
  WriteRegStr HKLM "${APP_DIR_REGKEY}" "" "$INSTDIR\start.cmd"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "DisplayIcon" "$INSTDIR\dist\public\favicon.png"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "URLInfoAbout" "${APP_WEB_SITE}"
  WriteRegStr HKLM "${APP_UNINST_KEY}" "Publisher" "${APP_PUBLISHER}"
  
  ; Write uninstaller
  WriteUninstaller "$INSTDIR\uninst.exe"
SectionEnd

; Uninstaller Section
Section Uninstall
  ; Remove shortcuts
  Delete "$SMPROGRAMS\SMETally\Uninstall.lnk"
  Delete "$SMPROGRAMS\SMETally\SME Tally.lnk"
  RMDir "$SMPROGRAMS\SMETally"
  Delete "$DESKTOP\SME Tally.lnk"
  
  ; Remove installed files
  RMDir /r "$INSTDIR\dist"
  RMDir /r "$INSTDIR\node_modules"
  RMDir /r "$INSTDIR\server"
  RMDir /r "$INSTDIR\shared"
  RMDir /r "$INSTDIR\client"
  RMDir /r "$INSTDIR\migrations"
  Delete "$INSTDIR\package.json"
  Delete "$INSTDIR\start.cmd"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\index.js"
  Delete "$INSTDIR\uninst.exe"
  
  ; Remove installation directory
  RMDir "$INSTDIR"
  
  ; Remove registry keys
  DeleteRegKey HKLM "${APP_UNINST_KEY}"
  DeleteRegKey HKLM "${APP_DIR_REGKEY}"
  
  SetAutoClose true
SectionEnd
