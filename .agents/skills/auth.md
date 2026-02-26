# Skill: Authentication

## Scope
Admin authentication using NextAuth.js v5 with credentials provider.

## Key Files
- `src/lib/auth.ts` — NextAuth config, `auth()`, `handlers`, `signIn`, `signOut`
- `src/middleware.ts` — route-level auth guard for `/admin/*` and write APIs
- `src/lib/validations.ts` — `SignInSchema`
- `src/lib/rate-limit.ts` — `checkRateLimit()`, `AUTH_RATE_LIMIT`
- `prisma/schema.prisma` — `AdminAccount` model

## How Auth Works
1. Admin submits email/password to NextAuth credentials provider
2. Rate limiter checks IP — blocks at 5 attempts per 15 minutes
3. Zod validates credentials format
4. Prisma looks up `AdminAccount` by email
5. bcrypt compares password with hash
6. NextAuth creates JWT session (24h expiry)
7. Session cookie: HttpOnly, Secure, SameSite=Strict

## Protecting Routes
The middleware handles auth automatically for:
- `/admin/*` (except `/admin/login`) → redirect to login
- Write API routes (POST/PATCH/PUT/DELETE on `/api/*`) → 401

## Accessing Session
In Server Components:
```typescript
import { auth } from "@/lib/auth"
const session = await auth()
```
In API Route Handlers:
```typescript
import { auth } from "@/lib/auth"
export const GET = auth(async (request) => {
  const session = request.auth
})
```

## Admin Account Management
- Only one admin account exists (no public registration)
- Created via `prisma/seed.ts` with `ADMIN_PASSWORD` env var
- Password change: authenticated `PATCH /api/settings/password`
- Password cost factor: 12 (bcrypt)
