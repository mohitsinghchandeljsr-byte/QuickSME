# SME Tally - Quick Package Guide

## 🎯 Choose Your Package Type

### For WinGet Distribution (Recommended)
```cmd
build-installer.cmd
```
Creates: `SMETally-Setup-1.0.0.exe`

### For Portable Use
```cmd
create-portable-package.cmd
```
Creates: `SMETally-Portable-1.0.0.zip`

---

## 📦 What Gets Created

### NSIS Installer Features:
- ✅ Professional setup wizard
- ✅ Start Menu & Desktop shortcuts
- ✅ Silent install support (`/S`)
- ✅ Built-in uninstaller
- ✅ Registry integration

### Portable Package Features:
- ✅ No installation needed
- ✅ USB drive compatible
- ✅ No admin rights required
- ✅ No registry changes
- ✅ Leaves no traces

---

## 🚀 Distribution Steps

### 1. Build Package
Run either `build-installer.cmd` or `create-portable-package.cmd`

### 2. Test Package
- Install/run on clean Windows 11 system
- Verify application starts
- Check http://localhost:5000 works

### 3. Upload to GitHub Releases
- Go to: https://github.com/mohitsinghchandeljsr-byte/smetally/releases
- Create release `v1.0.0`
- Upload package file

### 4. Submit to WinGet (for installer)
- Fork: https://github.com/microsoft/winget-pkgs
- Copy manifests from `winget-manifest/`
- Create pull request

### 5. Users Install
```cmd
# WinGet users:
winget install MohitSinghChandel.SMETally

# Direct download users:
# Download and run installer or extract ZIP
```

---

## 📋 Prerequisites

| Tool | Download | Required For |
|------|----------|--------------|
| Node.js 18+ | https://nodejs.org/ | Both packages |
| NSIS | https://nsis.sourceforge.io/ | Installer only |

---

## 🔧 Quick Commands

```cmd
# Build everything
npm run build

# Create installer (requires NSIS)
build-installer.cmd

# Create portable package
create-portable-package.cmd

# Test server
curl http://localhost:5000/api/health
```

---

## 📊 Package Comparison

| Feature | NSIS Installer | Portable ZIP |
|---------|---------------|--------------|
| Setup Wizard | ✅ | ❌ |
| Shortcuts | ✅ | ❌ |
| Silent Install | ✅ | N/A |
| Uninstaller | ✅ | Delete folder |
| WinGet Ready | ✅ | ❌ |
| USB Compatible | ❌ | ✅ |
| No Admin Needed | ❌ | ✅ |
| No Registry | ❌ | ✅ |

---

## 🎉 Success!

Your Windows 11 native package is ready for distribution!

**Next:** See `WINDOWS_PACKAGING_README.md` for detailed instructions.
