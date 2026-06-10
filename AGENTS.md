<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-agent-rules -->
# Agil Rental Mobil — Agent Operating Rules

Project: Car rental system for Agil Rental Mobil, Ambon
Stack: Next.js 16 (App Router), React 19, Prisma ORM, PostgreSQL, Tailwind CSS v4

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── cars/          # Car listing + detail
│   │   └── SearchForm.tsx # Search component (INACTIVE - see note)
│   ├── admin/             # Admin panel (protected)
│   ├── dashboard/         # Customer dashboard
│   ├── booking/[carId]/   # Multi-step booking
│   ├── login/ + register/ # Auth pages
│   └── api/               # 14 API routes
├── components/            # Shared components
├── lib/                   # Utilities, auth, validations, contexts
├── types/                 # TypeScript types + label maps
└── middleware.ts          # Route protection
```

## Key Conventions

1. **Images**: Always use file upload (via `/api/upload`) — never hardcode external URLs like Unsplash. Car forms, settings, booking uploads all use the upload API.
2. **Auth**: JWT-based via `lib/auth.ts`. Token stored in httpOnly cookie. `useAuth()` context for client-side. API routes use `requireAuth()` / `requireAdmin()`.
3. **Forms**: React Hook Form + Zod validation schemas (defined in `lib/validations.ts`).
4. **Styling**: Tailwind CSS v4 with `@import "tailwindcss"`. Custom colors via CSS vars (`--color-navy-*`, `--color-yellow-*`). Use `bg-[#0B1F44]` not `bg-navy-800`.
5. **Database**: Prisma ORM with PostgreSQL. Schema in `prisma/schema.prisma`. Run `npx prisma migrate dev` for changes, `npx prisma db seed` for seed data.
6. **Upload API**: POST `/api/upload` with FormData `{ file: File }`. Returns `{ url, name, size, type }`. Accepts JPG/PNG/WebP up to 5MB. Stores as base64 data URL (for production, Supabase Storage is recommended).
7. **Seed data**: Run `npm run prisma:seed`. Must use only uploaded/local images — no external URLs.

## DO NOT:
- Add external image URLs (Unsplash, placehold.co, etc.) to any code or seed
- Create new API routes for locations or car-types (these don't exist)
- Use `text-navy-900` class — use `text-[#0B1F44]` instead
- Remove existing features without confirmation
- Add npm packages without strong reason
- Change the Prisma schema without running migrations

## Testing Notes
- All tests are manual — no automated test suite exists
- Always run `npm run build` after changes to verify
- Check `DATABASE_URL` in `.env` before running database operations
<!-- END:project-agent-rules -->

<!-- BEGIN:agent-workflow-rules -->
## Agent Workflow Integration

This project follows the agent-workflow skill rules located at:
`~/.pi/agent/skills/agent-workflow/SKILL.md`

### Workflow Selection for This Project:

| Task Type | Workflow |
|-----------|----------|
| Add/modify car data, fix images | `Coder → Reviewer` |
| New feature (payment, notification) | `Planner → Architect → Coder → Tester → Reviewer` |
| UI/UX changes | `Imager → Coder → Tester → Reviewer` |
| Security review | `Security → Reviewer` |
| Database schema change | `Data → Security → Reviewer` |
| Bug fix | `Debugger → Coder → Tester → Reviewer` |
| Deploy | `Ops → Reviewer` |
| Full audit | `audit.md` workflow |

### Quality Gates Before Merge:
- [ ] No hardcoded external URLs
- [ ] All images uploaded via `/api/upload`
- [ ] Forms have validation and error states
- [ ] Mobile responsive checked
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] `npm run build` passes
- [ ] Prisma migrations applied if schema changed
<!-- END:agent-workflow-rules -->
