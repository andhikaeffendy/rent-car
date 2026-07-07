# SNAPSHOT: Agil Rental Mobil (rent-car)
Diupdate: 2026-07-07 (verified via full codebase audit)

## 🎯 Tujuan
Aplikasi rental mobil full-stack untuk Agil Rental Mobil di Ambon — customer bisa booking online, upload payment proof, admin manage booking/payment/car.

## 📍 Status
- Auth (login/register/JWT): ✅ Done
- Public pages (home, car list, car detail): ✅ Done
- Booking flow (form, calc, payment upload): ✅ Done
- Admin dashboard (stats, revenue chart): ✅ Done
- Admin CRUD mobil: ✅ Done
- Admin manage bookings (verify, confirm, complete): ✅ Done
- Admin manage payments: ✅ Done
- Admin settings (rental info): ✅ Done
- Customer dashboard (riwayat booking): ✅ Done
- Supabase Storage integration: ⚠️ Configured but .env placeholder — not active

## 🏗️ Arsitektur
Stack: Next.js 16.2 + React 19 + Tailwind 4 + Prisma (PostgreSQL Neon) + Zod + JWT cookie-auth
Struktur: `src/app/(public)/` (public pages), `src/app/admin/` (admin panel), `src/app/api/` (REST routes), `src/components/` (8 reusable), `src/lib/` (utils, auth, validations, prisma, supabase)
Aliran: Client → Next.js App Router → Server Components/API Routes → Prisma → PostgreSQL (Neon)

## 🔴 Blocker & Penting
- [BUG] File upload via `/api/upload` simpan sbg base64 Data URL — TIDAK persist di storage, hilang setelah refresh
- [WARN 2026-07-07] Supabase `.env` masih placeholder — `uploadFile()` di `lib/supabase.ts` throw error kalo dipanggil
- [WARN 2026-07-07] JWT_SECRET di `lib/auth.ts` punya fallback "fallback-secret" — ganti pake env sebelum production
- [WARN] Design tokens CSS didefinisikan di `globals.css` tapi 100% komponen pakai hardcoded colors — refactor perlu
- [ISSUE] Booking page (`988 LOC`) terlalu besar — perlu split ke sub-components

## 📋 Next Priority
1. Fix file upload persistence (Supabase Storage atau local disk)
2. Refactor CSS hardcoded colors → design tokens
3. Split booking page into smaller components
4. Accessibility improvements (focus trap, aria-labels, keyboard nav)

## 🧠 Key Decisions (5 terakhir)
| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| 2026-06-10 | Pindah ke base64 upload fallback | Supabase blm dikonfigurasi, perlu jalan dl |
| 2026-05-31 | Pilih Zod + react-hook-form | Validasi konsisten client & server |
| 2026-05-31 | Pilih Prisma + Neon PostgreSQL | ORM type-safe, free tier Neon cukup |
| 2026-05-31 | Cookie-based JWT (httpOnly) | Sederhana, gak perlu session store |
| 2026-05-31 | Route groups (public)/(admin) | Isolasi layout + middleware logic |
