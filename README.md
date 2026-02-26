# wsid — What Should I Do Now?

Personal portfolio and blog platform at **wsid.now** by [CreoVibe Coding](mailto:creovibecoding@gmail.com).

Content across four categories: **Coding · Guitar · Photography · Motorbikes**

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Mantine v8 |
| Database | PostgreSQL — Neon (serverless) via Prisma 7 |
| Auth | NextAuth.js v5 — credentials provider |
| Media | Uploadthing CDN |
| Content | Markdown stored in DB, rendered with next-mdx-remote |
| Editor | TipTap (rich text → HTML) |
| Validation | Zod |
| Testing | Vitest (unit/integration) + Playwright (E2E) |
| Deployment | Vercel + Neon + Uploadthing |

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)
- An [Uploadthing](https://uploadthing.com) account

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Pooled Neon connection string |
| `DATABASE_URL_UNPOOLED` | Direct Neon connection string (for migrations) |
| `AUTH_SECRET` | Random 32+ char string — `openssl rand -base64 32` |
| `AUTH_URL` | App URL — `http://localhost:3000` for dev |
| `UPLOADTHING_TOKEN` | From uploadthing.com dashboard |
| `NEXT_PUBLIC_APP_URL` | App URL — same as `AUTH_URL` |

### 3. Set up the database

```bash
npm run db:generate     # generate Prisma client
npm run db:migrate      # run migrations against your DB
```

### 4. Seed the database

Creates the default site settings and admin account:

```bash
ADMIN_PASSWORD="your-secure-password" npm run db:seed
```

> The admin email defaults to `creovibecoding@gmail.com`. Override with `ADMIN_EMAIL=...`.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site.
Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Scripts

```bash
npm run dev              # development server
npm run build            # production build
npm run start            # start production build
npm run lint             # ESLint
npm run typecheck        # TypeScript check (no emit)

npm test                 # unit + integration tests (Vitest)
npm run test:watch       # watch mode
npm run test:coverage    # with coverage report
npm run test:e2e         # E2E tests (Playwright — requires running server)
npm run test:e2e:ui      # Playwright UI mode

npm run db:generate      # generate Prisma client
npm run db:migrate       # run database migrations
npm run db:studio        # open Prisma Studio
npm run db:seed          # seed settings + admin account
```

---

## Project Structure

```
wsid/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public site — landing, categories, posts, about
│   │   ├── admin/             # Admin portal (auth-gated)
│   │   └── api/               # REST API route handlers
│   ├── components/
│   │   ├── public/            # PostCard, ShareToolbar, ScrollProgress, etc.
│   │   └── admin/             # AdminShell, PostForm, RichEditor, MediaGrid, etc.
│   └── lib/
│       ├── auth.ts            # NextAuth v5 config
│       ├── prisma.ts          # Prisma client singleton (PrismaPg adapter)
│       ├── validations.ts     # Zod schemas for all API inputs
│       ├── slug.ts            # Slug generation
│       ├── rate-limit.ts      # In-memory rate limiter
│       └── category.ts        # Category ↔ URL mapping
├── prisma/
│   ├── schema.prisma          # Data models
│   └── seed.ts                # DB seed script
├── docs/
│   └── architecture/          # Architecture documentation
│       ├── HIGH_LEVEL.md      # System overview, C4 diagrams, data flow
│       ├── COMPONENTS.md      # Component tree and props contracts
│       ├── DATA_MODEL.md      # Entity relationships and indexing
│       ├── SECURITY.md        # Threat model, auth flow, security headers
│       └── API.md             # API endpoint reference
├── tests/
│   └── e2e/                   # Playwright E2E tests
├── .agents/
│   ├── skills/                # Reusable agent skill definitions
│   └── specs/                 # Feature specifications
├── AGENTS.md                  # Agent setup and project conventions
├── CLAUDE.md                  # Claude Code instructions
└── .github/
    └── workflows/
        ├── ci.yml             # Tests on every PR
        └── vercel-preview.yml # Preview deployments on PR
```

---

## Architecture

Full documentation in [`docs/architecture/`](./docs/architecture/).

### Public site routes

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, category cards, recent posts |
| `/coding` `/guitar` `/photography` `/motorbikes` | Category listings |
| `/[category]/[slug]` | Post reader — Medium-style with share toolbar |
| `/about` | About page |
| `/api/og?slug=...` | Dynamic OG image (1200×630) |

### Admin routes (authentication required)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — stats, recent drafts |
| `/admin/posts` | Post list |
| `/admin/posts/new` | Create post — TipTap editor |
| `/admin/posts/[id]/edit` | Edit post |
| `/admin/media` | Media library — Uploadthing |
| `/admin/settings` | Site settings, social links |

### Security

- All write API routes and `/admin/*` pages guarded by Next.js middleware
- Rate limiting on auth endpoint: 5 requests / 15 minutes per IP
- Zod schema validation on every API input before DB access
- Prisma parameterized queries (no raw SQL)
- HTTP security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Env vars validated at startup with `@t3-oss/env-nextjs`

---

## Deployment

Hosted on **Vercel** with **Neon PostgreSQL** and **Uploadthing** media storage.

### Environment variables (Vercel)

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Auto-injected by Vercel + Neon integration |
| `DATABASE_URL_UNPOOLED` | Auto-injected by Vercel + Neon integration |
| `AUTH_SECRET` | Set manually — `openssl rand -base64 32` |
| `AUTH_URL` | Set manually — your production domain |
| `UPLOADTHING_TOKEN` | Set manually — from uploadthing.com |
| `NEXT_PUBLIC_APP_URL` | Set manually — your production domain |

### First deploy

```bash
# 1. Link to Vercel project and pull env vars
vercel link
vercel env pull .env.local

# 2. Run migrations against Neon
npm run db:migrate

# 3. Seed production DB
ADMIN_PASSWORD="your-secure-password" npm run db:seed

# 4. Deploy
git push origin main   # Vercel auto-deploys on push to main
```

### CI/CD

- Every PR runs: ESLint → TypeScript check → Vitest (47 tests)
- Merge to `main`: full test suite → Vercel production deploy
- Every PR also gets a Vercel preview deployment

---

## Testing

```
src/lib/validations.test.ts   30 tests — Zod schema coverage
src/lib/slug.test.ts          10 tests — slug generation
src/lib/rate-limit.test.ts     7 tests — rate limiter + IP extraction
tests/e2e/public-site.spec.ts  public browsing flows
tests/e2e/admin-portal.spec.ts auth guard + admin flows
```

Run the full suite:

```bash
npm test && npm run typecheck
```

---

## License

Private — CreoVibe Coding © 2026
