# 📱 Mark-VIII APK Kurulum Rehberi

## 🚀 APK Nasıl Oluşturulur?

### Gerekli Programlar:
1. **Android Studio** (https://developer.android.com/studio)
2. **Java JDK 11+** (Android Studio ile gelir)

### Adım 1: Android Studio ile APK Build
```bash
# Terminal'de:
cd Z:\Mark-VIII

# Android Studio'yu aç
npx cap open android
```

### Adım 2: APK Build Et
Android Studio'da:
1. Üst menüden: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Build tamamlandığında bildirim gelir
3. "**locate**" butonuna tıkla

### Adım 3: APK Konumu
APK dosyası burada:
```
Z:\Mark-VIII\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📤 Google Drive'a Yükleme

### 1. APK'yı Drive'a Yükle
- `app-debug.apk` dosyasını Google Drive'a yükle

### 2. Paylaşım Ayarları
- Dosyaya sağ tıkla → **Paylaş**
- "Genel erişim" → **Linki olan herkes**
- **Kopyala** butonuna tıkla

### 3. Linki Siteye Ekle
1. Web sitesinde **sağ alt köşedeki APK İndir** butonuna **sağ tıkla**
2. Google Drive linkini yapıştır
3. **Kaydet** butonuna tıkla
4. Link localStorage'a kaydedilir ✅

---

## 📲 Kullanıcılar İçin Kurulum

### Android Cihazda:
1. Siteden "**APK İndir**" butonuna tıkla
2. APK dosyası indirilir
3. İndirilenler'den APK'yı aç
4. "**Bilinmeyen kaynaklardan yükleme**" izni ver
5. **Yükle** butonuna tıkla
6. Mark-VIII uygulaması hazır! 🎉

---

## 🔧 Gelişmiş: Release APK (İmzalı)

İmzalı APK Google Play Store'a yüklenebilir:

```bash
cd android
./gradlew assembleRelease
```

APK konumu:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## ✅ Özellikler

- ✅ Native Android App
- ✅ Vercel API'ler ile çalışır
- ✅ İnternet bağlantısı gerekir
- ✅ PWA gibi offline cache
- ✅ Tam ekran native deneyim
- ✅ Bildirim desteği (hazır)

---

## 📝 Not

APK her build'de `app-debug.apk` olarak oluşur. Dosya boyutu ~7-10 MB civarındadır.

İlk açılışta internet bağlantısı zorunludur (Vercel URL'den yükleme).
