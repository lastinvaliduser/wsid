# Security Architecture — wsid.now

## Threat Model (STRIDE)

| Threat | Vector | Mitigation |
|--------|--------|------------|
| **Spoofing** | Forged session cookie | NextAuth HTTP-only, SameSite=Strict, signed JWT |
| **Tampering** | Modify post via API without auth | Middleware auth guard on all `/api/*` write routes |
| **Repudiation** | Deny creating malicious content | Admin single-user, all actions traceable to one identity |
| **Information Disclosure** | Leaked secrets in client bundle | `server-only` imports, `NEXT_PUBLIC_` gating, env validation |
| **Denial of Service** | Brute-force login | Rate limiting: 5 attempts / 15 min per IP on auth endpoint |
| **Elevation of Privilege** | Public user accessing admin | Next.js middleware blocks `/admin/*` and write APIs for unauthenticated requests |
| **Injection** | SQL injection via post content | Prisma parameterized queries — no raw SQL |
| **XSS** | Malicious content in post | Strict CSP headers; MDX rendered server-side as sanitized HTML |
| **Clickjacking** | Embed site in iframe | `X-Frame-Options: DENY` |
| **CSRF** | Cross-site form submission | NextAuth CSRF token + SameSite=Strict cookies |
| **Path Traversal** | Malicious slug or filename | Slug/filename sanitization in Zod schema before DB write |
| **File Upload Abuse** | Malicious files via upload | Uploadthing validates MIME type + max size; filename sanitized |

---

## Authentication Flow

```
Admin loads /admin/login
        │
        ▼
POST /api/auth/signin (NextAuth credentials provider)
        │
        ├── Rate limiter check (IP) ─── exceed limit ──▶ 429 Too Many Requests
        │
        ├── Zod validate { email, password }
        │
        ├── Query AdminAccount by email (Prisma)
        │
        ├── bcrypt.compare(password, passwordHash)
        │
        ├── success ──▶ NextAuth creates JWT session
        │               Cookie: HttpOnly, Secure, SameSite=Strict
        │               Expiry: 24h (access), 7d (refresh)
        │
        └── failure ──▶ 401 Unauthorized (generic message — no user enumeration)

Admin accesses /admin/* or POST/PATCH/DELETE /api/*
        │
        ▼
Next.js middleware.ts
        │
        ├── auth() from NextAuth
        │
        ├── no session ──▶ redirect to /admin/login (for pages)
        │              ──▶ 401 JSON response (for API routes)
        │
        └── valid session ──▶ allow request
```

---

## HTTP Security Headers

Configured in `next.config.ts` headers array:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';       ← Next.js requires this for hydration
  style-src 'self' 'unsafe-inline';        ← Mantine injects styles
  img-src 'self' data: https://utfs.io;    ← Uploadthing CDN
  font-src 'self';
  connect-src 'self' https://uploadthing.com;
  frame-ancestors 'none';

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## Rate Limiting Design

Implemented in `src/lib/rate-limit.ts` using an in-memory sliding window (dev) or Upstash Redis (production).

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/signin` | 5 requests | 15 minutes |
| All other API routes | 100 requests | 1 minute |

Rate limiter uses IP address as key. `X-Forwarded-For` header is trusted only when running behind Vercel's proxy (verified via `VERCEL` env var).

---

## Input Validation (Zod Schemas)

All API route handlers call `schema.parse(body)` before any business logic:

- **Post create/update**: title length, slug format, category enum, status enum, optional fields nullable
- **Slug**: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` — no path traversal characters
- **File upload**: MIME type allowlist (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), max 5MB
- **Settings**: key allowlist (only known setting keys accepted)
- **Auth**: email format, password min length 12

---

## Environment Variable Security

Validated at startup via `@t3-oss/env-nextjs`:

```typescript
// src/env.ts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: { ... }
})
```

If any required server var is missing at startup, the app throws and refuses to start.

`AUTH_SECRET` must be a cryptographically random string of at least 32 characters. Generate with:
```bash
openssl rand -base64 32
```

---

## Secrets Inventory

| Secret | Where stored | Exposed to client? |
|--------|-------------|-------------------|
| `DATABASE_URL` | Vercel env vars | No |
| `AUTH_SECRET` | Vercel env vars | No |
| `UPLOADTHING_TOKEN` | Vercel env vars | No |
| Admin password | Database (bcrypt hash, cost=12) | Never |

---

## Admin Password Management

- Password stored as `bcrypt` hash with cost factor 12
- No password reset flow exposed publicly — password change only through authenticated `/admin/settings`
- Seed script creates initial admin account — credentials communicated out-of-band, not stored in code
