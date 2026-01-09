# Mark-VIII APK Build Guide

## Ön Gereksinimler
- Android Studio kurulu olmalı
- Java JDK 11+ yüklü olmalı
- Node.js ve npm kurulu olmalı

## APK Oluşturma Adımları

### 1. Projeyi Hazırla
```bash
npm install
npm run build
```

### 2. Android Platform Sync
```bash
npx cap sync android
```

### 3. Android Studio'da Aç
```bash
npx cap open android
```

### 4. APK Build (Android Studio)
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. APK dosyası: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Release APK (İmzalı)
1. **Build** → **Generate Signed Bundle / APK**
2. **APK** seçin
3. Keystore oluştur/seç
4. **release** build variant seç
5. APK: `android/app/build/outputs/apk/release/app-release.apk`

## Hızlı Build (Terminal)
```bash
# Debug APK
cd android
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

## APK Konumları
- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`

## Google Drive'a Yükleme
1. APK dosyasını Google Drive'a yükle
2. "Paylaş" → "Linki olan herkes görebilir"
3. Linki kopyala
4. `components/DownloadButton.tsx` dosyasında `apkUrl` prop'una yapıştır

## Kurulum Talimatları (Kullanıcılar İçin)
1. APK'yı indir
2. Android cihazda "Bilinmeyen kaynaklardan yükleme" izni ver
3. APK'yı aç ve yükle
4. Mark-VIII uygulaması hazır!

## Not
- İlk yükleme sırasında Vercel URL'den çalışır
- İnternet bağlantısı gereklidir
- Offline mod için PWA versiyonunu kullanın
