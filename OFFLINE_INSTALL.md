# SME Tally - Offline Installation Guide

## 📦 Complete Offline Installer for Windows

This guide explains how to install and run SME Tally on Windows computers **without internet access**.

---

## 🎯 What You Need

### Minimum System Requirements
- **Operating System**: Windows 10 or later (64-bit)
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk Space**: 2 GB free space
- **Processor**: Dual-core 2 GHz or faster

### Required Software (included in offline package)
- Node.js 20.x or later
- (Optional) PostgreSQL 16.x for data persistence

---

## 📥 Step 1: Prepare the Offline Package

### On a Computer WITH Internet Access:

1. **Clone or download the repository**:
   ```bash
   git clone https://github.com/mohitsinghchandeljsr-byte/smetally.git
   cd smetally
   ```

2. **Run the offline package preparation script**:
   ```cmd
   prepare-offline.cmd
   ```

3. **The script will**:
   - Install all dependencies
   - Build the application
   - Package everything into `smetally-offline-installer` folder
   - Create a ZIP file (optional)

4. **Download additional installers** (optional but recommended):
   
   **Node.js Installer**:
   - URL: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
   - Save to: `smetally-offline-installer/node-installer/`
   
   **PostgreSQL Installer** (for production use):
   - URL: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download: PostgreSQL 16.x Windows x64 installer
   - Save to: `smetally-offline-installer/postgres-installer/`

5. **Transfer the package**:
   - Copy `smetally-offline-installer` folder to USB drive or DVD
   - Or use the ZIP file: `smetally-offline-installer.zip`

---

## 💻 Step 2: Install on Offline Computer

### Transfer Files
1. Copy the `smetally-offline-installer` folder to the target computer
2. Extract if you're using the ZIP file

### Install Prerequisites (if not already installed)

#### Install Node.js:
1. Navigate to `node-installer` folder (if included)
2. Run `node-v20.x.x-x64.msi`
3. Follow the installation wizard
4. **Important**: Keep all default options selected
5. Click "Install" and complete the installation
6. Restart your command prompt

#### Install PostgreSQL (optional, for production):
1. Navigate to `postgres-installer` folder (if included)
2. Run the PostgreSQL installer
3. During installation:
   - Set password for `postgres` user (remember this!)
   - Keep default port: 5432
   - Select all components
4. Complete the installation
5. Add PostgreSQL to PATH if prompted

### Run the Automated Installer

1. **Open Command Prompt as Administrator**:
   - Press `Win + X`
   - Select "Command Prompt (Admin)" or "Windows PowerShell (Admin)"

2. **Navigate to the installation folder**:
   ```cmd
   cd C:\path\to\smetally-offline-installer
   ```

3. **Run the installer**:
   ```cmd
   install.cmd
   ```

4. **The installer will automatically**:
   - ✅ Check for Node.js installation
   - ✅ Check for PostgreSQL (optional)
   - ✅ Extract and install dependencies
   - ✅ Configure environment variables
   - ✅ Build the application
   - ✅ Set up the database (if PostgreSQL is available)
   - ✅ Create a desktop shortcut (optional)

5. **Wait for completion**:
   - Installation typically takes 2-5 minutes
   - You'll see progress messages for each step

---

## 🚀 Step 3: Start the Application

### Method 1: Using the Startup Script (Recommended)

1. **Double-click** `start.cmd` in the installation folder
2. Or use the desktop shortcut (if created)

### Method 2: Command Line

```cmd
cd C:\path\to\smetally-offline-installer
start.cmd
```

### Method 3: Manual Start

```cmd
cd C:\path\to\smetally-offline-installer
set NODE_ENV=production
node dist/index.js
```

---

## 🌐 Step 4: Access the Application

1. **Open your web browser**
2. **Navigate to**: `http://localhost:5000`
3. **The application will load** - you should see the SME Tally dashboard

### Default Login Credentials (if authentication is enabled):
- **Username**: `admin`
- **Password**: `admin`
- **⚠️ Change these immediately after first login!**

---

## ⚙️ Configuration

### Environment Variables (.env file)

The installer creates a `.env` file automatically. You can customize it:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Security
SESSION_SECRET=your-random-secret-here

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://smetally:smetally@localhost:5432/smetally

# Application
APP_NAME=SME Tally
APP_VERSION=1.0.0
```

### Change Port Number

To run on a different port (e.g., 8080):

1. Edit `.env` file
2. Change `PORT=5000` to `PORT=8080`
3. Restart the application
4. Access at: `http://localhost:8080`

### Database Configuration

#### Using In-Memory Database (Default)
- No configuration needed
- ⚠️ **Data is NOT saved** when application restarts
- Suitable for testing only

#### Using PostgreSQL (Production)
1. Install PostgreSQL (see above)
2. Update `.env` file with correct `DATABASE_URL`
3. Run database migrations:
   ```cmd
   npm run db:push
   ```

---

## 🎹 Keyboard Shortcuts

SME Tally is designed for keyboard-first productivity:

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open Command Palette |
| `Ctrl + Shift + N` | New Voucher |
| `Ctrl + Shift + S` | Stock Management |
| `Ctrl + Shift + A` | AI Assistant |
| `Ctrl + Shift + P` | Parties |
| `Ctrl + Shift + L` | Ledgers |
| `/` | Quick Search |

**Press `Ctrl + K` in the application** to see all shortcuts!

---

## 🔧 Troubleshooting

### Installation Issues

#### "Node.js is not installed"
- Install Node.js from `node-installer` folder
- Restart Command Prompt after installation
- Run `install.cmd` again

#### "Failed to install dependencies"
- Ensure `offline-cache/node_modules.zip` exists
- Check available disk space (need at least 2 GB)
- Try extracting the ZIP manually to `node_modules` folder

#### "Build failed"
- Check Node.js version: `node --version` (should be 20.x or later)
- Ensure all files were copied correctly
- Check for error messages in the console

### Runtime Issues

#### "Application won't start"
- Ensure installation completed successfully
- Check if port 5000 is available:
  ```cmd
  netstat -ano | findstr :5000
  ```
- Try a different port (edit `.env` file)

#### "Cannot access http://localhost:5000"
- Ensure `start.cmd` is running (don't close the window)
- Check Windows Firewall settings
- Try `http://127.0.0.1:5000` instead

#### "Database connection failed"
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `.env` file
- Test PostgreSQL connection:
  ```cmd
  psql -U postgres
  ```

#### "Permission denied" errors
- Run Command Prompt as Administrator
- Check folder permissions
- Ensure antivirus is not blocking the application

---

## 📊 Features Overview

SME Tally includes comprehensive accounting features:

### Core Features
- ✅ **Dashboard**: Real-time financial overview
- ✅ **Vouchers**: Payment, Receipt, Sales, Purchase, Journal, Contra
- ✅ **Ledgers**: Chart of accounts with balance tracking
- ✅ **Parties**: Customer and vendor management
- ✅ **Stock Management**: Inventory tracking with barcode scanner
- ✅ **GST Compliance**: CGST, SGST, IGST calculations

### Advanced Features
- ✅ **AI Assistant** (⌘⇧A): Ask accounting questions, get insights
- ✅ **Purchase Orders**: Track supplier orders
- ✅ **Expense Management**: Categorize and track expenses
- ✅ **Bank Reconciliation**: Match statements with ledger entries
- ✅ **Reports**: Financial statements, GST reports, profit & loss

### Developer Features
- ✅ **API Platform**: REST API for integrations
- ✅ **API Keys**: Secure authentication
- ✅ **Webhooks**: Real-time event notifications
- ✅ **Developer Portal**: Complete API documentation

### Enterprise Security
- ✅ **Role-Based Access Control** (Admin, Manager, Accountant, Viewer)
- ✅ **Audit Logs**: Track all user actions
- ✅ **Session Management**: Automatic timeout
- ✅ **Backup & Restore**: Automated data backup

---

## 🔐 Security Best Practices

### For Production Use:

1. **Change Default Credentials**:
   - Change admin password immediately
   - Use strong passwords (12+ characters)

2. **Update Session Secret**:
   - Edit `.env` file
   - Generate a strong random `SESSION_SECRET`
   - Example: Use a password generator

3. **Enable HTTPS** (for network access):
   - Use a reverse proxy (nginx, IIS)
   - Configure SSL certificates
   - Never expose HTTP over the internet

4. **Database Security**:
   - Use PostgreSQL for production
   - Change default database password
   - Enable SSL connections
   - Regular backups

5. **Network Security**:
   - Use firewall to restrict access
   - Only allow trusted IP addresses
   - Consider VPN for remote access

6. **Regular Updates**:
   - Check for updates regularly
   - Keep Node.js and PostgreSQL updated
   - Monitor security advisories

---

## 📁 Directory Structure

```
smetally-offline-installer/
├── install.cmd                 # Main installation script
├── start.cmd                   # Application startup script
├── prepare-offline.cmd         # Package preparation (run online)
├── README.md                   # This file
├── .env                        # Configuration (created by installer)
│
├── client/                     # Frontend source code
├── server/                     # Backend source code
├── shared/                     # Shared types and schemas
├── dist/                       # Built application (production)
│
├── offline-cache/
│   └── node_modules.zip        # Packaged dependencies
│
├── node-installer/             # Optional: Node.js installer
│   └── node-v20.x.x-x64.msi
│
└── postgres-installer/         # Optional: PostgreSQL installer
    └── postgresql-16.x-x64.exe
```

---

## 🆘 Support & Documentation

### Documentation
- **User Guide**: Access from application Help menu
- **API Documentation**: `http://localhost:5000/developer/api-docs`
- **Keyboard Shortcuts**: Press `Ctrl + K` in app or visit `/shortcuts`

### Getting Help
- **GitHub Issues**: https://github.com/mohitsinghchandeljsr-byte/smetally/issues
- **Repository**: https://github.com/mohitsinghchandeljsr-byte/smetally

### Reporting Bugs
When reporting issues, include:
- Windows version
- Node.js version (`node --version`)
- Error messages (screenshots or text)
- Steps to reproduce the issue

---

## 🔄 Updating the Application

### To update to a new version:

1. **Backup your data**:
   - Export all data from the application
   - Or backup PostgreSQL database:
     ```cmd
     pg_dump -U smetally smetally > backup.sql
     ```

2. **Download new version**:
   - Get the updated offline installer package
   - Follow the same offline package preparation steps

3. **Install update**:
   - Run `install.cmd` in the new folder
   - Or manually copy new files over old installation

4. **Restore data** (if using PostgreSQL):
   ```cmd
   psql -U smetally smetally < backup.sql
   ```

---

## 📝 License

This software is provided as-is for accounting and business management purposes.
Check the repository for license details.

---

## 🎉 Quick Start Summary

```cmd
# 1. Prepare offline package (on computer with internet)
prepare-offline.cmd

# 2. Transfer to offline computer
# Copy smetally-offline-installer folder

# 3. Install (on offline computer)
install.cmd

# 4. Start application
start.cmd

# 5. Access in browser
http://localhost:5000
```

---

**Built with ❤️ for Indian SMEs**

*Ultra-fast, keyboard-friendly accounting - 5-10x faster than SAP/Oracle/Tally*
