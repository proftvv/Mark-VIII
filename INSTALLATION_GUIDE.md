# Mark-VIII Encryption System
## Complete Installation and Deployment Guide

## Overview
Mark-VIII is a cross-platform encryption system with biometric authentication support. It works on Windows and Android through a web interface and can be deployed to Vercel.

## Features
- ✅ AES-256 encryption for data security
- ✅ Bcrypt password hashing
- ✅ Biometric authentication (fingerprint/face recognition on compatible devices)
- ✅ SQLite database for data persistence
- ✅ Responsive design for mobile and desktop
- ✅ Cross-platform (Windows & Android via web browser)
- ✅ Vercel deployment ready

## Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Encryption**: CryptoJS (AES-256)
- **Authentication**: bcryptjs, Web Authentication API
- **Database**: Better-SQLite3
- **Deployment**: Vercel

---

## Installation Steps

### Prerequisites
1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Verify: `node --version`

### Step 1: Run Installation Script
```bash
# Run the automated installer
install.bat
```

This will:
- Create all necessary directories
- Generate all application files
- Set up the project structure

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages:
- Next.js framework
- React libraries
- Encryption libraries (CryptoJS, bcryptjs)
- Database (better-sqlite3)
- Tailwind CSS
- TypeScript support

### Step 3: Run Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000`

---

## Project Structure

```
Mark-VIII/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page with auth logic
├── components/               # React components
│   ├── LoginForm.tsx        # Login form with biometric option
│   ├── RegisterForm.tsx     # Registration form
│   ├── Dashboard.tsx        # Main dashboard
│   ├── EncryptionPanel.tsx  # Encryption interface
│   └── DataList.tsx         # Encrypted data management
├── lib/                      # Utility libraries
│   ├── database.ts          # SQLite database setup
│   ├── encryption.ts        # AES encryption functions
│   └── biometric.ts         # WebAuthn biometric auth
├── pages/api/                # API routes
│   ├── auth/
│   │   ├── login.ts         # Login endpoint
│   │   └── register.ts      # Registration endpoint
│   └── data/
│       ├── save.ts          # Save encrypted data
│       ├── list.ts          # List user's data
│       └── delete.ts        # Delete data
├── public/                   # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind CSS config
└── README.md                # This file
```

---

## Usage Guide

### 1. User Registration
1. Open the application
2. Click "Register"
3. Enter username and password (min 6 characters)
4. Optional: Enable biometric authentication (if available)
5. Click "Register"

### 2. Login
**Option A: Password Login**
1. Enter username and password
2. Click "Login"

**Option B: Biometric Login** (if registered)
1. Enter username
2. Click "Login with Biometric"
3. Use fingerprint/face recognition

### 3. Encrypt Data
1. After login, you'll see the Dashboard
2. In "Encrypt Data" panel:
   - Enter a title for your data
   - Enter the content to encrypt
   - Set an encryption password
   - Click "Encrypt & Save"

**Important**: The encryption password is separate from your login password and is required to decrypt the data later.

### 4. View Encrypted Data
1. In "Your Encrypted Data" panel, see all your encrypted items
2. Click "View Decrypted" on any item
3. Enter the encryption password
4. Click "Decrypt" to view the content

### 5. Delete Data
- Click "Delete" next to any encrypted item to remove it permanently

---

## Security Features

### 1. Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Separate encryption passwords for data

### 2. Data Encryption
- AES-256 encryption algorithm
- Each item encrypted with unique password
- Encryption happens client-side before storage

### 3. Biometric Authentication
- Uses Web Authentication API (WebAuthn)
- Platform authenticator (fingerprint, face recognition)
- Requires user verification
- Works on compatible devices (Android, Windows Hello)

### 4. Database Security
- SQLite with WAL mode for data integrity
- Foreign key constraints
- User data isolation
- Automatic timestamps

---

## Android Access

### Option 1: Local Network Access
1. Get your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On your Android device:
   - Connect to same WiFi network
   - Open browser (Chrome recommended)
   - Navigate to: `http://YOUR-IP:3000`
   - Example: `http://192.168.1.100:3000`

### Option 2: Deploy to Vercel (Recommended for Production)
See "Deployment" section below

---

## Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: mark-viii-encryption
- Directory: ./
- Override settings: No

### Step 4: Access Your Deployment
After deployment, you'll get a URL like:
- `https://mark-viii-encryption.vercel.app`

**Note**: For Vercel deployment, you'll need to modify the database configuration to use a cloud database (like Vercel Postgres or PlanetScale) instead of SQLite, as Vercel's serverless functions don't support file-based databases.

### Alternative: Vercel with Cloud Database

1. **Create Vercel Postgres Database**:
   - Go to your Vercel dashboard
   - Navigate to Storage → Create Database
   - Select Postgres

2. **Update Database Configuration**:
   ```typescript
   // lib/database.ts
   import { sql } from '@vercel/postgres';
   
   // Use Vercel Postgres instead of SQLite
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

---

## Environment Variables

For production deployment, create `.env.local`:

```env
# Database (for Vercel deployment)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
POSTGRES_USER=your_user
POSTGRES_HOST=your_host
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database

# Optional: Session Secret
SESSION_SECRET=your_random_secret_here
```

---

## Troubleshooting

### Issue: npm install fails
**Solution**: 
- Ensure Node.js 18+ is installed
- Try: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry

### Issue: Biometric authentication not working
**Solution**:
- Ensure HTTPS connection (required for WebAuthn)
- Use localhost for testing or deploy with SSL
- Check device compatibility

### Issue: Database locked error
**Solution**:
- Close all instances of the application
- Delete `data.db-wal` and `data.db-shm` files
- Restart the application

### Issue: Cannot access from Android
**Solution**:
- Verify both devices on same network
- Check firewall settings on Windows
- Ensure development server is running
- Try IP address instead of localhost

### Issue: Build fails for Vercel
**Solution**:
- SQLite doesn't work on Vercel
- Use Vercel Postgres or external database
- Update database configuration

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Browser Compatibility

### Desktop
- ✅ Chrome 67+
- ✅ Edge 79+
- ✅ Firefox 60+
- ✅ Safari 13+

### Mobile
- ✅ Chrome Android 70+
- ✅ Safari iOS 14+
- ✅ Samsung Internet 10+

**Note**: Biometric authentication requires HTTPS except on localhost.

---

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, symbols
   - Different passwords for login and encryption

2. **Protect Encryption Passwords**
   - Write down encryption passwords securely
   - Cannot be recovered if forgotten
   - Use password manager

3. **Regular Backups**
   - Export important encrypted data
   - Store backups securely
   - Test restoration process

4. **HTTPS in Production**
   - Always use HTTPS for production
   - Required for biometric authentication
   - Protects data in transit

5. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

---

## Future Enhancements

### Planned Features
- [ ] Password recovery system
- [ ] Data export/import functionality
- [ ] File encryption support
- [ ] Sharing encrypted data with other users
- [ ] Mobile app (React Native)
- [ ] Multi-factor authentication
- [ ] Cloud synchronization
- [ ] Encrypted backups
- [ ] Password strength meter
- [ ] Dark mode toggle

### Contributing
This is a private project. For suggestions or issues:
1. Document the issue/suggestion
2. Include steps to reproduce (for bugs)
3. Provide environment details

---

## License
Private project - All rights reserved

---

## Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Check browser console for errors
4. Verify all dependencies installed correctly

---

## Technical Notes

### Encryption Details
- **Algorithm**: AES-256
- **Mode**: CBC (Cipher Block Chaining)
- **Library**: CryptoJS 4.2.0
- **Key Derivation**: PBKDF2 (handled by CryptoJS)

### Password Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Library**: bcryptjs 2.4.3

### Biometric Authentication
- **API**: Web Authentication API (WebAuthn)
- **Authenticator Type**: Platform (built-in)
- **User Verification**: Required
- **Algorithms**: ES256 (-7), RS256 (-257)

### Database Schema

**users table**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**encrypted_data table**:
```sql
CREATE TABLE encrypted_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  encrypted_content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Quick Start Summary

```bash
# 1. Install project
install.bat

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000

# 5. For Android access
# http://YOUR-IP:3000
```

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Framework**: Next.js 14  
**Node Version**: 18+
