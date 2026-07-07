# SNAPSHOT: Agil Rental Kendaraan (rent-car)
Diupdate: 2026-07-07 (post full audit & enhancement)

## 🎯 Tujuan
Aplikasi rental mobil & motor full-stack untuk Agil Rental Ambon — customer bisa booking online via 6-step wizard, admin manage kendaraan/pesanan/pembayaran via CMS panel.

## 📍 Status
- Auth (login/register/JWT httpOnly cookie): ✅ Done
- Public pages (landing, cars, car detail): ✅ Done
- Filter & badge Mobil/Motor di halaman daftar: ✅ Done
- Booking wizard 6-step (Tanggal→Layanan→Detail→Bayar→KTP→Konfirmasi): ✅ Done
- Dukungan Motor (skip layanan, tunai delivery): ✅ Done
- Metode bayar Transfer (tampil rekening) + Tunai (langsung verifikasi): ✅ Done
- No HP delivery field: ✅ Done
- Admin CMS redesigned (layout, dashboard, bookings, cars, settings): ✅ Done
- Zustand state management + API service layer: ✅ Done
- Toast notification system: ✅ Done
- File upload ke local storage (public/uploads/): ✅ Done
- Vitest test framework (12/12 tests passing): ✅ Done
- JWT_SECRET fallback fixed: ✅ Done
- Custom 404 page: ✅ Done
- Supabase Storage: ⚠️ Not configured (.env placeholder) — local upload working

## 🏗️ Arsitektur
Stack: Next.js 16.2 + React 19 + Tailwind 4 + Prisma (PostgreSQL) + Zod + JWT cookie-auth + Zustand
Struktur: `(public)/` (landing, cars), `admin/` (CMS: 7 pages), `api/` (15 REST routes), `components/` (10), `lib/` (10, including stores + api + hooks)
Booking: 6-step wizard — Tanggal → Layanan → Detail → Bayar → KTP → Konfirmasi
State: Zustand stores (carStore, bookingStore, adminStore) + API service layer (src/lib/api/client.ts)

## ✅ New Features (since baseline)
- VehicleType enum (MOBIL/MOTOR) + PaymentMethod enum (TRANSFER/TUNAI)
- Bank fields di RentalSetting + tampil di step Bayar
- Filter kendaraan + type badge di card
- Navbar anchor links (Layanan/Kontak ke section) + fix highlight mutual
- Datepicker full-area clickable (CSS overlay)
- Admin layout: sidebar redesign, header, breadcrumbs, user menu
- Dashboard: 6 stat cards + skeleton loading + revenue bars
- Admin bookings: filter pills, detail modal, mobile cards
- Admin cars: type column, skeleton, empty states
- Admin settings: 3 tabs (Info/Bank/Logo)
- Admin payments, customers, reports: new pages
- Custom 404 page
- useHash hook (SSR-safe hash tracking)

## 🔴 Blocker
- [LOW] File upload pake `public/uploads/` — gak persist di Vercel (serverless), tapi fine untuk lokal
- [LOW] Design tokens CSS dikasih di `globals.css` tapi komponen masih hardcoded — refactor besar
- [LOW] Tidak ada pagination server-side — data dikit, fine untuk skripsi
- [WARN] Supabase .env masih placeholder — storage tidak aktif (tapi gak perlu untuk lokal)

## 📋 Git Log (20 commits)
```
8ba8152 fix: admin car forms — tambah Tipe Kendaraan, disable harga supir Motor
decdbd2 feat: vitest testing (12 tests), fix JWT fallback secret
2cebd0d feat: redesign settings (tabs), toast notification system
59b02f5 feat: redesign CMS — bookings, cars, payments, customers, reports
06b2373 feat: redesign dashboard — stat cards, skeleton, chart
26dcc82 feat: redesign admin layout — sidebar, header, breadcrumbs
3279233 feat: Zustand stores + API client layer
43cbda2 fix: upload route — simpan file ke public/uploads/
d0e4964 fix: datepicker full-area clickable
9a5a86e fix: window is not defined — useHash hook
```

## 🧠 Key Decisions
| Tanggal | Keputusan |
|---------|-----------|
| 2026-07-07 | Booking wizard 6-step mengikuti diagram workflow |
| 2026-07-07 | VehicleType + PaymentMethod enum — akomodir Motor & Tunai |
| 2026-07-07 | Upload file ke disk (bukan base64 di DB) — DB cleaner, faster |
| 2026-07-07 | Zustand untuk state management — lightweight, no boilerplate |
| 2026-07-07 | Vitest untuk testing — setup minimal, TypeScript native |
| 2026-06-10 | Base64 upload fallback (sudah diganti disk storage 07-07) |
