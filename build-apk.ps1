# Mark-VIII APK Builder (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mark-VIII APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Android yapilandirmasi sync ediliyor..." -ForegroundColor Yellow
npx cap sync android

Write-Host ""
Write-Host "2. APK build basliyor (bu 2-5 dakika surebilir)..." -ForegroundColor Yellow
Write-Host ""

Set-Location android
& .\gradlew.bat assembleDebug

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "APK HAZIR!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Konum: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""
Write-Host "APK dosyasini Google Drive'a yukleyebilirsin!" -ForegroundColor Cyan
Write-Host ""
