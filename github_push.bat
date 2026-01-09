@echo off
echo ================================================
echo   Mark-VIII - GitHub Push Script  
echo ================================================
echo.

echo Step 1: Fixing files...
call fix_files.bat

echo.
echo Step 2: Initializing Git...
git init

echo.
echo Step 3: Adding all files...
git add .

echo.
echo Step 4: Creating initial commit...
git commit -m "🎉 Initial commit: Mark-VIII Encryption System v1.0.0"

echo.
echo Step 5: Setting main branch...
git branch -M main

echo.
echo Step 6: Adding remote repository...
git remote add origin https://github.com/proftvv/Mark-VIII.git

echo.
echo Step 7: Pushing to GitHub...
git push -u origin main

echo.
echo ================================================
echo   ✅ SUCCESS! Project pushed to GitHub!
echo ================================================
echo.
echo Next steps:
echo 1. Visit: https://github.com/proftvv/Mark-VIII
echo 2. Add repository description and topics
echo 3. Add screenshots to README
echo 4. Deploy to Vercel (optional)
echo.
pause
