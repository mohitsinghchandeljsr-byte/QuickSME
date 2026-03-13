# SME Tally - Windows 11 Native Package Guide

This guide explains how to create and distribute native Windows packages for SME Tally.

## 📦 Package Types Available

### 1. **NSIS Installer (Recommended for WinGet)**
- Professional Windows installer with setup wizard
- Creates Start Menu and Desktop shortcuts
- Supports silent installation (`/S` flag)
- Uninstaller included
- **Output**: `SMETally-Setup-1.0.0.exe`

### 2. **Portable ZIP Package**
- No installation required
- Runs from any folder or USB drive
- No registry changes
- No admin privileges needed
- **Output**: `SMETally-Portable-1.0.0.zip`

## 🚀 Quick Start

### Option 1: Build NSIS Installer (For WinGet Distribution)

```cmd
build-installer.cmd
```

**Requirements:**
- NSIS (Nullsoft Scriptable Install System)
  - Download: https://nsis.sourceforge.io/
  - Install and add to PATH: `C:\Program Files (x86)\NSIS`

**Output:**
- `SMETally-Setup-1.0.0.exe` - Windows installer
- Updated WinGet manifest with SHA256 hash

### Option 2: Create Portable Package

```cmd
create-portable-package.cmd
```

**Requirements:**
- Node.js 18+
- Windows 10/11

**Output:**
- `SMETally-Portable-1.0.0.zip` - Portable application

## 📋 Detailed Instructions

### Building the NSIS Installer

1. **Install NSIS** (one-time setup):
   ```cmd
   # Download from https://nsis.sourceforge.io/
   # Run installer and add to PATH
   ```

2. **Build the installer**:
   ```cmd
   cd e:\replit.github\QuickSME
   build-installer.cmd
   ```

3. **The script will**:
   - Check prerequisites
   - Build the application if needed
   - Create the installer
   - Calculate SHA256 hash
   - Update WinGet manifest

4. **Output files**:
   - `SMETally-Setup-1.0.0.exe` - The installer
   - Updated `winget-manifest/MohitSinghChandel.SMETally.installer.yaml`

### Creating Portable Package

1. **Run the script**:
   ```cmd
   create-portable-package.cmd
   ```

2. **The script will**:
   - Build the application if needed
   - Create portable package structure
   - Create launcher script
   - Package into ZIP file
   - Calculate SHA256 hash

3. **Distribute the ZIP file** for users who prefer portable apps

## 📤 Distribution Channels

### 1. Microsoft WinGet (Recommended)

**Why WinGet?**
- ✅ Built into Windows 10/11
- ✅ Official Microsoft platform
- ✅ Command-line installation
- ✅ Automatic updates
- ✅ Millions of users

**Submit to WinGet:**

1. **Upload installer to GitHub Releases**:
   - Go to: https://github.com/mohitsinghchandeljsr-byte/smetally/releases
   - Create new release: `v1.0.0`
   - Upload `SMETally-Setup-1.0.0.exe`

2. **Update manifest URL**:
   ```yaml
   # In winget-manifest/MohitSinghChandel.SMETally.installer.yaml
   InstallerUrl: https://github.com/mohitsinghchandeljsr-byte/smetally/releases/download/v1.0.0/SMETally-Setup-1.0.0.exe
   ```

3. **Submit to WinGet**:
   - Fork: https://github.com/microsoft/winget-pkgs
   - Add manifests to: `manifests/m/MohitSinghChandel/SMETally/1.0.0/`
   - Create pull request

4. **Users install via**:
   ```cmd
   winget install MohitSinghChandel.SMETally
   ```

### 2. Direct Download

**Portable ZIP**:
- Upload `SMETally-Portable-1.0.0.zip` to GitHub Releases
- Users download, extract, and run `SME-Tally-Portable.cmd`

**Installer EXE**:
- Upload `SMETally-Setup-1.0.0.exe` to GitHub Releases
- Users download and run installer

### 3. Microsoft Store (Future)

For Microsoft Store distribution, you need to:
1. Convert to MSIX package
2. Sign with code signing certificate
3. Submit via Partner Center

## 🔧 Package Contents

### NSIS Installer Includes:
- ✅ Compiled application (`dist/`)
- ✅ Server files (`server/`)
- ✅ Client files (`client/`)
- ✅ Shared schemas (`shared/`)
- ✅ Database migrations (`migrations/`)
- ✅ Production dependencies (`node_modules/`)
- ✅ Start Menu shortcut
- ✅ Desktop shortcut
- ✅ Uninstaller

### Portable Package Includes:
- ✅ Same files as installer
- ✅ Portable launcher script
- ✅ README with instructions
- ✅ No installation required

## 🛠️ Customization

### Modifying the Installer

Edit `installer.nsi` to customize:
- Application name and version
- Installation directory
- Shortcuts and registry entries
- Additional files to include

### Modifying the Build Scripts

Edit `build-installer.cmd` or `create-portable-package.cmd` to:
- Change version numbers
- Add/remove files
- Customize build process

## 📊 File Sizes (Estimated)

| Package Type | Size | Best For |
|-------------|------|----------|
| Portable ZIP | ~50-100 MB | USB drives, quick testing |
| NSIS Installer | ~50-100 MB | Permanent installation, WinGet |
| MSIX (future) | ~50-100 MB | Microsoft Store |

## 🐛 Troubleshooting

### "makensis not found"
- Install NSIS: https://nsis.sourceforge.io/
- Add to PATH: `C:\Program Files (x86)\NSIS`

### "Build failed"
- Ensure Node.js is installed: `node --version`
- Run `npm install` to install dependencies
- Check `dist/index.js` exists

### "Installer creation failed"
- Check NSIS script syntax: `makensis installer.nsi`
- Review error messages in console

### "SHA256 hash mismatch"
- Rebuild the installer
- Update manifest with new hash
- Ensure using exact download URL (no redirects)

## 📝 Checklist Before Distribution

- [ ] Application builds successfully
- [ ] Installer created without errors
- [ ] Installer tested on clean Windows 11 VM
- [ ] Silent installation works: `SMETally-Setup-1.0.0.exe /S`
- [ ] Uninstaller works correctly
- [ ] SHA256 hash calculated and verified
- [ ] WinGet manifest updated
- [ ] GitHub Release created
- [ ] Installer uploaded to GitHub Releases
- [ ] WinGet manifest submitted (if using WinGet)

## 🆘 Support

**Issues with packaging?**
- GitHub Issues: https://github.com/mohitsinghchandeljsr-byte/smetally/issues
- NSIS Documentation: https://nsis.sourceforge.io/Docs/

**WinGet submission help:**
- WinGet Docs: https://docs.microsoft.com/en-us/windows/package-manager/
- WinGet Repo: https://github.com/microsoft/winget-pkgs

---

**Ready to distribute SME Tally to millions of Windows users! 🚀**
