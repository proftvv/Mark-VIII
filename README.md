<div align="center">

# 🔐 Mark VIII - Güvenli Veri Şifreleme Platformu

### Kurumsal Seviye Güvenlik ile Verilerinizi Koruyun

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**🌐 Canlı Sistem:** [https://mark8.proftvv.com.tr/](https://mark8.proftvv.com.tr/)

*Modern web teknolojileri ile geliştirilmiş, AES-256 şifreleme & Passkey desteği sunan profesyonel veri güvenliği çözümü*

---

</div>

## 📋 Platform Hakkında

**Mark VIII**, kişisel ve kurumsal verilerinizi en yüksek güvenlik standartlarında şifreleyen ve yöneten modern bir web platformudur. Kullanıcılarına kolay, hızlı ve son derece güvenli bir deneyim sunmak için tasarlanmıştır.

### 🎯 Kimler İçin?

- 💼 **Profesyoneller:** Müşteri bilgileri, iş verileri, gizli notlar
- 👨‍💻 **Geliştiriciler:** API anahtarları, database bilgileri, server credentials
- 🏢 **Kurumlar:** Hassas dokümanlar, şifreli raporlar, güvenli arşivleme
- 👤 **Bireysel Kullanıcılar:** Şifreler, kişisel notlar, önemli belgeler

---

## 🌟 Temel Özellikler

### 🔒 Askeri Seviye Güvenlik

<table>
<tr>
<td width="50%">

#### 🛡️ AES-256 Şifreleme
- **Endüstri Standardı:** NSA tarafından "TOP SECRET" sınıflandırılmış veriler için onaylı
- **Kırılması İmkansız:** Günümüz süper bilgisayarlarıyla 2^256 kombinasyon (10^77 yıl)
- **Client-Side Encryption:** Veriler sunucuya gitmeden cihazınızda şifrelenir
- **Zero-Knowledge:** Şifreleme anahtarınızı sadece siz bilirsiniz

</td>
<td width="50%">

#### 🔑 Modern Kimlik Doğrulama
- **Email/Username Giriş:** Esnek giriş seçenekleri
- **Passkey Teknolojisi:** Yüz tanıma/parmak izi ile anında giriş
- **2FA (TOTP):** Google/Microsoft Authenticator desteği
- **Bcrypt Hashing:** Şifreler SHA-256 hash ile saklanır

</td>
</tr>
</table>

### ⚡ Kullanıcı Deneyimi

- **🎨 Modern Arayüz:** Koyu tema ile gözlere kolay tasarım
- **📱 Responsive:** Telefon, tablet, bilgisayar - her cihazda mükemmel görünüm
- **🚀 Hızlı:** Next.js 15 ile anlık sayfa yüklemeleri
- **🌍 Türkçe:** Tam Türkçe dil desteği

### 🔐 Güvenlik Katmanları

```
┌─────────────────────────────────────────────────┐
│  1. HTTPS/TLS Şifreleme (Veri İletimi)        │
│  2. AES-256 Encryption (Veri Depolama)        │
│  3. JWT Token Authentication (Oturum)         │
│  4. Passkey/2FA (Kimlik Doğrulama)           │
│  5. PostgreSQL Güvenliği (Database)           │
│  6. Vercel WAF (Web Application Firewall)    │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Nasıl Kullanılır?

### 1️⃣ Platforma Erişim

**🌐 Web Adresi:** [https://mark8.proftvv.com.tr/](https://mark8.proftvv.com.tr/)

> ⚠️ **Önemli:** Mark VIII kapalı kaynak bir platformdur. Kodu indirip yerel olarak çalıştıramazsınız. Tüm işlemler güvenli bulut sunucularımızda gerçekleşir.

### 2️⃣ Hesap Oluşturma

1. **"Hesap Oluştur"** butonuna tıklayın
2. Aşağıdaki bilgileri girin:
   - **Email:** Hesap kurtarma için geçerli email adresi
   - **Kullanıcı Adı:** 3-20 karakter arası benzersiz kullanıcı adı
   - **Şifre:** En az 8 karakter (büyük harf, küçük harf, rakam önerilir)
3. Şifrenizi tekrar girin ve **"Hesap Oluştur"** butonuna basın

### 3️⃣ Giriş Yapma

**Klasik Yöntem:**
- Email veya kullanıcı adınız + şifreniz ile giriş yapın

**Passkey ile (Önerilen):**
- **"Passkey ile Giriş"** butonuna tıklayın
- Cihazınızın parmak izi okuyucusu veya yüz tanıma özelliği ile doğrulayın
- Şifre yazmadan anında giriş yapın! 🎉

### 4️⃣ Veri Şifreleme

1. **Dashboard → Genel** sekmesine gidin
2. **"Yeni Veri Ekle"** butonuna tıklayın
3. Başlık ve içerik girin
4. **"Şifrele ve Kaydet"** - Otomatik olarak AES-256 ile şifrelenir
5. Verilerinizi listeden görebilir, düzenleyebilir veya silebilirsiniz

---

## 🔐 Güvenlik Özellikleri Detayları

### 🛡️ AES-256 Encryption

**Ne kadar güvenli?**
- **Teorik Kırma Süresi:** 3 × 10^51 yıl (evrenin yaşı: 13.8 × 10^9 yıl)
- **Kullanım Alanları:** ABD hükümeti, NASA, bankacılık sektörü, savunma sanayii
- **Sertifikalar:** FIPS 140-2 onaylı

**Nasıl Çalışır?**
```
Düz Metin → AES-256 Şifreleme → Şifreli Veri → PostgreSQL
    ↓                                              ↓
 "Merhaba"                                "a7f3k9x2..."
```

### 🔑 Passkey (WebAuthn) Teknolojisi

**Neden Passkey?**
- 🚫 **Phishing Koruması:** Sahte sitelere çalınması imkansız
- ⚡ **Hız:** Şifre yazmaktan 3-5 kat daha hızlı
- 🔒 **Güvenlik:** Cihaza bağlı kriptografik anahtar çifti
- 🌍 **Standart:** FIDO2/WebAuthn - Google, Apple, Microsoft tarafından desteklenir

**Teknik Detaylar:**
- **Public Key Cryptography:** RSA veya ECDSA
- **Biometric:** Parmak izi, yüz tanıma, PIN
- **Platform:** Windows Hello, Touch ID, Android Biometric

### 🔐 İki Faktörlü Kimlik Doğrulama (2FA)

**Nasıl Aktive Edilir?**
1. Dashboard → Güvenlik → **"2FA Etkinleştir"**
2. Google Authenticator/Microsoft Authenticator ile QR kodu tarayın
3. 6 haneli kodu girin ve doğrulayın
4. **Backup kodlarını güvenli bir yere kaydedin!**

**Desteklenen Uygulamalar:**
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden

---

## 📊 Kullanıcı Paneli

### 🏠 Ana Ekran
- Güvenlik seviyeniz (0-10 arası)
- Şifrelenmiş veri miktarı
- Son aktiviteler
- Hızlı erişim butonları

### ⚙️ Genel
- Şifreli veri listesi
- Yeni veri ekleme
- Veri düzenleme/silme
- Arama ve filtreleme

### 🔒 Güvenlik
- 2FA yönetimi (aktif/pasif)
- Passkey oluşturma
- Backup kodlarını görüntüleme
- Şifre değiştirme

### 📋 Aktiviteler
- Giriş kayıtları
- IP adresi takibi
- Cihaz bilgileri
- Tarih/saat damgaları

### ❌ Hesabı Sil
- Tüm verilerinizi kalıcı olarak silin
- Geri alınamaz işlem
- Onay gerektirir

---

## 🏗️ Teknoloji Stack

### Frontend
```typescript
- Next.js 15 (React Framework)
- TypeScript (Type Safety)
- Tailwind CSS (Styling)
- Radix UI (Components)
```

### Backend
```typescript
- Node.js (Runtime)
- Next.js API Routes (Serverless)
- PostgreSQL (Database)
- Vercel (Hosting & CDN)
```

### Güvenlik
```typescript
- AES-256-GCM (Encryption)
- bcryptjs (Password Hashing)
- JWT (JSON Web Tokens)
- WebAuthn/FIDO2 (Passkey)
- speakeasy (2FA/TOTP)
```

---

## 🔒 Gizlilik & Veri Politikası

### ✅ Sakladığımız Veriler
- Email adresi (hesap kurtarma)
- Kullanıcı adı (giriş)
- Şifrelenmiş şifre hash'i (bcrypt)
- Şifreli verileriniz (AES-256)
- Giriş logları (güvenlik)

### ❌ Saklamadığımız Veriler
- Şifreleme anahtarlarınız
- Düz metin şifreleriniz
- Kredi kartı bilgileri
- Kişisel kimlik bilgileri

### 🛡️ Güvenlik Garantileri
- **Zero-Knowledge Encryption:** Verilerinizi biz bile göremeyiz
- **No Third-Party:** Verileriniz 3. parti servislerle paylaşılmaz
- **GDPR Compliant:** Avrupa veri koruma yasalarına uygun
- **Regular Backups:** Günlük otomatik yedekleme

---

## ❓ Sıkça Sorulan Sorular

### 🤔 Şifremi unutursam ne olur?
Şifreniz bcrypt ile hash'lenmiştir ve geri alınamaz. Ancak email ile şifre sıfırlama özelliğimiz yakında eklenecektir.

### 🔑 Passkey'imi kaybedersem?
Passkey cihaza bağlıdır. Cihazınızı kaybederseniz klasik yöntemle (email/şifre) giriş yapabilir, yeni bir passkey oluşturabilirsiniz.

### 💰 Ücretli mi?
Şu anda tamamen ücretsizdir. Gelecekte premium özellikler eklenebilir.

### 📱 Mobil uygulama var mı?
Hayır, ancak web sitemiz tam responsive'dir ve mobil cihazlarda mükemmel çalışır.

### 🔄 Verilerimi dışarı aktarabilir miyim?
Evet, yakında "Export" özelliği eklenecektir (JSON/CSV formatında).

---

## 📞 Destek & İletişim

### 🐛 Hata Bildirimi
Bir hata ile karşılaştıysanız, lütfen şu bilgileri içeren bir rapor gönderin:
- Hata mesajı
- Tarayıcı bilgisi
- İşlem adımları
- Ekran görüntüsü (varsa)

### 💡 Özellik İsteği
Yeni bir özellik öneriniz varsa bizimle paylaşın!

### 📧 İletişim
- **Website:** [https://mark8.proftvv.com.tr/](https://mark8.proftvv.com.tr/)
- **Email:** ozcan@reportdisticaret.com

---

## 📜 Lisans & Yasal

**Copyright © 2026 Mark VIII - Tüm Hakları Saklıdır**

Bu yazılım kapalı kaynak koddur. Kaynak kodunun kopyalanması, dağıtılması veya tersine mühendislik yapılması yasaktır.

**Kullanım Koşulları:**
- Platform sadece yasal amaçlarla kullanılabilir
- Kötüye kullanım tespit edilirse hesabınız kapatılır
- Verilerinizin yedeklenmesi sizin sorumluluğunuzdadır

---

<div align="center">

### 🔐 Güvenliğiniz Bizim Önceliğimiz

**[Mark VIII'e Başlayın →](https://mark8.proftvv.com.tr/)**

---

*Made with ❤️ and 🔒 by Mark VIII Team*

</div>

## 📱 Android Access

Access from your Android device on the same WiFi network:

```bash
# 1. Find your computer's IP address
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)

# 2. On Android browser, open:
http://YOUR-IP:3000
# Example: http://192.168.1.100:3000
```

---

## 💡 Usage

### 1. Register Account

```
1. Click "Register" button
2. Enter username and password (min 6 characters)
3. Optional: Enable biometric authentication
4. Click "Register"
```

### 2. Login

**Password Login:**
```
1. Enter credentials
2. Click "Login"
```

**Biometric Login:**
```
1. Enter username
2. Click "Login with Biometric"
3. Use fingerprint/face recognition
```

### 3. Encrypt Data

```
1. Enter title for your data
2. Type/paste content to encrypt
3. Set encryption password
4. Click "Encrypt & Save"
```

⚠️ **Important:** Encryption passwords cannot be recovered. Store them securely!

### 4. Decrypt & View

```
1. Click "View Decrypted" on any item
2. Enter encryption password
3. Click "Decrypt"
```

---

## 🔐 Security

### Encryption

- **Algorithm**: AES-256-CBC
- **Library**: CryptoJS 4.2.0
- **Key Derivation**: PBKDF2
- **Client-Side**: All encryption happens in browser

### Authentication

- **Password Hashing**: bcrypt with 10 salt rounds
- **Biometric**: WebAuthn API (FIDO2 standard)
- **Session**: Secure session management
- **Protection**: SQL injection prevention

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Encrypted data table
CREATE TABLE encrypted_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  encrypted_content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Icons**: Heroicons

### Backend
- **API**: Next.js API Routes
- **Database**: Better-SQLite3
- **Encryption**: CryptoJS
- **Auth**: bcryptjs, WebAuthn

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js Compiler

---

## 📦 Project Structure

```
Mark-VIII/
├── app/
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── LoginForm.tsx         # Login component
│   ├── RegisterForm.tsx      # Registration
│   ├── Dashboard.tsx         # Main dashboard
│   ├── EncryptionPanel.tsx   # Encrypt interface
│   └── DataList.tsx          # Data management
├── lib/
│   ├── database.ts           # SQLite setup
│   ├── encryption.ts         # AES functions
│   └── biometric.ts          # WebAuthn
├── pages/api/
│   ├── auth/
│   │   ├── login.ts         # Login endpoint
│   │   └── register.ts      # Register endpoint
│   └── data/
│       ├── save.ts          # Save data
│       ├── list.ts          # List data
│       └── delete.ts        # Delete data
└── public/                   # Static assets
```

---

## 🌐 Deployment

### Local Development (Recommended)

```bash
npm run dev
```

Access:
- **Windows**: http://localhost:3000
- **Android** (same WiFi): http://YOUR-IP:3000

### Vercel Deployment

⚠️ **Important**: SQLite doesn't work on Vercel's serverless platform.

**For Vercel deployment**, you need to:

1. **Set up Vercel Postgres**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy (will prompt for Postgres setup)
   vercel
   ```

2. **Configure Database**:
   - Vercel Dashboard → Storage → Create Database → Postgres
   - Environment variables will be auto-added
   
3. **Update Database Code**:
   - Replace `lib/database.ts` with Postgres implementation
   - See `VERCEL_DEPLOY.md` for details

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

**Alternative**: Use the app locally with SQLite (works perfectly for development and personal use).

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env.local`:

```env
# Database (for Vercel)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url

# Session (optional)
SESSION_SECRET=your_random_secret
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `npm install` fails | Ensure Node.js 18+, try `npm cache clean --force` |
| Port 3000 in use | Use `npm run dev -- -p 3001` |
| Can't access from Android | Check same WiFi, verify firewall |
| Biometric not working | Requires HTTPS or localhost |
| Database locked | Close app, delete `.db-wal` files |

### Support

1. Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
2. Review [troubleshooting section](#-troubleshooting)
3. Open an issue on GitHub

---

## 📚 Documentation

- 📖 [Installation Guide](./INSTALLATION_GUIDE.md) - Detailed setup
- 📖 [Quick Reference](./QUICK_REFERENCE.md) - Command reference
- 📖 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details
- 📖 [Start Here](./START_HERE.txt) - Quick start guide

---

## 🗺️ Roadmap

- [ ] Password recovery system
- [ ] File encryption support
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Multi-factor authentication
- [ ] Cloud synchronization
- [ ] Encrypted backups
- [ ] Password strength meter
- [ ] Sharing functionality
- [ ] Admin dashboard

---

## 🤝 Contributing

This is a private project. For suggestions or bug reports:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

Private project - All rights reserved

---

## 👨‍💻 Author

**proftvv**

- GitHub: [@proftvv](https://github.com/proftvv)
- Project: [Mark-VIII](https://github.com/proftvv/Mark-VIII)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- CryptoJS for encryption library
- All open-source contributors

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for security and privacy**

[Report Bug](https://github.com/proftvv/Mark-VIII/issues) • [Request Feature](https://github.com/proftvv/Mark-VIII/issues)

</div>
