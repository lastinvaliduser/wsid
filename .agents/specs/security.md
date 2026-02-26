# Spec: Security

Full security architecture is documented in `docs/architecture/SECURITY.md`.

## Implementation Checklist

### HTTP Security Headers
- [ ] Configured in `next.config.ts` `headers()` function
- [ ] All 6 security headers applied to all routes (`source: "/(.*)"`)
- [ ] CSP includes Uploadthing CDN (`utfs.io`) in `img-src`
- [ ] `frame-ancestors 'none'` in CSP (replaces X-Frame-Options for CSP-compliant browsers)

### Authentication
- [ ] NextAuth v5 credentials provider in `src/lib/auth.ts`
- [ ] bcrypt with cost factor 12 for password hashing
- [ ] Session JWT, 24h expiry
- [ ] HttpOnly, Secure, SameSite=Strict cookies (NextAuth defaults)

### Middleware Guard
- [ ] `src/middleware.ts` blocks `/admin/*` (except `/admin/login`) for unauthenticated requests
- [ ] Write API routes (POST/PATCH/PUT/DELETE) return 401 for unauthenticated requests
- [ ] Matcher config in `export const config` covers all admin and write API paths

### Rate Limiting
- [ ] Applied to `POST /api/auth/signin`: 5 requests per 15 minutes per IP
- [ ] `getClientIp()` used to extract client IP from headers
- [ ] Returns 429 with `Retry-After` header when limit exceeded

### Input Validation
- [ ] All POST/PATCH API handlers call `Schema.safeParse(body)` first
- [ ] Return 400 with Zod issues on validation failure
- [ ] Slug sanitized via `generateSlug()` before DB write
- [ ] File upload validation: MIME type, size limit in Uploadthing router

### Environment
- [ ] `src/env.ts` validates all required env vars at startup
- [ ] `AUTH_SECRET` minimum 32 characters enforced
- [ ] No `NEXT_PUBLIC_` prefix on server secrets

### Database
- [ ] Prisma ORM used exclusively — no raw SQL
- [ ] `AdminAccount.email` has `@unique` constraint
- [ ] `Post.slug` has `@unique` constraint
