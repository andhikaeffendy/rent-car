# PRD: Agil Rental Mobil — Booking Flow Enhancement
**Version:** 1.0
**Date:** 2026-07-07
**Status:** Draft
**Author:** Hermes AI (verified via full codebase audit + workflow analysis)

---

## 1. Executive Summary

### 1.1 Problem Statement
Aplikasi Agil Rental Mobil saat ini sudah memiliki fungsionalitas booking dasar, tetapi terdapat beberapa gap antara implementasi yang ada dengan workflow yang diharapkan (berdasarkan dokumen workflow di `workflow website.docx`):

1. **Booking flow tidak sesuai diagram** — meski sudah multi-step, urutan dan konten step berbeda
2. **Tidak ada dukungan Motor** — hanya Mobil, padahal diagram mengakomodir kedua jenis
3. **Tidak ada metode pembayaran Tunai** — hanya Transfer
4. **Tidak ada field No HP delivery** — alamat ada, nomor telepon penyewa tidak
5. **Tidak ada display No Rekening** — bukti transfer langsung upload tanpa lihat rekening tujuan
6. **Upload KTP masih campur dengan payment** — diagram pisah

### 1.2 Scope
Proyek ini mencakup:
- Restrukturisasi booking flow menjadi wizard 6-step sesuai diagram
- Penambahan tipe kendaraan Motor
- Penambahan metode pembayaran Tunai
- Penambahan field No HP delivery
- Penambahan display rekening bank pada settings
- Penambahan halaman Ringkasan Pemesanan sebelum konfirmasi final

### 1.3 Out of Scope
- Dashboard admin — tidak diubah (kecuali menampung field baru)
- Manajemen pengguna
- Landing page redesign
- Design system refactor (hardcoded colors — ini PR terpisah)

---

## 2. Current State Analysis (dari Audit 2026-07-07)

### 2.1 Tech Stack Saat Ini
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Form | react-hook-form + @hookform/resolvers | 7.76 |
| Validation | Zod | ^4.4.3 |
| ORM | Prisma | ^5.22.0 |
| Database | PostgreSQL (Neon) | Cloud |
| Auth | JWT (jsonwebtoken) + bcryptjs | 9.x / 3.x |
| File Storage | base64 (fallback, tidak persist) | — |
| Deployment | Vercel | — |

### 2.2 Prisma Schema — Model Saat Ini
```prisma
enum ServiceType { SELF_DRIVE, WITH_DRIVER }
enum PickupMethod { SELF_PICKUP, DELIVERY }
enum BookingStatus { WAITING_PAYMENT, WAITING_VERIFICATION, CONFIRMED, REJECTED, ON_RENT, COMPLETED, CANCELLED }

model Car {
  id              String    @id @default(uuid())
  name            String
  slug            String    @unique
  transmission    String    // "AT" / "MT"
  capacity        Int       @default(4)
  fuelType        String    @default("Bensin")
  year            Int
  color           String?
  priceSelfDrive  Float     // Harga lepas kunci
  priceWithDriver Float?    // Harga dengan supir
  imageUrl        String
  galleryUrls     String[]
  status          CarStatus @default(AVAILABLE)
  description     String?
  facilities      String[]
  bookings        Booking[]
}

model Booking {
  id             String         @id @default(uuid())
  bookingCode    String         @unique
  userId         String?
  carId          String
  serviceType    ServiceType    @default(SELF_DRIVE)
  pickupMethod   PickupMethod   @default(SELF_PICKUP)
  pickupAddress  String?        // Alamat jika delivery
  startDate      DateTime
  endDate        DateTime
  duration       Int
  subtotal       Float
  deliveryFee    Float          @default(0)
  totalPrice     Float
  notes          String?
  status         BookingStatus  @default(WAITING_PAYMENT)
  user           User?          @relation(...)
  car            Car            @relation(...)
  payments       Payment[]
  documents      Document[]
}

model Payment {
  id               String        @id @default(uuid())
  bookingId        String
  amount           Float
  transferProofUrl String        // URL bukti transfer
  status           PaymentStatus @default(WAITING)
}

model Document {
  id        String   @id @default(uuid())
  bookingId String
  ktpUrl    String   // URL foto KTP
}

model RentalSetting {
  id            String @id @default(uuid())
  rentalName    String
  address       String
  openingHours  String
  phone1        String
  phone2        String?
  instagram     String?
  facebook      String?
  logoUrl       String?
  // ❌ Tidak ada field bankAccount / rekening
}
```

### 2.3 Booking Flow Saat Ini (4 Steps)
```
User → /booking/[carId]?startDate=X&endDate=Y&serviceType=Z&totalPrice=W
  → Step 1: Pilih Layanan (Lepas Kunci / Dengan Supir)
  → Step 2: Metode Pengambilan & Detail (Ambil Sendiri / Diantar + alamat + catatan)
  → Step 3: Upload Dokumen (KTP + Bukti Transfer — dalam 1 step)
  → Step 4: Konfirmasi (Ringkasan + Submit)
  → Submit → POST /api/bookings → WAITING_VERIFICATION
```

### 2.4 Gap Analysis

| # | Area | Diagram (docx) | Saat Ini | Gap |
|---|------|---------------|----------|-----|
| G1 | Tipe Kendaraan | Motor + Mobil | Hanya Mobil | ❌ |
| G2 | Step pemilihan tanggal | Step terpisah setelah login | Lewat query params | ⚠️ Partial |
| G3 | Step "Klik Pesan" setelah tanggal | Ada tombol "Pesan" terpisah | Langsung ke form | ❌ |
| G4 | Motor skip layanan | Motor → langsung lanjut | Tidak ada Motor | ❌ |
| G5 | Metode Pembayaran | Transfer + Tunai | Hanya Transfer | ❌ |
| G6 | No Rekening display | Tampilkan rekening sebelum upload | Tidak ada | ❌ |
| G7 | No HP delivery | Field terpisah untuk No HP | Tidak ada | ❌ |
| G8 | Upload KTP step terpisah | Step sendiri setelah payment | Campur di step 3 | ❌ |
| G9 | Ringkasan sebelum confirm | Halaman review terpisah | Ada di step 4 (satu halaman) | ⚠️ Partial |
| G10 | Booking code format | — | `AGL-XXXXXXXX` | ✅ OK |

---

## 3. Requirements

### 3.1 Functional Requirements

#### FR-1: Multi-Step Booking Wizard
Restruktur booking menjadi 6 step wizard sesuai diagram:

| Step | Nama | Konten | Validasi |
|------|------|--------|----------|
| 1 | **Pilih Tanggal & Durasi** | Date picker start + end date | end > start |
| 2 | **Pilih Layanan** | Radio: Lepas Kunci / Dengan Supir (hanya jika Mobil) | Wajib |
| 3 | **Metode Pengambilan** | Radio: Ambil Sendiri / Diantar. Jika Diantar → form Alamat + No HP | Alamat & No HP wajib jika Diantar |
| 4 | **Pilih Pembayaran** | Radio: Transfer / Tunai. Jika Transfer → tampilkan No Rekening + upload bukti | Bukti wajib jika Transfer |
| 5 | **Upload KTP** | Upload foto KTP + preview | Wajib |
| 6 | **Konfirmasi** | Ringkasan lengkap + tombol "Konfirmasi & Kirim" | — |

#### FR-2: Dukungan Motor
- Tambah field `type` enum `MOTOR` | `MOBIL` di model Car
- Jika kendaraan bertipe MOTOR → Step 2 (Layanan) dilewati (skip)
- Harga Motor: hanya `priceSelfDrive` (tidak perlu `priceWithDriver`)
- Filter di halaman daftar: tab Motor / Mobil

#### FR-3: Metode Pembayaran Tunai
- Tambah enum `PaymentMethod` = `TRANSFER` | `TUNAI`
- Jika Tunai → tidak perlu upload bukti transfer
- Status booking tetap `WAITING_VERIFICATION` (admin verifikasi manual)
- Payment record tetap dibuat dengan `amount` dan `status: WAITING`

#### FR-4: No Rekening di Settings
- Tambah field di `RentalSetting`:
  - `bankName` (String?) — nama bank
  - `bankAccountNumber` (String?) — nomor rekening
  - `bankAccountName` (String?) — atas nama
- Admin bisa set/manage via halaman Settings
- API settings return bank info
- Di step pembayaran transfer, tampilkan data rekening sebelum upload bukti

#### FR-5: Field No HP Delivery
- Tambah field `deliveryPhone` (String?) di model Booking
- Muncul di Step 3 jika `pickupMethod === DELIVERY`

#### FR-6: Halaman Daftar dengan Filter Motor/Mobil
- Tab/filter di halaman `/cars` untuk Motor atau Mobil
- API `/api/cars` support filter `?type=MOTOR&type=MOBIL`

### 3.2 Non-Functional Requirements

| NFR | Description |
|-----|-------------|
| NFR-1 | Semua state wizard harus survive browser refresh (gunakan URL searchParams atau localStorage) |
| NFR-2 | Back button di setiap step tanpa kehilangan data |
| NFR-3 | Upload preview sebelum submit (KTP + bukti transfer) |
| NFR-4 | Mobile responsive wizard — setiap step full-width di mobile |
| NFR-5 | TypeScript strict — no `any` di kode baru |
| NFR-6 | Zero visual change untuk komponen yang tidak diubah |

### 3.3 Data Model Changes

#### Model Car — Tambah
```prisma
enum VehicleType {
  MOBIL
  MOTOR
}

model Car {
  // ... existing fields ...
  type             VehicleType  @default(MOBIL)
  // priceWithDriver jadi opsional (Motor tidak punya supir) — sudah nullable
}
```

#### Model Booking — Tambah
```prisma
enum PaymentMethod {
  TRANSFER
  TUNAI
}

model Booking {
  // ... existing fields ...
  deliveryPhone    String?        // No HP untuk delivery
  paymentMethod    PaymentMethod  @default(TRANSFER)
}
```

#### Model RentalSetting — Tambah
```prisma
model RentalSetting {
  // ... existing fields ...
  bankName             String?
  bankAccountNumber    String?
  bankAccountName      String?
}
```

### 3.4 API Changes

| Endpoint | Method | Change |
|----------|--------|--------|
| `GET /api/cars` | GET | Tambah query param `?type=MOBIL\|MOTOR` |
| `POST /api/cars` | POST | Tambah field `type` |
| `GET /api/settings` | GET | Return `bankName`, `bankAccountNumber`, `bankAccountName` |
| `PUT /api/settings` | PUT | Accept bank fields |
| `POST /api/bookings` | POST | Accept `deliveryPhone`, `paymentMethod` fields |

### 3.5 Files to Modify / Create

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFY | Tambah `VehicleType`, `PaymentMethod` enum + field baru |
| `prisma/seed.ts` | MODIFY | Tambah seed untuk Motor + bank settings |
| `src/types/index.ts` | MODIFY | Tambah tipe baru |
| `src/lib/validations.ts` | MODIFY | Tambah validasi payment method, delivery phone |
| `src/app/booking/[carId]/page.tsx` | RESTRUCTURE | Ubah dari 4 step → 6 step wizard |
| `src/app/(public)/cars/page.tsx` | MODIFY | Tambah filter/tab Motor/Mobil |
| `src/app/(public)/cars/[slug]/page.tsx` | MODIFY | Tampilkan tipe kendaraan |
| `src/app/api/cars/route.ts` | MODIFY | Support filter `?type=` |
| `src/app/api/cars/[id]/route.ts` | MODIFY | — (auto) |
| `src/app/api/settings/route.ts` | MODIFY | Tambah bank fields |
| `src/app/admin/settings/page.tsx` | MODIFY | Form untuk bank fields |
| `src/components/CarCard.tsx` | MODIFY | Tampilkan badge Mobil/Motor |
| `src/app/api/upload/route.ts` | MODIFY | — (opsional, untuk persist) |

---

## 4. Proposed Booking Flow (Target)

```
User → Buka Website
  → Lihat Daftar Kendaraan (filter: Mobil / Motor)
  → Pilih Kendaraan → /cars/[slug]
  → Isi Tanggal Sewa + Durasi
  → Klik "Pesan" → /booking/[carId]?startDate=X&endDate=Y

  [Wizard 6 Step]

  Step 1: Pilih Tanggal & Durasi (pre-filled from URL)
  → Klik Lanjutkan

  Step 2: Pilih Layanan Service Type
    [Jika MOBIL] → Tampilkan Lepas Kunci / Dengan Supir
    [Jika MOTOR] → Skip step ini
  → Klik Lanjutkan

  Step 3: Metode Pengambilan
    [Ambil Sendiri] → No fields
    [Diantar] → Alamat Pengantaran + No HP
  → Klik Lanjutkan

  Step 4: Metode Pembayaran
    [Transfer] → Tampilkan No Rekening (dari settings) + Upload Bukti
    [Tunai] → No upload, langsung lanjut
  → Klik Lanjutkan

  Step 5: Upload KTP
    Upload foto KTP + preview
  → Klik Lanjutkan

  Step 6: Konfirmasi & Kirim
    Ringkasan semua detail
    → Klik "Konfirmasi & Kirim"
    → POST /api/bookings
    → Status: Menunggu Konfirmasi Admin (WAITING_VERIFICATION)
```

---

## 5. Migration Plan

### Phase 1: Data Layer (Prisma + Types)
```
1. Tambah enum VehicleType (MOBIL, MOTOR) dan PaymentMethod (TRANSFER, TUNAI)
2. Tambah field type di Car, deliveryPhone & paymentMethod di Booking
3. Tambah bank fields di RentalSetting
4. Update types/index.ts
5. Update validations.ts
6. Generate Prisma client
7. Update seed.ts
```

### Phase 2: API Layer
```
8. Update GET /api/cars — support filter ?type=
9. Update POST /api/cars — accept type field
10. Update GET/PUT /api/settings — bank fields
11. Update POST /api/bookings — accept deliveryPhone, paymentMethod
```

### Phase 3: UI Layer — Booking Wizard
```
12. Restructure src/app/booking/[carId]/page.tsx:
    - Step 1: Tanggal & Durasi (pre-filled from params, editable)
    - Step 2: Service Type (skip if Motor)
    - Step 3: Pickup Method + Alamat + No HP
    - Step 4: Payment Method + Rekening display + Upload (if Transfer)
    - Step 5: Upload KTP
    - Step 6: Ringkasan + Konfirmasi
```

### Phase 4: UI Layer — Other Pages
```
13. Update /cars page — filter tabs Mobil/Motor
14. Update /cars/[slug] — show type badge
15. Update CarCard — show type badge
16. Update admin/settings — bank fields form
```

### Phase 5: Verification
```
17. npx tsc --noEmit
18. npm run build
19. Manual flow test: Mobil + Transfer
20. Manual flow test: Motor + Tunai
```

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Booking page (988 LOC) restructure rawan error | High | Kerjakan step-by-step, commit tiap step selesai |
| Migration data existing booking tanpa paymentMethod | Medium | Default `TRANSFER` untuk booking lama |
| Unsplash image tanpa domain config Next.js | Low | Tambah remotePatterns di next.config.ts |
| File upload persist (base64 vs storage) | Medium | Pake Supabase Storage setelah .env diisi |

---

## 7. Success Criteria

| Criteria | Measurement |
|----------|-------------|
| Booking wizard berfungsi 6 step | Manual test semua flow |
| Filter Mobil/Motor di halaman daftar | Tab filter muncul, API return benar |
| Pembayaran Tunai bisa dipilih | Booking sukses tanpa upload bukti |
| No Rekening tampil di step Transfer | Data dari settings muncul |
| TypeScript compile | `tsc --noEmit` = 0 errors |
| Build production | `npm run build` sukses |

---

## 8. Appendix

### A. Current vs Target Comparison Table

| Aspek | Saat Ini | Target |
|-------|----------|--------|
| Booking step count | 4 | 6 |
| Tipe kendaraan | Mobil only | Mobil + Motor |
| Metode bayar | Transfer only | Transfer + Tunai |
| Upload KTP | Campur step 3 | Step terpisah (step 5) |
| No HP delivery | ❌ | ✅ |
| No Rekening display | ❌ | ✅ |
| Filter kendaraan | None | Mobil/Motor tabs |
| Halaman daftar | `/cars` | `/cars?type=MOBIL\|MOTOR` |

### B. Referensi
- Workflow diagram: `/Users/avowsmacbook/Downloads/workflow website.docx`
- Audit report: `docs/SNAPSHOT.md`
- Project profile: `docs/PROFILE.md`
