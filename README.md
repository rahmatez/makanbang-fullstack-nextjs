# MakanBang — Aplikasi Pemesanan Makanan

Aplikasi pemesanan makanan full-stack dengan Next.js, PostgreSQL, Auth.js, dan Midtrans Snap.

## Fitur

### Portal Pelanggan
- Browse menu dengan filter kategori & pencarian
- CartDrawer (sheet) + halaman keranjang
- Checkout dengan progress steps & React Hook Form
- Midtrans Snap via API route dedicated
- Riwayat pesanan dengan polling status otomatis
- Batalkan pesanan (status PENDING/PAID)
- Profil & alamat tersimpan
- Notifikasi in-app
- Dark mode

### Portal Admin
- Dashboard statistik
- CRUD menu & kategori (edit/hapus)
- Kelola pesanan + audit log status
- Laporan mingguan dengan grafik
- Pengaturan jam operasional restoran
- Mobile bottom navigation

### Keamanan
- Webhook Midtrans dengan verifikasi signature SHA512
- Penanganan `fraud_status`
- Rate limiting (login, register, checkout, webhook)
- Dev payment bypass hanya jika `ALLOW_DEV_PAYMENT_BYPASS=true` dan bukan production

### Auth
- Login / register dengan React Hook Form + Zod
- Auto-login setelah register
- Lupa password & reset password (dev: link ditampilkan)
- Verifikasi email (dev: link ditampilkan)

## Tech Stack

- Next.js 16 (App Router)
- PostgreSQL + Prisma ORM 7
- Auth.js v5
- Zustand, React Hook Form, Zod
- shadcn/ui + Tailwind CSS v4 + next-themes

## Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user@localhost:5432/makanbang"
AUTH_SECRET="your-secret"
AUTH_URL="http://localhost:3000"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"
ALLOW_DEV_PAYMENT_BYPASS="true"  # hanya development
```

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@makanbang.com | admin123 |
| Customer | customer@makanbang.com | customer123 |

## Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Menu & pencarian |
| `/cart` | Keranjang |
| `/checkout` | Checkout & bayar |
| `/orders` | Riwayat pesanan |
| `/profile` | Profil & alamat |
| `/admin/dashboard` | Dashboard |
| `/admin/menu` | Kelola menu |
| `/admin/orders` | Kelola pesanan |
| `/admin/reports` | Laporan mingguan |
| `/admin/settings` | Jam operasional |

## Deploy ke Vercel

1. Buat database PostgreSQL hosted (Neon, Supabase, atau Vercel Postgres).
2. Di **Vercel → Project → Settings → Environment Variables**, set:

| Variable | Contoh |
|----------|--------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | random string (`openssl rand -base64 32`) |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `MIDTRANS_SERVER_KEY` | key Midtrans |
| `MIDTRANS_CLIENT_KEY` | key Midtrans |
| `MIDTRANS_IS_PRODUCTION` | `false` (sandbox) atau `true` |
| `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` | sama dengan di atas |
| `ALLOW_DEV_PAYMENT_BYPASS` | `false` |

3. Push ke GitHub dan deploy. Build menjalankan `prisma migrate deploy` otomatis.
4. Setelah deploy pertama, seed database (jalankan lokal dengan `DATABASE_URL` production):

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

**Catatan:** Jangan pakai `localhost` di `DATABASE_URL` Vercel — database harus bisa diakses dari internet.
