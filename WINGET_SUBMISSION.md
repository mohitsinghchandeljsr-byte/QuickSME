# WinGet Submission Guide for SME Tally

## 🎯 About Ninite vs. WinGet

### ❌ Ninite Does NOT Accept Direct Submissions

**Important:** Ninite **does not have a submission process** for developers. They operate on a curated model where:
- Only popular, user-requested apps are added
- Each app requires custom C++ automation (significant engineering effort)
- No vendor submissions are accepted
- Contact: contact@ninite.com (but set realistic expectations)

### ✅ WinGet is the MUCH Better Alternative

**Windows Package Manager (WinGet)** is:
- **Official Microsoft platform** - Built into Windows 10/11
- **Open for submissions** - Anyone can submit packages via GitHub
- **Reaches millions of users** - Every Windows user has WinGet
- **Automated distribution** - Users install via: `winget install SMETally`
- **Free and open-source** - No fees or approval politics
- **Integrates with Ninite** - Ninite's Nintune service includes WinGet apps

**Bottom line:** Submit to WinGet first. If your app becomes popular, Ninite may add it based on user requests.

---

## 📦 WinGet Submission Process

### Prerequisites

Before submitting to WinGet, you need:

1. **A proper Windows installer** (see section below)
2. **GitHub account**
3. **Public download URL** for your installer (GitHub Releases recommended)
4. **Windows 10 1809+ or Windows 11** for testing

---

## 🔨 Step 1: Create a Proper Windows Installer

**Current Status:** SME Tally has CMD-based installation scripts, but WinGet requires a proper installer.

### Required Installer Formats:
- ✅ **EXE** (NSIS, Inno Setup, or Electron Builder)
- ✅ **MSI** (Windows Installer)
- ✅ **MSIX** (Modern Windows package format)
- ❌ **NOT supported:** CMD scripts, ZIP files, .tar.gz

### Recommended: Use Electron Builder (Easiest for Node.js Apps)

Since SME Tally is a Node.js/Electron-compatible app, use **Electron Builder**:

1. **Install Electron Builder**:
   ```bash
   npm install --save-dev electron-builder
   ```

2. **Add to package.json**:
   ```json
   {
     "scripts": {
       "dist": "electron-builder"
     },
     "build": {
       "appId": "com.mohitsinghchandel.smetally",
       "productName": "SME Tally",
       "win": {
         "target": ["nsis"],
         "icon": "icon.ico"
       },
       "nsis": {
         "oneClick": false,
         "perMachine": false,
         "allowToChangeInstallationDirectory": true,
         "createDesktopShortcut": true,
         "createStartMenuShortcut": true,
         "installerIcon": "icon.ico",
         "uninstallerIcon": "icon.ico",
         "license": "LICENSE"
       }
     }
   }
   ```

3. **Build the installer**:
   ```bash
   npm run dist
   ```

4. **Output**: `dist/SMETally-Setup-1.0.0.exe` (ready for WinGet!)

### Alternative: NSIS (Advanced)

If you prefer more control, create a custom NSIS installer:

1. Download NSIS: https://nsis.sourceforge.io/
2. Create `installer.nsi` script
3. Package Node.js runtime + your application
4. Build with: `makensis installer.nsi`

---

## 📤 Step 2: Upload Installer to GitHub Releases

1. **Create a new release** on GitHub:
   ```
   https://github.com/mohitsinghchandeljsr-byte/smetally/releases/new
   ```

2. **Tag version**: `v1.0.0`

3. **Release title**: `SME Tally v1.0.0`

4. **Upload your installer**: `SMETally-Setup-1.0.0.exe`

5. **Publish release**

6. **Copy the direct download URL**:
   ```
   https://github.com/mohitsinghchandeljsr-byte/smetally/releases/download/v1.0.0/SMETally-Setup-1.0.0.exe
   ```

---

## 📝 Step 3: Create WinGet Manifest

The manifest files are **already prepared** in the `winget-manifest/` folder:

- `MohitSinghChandel.SMETally.yaml` - Version info
- `MohitSinghChandel.SMETally.locale.en-US.yaml` - Descriptions, tags, etc.
- `MohitSinghChandel.SMETally.installer.yaml` - Installer details

### Update the Installer Manifest:

1. **Replace the installer URL** in `MohitSinghChandel.SMETally.installer.yaml`:
   ```yaml
   InstallerUrl: https://github.com/mohitsinghchandeljsr-byte/smetally/releases/download/v1.0.0/SMETally-Setup-1.0.0.exe
   ```

2. **Calculate SHA256 hash**:

   **On Windows (PowerShell)**:
   ```powershell
   Get-FileHash SMETally-Setup-1.0.0.exe -Algorithm SHA256
   ```

   **On Linux/Mac**:
   ```bash
   sha256sum SMETally-Setup-1.0.0.exe
   ```

3. **Replace the hash** in the manifest:
   ```yaml
   InstallerSha256: abc123def456...
   ```

---

## ✅ Step 4: Validate Manifest Locally

1. **Install WinGet Create Tool**:
   ```bash
   winget install wingetcreate
   ```

2. **Validate the manifest**:
   ```bash
   winget validate --manifest winget-manifest
   ```

3. **Test installation** (optional):
   ```bash
   winget install --manifest winget-manifest
   ```

---

## 🚀 Step 5: Submit to WinGet Repository

### Fork the WinGet Repository

1. Go to: https://github.com/microsoft/winget-pkgs
2. Click **"Fork"** (top-right corner)
3. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/winget-pkgs.git
   cd winget-pkgs
   ```

### Add Your Manifest

1. **Create the correct folder structure**:
   ```bash
   mkdir -p manifests/m/MohitSinghChandel/SMETally/1.0.0
   ```

2. **Copy manifest files**:
   ```bash
   cp ../smetally/winget-manifest/*.yaml manifests/m/MohitSinghChandel/SMETally/1.0.0/
   ```

3. **Verify structure**:
   ```
   manifests/
   └── m/
       └── MohitSinghChandel/
           └── SMETally/
               └── 1.0.0/
                   ├── MohitSinghChandel.SMETally.installer.yaml
                   ├── MohitSinghChandel.SMETally.locale.en-US.yaml
                   └── MohitSinghChandel.SMETally.yaml
   ```

### Commit and Push

```bash
git add manifests/m/MohitSinghChandel/SMETally/1.0.0/
git commit -m "Add SME Tally version 1.0.0"
git push origin main
```

### Create Pull Request

1. Go to: https://github.com/microsoft/winget-pkgs
2. Click **"Pull requests"** → **"New pull request"**
3. Click **"compare across forks"**
4. Select **your fork** as the source
5. Title: `Add MohitSinghChandel.SMETally version 1.0.0`
6. Description:
   ```
   # SME Tally v1.0.0

   Ultra-fast, keyboard-friendly accounting application for Indian SMEs.
   
   - Package Identifier: MohitSinghChandel.SMETally
   - Version: 1.0.0
   - Installer Type: NSIS EXE
   - Architecture: x64
   
   ## Features:
   - GST compliance for Indian businesses
   - AI-powered accounting assistant
   - Developer API platform
   - Enterprise security with RBAC
   - 5-10x faster than traditional ERP systems
   
   ## Testing:
   - [x] Manifest validated locally
   - [x] Installation tested
   - [x] Silent install works
   - [x] Uninstall works
   
   GitHub: https://github.com/mohitsinghchandeljsr-byte/smetally
   ```
7. Click **"Create pull request"**

---

## 🤖 Step 6: Automated Validation

Once submitted, GitHub Actions will automatically:

- ✅ Validate manifest syntax
- ✅ Verify SHA256 hash
- ✅ Test installation in isolated environment
- ✅ Check SmartScreen reputation
- ✅ Run policy compliance checks

**Possible outcomes:**
- ✅ **Green checkmark** → Ready for review
- ⚠️ **Yellow warning** → Minor issues (reviewers may approve anyway)
- ❌ **Red X** → Validation failed (fix errors and push updates)

---

## 👥 Step 7: Manual Review

After automated checks pass:

1. **Microsoft moderator reviews** your submission
2. **Approval time**: Usually 24-48 hours
3. **Merged into repository**
4. **Available to all users** within 24 hours after merge

---

## 🎉 Step 8: Users Can Install Your App!

Once approved, anyone can install SME Tally via:

```bash
winget install MohitSinghChandel.SMETally
```

Or search for it:

```bash
winget search "SME Tally"
```

Or use the GUI (Windows 11):
- Open Microsoft Store
- Go to "Library" → "Get updates"
- Search for "SME Tally"

---

## 🔄 Updating Your Package

For future versions (e.g., v1.1.0):

1. **Build new installer** and upload to GitHub Releases
2. **Use WinGetCreate to update**:
   ```bash
   wingetcreate update MohitSinghChandel.SMETally --urls https://github.com/mohitsinghchandeljsr-byte/smetally/releases/download/v1.1.0/SMETally-Setup-1.1.0.exe --version 1.1.0
   ```
3. **Submit pull request** (same process as before)

---

## 📊 Alternative Distribution Channels

While WinGet is recommended, consider these additional platforms:

### 1. **Chocolatey** (Windows package manager)
- URL: https://chocolatey.org/packages/upload
- Similar to WinGet but older and more established
- Requires creating a `.nuspec` file
- Submission: https://github.com/chocolatey/choco/wiki/CreatePackages

### 2. **Microsoft Store** (Windows 10/11 app store)
- URL: https://partner.microsoft.com/dashboard
- Requires MSIX packaging
- Costs: Free (one-time $19 registration fee waived for some accounts)
- Best for: Consumer-facing applications

### 3. **Scoop** (Command-line installer)
- URL: https://scoop.sh/
- Lightweight, JSON-based manifests
- Popular with developers
- Submission: https://github.com/ScoopInstaller/Scoop

### 4. **Direct Download** (Your website/GitHub)
- Keep offering direct downloads
- Many users prefer this for enterprise software
- Good fallback option

---

## 📋 Checklist Before Submission

- [ ] Created proper Windows installer (EXE/MSI/MSIX)
- [ ] Installer supports silent installation (`/S` flag)
- [ ] Uploaded installer to GitHub Releases
- [ ] Obtained direct download URL
- [ ] Calculated SHA256 hash
- [ ] Updated manifest files with correct URL and hash
- [ ] Validated manifest locally (`winget validate`)
- [ ] Tested installation locally
- [ ] Forked winget-pkgs repository
- [ ] Added manifest to correct folder structure
- [ ] Created pull request with clear description
- [ ] Responded to any reviewer feedback

---

## 🆘 Troubleshooting

### "Validation failed - hash mismatch"
- Recalculate SHA256 hash of your installer
- Ensure you're using the exact download URL
- Don't use shortened URLs or redirects

### "Silent install not supported"
- Test your installer with `/S` flag
- Use NSIS or Electron Builder which support silent installs
- Check installer logs for errors

### "Package identifier conflict"
- Someone else may have used a similar name
- Search existing packages: https://github.com/microsoft/winget-pkgs/tree/master/manifests
- Consider alternative identifier (e.g., add your company name)

### "SmartScreen warning"
- Common for new publishers
- Sign your installer with a code signing certificate
- Or: Users can bypass (not ideal but acceptable initially)

---

## 📞 Support

**WinGet Community:**
- GitHub: https://github.com/microsoft/winget-pkgs
- Discussions: https://github.com/microsoft/winget-cli/discussions
- Issues: https://github.com/microsoft/winget-pkgs/issues

**SME Tally:**
- GitHub: https://github.com/mohitsinghchandeljsr-byte/smetally
- Issues: https://github.com/mohitsinghchandeljsr-byte/smetally/issues

---

## 🎯 Summary

**Steps to get on WinGet:**

1. ✅ Create proper Windows installer (NSIS/MSI/MSIX)
2. ✅ Upload to GitHub Releases
3. ✅ Update manifest files (already prepared in `winget-manifest/`)
4. ✅ Fork winget-pkgs repository
5. ✅ Add manifests to correct folder
6. ✅ Submit pull request
7. ⏳ Wait for automated validation
8. ⏳ Wait for manual review
9. 🎉 Get approved and merged
10. 🚀 Users can install via `winget install MohitSinghChandel.SMETally`

**Time to approval:** 24-72 hours typically

**Effort:** Medium (mainly creating the installer)

**Reach:** Millions of Windows users

**Cost:** Free

---

**Good luck with your submission! 🚀**
