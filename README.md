# 🚗 Agil Rental — Aplikasi Rental Mobil & Motor Ambon

Aplikasi website full-stack untuk rental kendaraan (mobil & motor) di Ambon.  
Dibangun dengan **Next.js 16**, **Prisma**, **PostgreSQL**, dan **Tailwind CSS**.

> 🌐 **Live demo**: [https://rent-car.vercel.app](https://rent-car.vercel.app)

---

## 📋 Daftar Isi

1. [Software yang Harus Diinstall](#1-software-yang-harus-diinstall)
2. [Download Project](#2-download-project)
3. [Setup Database (Lokal)](#3-setup-database-lokal)
4. [Setup Environment Variables](#4-setup-environment-variables)
5. [Install Dependencies](#5-install-dependencies)
6. [Push Schema & Seed Data](#6-push-schema--seed-data)
7. [Jalankan Aplikasi](#7-jalankan-aplikasi)
8. [Daftar Akun Demo](#8-daftar-akun-demo)
9. [Panduan Penggunaan — Customer](#9-panduan-penggunaan--customer)
10. [Panduan Penggunaan — Admin](#10-panduan-penggunaan--admin)
11. [Setup Supabase (Opsional)](#11-setup-supabase-opsional)
12. [Deploy ke Internet](#12-deploy-ke-internet)
13. [Troubleshooting](#13-troubleshooting)
14. [Daftar Armada & Harga](#14-daftar-armada--harga)

---

## 1. Software yang Harus Diinstall

Sebelum memulai, install software berikut **satu per satu**:

### 1.1 Node.js (Wajib)

**Apa fungsinya?** Menjalankan aplikasi JavaScript.

| Sistem Operasi | Cara Install |
|----------------|--------------|
| **Windows** | 1. Buka [nodejs.org](https://nodejs.org/)<br>2. Klik tombol hijau **"LTS"**<br>3. Buka file yang sudah di-download<br>4. Klik **Next** → **Next** → **Install** → **Finish** |
| **macOS** | 1. Buka [nodejs.org](https://nodejs.org/)<br>2. Klik tombol hijau **"LTS"**<br>3. Buka file `.pkg` → **Continue** → **Install**<br>Atau via Homebrew: `brew install node` |
| **Linux** | `sudo apt install nodejs npm` (Ubuntu/Debian) |

**Verifikasi** (buka Terminal / CMD):
```bash
node --version    # Harus muncul angka, contoh: v20.19.0
npm --version     # Harus muncul angka, contoh: 10.8.0
```

### 1.2 PostgreSQL (Wajib — untuk development lokal)

**Apa fungsinya?** Menyimpan semua data (user, mobil, booking, pembayaran).

#### Windows
1. Download: [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Jalankan installer → **Next** terus
3. **Password**: Masukkan password untuk user `postgres` — **CATAT PASSWORD INI!**
4. Port: `5432` (default) → **Next**
5. **Finish**
6. Buka **pgAdmin** (start menu) untuk verifikasi

#### macOS
```bash
# Cara 1: Via Homebrew (rekomendasi)
brew install postgresql@16
brew services start postgresql@16

# Cara 2: Download Postgres.app dari https://postgresapp.com/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.3 Git (Opsional — untuk download & deploy)

| Sistem Operasi | Cara Install |
|----------------|--------------|
| **Windows** | [git-scm.com](https://git-scm.com/downloads) → Download → Install |
| **macOS** | `brew install git` atau download dari git-scm.com |
| **Linux** | `sudo apt install git` |

### 1.4 VS Code (Rekomendasi — Teks Editor)

Download dari [code.visualstudio.com](https://code.visualstudio.com/), install seperti biasa.

---

## 2. Download Project

### 2.1 Download File

Buka Terminal / CMD, lalu jalankan:

```bash
# Clone project (jika sudah di GitHub)
git clone https://github.com/<username>/rent-car.git
cd rent-car

# ATAU: download ZIP dari GitHub →
# Extract → buka Terminal → cd ke folder hasil extract
```

### 2.2 Buka di VS Code (Opsional)

```bash
code .
```

---

## 3. Setup Database (Lokal)

### 3.1 Buat Database Baru

#### Via pgAdmin (Cara GUI — paling mudah)
1. Buka **pgAdmin** dari Start Menu
2. Klik **"Servers"** → **"PostgreSQL 16"**
3. Masukkan password PostgreSQL Anda
4. Klik kanan **"Databases"** → **"Create"** → **"Database"**
5. **Database**: `rentcar`
6. **Owner**: `postgres`
7. Klik **"Save"**

#### Via Terminal (Cara Cepat)

**Windows:**
```cmd
# Buka "SQL Shell (psql)" dari Start Menu
# Enter, Enter, masukkan password, Enter
CREATE DATABASE rentcar;
\q
```

**macOS / Linux:**
```bash
sudo -u postgres createdb rentcar
# ATAU:
psql -U postgres -c "CREATE DATABASE rentcar;"
```

### 3.2 Catat Password PostgreSQL

Anda akan membutuhkan password PostgreSQL untuk langkah selanjutnya:
- **Username**: `postgres` (default)
- **Password**: yang Anda isi saat install

---

## 4. Setup Environment Variables

### 4.1 Buat File `.env`

Di folder project, buat file baru bernama **`.env`**:

```bash
# Salin dari .env.example
cp .env.example .env

# Atau buat manual di VS Code
```

### 4.2 Isi File `.env`

Buka file `.env` dengan VS Code, isi seperti ini:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/rentcar?schema=public"
JWT_SECRET="rentcar-jwt-secret-key-2024"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="6285754650271"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

| Variabel | Penjelasan | Contoh Isi |
|----------|-----------|------------|
| `DATABASE_URL` | **GANTI `PASSWORD_ANDA`** dengan password PostgreSQL | `postgresql://postgres:admin123@localhost:5432/rentcar` |
| `JWT_SECRET` | Kata rahasia untuk login (bebas, asal panjang) | `rentcar-jwt-secret-key-2024` |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi | `http://localhost:3000` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WA admin | `6285754650271` |
| `NEXT_PUBLIC_SUPABASE_URL` | Biarkan dulu (untuk upload file, opsional) | — |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Biarkan dulu (untuk upload file, opsional) | — |

---

## 5. Install Dependencies

Buka Terminal di folder project, jalankan **satu per satu**:

```bash
# 1. Install semua package yang dibutuhkan
npm install

# 2. Generate Prisma Client (untuk koneksi ke database)
npx prisma generate
```

> ⏳ Tunggu sampai selesai (± 1-2 menit). Akan banyak teks scrolling — itu normal.

---

## 6. Push Schema & Seed Data

### 6.1 Push Schema (Buat Tabel di Database)

```bash
npx prisma db push
```

Hasil yang benar:
```
Your database is now in sync with your Prisma schema.
```

### 6.2 Seed Data (Isi Data Awal)

```bash
npx prisma db seed
```

Hasil yang benar:
```
✅ 7 users created
✅ 6 mobil + 2 motor created
✅ Rental settings created (with bank info)
✅ 5 sample bookings created (with payments & documents)
```

> 🎉 **Database siap!** Semua tabel dan data awal sudah terisi.

---

## 7. Jalankan Aplikasi

### 7.1 Mode Development

```bash
npm run dev
```

Buka browser, akses: **http://localhost:3000**

### 7.2 Yang Harus Muncul

- 🏠 **Halaman utama** — Hero dengan logo Agil Rental, daftar mobil, info kontak
- 🚗 **Halaman kendaraan** — 6 mobil + 2 motor dengan foto dan harga
- 🏍️ **Filter Mobil/Motor** — Tab filter di halaman daftar kendaraan
- 🔑 **Halaman login** — Form login dengan info akun demo
- 📝 **Halaman register** — Form pendaftaran akun baru

---

## 8. Daftar Akun Demo

Setelah seed data, akun-akun ini tersedia:

### 👑 Admin

| Nama | Email | Password |
|------|-------|----------|
| Priscil Admin | `admin@agilrental.test` | `password123` |
| Avow Admin | `avow@admin.com` | `password123` |

> Admin bisa: kelola mobil, verifikasi pembayaran, lihat laporan, ubah pengaturan.

### 👤 Customer

| Nama | Email | Password |
|------|-------|----------|
| Budi Santoso | `budi@example.com` | `password123` |
| Siti Rahayu | `siti@example.com` | `password123` |
| Andi Pratama | `andi@example.com` | `password123` |
| Dewi Lestari | `dewi@example.com` | `password123` |
| Avow User | `avow@user.com` | `password123` |

> Customer bisa: lihat mobil, booking, upload KTP & bukti transfer, lihat riwayat.

### Cara Daftar Akun Baru

1. Buka `http://localhost:3000/register`
2. Isi: Nama, Email, Password, Konfirmasi Password
3. Klik **"Daftar"**
4. Otomatis login → masuk ke Dashboard Customer

---

## 9. Panduan Penggunaan — Customer

### 9.1 Melihat & Mencari Kendaraan

1. Buka halaman utama → scroll ke **"Mobil Tersedia"**  
   atau buka langsung `/cars`
2. **Filter kendaraan**:
   - **Tipe**: Semua, Mobil, Motor (tab filter)
   - **Transmisi**: AT (Matic), MT (Manual)
   - **Kapasitas**: Jumlah kursi (4, 5, 7)
   - **Urutkan**: Terbaru, Harga Terendah, Harga Tertinggi
3. Klik kendaraan untuk lihat **detail lengkap** (ada badge Mobil/Motor)

### 9.2 Booking Kendaraan (6 Langkah)

> ⚠️ **PENTING**: Anda wajib **login terlebih dahulu** untuk melakukan pemesanan.
> Jika belum login, akan diarahkan ke halaman login, lalu otomatis kembali ke booking.

Proses booking menggunakan **wizard 6 langkah**:

#### Langkah ① — Pilih Tanggal Sewa

1. Pilih **Tanggal Mulai** dan **Tanggal Selesai**
2. Durasi sewa otomatis terhitung
3. Klik **"Lanjutkan"**

#### Langkah ② — Pilih Layanan (Khusus Mobil)

> 🏍️ **Untuk Motor**: Langkah ini otomatis dilewati (Motor hanya tersedia lepas kunci)

1. Pilih jenis layanan:
   - 🔑 **Lepas Kunci** — Anda yang menyetir sendiri
   - 👨‍✈️ **Dengan Supir** — Ada sopir (jika tersedia)
2. Klik **"Lanjutkan"**

#### Langkah ③ — Metode Pengambilan & Detail

1. Pilih metode pengambilan:
   - 🏢 **Ambil Sendiri** — Datang ke lokasi
   - 🚚 **Diantar** — Kendaraan diantar ke alamat Anda (+Rp50.000)
2. Jika "Diantar", **isi alamat lengkap** + **No. HP untuk pengantaran**
3. Isi **catatan** (opsional)
4. Klik **"Lanjutkan"**

#### Langkah ④ — Metode Pembayaran

Pilih metode pembayaran:

| Metode | Keterangan |
|--------|------------|
| 🏦 **Transfer Bank** | Lihat No. Rekening tujuan → Upload bukti transfer |
| 💵 **Tunai** | Bayar saat pengambilan/pengantaran (tanpa upload bukti) |

> Jika memilih **Transfer**, data rekening (Bank Mandiri) akan ditampilkan langsung di layar.

#### Langkah ⑤ — Upload Foto KTP

1. Upload foto KTP untuk verifikasi identitas
2. Format: JPG, PNG, WebP (maks 5MB)
3. Klik **"Lanjutkan"**

#### Langkah ⑥ — Konfirmasi & Kirim

1. Review semua detail di ringkasan pesanan
2. Periksa rincian biaya (harga sewa, biaya antar, total)
3. Klik **"Konfirmasi & Kirim"**
4. Notifikasi sukses muncul dengan kode booking (format: `AGL-XXXXXXXX`)

### 9.3 Dashboard Customer

Setelah login, buka `/dashboard`:

| Informasi | Keterangan |
|-----------|------------|
| 📋 Total Pesanan | Jumlah semua booking Anda |
| ⏳ Aktif / Menunggu | Booking yang sedang diproses |
| ✅ Selesai | Booking yang sudah completed |

**Riwayat Pemesanan**: Setiap booking menampilkan:
- Foto & nama mobil
- Kode booking (format: `AGL-XXXXXXXX`)
- Tanggal sewa & durasi
- Total harga
- Status dengan badge warna

### 9.4 Arti Status Pesanan

| Status | Badge | Arti |
|--------|-------|------|
| ⏳ Menunggu Pembayaran | Kuning | Belum upload bukti transfer (jika Transfer) |
| 🔄 Menunggu Verifikasi | Oranye | Menunggu admin verifikasi (Transfer / Tunai) |
| ✅ Dikonfirmasi | Hijau | Booking disetujui, mobil siap |
| ❌ Ditolak | Merah | Booking ditolak |
| 🚗 Sedang Disewa | Biru | Mobil sedang Anda gunakan |
| ✅ Selesai | Abu-abu | Sewa sudah selesai |
| ❌ Dibatalkan | Pink | Booking dibatalkan |

---

## 10. Panduan Penggunaan — Admin

### 10.1 Dashboard Admin (`/admin/dashboard`)

Statistik ringkasan:

| Kartu | Isi |
|-------|-----|
| 🚗 Total Mobil | Semua mobil terdaftar |
| ✅ Mobil Tersedia | Mobil yang siap disewa |
| ⏳ Menunggu Verif | Pesanan perlu dicek |
| 📋 Pesanan Hari Ini | Booking baru hari ini |
| 💰 Total Pendapatan | Pembayaran terverifikasi |
| 👥 Total Pelanggan | Customer terdaftar |

Juga menampilkan **10 pesanan terbaru** dan **grafik pendapatan bulanan**.

### 10.2 Manajemen Kendaraan (`/admin/cars`)

#### Lihat Daftar Kendaraan
Tabel dengan kolom: Nama, Tipe (Mobil/Motor), Transmisi, Kapasitas, Harga Lepas Kunci, Harga Supir, Status, Aksi.

#### Tambah Kendaraan Baru
1. Klik **"+ Tambah Kendaraan"**
2. Isi form:
   - Nama, Slug (URL-friendly, contoh: `honda-vario-160`)
   - **Tipe Kendaraan**: Mobil / Motor
   - Transmisi, Kapasitas, Bahan Bakar, Tahun, Warna
   - Harga Lepas Kunci (per hari)
   - Harga Dengan Supir (opsional, khusus Mobil)
   - **Upload Gambar Utama** — klik area upload → pilih file JPG/PNG/WebP (maks 5MB)
   - **Upload Galeri Gambar** — opsional, bisa pilih banyak gambar sekaligus
   - Deskripsi, Fasilitas (pisahkan dengan koma)
   - Status (Tersedia / Perawatan / Tidak Tersedia)
3. Klik **"Simpan Kendaraan"**

#### Edit / Hapus Kendaraan
- Klik **"Edit"** → ubah data (termasuk tipe kendaraan) → **"Simpan"**
- Klik **"Hapus"** → konfirmasi → kendaraan dihapus

### 10.3 Verifikasi Pesanan (`/admin/bookings`)

Daftar semua pesanan dengan filter status.

#### Detail Pesanan (klik baris pesanan)
- Info booking: kode, tanggal, layanan
- Data customer: nama, email, telepon
- **Dokumen KTP** — bisa dilihat (klik gambar)
- **Bukti Transfer** — bisa dilihat (klik gambar)
- Metode pembayaran (Transfer Bank / Tunai)
- Rincian biaya

#### Aksi Admin

| Status Booking | Tombol | Hasil |
|---------------|--------|-------|
| Menunggu Verifikasi | ✅ Konfirmasi | Booking → DIKONFIRMASI, Mobil → DISEWA |
| Menunggu Verifikasi | ❌ Tolak | Booking → DITOLAK |
| Dikonfirmasi / Sedang Disewa | ✅ Selesaikan | Booking → SELESAI, Mobil → TERSEDIA |

### 10.4 Verifikasi Pembayaran (`/admin/payments`)

- Lihat semua pembayaran
- **Verifikasi** → Pembayaran diterima, booking dikonfirmasi, mobil marked RENTED
- **Tolak** → Pembayaran ditolak, booking kembali ke Menunggu Pembayaran

### 10.5 Data Pelanggan (`/admin/customers`)

Daftar pelanggan: nama, email, telepon, total booking.  
Klik pelanggan → lihat riwayat booking.

### 10.6 Laporan (`/admin/reports`)

Filter: **Status**, **Tanggal Mulai**, **Tanggal Selesai**  
Tampil: summary (total transaksi, pendapatan, selesai) + tabel detail.

### 10.7 Pengaturan (`/admin/settings`)

Ubah: **Logo Rental (upload gambar)**, Nama Rental, Alamat, Jam Operasional, Telepon, Instagram, Facebook.

---

## 11. Setup Supabase (Opsional)

Fitur upload file **tetap berfungsi tanpa Supabase** (menggunakan encoding Base64).  
Tapi untuk production, disarankan setup Supabase Storage:

### 11.1 Buat Project di Supabase

1. Buka [supabase.com](https://supabase.com/) → **"Start your project"**
2. Login dengan GitHub
3. Klik **"New project"**
4. Isi: Nama project, password database, region → **"Create project"**
5. Tunggu 2 menit

### 11.2 Ambil API Keys

1. Di dashboard project → **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → paste ke `.env` → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → paste ke `.env` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 11.3 Buat Storage Bucket

1. Menu **Storage** (sidebar kiri)
2. Klik **"New bucket"**
3. Buat 3 bucket: `ktp`, `payments`, `cars`
4. Set masing-masing bucket → **"Public bucket"** = ON

---

## 12. Deploy ke Internet

Untuk membuat aplikasi bisa diakses publik (tidak hanya di laptop Anda):

📖 **Baca panduan lengkap: [DEPLOY.md](./DEPLOY.md)**

Ringkasan singkat:

1. **Buat akun** [GitHub](https://github.com) + [Neon](https://neon.tech) + [Vercel](https://vercel.com) (semua gratis)
2. **Buat database** di Neon → copy connection string
3. **Push kode** ke GitHub
4. **Import project** di Vercel → tambahkan environment variables → deploy
5. **Push data** ke database Neon (`npx prisma db push` + `npx tsx prisma/seed.ts`)
6. **Redeploy** → aplikasi live!

---

## 13. Troubleshooting

### ❌ `npm install` gagal
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ `npx prisma db push` gagal
- Pastikan PostgreSQL **sedang berjalan**
- Cek password di `.env` sudah benar
- Coba: `npx prisma db push --accept-data-loss`

### ❌ Port 3000 sudah dipakai

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ Tidak bisa login
- Pastikan sudah menjalankan `npx prisma db seed`
- Coba: `admin@agilrental.test` / `password123`
- Reset database:
  ```bash
  npx prisma db push --force-reset
  npx prisma db seed
  ```

### ❌ Gambar tidak muncul
- URL gambar dari Unsplash mungkin lambat — tunggu beberapa detik
- Ganti dengan URL gambar lain di `/admin/cars/[id]/edit`

### ❌ Upload file error
- Pastikan file JPG/PNG, maks 5MB
- Fitur tetap berfungsi tanpa Supabase (pakai Base64)

---

## 14. Daftar Armada & Harga

| Mobil | Transmisi | Kursi | Lepas Kunci | Dengan Supir |
|-------|-----------|-------|-------------|--------------|
| **Brio Terbaru** (2024) | AT | 5 | Rp350.000/hari | — |
| **Xenia 2020** | MT | 7 | Rp350.000/hari | Rp600.000/12 jam |
| **Xenia Terbaru** (2024) | MT | 7 | Rp400.000/hari | Rp600.000/12 jam |
| **Avanza Terbaru** (2024) | AT | 7 | Rp400.000/hari | Rp600.000/12 jam |
| **Innova Reborn** (2023) | AT/MT | 7 | Rp700.000/hari | Rp900.000/12 jam |
| **Zenix** (2024) | AT | 7 | Rp900.000/hari | Rp1.300.000/12 jam |

---

## 📞 Kontak Agil Rental

| Info | Detail |
|------|--------|
| Alamat | Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan) |
| Jam Operasional | Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT |
| Telepon 1 | 0857-5465-0271 (Priscil/Admin) |
| Telepon 2 | 0821-7911-7882 |
| Instagram | @agil.rental.ambon |
| Facebook | Gilbert Sipahelut |

---

## 📁 Struktur Project

```
rent-car/
├── prisma/
│   ├── schema.prisma          # Skema database (User, Car, Booking, Payment, dll)
│   └── seed.ts                # Data awal (akun, mobil, booking sample)
├── src/
│   ├── app/
│   │   ├── (public)/          # Halaman publik
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── cars/page.tsx          # Daftar mobil
│   │   │   └── cars/[slug]/page.tsx   # Detail mobil
│   │   ├── admin/             # Halaman admin
│   │   │   ├── dashboard/     # Statistik & ringkasan
│   │   │   ├── cars/          # Kelola mobil (CRUD)
│   │   │   ├── bookings/      # Verifikasi pesanan
│   │   │   ├── payments/      # Verifikasi pembayaran
│   │   │   ├── customers/     # Data pelanggan
│   │   │   ├── reports/       # Laporan transaksi
│   │   │   └── settings/      # Pengaturan rental
│   │   ├── booking/[carId]/   # Form pemesanan 4 langkah
│   │   ├── dashboard/         # Dashboard customer
│   │   ├── login/             # Halaman login
│   │   ├── register/          # Halaman registrasi
│   │   └── api/               # Backend API routes
│   │       ├── auth/          # Login, register, logout, me
│   │       ├── cars/          # CRUD mobil
│   │       ├── bookings/      # CRUD booking
│   │       ├── payments/      # CRUD pembayaran
│   │       ├── admin/stats/   # Statistik dashboard
│   │       ├── settings/      # Pengaturan rental
│   │       └── upload/        # Upload file
│   ├── components/            # Komponen UI reusable
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── CarCard.tsx
│   │   └── StatusBadge.tsx
│   ├── lib/                   # Utility
│   │   ├── prisma.ts          # Koneksi database
│   │   ├── auth.ts            # JWT, hash password
│   │   ├── utils.ts           # Format harga, tanggal
│   │   └── validations.ts     # Zod validasi form
│   └── types/index.ts         # TypeScript type definitions
├── public/                    # Static files
├── .env                       # Environment variables
├── .env.example               # Template .env
├── package.json               # Dependencies
├── DEPLOY.md                  # Panduan deploy lengkap
└── README.md                  # File ini
```

---

## 🔑 Command Penting

| Perintah | Fungsi |
|----------|--------|
| `npm install` | Install dependencies |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Buat/perbarui tabel database (termasuk VehicleType, PaymentMethod dll) |
| `npx prisma db seed` | Isi data awal |
| `npm run dev` | Jalankan aplikasi (development) |
| `npm run build` | Build untuk production |
| `npm start` | Jalankan aplikasi (production) |
| `npx prisma studio` | Buka GUI database (prisma studio) |

---

Selamat mencoba! 🚗🏍️ Jika ada pertanyaan, hubungi admin Agil Rental via WhatsApp di **0857-5465-0271**.
