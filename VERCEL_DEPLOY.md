# Mark-VIII için Vercel Deployment Rehberi

## ⚠️ ÖNEMLİ: Proje Artık Vercel Postgres Kullanıyor

SQLite ve `better-sqlite3` bağımlılığı kaldırıldı. Sunucu tarafı işlemler `@vercel/postgres` ile çalışır ve Vercel üzerinde kalıcıdır.

### Gerekli Kurulumlar

1. Vercel Dashboard → Storage → Create Database → Postgres
2. Projenizi bu veritabanına bağlayın.
3. Aşağıdaki environment değişkenlerinin projeye eklendiğini doğrulayın:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_PRISMA_URL` (opsiyonel, kullanılmıyor ama eklenebilir)

Backend kodu tabloyu otomatik oluşturur (`lib/database.ts` içindeki `initDatabase()`), ekstra migration gerekmez.

## Hızlı Kurulum

```bash
# 1. Kurulum
npm install

# 2. Local test
npm run dev

# 3. Vercel'e deploy
vercel

# 4. Postgres setup (Vercel dashboard'da)
# 5. Production deploy
vercel --prod
```

## Detaylı Adımlar

### 1. Local Test
```bash
npm install
npm run dev
# http://localhost:3000
```

### 2. Vercel CLI ile Deploy
```bash
npm install -g vercel
vercel login
vercel
```

### 3. Postgres Ekle
- Vercel Dashboard → Project → Storage
- Create Database → Postgres
- Connect to project

### 4. Database Kodunu Güncelle
Gerek yok: `lib/database.ts` zaten `@vercel/postgres` ile güncel ve tablo oluşturmayı otomatik yapıyor.

## API Uç Noktaları
- `POST /api/auth/register` → Kullanıcı oluşturur
- `POST /api/auth/login` → Giriş doğrulaması (bcrypt)
- `POST /api/data/save` → İçeriği şifreler ve kaydeder
- `GET /api/data/list?username=...` → Kullanıcıya ait verileri listeler
- `DELETE /api/data/delete?id=...` → Kaydı siler

## Ortam Değişkenleri (Local)
Local geliştirirken Vercel Postgres’e bağlanmak için Vercel dashboard’dan bağlantı bilgilerini kopyalayıp `.env.local` dosyasına ekleyebilirsiniz:

```
POSTGRES_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
```

Not: Vercel üzerinde bu değişkenler Project → Settings → Environment altında yönetilir.
