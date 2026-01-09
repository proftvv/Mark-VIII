@echo off
echo ========================================
echo Mark-VIII APK Builder
echo ========================================
echo.
echo 1. Android yapilandirmasi sync ediliyor...
call npx cap sync android
echo.
echo 2. APK build basliyor (bu 2-5 dakika surebilir)...
echo.
cd android
call gradlew.bat assembleDebug
echo.
echo ========================================
echo APK HAZIR!
echo ========================================
echo.
echo Konum: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo APK dosyasini Google Drive'a yukleyebilirsin!
echo.
pause
