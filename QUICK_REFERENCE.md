# Mark-VIII Encryption System - Quick Reference

## Installation
```bash
install.bat          # Run installer
npm install          # Install dependencies
npm run dev          # Start development server
```

## Access
- **Windows**: http://localhost:3000
- **Android**: http://YOUR-IP:3000 (same network)

## Features
1. **User Authentication**
   - Username/password login
   - Optional biometric authentication (fingerprint/face)
   
2. **Data Encryption**
   - AES-256 encryption
   - Separate encryption password per item
   - Secure storage in SQLite database

3. **Cross-Platform**
   - Windows desktop
   - Android mobile browser
   - Responsive design

## Security
- ✅ Bcrypt password hashing
- ✅ AES-256 encryption
- ✅ WebAuthn biometric support
- ✅ Session management
- ✅ SQLite database

## Deployment
```bash
npm run build        # Build for production
vercel              # Deploy to Vercel
```

## Important Notes
- **Encryption passwords** cannot be recovered - store safely
- **Biometric auth** requires HTTPS (except localhost)
- **Vercel deployment** requires cloud database (not SQLite)
- **Android access** requires same WiFi network

## Tech Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- CryptoJS
- bcryptjs
- Better-SQLite3

## Support
Check `INSTALLATION_GUIDE.md` for detailed documentation.
