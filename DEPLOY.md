# 🚀 Deploy ke Vercel — Tutorial Lengkap

> **Baca ini jika Anda ingin membuat aplikasi Agil Rental Mobil bisa diakses publik di internet.**

Ikuti langkah demi langkah di bawah ini. Total waktu: **±15 menit**.

---

## 📋 Daftar Isi

1. [Persiapan Sebelum Deploy](#1-persiapan-sebelum-deploy)
2. [Buat Akun yang Diperlukan](#2-buat-akun-yang-diperlukan)
3. [Buat Database Cloud di Neon](#3-buat-database-cloud-di-neon)
4. [Push Project ke GitHub](#4-push-project-ke-github)
5. [Deploy ke Vercel](#5-deploy-ke-vercel)
6. [Push Data ke Database Cloud](#6-push-data-ke-database-cloud)
7. [Test Aplikasi Live](#7-test-aplikasi-live)
8. [Update Aplikasi (Setelah Deploy)](#8-update-aplikasi-setelah-deploy)
9. [Troubleshooting Deploy](#9-troubleshooting-deploy)

---

## 1. Persiapan Sebelum Deploy

Sebelum deploy, pastikan aplikasi **sudah berjalan lancar di lokal**:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Jalankan aplikasi
npm run dev
```

Buka **http://localhost:3000** — pastikan halaman utama muncul dan tidak ada error.

> 💡 **Jika belum bisa jalan di lokal**, silakan baca [README.md](./README.md) dulu untuk setup dari awal.

---

## 2. Buat Akun yang Diperlukan

Anda perlu **3 akun gratis** sebelum deploy. Setiap langkah cukup **5 menit**.

### 2.1 Akun GitHub (tempat menyimpan kode)

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [github.com](https://github.com/) |
| 2. Klik | **"Sign up"** (pojok kanan atas) |
| 3. Isi | Email, password, username |
| 4. Verifikasi | Cek email, klik link verifikasi |
| 5. Done | Akun GitHub siap digunakan |

### 2.2 Akun Neon (database cloud — GRATIS)

Neon adalah database PostgreSQL gratis yang bisa diakses dari mana saja.  
**Tidak perlu install apa pun** — semua online.

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [neon.tech](https://neon.tech/) |
| 2. Klik | **"Sign Up"** |
| 3. Pilih | Login dengan **GitHub** atau **Google** |
| 4. Done | Akan langsung masuk ke dashboard Neon |

> 🟢 Kenapa Neon? Gratis (hingga 500MB storage), serverless, langsung siap pakai dalam 30 detik.

### 2.3 Akun Vercel (hosting website — GRATIS)

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [vercel.com](https://vercel.com/) |
| 2. Klik | **"Sign Up"** |
| 3. Pilih | Login dengan **GitHub** |
| 4. Authorize | Klik **"Authorize Vercel"** |
| 5. Done | Dashboard Vercel akan muncul |

> 🟢 Vercel adalah hosting gratis untuk Next.js. Domain akan berakhiran `.vercel.app`.

---

## 3. Buat Database Cloud di Neon

### 3.1 Buka Dashboard Neon

Setelah login di [neon.tech](https://neon.tech/), Anda akan melihat tampilan seperti ini.  
Klik **"Create project"** atau **"New Project"**.

### 3.2 Isi Form Project

| Field | Isi |
|-------|-----|
| **Project name** | `rentcar-agil` |
| **Database name** | `rentcar` |
| **Region** | Pilih yang terdekat (contoh: `Singapore` atau `Tokyo`) |
| **Postgres version** | `16` (default) |

Klik **"Create project"**. Tunggu ±30 detik.

### 3.3 Dapatkan Connection String

Setelah project dibuat, Anda akan masuk ke halaman project.  
Ikuti langkah ini untuk mendapatkan URL koneksi database:

| Langkah | Gambaran |
|---------|----------|
| 1. Lihat sidebar kiri | Ada menu **"Dashboard"**, **"SQL Editor"**, dll |
| 2. Klik **"Dashboard"** | Tampilan default setelah membuat project |
| 3. Cari kotak **"Connection Details"** | Biasanya di bagian atas halaman |
| 4. Pilih tab **"Prisma"** | Karena aplikasi kita pakai Prisma |
| 5. Copy **Connection string** | Akan terlihat seperti: |

```
postgresql://neondb_owner:npg_xxxxxxxxxxxx@ep-xxxx-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

> 📝 **Simpan connection string ini!** Kita akan menggunakannya di Vercel nanti.

### 3.4 Cek Koneksi

Copy connection string, buka Terminal, jalankan:

```bash
# Ganti <CONNECTION_STRING> dengan URL dari Neon
DATABASE_URL="<CONNECTION_STRING>" npx prisma db push
```

Jika berhasil:
```
Your database is now in sync with your Prisma schema.
```

> ⚠️ **Jangan lupa tambahkan `?sslmode=require` di akhir URL** jika belum ada.  
> Tanpa ini, koneksi ke Neon akan gagal.

---

## 4. Push Project ke GitHub

### 4.1 Buka Terminal di Folder Project

```bash
cd /path/ke/folder/rent-car
```

### 4.2 Inisialisasi Git

```bash
git init
```

### 4.3 Buat Repository di GitHub

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [github.com/new](https://github.com/new) |
| 2. **Repository name** | `rent-car` |
| 3. **Private** atau **Public** | Bebas, pilih salah satu |
| 4. **JANGAN centang** | Add a README, .gitignore, license |
| 5. Klik | **"Create repository"** |

### 4.4 Hubungkan & Push

GitHub akan menampilkan perintah. Jalankan di Terminal:

```bash
git add .
git commit -m "Initial commit: Agil Rental Mobil v1.0"

# Copy perintah dari halaman GitHub, biasanya seperti ini:
git remote add origin https://github.com/<username>/rent-car.git
git branch -M main
git push -u origin main
```

> 💡 Ganti `<username>` dengan username GitHub Anda.

**Verifikasi**: Refresh halaman GitHub — file project akan muncul.

---

## 5. Deploy ke Vercel

### 5.1 Import Project

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [vercel.com](https://vercel.com/) |
| 2. Klik | **"Add New..."** → **"Project"** |
| 3. Cari | Repository `rent-car` |
| 4. Klik | **"Import"** |

### 5.2 Konfigurasi Project

#### Framework

Vercel otomatis mendeteksi **Next.js**. **Tidak perlu diubah.**

#### Environment Variables

Ini bagian **PALING PENTING**.  
Klik **"Environment Variables"** dan tambahkan satu per satu:

| Key (Nama) | Value (Isi) | Keterangan |
|------------|-------------|------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_xxx...` | **Connection string dari Neon** (langkah 3.3) |
| `JWT_SECRET` | `rentcar-jwt-secret-prod-2024` | Kata rahasia untuk JWT (bebas, asal panjang) |
| `NEXT_PUBLIC_APP_URL` | `https://rent-car.vercel.app` | Nanti diupdate setelah deploy |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `6285754650271` | Nomor WhatsApp admin |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Biarkan dulu seperti ini |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Biarkan dulu seperti ini |

> 📝 **Cara mengisi `DATABASE_URL`**:  
> Copy-paste connection string dari Neon yang Anda simpan di langkah 3.3.

#### Root Directory

Biarkan kosong (default).

### 5.3 Deploy!

Klik tombol **"Deploy"**.

Vercel akan:
1. 📥 Download kode dari GitHub
2. 📦 Install dependencies (`npm install`)
3. 🔧 Generate Prisma client (`prisma generate`)
4. 🏗️ Build aplikasi (`npm run build`)
5. 🚀 Deploy ke server

**Tunggu 2-3 menit.** Progress bisa dilihat di halaman Vercel.

### 5.4 Cek Hasil Deploy

Setelah selesai, Vercel akan menampilkan:

```
🎉 Congratulations! Your app is deployed!
Production: https://rent-car-xxxxx.vercel.app
```

Buka URL tersebut. Halaman utama Agil Rental Mobil akan muncul!

> ⚠️ **Tapi API belum berfungsi** — karena database belum berisi data. Lanjut ke langkah 6.

---

## 6. Push Data ke Database Cloud

Sekarang kita isi database Neon dengan data awal (mobil, akun, booking sample).

### 6.1 Set DATABASE_URL Sementara

Buka Terminal, jalankan:

```bash
cd /path/ke/folder/rent-car

# Ganti dengan connection string Neon Anda
export DATABASE_URL="postgresql://neondb_owner:npg_xxx..."
```

> Untuk Windows (Command Prompt):
> ```cmd
> set DATABASE_URL=postgresql://neondb_owner:npg_xxx...
> ```

### 6.2 Push Schema

```bash
npx prisma db push
```

### 6.3 Seed Data

```bash
npx tsx prisma/seed.ts
```

Hasilnya:
```
✅ 7 users created
✅ 6 cars created
✅ 5 sample bookings created
✅ Rental settings created
```

### 6.4 Update NEXT_PUBLIC_APP_URL

| Langkah | Keterangan |
|---------|------------|
| 1. Buka | [vercel.com](https://vercel.com/) → Project `rent-car` |
| 2. Klik | **"Settings"** → **"Environment Variables"** |
| 3. Cari | `NEXT_PUBLIC_APP_URL` |
| 4. Edit | Ganti value menjadi URL production Anda |
| 5. Klik | **"Save"** |

Contoh: `https://rent-car-flame.vercel.app`

### 6.5 Redeploy

Setiap kali environment variable berubah, **harus redeploy**:

| Langkah | Keterangan |
|---------|------------|
| 1. Klik | **"Deployments"** (tab atas) |
| 2. Klik | **titik tiga (...)** di deployment terbaru |
| 3. Klik | **"Redeploy"** |
| 4. Konfirmasi | Klik **"Redeploy"** lagi |
| 5. Tunggu | ±2 menit |

---

## 7. Test Aplikasi Live

Setelah redeploy selesai, buka URL production Anda dan cek:

### 7.1 Halaman Publik

| Halaman | URL | Yang Harus Muncul |
|---------|-----|-------------------|
| Homepage | `/` | Hero, mobil, layanan, kontak |
| Daftar Mobil | `/cars` | 6 mobil dengan harga |
| Detail Mobil | `/cars/brio-terbaru` | Foto, spesifikasi, form booking |
| Login | `/login` | Form login + info akun demo |
| Register | `/register` | Form pendaftaran |

### 7.2 Test Login

Coba login dengan akun demo:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@agilrental.test` | `password123` |
| Customer | `budi@example.com` | `password123` |

### 7.3 Test Fitur Booking

1. Login sebagai customer (`budi@example.com`)
2. Buka `/cars` → pilih mobil → **"Pesan Sekarang"**
3. Pilih layanan, upload KTP & bukti transfer
4. Konfirmasi → lihat di dashboard customer

### 7.4 Test Fitur Admin

1. Login sebagai admin (`admin@agilrental.test`)
2. Dashboard muncul dengan statistik
3. Cek `/admin/bookings` → verifikasi/tolak pembayaran
4. Cek `/admin/cars` → tambah/edit mobil

> ✅ **Jika semua berfungsi**, aplikasi siap digunakan! 🎉

---

## 8. Update Aplikasi (Setelah Deploy)

Setiap kali Anda mengubah kode dan ingin update di production:

```bash
# 1. Edit kode di lokal
# 2. Test: npm run dev
# 3. Commit & push
git add .
git commit -m "Deskripsi perubahan"
git push

# Vercel akan otomatis mendeteksi push ke GitHub dan deploy ulang
```

> 🟢 **No need to redeploy manually** — Vercel auto-deploys setiap push ke GitHub.

---

## 9. Troubleshooting Deploy

### ❌ Build Error: "Prisma Client generation"

**Pesan error:**
```
Prisma has detected that this project was built on Vercel...
```

**Solusi:** Pastikan `package.json` memiliki baris ini:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```
> File ini sudah ada di project. Jangan dihapus.

### ❌ API Error 500 di Production

**Pesan:** `{"error":"Terjadi kesalahan server"}`

**Penyebab:** Database tidak terkoneksi.

**Solusi:**
1. Cek `DATABASE_URL` di Vercel Settings → Environment Variables
2. Pastikan URL mengandung `?sslmode=require` di akhir
3. Cek database Neon masih aktif (buka dashboard Neon)
4. Coba redeploy (langkah 6.5)

### ❌ "Module not found: @prisma/client"

**Pesan error:**
```
Cannot find module '@prisma/client'
```

**Solusi:** Jalankan di lokal:
```bash
npx prisma generate
npm install
git add .
git commit -m "fix: prisma client"
git push
```

### ❌ Neon Database Timed Out

Neon free tier akan **idle** jika tidak digunakan selama beberapa hari.

**Solusi:**
1. Buka [console.neon.tech](https://console.neon.tech/)
2. Project Anda akan otomatis **wake up** saat dibuka
3. Tunggu 10-30 detik
4. Aplikasi akan berfungsi kembali

### ❌ Gambar Tidak Muncul

Gambar dari Unsplash mungkin lambat. Tidak ada error — hanya loading.

**Solusi:** Upload gambar sendiri atau gunakan URL gambar dari Supabase Storage.

---

## 📊 Ringkasan Arsitektur

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   GitHub    │────▶│   Vercel    │────▶│  Neon (DB)   │
│  (Kode)     │     │  (Hosting)  │     │  (PostgreSQL)│
└─────────────┘     └─────────────┘     └──────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  Pengguna    │
                   │  (Browser)   │
                   └──────────────┘
```

- **GitHub**: Menyimpan kode project
- **Vercel**: Menghosting aplikasi Next.js dan menjalankan API
- **Neon**: Database PostgreSQL cloud (gratis)
- **Pengguna**: Mengakses aplikasi via browser

---

## 💰 Biaya

Semua layanan yang digunakan **100% GRATIS**:

| Layanan | Free Tier |
|---------|-----------|
| GitHub | Unlimited public/private repos |
| Vercel | 100 GB bandwidth/bulan, unlimited sites |
| Neon | 500 MB storage, 1 project |

> Untuk penggunaan skala kecil-menengah (rental mobil lokal), free tier **lebih dari cukup**.

---

## 📞 Butuh Bantuan?

Jika mengalami kesulitan saat deploy, hubungi developer atau buka dokumentasi:

- [Dokumentasi Vercel](https://vercel.com/docs)
- [Dokumentasi Neon](https://neon.tech/docs)
- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Dokumentasi Prisma](https://www.prisma.io/docs)
