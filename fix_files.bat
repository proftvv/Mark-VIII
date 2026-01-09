@echo off
echo Fixing files...

del create_structure.js 2>nul
ren create_structure_fixed.js create_structure.js

echo Fixed!
echo Now run: install.bat
pause
