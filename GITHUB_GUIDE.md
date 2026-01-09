# 🚀 GitHub Yayınlama Rehberi / GitHub Publishing Guide

## 📋 Adım Adım GitHub'a Yükleme

### 1. Git Kurulumu Kontrol Et
```bash
git --version
```
Eğer kurulu değilse: https://git-scm.com/downloads

### 2. Projeyi Hazırla
```bash
# Proje dizinine git
cd z:\Mark-VIII

# Kurulumu tamamla
install.bat
npm install
```

### 3. Git Başlat
```bash
# Git repository'sini başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "🎉 Initial commit: Mark-VIII Encryption System v1.0.0"
```

### 4. GitHub Repository Oluştur
1. https://github.com adresine git
2. "New repository" tıkla
3. Repository adı: `Mark-VIII`
4. Description: `🔐 Military-Grade Encryption System with Biometric Authentication`
5. Public veya Private seç
6. **ÖNEMLİ**: README, .gitignore, license EKLEME (zaten var)
7. "Create repository" tıkla

### 5. GitHub'a Bağlan ve Yükle
```bash
# Remote repository ekle
git remote add origin https://github.com/proftvv/Mark-VIII.git

# Main branch'i ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

### 6. GitHub Token ile Bağlan (Gerekirse)
Eğer şifre soruyorsa:
1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token (classic)"
3. Scopes: `repo` seç
4. Token'ı kopyala
5. Şifre yerine token'ı kullan

---

## 📦 Vercel'e Deploy Et (Opsiyonel)

### 1. Vercel CLI Kur
```bash
npm install -g vercel
```

### 2. Vercel'e Giriş Yap
```bash
vercel login
```

### 3. Deploy Et
```bash
vercel
```

### 4. Production'a Al
```bash
vercel --prod
```

---

## 🔄 Güncelleme Yapmak

### Kod Değişikliği Yaptıktan Sonra:
```bash
# Değişiklikleri ekle
git add .

# Commit yap (anlamlı mesaj)
git commit -m "✨ Add: Yeni özellik açıklaması"
# veya
git commit -m "🐛 Fix: Hata düzeltmesi açıklaması"
# veya
git commit -m "📝 Docs: Dokümantasyon güncelleme"

# GitHub'a gönder
git push
```

### Commit Mesaj İkonları:
- 🎉 `:tada:` - İlk commit
- ✨ `:sparkles:` - Yeni özellik
- 🐛 `:bug:` - Hata düzeltme
- 📝 `:memo:` - Dokümantasyon
- 🔒 `:lock:` - Güvenlik
- ⚡ `:zap:` - Performans
- 💄 `:lipstick:` - UI/stil
- 🚀 `:rocket:` - Deploy
- ♻️ `:recycle:` - Refactoring
- 🔥 `:fire:` - Kod/dosya silme

---

## 🏷️ Release Oluştur

### 1. GitHub'da Release Oluştur
1. Repository'de "Releases" sekmesi
2. "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Mark-VIII v1.0.0 - Initial Release`
5. Description: CHANGELOG.md'den kopyala
6. "Publish release"

### 2. Komut Satırından Tag
```bash
# Tag oluştur
git tag -a v1.0.0 -m "Version 1.0.0"

# GitHub'a gönder
git push origin v1.0.0
```

---

## 📊 Repository Ayarları

### 1. About Düzenle (GitHub sayfasında)
```
Description: 🔐 Military-Grade Encryption System with Biometric Authentication for Windows & Android

Website: https://mark-viii.vercel.app (deploy sonrası)

Topics:
- encryption
- security
- nextjs
- react
- typescript
- biometric-authentication
- aes-256
- cross-platform
- privacy
- cryptography
```

### 2. Branch Protection (Opsiyonel)
Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request reviews
- ✅ Require status checks to pass

### 3. GitHub Pages (Opsiyonel)
Settings → Pages → Source: GitHub Actions

---

## 🎨 Repository Badges

README.md'de zaten var, ama özelleştirmek için:

```markdown
[![GitHub stars](https://img.shields.io/github/stars/proftvv/Mark-VIII?style=social)](https://github.com/proftvv/Mark-VIII/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/proftvv/Mark-VIII?style=social)](https://github.com/proftvv/Mark-VIII/network)
[![GitHub issues](https://img.shields.io/github/issues/proftvv/Mark-VIII)](https://github.com/proftvv/Mark-VIII/issues)
[![GitHub license](https://img.shields.io/github/license/proftvv/Mark-VIII)](https://github.com/proftvv/Mark-VIII/blob/main/LICENSE)
```

---

## 🔍 SEO ve Keşfedilebilirlik

### 1. Topics (GitHub'da)
Repository → About → Settings:
- encryption
- security
- nextjs
- react
- typescript
- tailwindcss
- sqlite
- biometric
- webauthn
- privacy

### 2. Social Preview
Settings → Social preview → Upload:
- 1280x640 px görsel
- Proje logosu/screenshot

---

## 📱 Social Media Paylaşım

### Twitter
```
🔐 Mark-VIII Encryption System'i GitHub'da yayınladım!

✨ AES-256 Encryption
🔑 Biometric Authentication
📱 Cross-platform (Windows & Android)
🎨 Modern UI with Next.js & Tailwind

⭐ Star atmayı unutmayın!

https://github.com/proftvv/Mark-VIII

#encryption #security #NextJS #React #TypeScript
```

### LinkedIn
```
Yeni projem Mark-VIII Encryption System'i paylaşmaktan mutluluk duyuyorum! 

🔐 Askeri seviye AES-256 şifreleme
🔑 Biyometrik kimlik doğrulama
📱 Windows ve Android cross-platform desteği
⚡ Next.js 14 ve React 18 ile modern mimari

Proje tamamen open-source. GitHub'da yıldız atmayı unutmayın!

🔗 github.com/proftvv/Mark-VIII

#WebDevelopment #Encryption #Security #NextJS #React #OpenSource
```

---

## 🆘 Sorun Giderme

### "Permission denied" hatası
```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "your_email@example.com"

# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH Keys → Add
```

### "Repository not found"
```bash
# Remote'u kontrol et
git remote -v

# Yanlışsa düzelt
git remote set-url origin https://github.com/proftvv/Mark-VIII.git
```

### Token süresi doldu
1. GitHub → Settings → Developer settings
2. Personal access tokens → Regenerate token
3. Yeni token'ı kullan

---

## ✅ Checklist

Yayınlamadan önce kontrol et:

- [ ] `npm install` çalışıyor
- [ ] `npm run build` başarılı
- [ ] `npm run dev` hatasız başlıyor
- [ ] README.md tamamlandı
- [ ] LICENSE dosyası var
- [ ] .gitignore doğru ayarlanmış
- [ ] Hassas bilgi yok (API keys, passwords vb.)
- [ ] CHANGELOG.md güncellendi
- [ ] package.json version doğru

Yayınladıktan sonra:

- [ ] Repository description eklendi
- [ ] Topics eklendi
- [ ] README badges çalışıyor
- [ ] Issues aktif
- [ ] License görünüyor
- [ ] Star repo yapıldı mı? ⭐

---

## 🎯 İlk 24 Saat İçinde

1. **README.md'i İyileştir**
   - Screenshot ekle
   - Demo video linki ekle
   - Live demo linki ekle (Vercel)

2. **Social Media**
   - Twitter'da paylaş
   - LinkedIn'de paylaş
   - Reddit'te paylaş (r/reactjs, r/nextjs)

3. **Community**
   - Dev.to'da makale yaz
   - Hashnode'da blog yaz
   - Medium'da paylaş

4. **Engagement**
   - İlk issue'ları aç (roadmap için)
   - Discussions aktif et
   - Contributing guide'ı netleştir

---

**Başarılar! 🚀**

Sorularınız için Issue açabilirsiniz.
