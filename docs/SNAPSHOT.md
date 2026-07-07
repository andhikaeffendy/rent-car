# SNAPSHOT: Agil Rental Mobil (rent-car)
Diupdate: 2026-07-07 (verified — post enhancement)

## 🎯 Tujuan
Aplikasi rental mobil full-stack untuk Agil Rental Mobil di Ambon — customer bisa booking online, upload payment proof/KTP, admin manage booking/payment/car.

## 📍 Status
- Auth (login/register/JWT): ✅ Done
- Public pages + filter Mobil/Motor: ✅ Done (enhanced)
- Booking wizard 6-step (Tanggal→Layanan→Detail→Bayar→KTP→Konfirmasi): ✅ NEW
- Dukungan Motor (skip layanan): ✅ NEW
- Metode bayar Transfer + Tunai: ✅ NEW
- Display rekening bank (dari settings): ✅ NEW
- No HP delivery field: ✅ NEW
- Admin dashboard + CRUD mobil: ✅ Done
- Admin manage bookings/payments/settings: ✅ Done (bank fields added)
- Customer dashboard (riwayat booking): ✅ Done
- Supabase Storage integration: ⚠️ Configured but .env placeholder

## 🏗️ Arsitektur
Stack: Next.js 16.2 + React 19 + Tailwind 4 + Prisma (Neon PostgreSQL) + Zod + JWT cookie-auth
Struktur: `(public)/` (public pages), `admin/` (admin panel), `api/` (15 REST routes), `components/` (8), `lib/` (7)
Booking flow: 6-step wizard (Tanggal → Layanan → Detail → Bayar → KTP → Konfirmasi)

## 🔴 Blocker & Penting
- [WARN] File upload via `/api/upload` masih base64 — gak persist ke storage
- [WARN] Supabase `.env` masih placeholder — storage gak aktif
- [WARN] JWT_SECRET fallback "fallback-secret" di `lib/auth.ts` — ganti sebelum production
- [WARN] Design tokens CSS didefinisikan di `globals.css` tapi 100% komponen pakai hardcoded colors
- [INFO] Booking page sekarang 609 LOC (turun dari 988) — lebih manageable

## 📋 Next Priority
1. Fix file upload persistence (Supabase Storage atau local disk)
2. Refactor CSS hardcoded colors → design tokens
3. Accessibility improvements (focus trap, aria-labels)
4. Upgrade Prisma 5.22 → 7.x

## 🧠 Key Decisions
| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| 2026-07-07 | Booking wizard 6-step mengikuti diagram workflow | Step-by-step UX lebih jelas, sesuai dokumen |
| 2026-07-07 | Tambah VehicleType enum (MOBIL/MOTOR) | Akomodir Motor sesuai diagram |
| 2026-07-07 | PaymentMethod enum (TRANSFER/TUNAI) | Flow pembayaran sesuai diagram |
| 2026-07-07 | Status WAITING_VERIFICATION untuk Tunai | Tunai tidak perlu upload bukti, langsung masuk verifikasi admin |
| 2026-06-10 | Base64 upload fallback | Supabase blm dikonfigurasi |
