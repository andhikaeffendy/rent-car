# PROFILE: Agil Rental Mobil (rent-car)

## Stack
- **Framework:** Next.js 16.2.6 (App Router)
- **UI:** React 19.2.4 + Tailwind CSS 4
- **Form:** react-hook-form 7.76 + @hookform/resolvers + Zod 4
- **Database:** Prisma ORM + PostgreSQL (Neon)
- **Auth:** JWT (jsonwebtoken) + bcryptjs, httpOnly cookie
- **Storage:** Supabase Storage (configured, not active)
- **Deploy:** Vercel (.vercel config present)
- **Font:** Geist (Geist + Geist_Mono via next/font)

## Conventions
- **Routing:** Next.js App Router with route groups `(public)/` `admin/` `api/`
- **Components:** PascalCase, default export, `"use client"` directive when needed
- **Validation:** Zod schemas in `lib/validations.ts`, inferred types via `z.infer`
- **Styling:** Tailwind arbitrary values `text-[#F5B21A]` (no design tokens — known tech debt)
- **Auth:** JWT cookie (7 days), server-side via `lib/auth.ts`, client via `AuthContext`
- **Database:** Prisma schema-driven, auto-generate client via `postinstall`
- **API:** All routes in `app/api/` with try/catch wrapper, return `{ error }` on failure

## Architecture
```
User → Browser → Next.js App Router
  ├── (public)/ → Landing, Cars, Car Detail
  ├── admin/ → Dashboard, Bookings, Cars CRUD, Payments, Settings, Reports
  ├── dashboard/ → Customer booking history
  ├── booking/[carId]/ → Booking form + payment upload
  ├── api/ → REST endpoints (auth, cars, bookings, payments, upload, settings, admin/stats)
  └── login | register → Auth pages
       ↓
  lib/auth.ts → JWT verify
  lib/prisma.ts → Prisma Client (singleton)
       ↓
  PostgreSQL (Neon Cloud)
```

## Data Models (Prisma)
```
User → Booking → Payment, Document
Car → Booking
RentalSetting (standalone)
```
7 status booking lifecycle: WAITING_PAYMENT → WAITING_VERIFICATION → CONFIRMED → ON_RENT → COMPLETED | REJECTED | CANCELLED

## Deployment
- **Hosting:** Vercel (configured, `.vercel/` directory present)
- **Env vars:** DATABASE_URL (Neon), JWT_SECRET, NEXT_PUBLIC_SUPABASE_*, NEXT_PUBLIC_WHATSAPP_NUMBER
- **Demo accounts:** admin@agilrental.test / budi@example.com — password: password123
- **Build:** `npm run build` (includes `prisma generate` via postinstall)

## Testing
- ❌ No test framework installed
- Only manual testing via `npm run dev`

## Common Gotchas
- **Booking page 988 LOC** — jangan edit tanpa baca seluruh file dulu, form + payment + document upload campur jadi satu
- **Upload file** — `/api/upload` return base64 Data URL, gak persist. Kalo mau upload beneran, aktifkan Supabase `.env` dulu
- **Warna hardcoded** — jangan nambah warna baru tanpa ngecek `globals.css` dulu (ada `--color-navy-*` dan `--color-yellow-*` yang gak dipake)
- **Middleware minimal** — gak ada route protection di middleware; admin check dilakukan di page level via `useAuth()` + `router.push`
- **SSH PATH issue** — kalo compile via SSH, export PATH dulu: `export PATH='/opt/homebrew/bin:$PATH'`
- **next.config.ts minimal** — no image domains, no redirects; kalo mau configure Unsplash/images, tambahin remotePatterns

## Decision Log
| Date | Keputusan | Konteks | Alternatif |
|------|-----------|---------|------------|
| 2026-05-31 | JWT cookie auth instead of NextAuth | Simple, no extra deps, cukup untuk 2 role | NextAuth.js, Lucia Auth |
| 2026-05-31 | Prisma + PostgreSQL instead of MongoDB | Relasi kuat (User→Booking→Payment), Neon free tier | MongoDB + Mongoose |
| 2026-05-31 | Zod instead of Yup | Better TS integration, smaller bundle | Yup, Joi |
| 2026-05-31 | Tailwind CSS v4 | Default Next.js 16, faster build | CSS Modules, styled-components |
| 2026-06-10 | Base64 upload fallback | Supabase .env blm diisi, perlu fitur upload jalan | Supabase Storage, Uploadthing |
