@echo off
echo ========================================
echo Mark-VIII Encryption System Installer
echo ========================================
echo.

echo Step 1: Creating directory structure...
mkdir app 2>nul
mkdir lib 2>nul
mkdir components 2>nul
mkdir pages\api\auth 2>nul
mkdir pages\api\data 2>nul
mkdir public 2>nul
echo Directories created!
echo.

echo Step 2: Creating application files...
node create_structure.js
echo.

echo Step 3: Creating component files...
node create_components.js
echo.

echo Step 4: Creating API routes...
node create_api.js
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo For Android access:
echo - Find your computer's IP address (ipconfig)
echo - Access from Android: http://YOUR-IP:3000
echo.
echo GitHub Push:
echo 1. git init
echo 2. git add .
echo 3. git commit -m "Initial commit"
echo 4. git remote add origin https://github.com/proftvv/Mark-VIII.git
echo 5. git push -u origin main
echo.
pause
