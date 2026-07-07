# PROFILE: Agil Rental Kendaraan (rent-car)

## Stack
- **Framework:** Next.js 16.2.6 (App Router)
- **UI:** React 19.2.4 + Tailwind CSS 4
- **Form:** react-hook-form 7.76 + Zod 4
- **State:** Zustand (carStore, bookingStore, adminStore)
- **Database:** Prisma ORM + PostgreSQL
- **Auth:** JWT (jsonwebtoken) + bcryptjs, httpOnly cookie (7 days)
- **Storage:** Local `public/uploads/` (file-to-disk, path in DB)
- **Testing:** Vitest 4.x (4 test files, 12 tests)
- **Deploy:** Vercel (not active — local-only for skripsi)
- **Font:** Geist (via next/font/google)

## Project Stats
- 20 pages (16 user-facing + 15 API routes)
- 10 database models + 8 Prisma enums
- 10 components, 10 lib files, 4 Zustand stores
- 20 git commits, TypeScript strict, 0 tsc errors, build PASS

## Conventions
- **Routing:** Next.js App Router with route groups `(public)/` `admin/` `api/`
- **Components:** PascalCase, `"use client"` when needed, colocated with page
- **Validation:** Zod schemas in `lib/validations.ts`
- **Styling:** Tailwind arbitrary values (tech debt — hardcoded colors)
- **Auth:** JWT cookie. NO middleware — page-level protection via AuthContext + router.push
- **State:** Zustand stores for shared data (cars, bookings, admin stats)
- **API:** All routes in `app/api/` with try/catch, return `{ error }` on failure
- **Upload:** POST `/api/upload` → saves to `public/uploads/` → returns `/uploads/filename`
- **Testing:** `npm test` → Vitest, `npm run test:watch` → watch mode

## Architecture
```
User → Browser → Next.js App Router
  ├── (public)/ → Landing, Cars, Car Detail (with type badge)
  ├── admin/ → Dashboard, Bookings, Cars CRUD, Payments, Settings, Reports, Customers
  ├── dashboard/ → Customer booking history
  ├── booking/[carId]/ → 6-step wizard
  ├── api/ → 15 REST endpoints
  └── not-found.tsx → Custom 404
       ↓
  lib/stores/ → Zustand (carStore, bookingStore, adminStore)
  lib/api/ → API service layer (client.ts)
       ↓
  Prisma → PostgreSQL (local)
```

## Data Models (Prisma)
```
User → Booking (paymentMethod, deliveryPhone, 7 status lifecycle)
Car (type: MOBIL|MOTOR, status: AVAILABLE|RENTED|...)
Payment (transferProofUrl), Document (ktpUrl)
RentalSetting (bankName, bankAccountNumber, bankAccountName)
```
8 enums: VehicleType, PaymentMethod, BookingStatus, CarStatus, ServiceType, PickupMethod, DriverStatus, UserRole

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agilrental.test | password123 |
| Admin | avow@admin.com | password123 |
| Customer | budi@example.com | password123 |

## Testing
- Vitest 4.x, jsdom environment, TypeScript native
- 4 test files: utils, api, validations, booking-flow
- 12 tests: formatPrice, formatDate, API routes, service types, payment methods, booking statuses, booking flow logic
- Run: `npm test` or `npm run test:watch`

## Common Gotchas
- **SSH PATH issue:** Always export PATH before compile — `export PATH='/opt/homebrew/bin:$PATH'`
- **Warna hardcoded:** Jangan tambah warna baru tanpa ngecek globals.css (ada --color-navy-* dan --color-yellow-* yang gak dipake)
- **Next.js hash links:** Anchor link (`/#layanan`) → butuh useHash hook, window.location.hash gak available pas SSR
- **Middleware kosong:** Route protection di page level via AuthContext, bukan middleware
- **Upload lokal:** File simpen di `public/uploads/`, kalo deploy ke Vercel perlu pindah ke Supabase Storage
- **Booking flow:** Booking Motor skip layanan (SELF_DRIVE only), Mobil bisa WITH_DRIVER

## Decision Log
| Date | Keputusan | Konteks |
|------|-----------|---------|
| 2026-07-07 | File upload → local disk (public/uploads/) | Ganti base64 di DB — cleaner, faster |
| 2026-07-07 | Zustand instead of useState-only | State management untuk cache + optimistik update |
| 2026-07-07 | Vitest for testing | Setup 1 menit, native TS, cocok buat skripsi |
| 2026-07-07 | VehicleType + PaymentMethod enums | Akomodir Motor + Tunai sesuai diagram |
| 2026-07-07 | Bookings filter pills instead of select | UX lebih cepat — 1 klik filter tanpa dropdown |
| 2026-05-31 | JWT cookie auth instead of NextAuth | Simple, cukup 2 role |
| 2026-05-31 | Prisma + PostgreSQL | Relasi kuat, Neon free tier |
