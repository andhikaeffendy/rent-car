# 🚗 Agil Rental — Aplikasi Rental Mobil & Motor Ambon

Aplikasi website full-stack untuk rental kendaraan (mobil & motor) di Ambon.  
Dibangun dengan **Next.js 16**, **Prisma ORM**, **PostgreSQL** (Neon), dan **Tailwind CSS 4**.

> ⚠️ Dalam tahap **pengembangan skripsi** — belum di-deploy ke publik.

---

## 📋 Daftar Isi

1. [Software yang Harus Diinstall](#1-software-yang-harus-diinstall)
2. [Download Project](#2-download-project)
3. [Setup Database](#3-setup-database)
4. [Setup Environment Variables](#4-setup-environment-variables)
5. [Install Dependencies](#5-install-dependencies)
6. [Apply Migration & Seed Data](#6-apply-migration--seed-data)
7. [Jalankan Aplikasi](#7-jalankan-aplikasi)
8. [Daftar Akun Demo](#8-daftar-akun-demo)
9. [Panduan Penggunaan — Customer](#9-panduan-penggunaan--customer)
10. [Panduan Penggunaan — Admin](#10-panduan-penggunaan--admin)
11. [Deploy ke Internet](#11-deploy-ke-internet)
12. [Troubleshooting](#12-troubleshooting)
13. [Daftar Armada & Harga](#13-daftar-armada--harga)

---

## 1. Software yang Harus Diinstall

Sebelum memulai, install software berikut **satu per satu**:

### 1.1 Node.js (Wajib)

| Sistem Operasi | Cara Install |
|----------------|--------------|
| **Windows** | 1. Buka [nodejs.org](https://nodejs.org/)<br>2. Klik tombol hijau **"LTS"**<br>3. Buka file yang sudah di-download<br>4. Klik **Next** → **Next** → **Install** → **Finish** |
| **macOS** | 1. Buka [nodejs.org](https://nodejs.org/)<br>2. Klik tombol hijau **"LTS"**<br>3. Buka file `.pkg` → **Continue** → **Install** |
| **Linux** | `sudo apt install nodejs npm` (Ubuntu/Debian) |

**Verifikasi:**
```bash
node --version    # Contoh: v20.19.0
npm --version     # Contoh: 10.8.0
```

### 1.2 Akun Neon Database (Wajib)

Database cloud gratis — tanpa install PostgreSQL lokal.

1. Buka [neon.tech](https://neon.tech/) → **Sign Up**
2. **Create a project** → nama: `rent-car` → region terdekat
3. **Copy connection string**:
   ```
   postgresql://neondb_owner:********@ep-nama-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Simpan — akan dipakai di Langkah 4

### 1.3 VS Code (Rekomendasi)

Download dari [code.visualstudio.com](https://code.visualstudio.com/)

### 1.4 Git (Opsional)

| OS | Cara |
|----|------|
| **Windows** | [git-scm.com](https://git-scm.com/downloads) |
| **macOS** | `brew install git` |
| **Linux** | `sudo apt install git` |

---

## 2. Download Project

```bash
git clone https://github.com/andhikaeffendy/rent-car.git
cd rent-car
code .   # Buka di VS Code (opsional)
```

---

## 3. Setup Database

Gunakan **Neon (PostgreSQL cloud)** — connection string dari langkah 1.2.  
Tidak perlu install PostgreSQL lokal.

---

## 4. Setup Environment Variables

### 4.1 Buat File `.env`

```bash
cp .env.example .env
```

### 4.2 Isi File `.env`

```env
DATABASE_URL="postgresql://neondb_owner:********@ep-nama-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="rentcar-jwt-super-secret-key-2024"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="6285754650271"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

> ⚠️ **GANTI `DATABASE_URL`** dengan punya Anda dari Neon. Jika password mengandung `@`, `:`, `/`, `%`, atau `?`, harus di-URL-encode (contoh: `pass@word` → `pass%40word`).

---

## 5. Install Dependencies

```bash
npm install
```

Jika error:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 6. Apply Migration & Seed Data

> ⚠️ **JANGAN import file SQL dari `prisma/migrations/` secara manual!** Biarkan Prisma yang urus.

### 6.1 Apply Migration

```bash
npx prisma migrate deploy
```

Hasil sukses:
```
1 migration found in prisma/migrations
All migrations have been successfully applied.
```

Membuat **6 tabel** (`User`, `Car`, `Booking`, `Payment`, `Document`, `RentalSetting`) + **8 enum** otomatis.

### 6.2 Seed Data

```bash
npx prisma db seed
```

Hasil sukses:
```
✅ 7 users created
✅ 6 cars + 2 motors created
✅ Rental settings created
✅ 5 sample bookings created with payments & documents
```

---

## 7. Jalankan Aplikasi

```bash
npm run dev
```

Buka **http://localhost:3000**

Tekan **Ctrl + C** untuk berhenti.

---

## 8. Daftar Akun Demo

### 👑 Admin

| Nama | Email | Password |
|------|-------|----------|
| Priscil Admin | `admin@agilrental.test` | `password123` |
| Avow Admin | `avow@admin.com` | `password123` |

### 👤 Customer

| Nama | Email | Password |
|------|-------|----------|
| Budi Santoso | `budi@example.com` | `password123` |
| Siti Rahayu | `siti@example.com` | `password123` |
| Andi Pratama | `andi@example.com` | `password123` |
| Dewi Lestari | `dewi@example.com` | `password123` |
| Avow User | `avow@user.com` | `password123` |

---

## 9. Panduan Penggunaan — Customer

### 9.1 Melihat Kendaraan

Buka `/cars` → filter tipe (Mobil/Motor), transmisi, kapasitas, urutkan harga.

### 9.2 Booking (6 Langkah)

Wajib login. Proses:
1. **Pilih Tanggal** — mulai & selesai
2. **Pilih Layanan** — Lepas Kunci / Dengan Supir (Motor skip)
3. **Metode Pengambilan** — Ambil Sendiri / Diantar (+Rp50.000)
4. **Pembayaran** — Transfer Bank (upload bukti) / Tunai
5. **Upload KTP** — JPG/PNG/WebP max 5MB
6. **Konfirmasi** — review & kirim

### 9.3 Status Pesanan

| Status | Arti |
|--------|------|
| ⏳ Menunggu Pembayaran | Belum upload bukti transfer |
| 🔄 Menunggu Verifikasi | Menunggu admin verifikasi |
| ✅ Dikonfirmasi | Booking disetujui |
| ❌ Ditolak | Booking ditolak |
| 🚗 Sedang Disewa | Kendaraan digunakan |
| ✅ Selesai | Sewa selesai |
| ❌ Dibatalkan | Booking dibatalkan |

---

## 10. Panduan Penggunaan — Admin

Akses `/admin/dashboard` setelah login sebagai admin.

| Halaman | Fungsi |
|---------|--------|
| `/admin/dashboard` | Statistik + grafik + pesanan terbaru |
| `/admin/cars` | CRUD kendaraan (tambah/edit/hapus) |
| `/admin/bookings` | Verifikasi pesanan (konfirmasi/tolak/selesai) |
| `/admin/payments` | Verifikasi pembayaran |
| `/admin/customers` | Data pelanggan + riwayat booking |
| `/admin/reports` | Laporan transaksi (filter status & tanggal) |
| `/admin/settings` | Pengaturan rental (info, bank, logo) |

---

## 11. Deploy ke Internet

📖 **Panduan lengkap: [DEPLOY.md](./DEPLOY.md)**

1. `git push` ke GitHub
2. Import di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

---

## 12. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `migrate deploy` gagal | Cek `DATABASE_URL` — pastikan password di-URL-encode |
| `db seed` gagal — tabel tak ditemukan | Jalankan `npx prisma migrate deploy` dulu |
| `npm install` gagal | `rm -rf node_modules package-lock.json && npm install` |
| Port 3000 dipakai | `lsof -ti:3000 \| xargs kill -9` (Mac/Linux) |
| Tidak bisa login | `npx prisma db seed` sudah? Coba `admin@agilrental.test` / `password123` |
| Gambar placeholder SVG | Upload foto asli via Admin Panel → Edit Kendaraan |

---

## 13. Daftar Armada & Harga

| Kendaraan | Tipe | Transmisi | Kursi | Lepas Kunci | Dengan Supir |
|-----------|------|-----------|-------|-------------|--------------|
| **Brio Terbaru** (2024) | Mobil | AT | 5 | Rp350.000/hari | — |
| **Xenia 2020** | Mobil | MT | 7 | Rp350.000/hari | Rp600.000/12 jam |
| **Xenia Terbaru** (2024) | Mobil | MT | 7 | Rp400.000/hari | Rp600.000/12 jam |
| **Avanza Terbaru** (2024) | Mobil | AT | 7 | Rp400.000/hari | Rp600.000/12 jam |
| **Innova Reborn** (2023) | Mobil | AT/MT | 7 | Rp700.000/hari | Rp900.000/12 jam |
| **Zenix** (2024) | Mobil | AT | 7 | Rp900.000/hari | Rp1.300.000/12 jam |
| **Honda Vario 160** (2024) | Motor | CVT | 2 | Rp100.000/hari | — |
| **Yamaha Nmax 155** (2024) | Motor | CVT | 2 | Rp125.000/hari | — |

---

## 📞 Kontak Agil Rental

| Info | Detail |
|------|--------|
| Alamat | Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan) |
| Jam Operasional | Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT |
| Telepon 1 | 0857-5465-0271 |
| Telepon 2 | 0821-7911-7882 |
| Instagram | @agil.rental.ambon |
| Facebook | Gilbert Sipahelut |

---

## 🔑 Command Penting

| Perintah | Fungsi |
|----------|--------|
| `npm install` | Install dependencies |
| `npx prisma migrate deploy` | Apply migration ke database |
| `npx prisma db seed` | Isi data awal |
| `npx prisma db push` | Sync schema cepat (tanpa migration file) |
| `npm run dev` | Jalankan aplikasi |
| `npm run build` | Build production |
| `npx prisma studio` | GUI database di browser |

---

## 📁 Struktur Project

```
rent-car/
├── prisma/
│   ├── schema.prisma          # Skema database (6 tabel + 8 enum)
│   ├── seed.ts                # Data awal
│   └── migrations/            # File migration (jangan diedit!)
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing, cars, car detail
│   │   ├── admin/             # CMS Admin (7 halaman)
│   │   ├── booking/[carId]/   # Wizard 6 langkah
│   │   ├── dashboard/         # Dashboard customer
│   │   ├── login/             # Login
│   │   ├── register/          # Registrasi
│   │   └── api/               # 15 REST API routes
│   ├── components/            # UI reusable
│   ├── lib/                   # Utility (prisma, auth, validasi)
│   └── types/                 # TypeScript types
├── public/uploads/            # File upload
├── .env                       # Environment variables
├── DEPLOY.md                  # Panduan deploy
└── README.md                  # File ini
---

Selamat mencoba! 🚗🏍️
