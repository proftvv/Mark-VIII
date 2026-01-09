# 📱 Android Studio ile Telefona Deploy

## ✅ Android Studio AÇILDI!

### Adım 1: Gradle Sync (Otomatik)
- Android Studio proje yükleniyor...
- Gradle sync bekle (1-2 dakika)
- Sağ alt köşede "Sync finished" görünecek

### Adım 2: Telefonu Seç
1. Üst toolbar'da cihaz seçici var
2. **R5CTB2B165X (Samsung A73)** seçili olmalı
3. Görünmüyorsa → **Tools** → **Device Manager**

### Adım 3: Run / Debug
**İki yol:**

**A) Direkt Çalıştır:**
- Yeşil **▶ Play** butonuna tıkla (üstte)
- Ya da **Shift+F10**
- App telefonda açılır! 🚀

**B) Debug Mode:**
- Böcek ikonu 🐛 tıkla
- Ya da **Shift+F9**
- Breakpoint koyabilirsin

### Adım 4: APK Build (Opsiyonel)
**Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

APK: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 🔥 Live Reload

Capacitor config'te dev server var:
```
url: 'http://192.168.1.108:3000'
```

**Kod değişince otomatik yenilenir!**

---

## ⚠️ İlk Kurulumda

### Telefonda USB Debugging açık mı?
1. **Ayarlar** → **Geliştirici seçenekleri**
2. **USB debugging** ✅ aktif olmalı
3. Bilgisayara ilk bağlandığında "Allow USB debugging?" → **OK**

### Gradle Build Hatası?
- **File** → **Invalidate Caches** → **Invalidate and Restart**
- Gradle sync tekrar çalışır

---

## 🎯 Şu Anda

1. ✅ Android Studio açık
2. ✅ Telefon bağlı (R5CTB2B165X)
3. ✅ Dev server çalışıyor (localhost:3000)

**Yapman gereken:**
- Gradle sync bitsin (1-2 dk)
- Yeşil ▶ butonuna bas
- App telefonda açılır! 📱

---

## 💡 Hızlı Tuşlar

- **Shift+F10**: Run
- **Shift+F9**: Debug
- **Ctrl+F9**: Build
- **Ctrl+Shift+F9**: Run Tests
