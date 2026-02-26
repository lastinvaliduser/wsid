# AGENTS.md — wsid

Portfolio and blog platform for wsid.now (What Should I Do Now).
Developer: CreoVibe Coding | creovibecoding@gmail.com

## Project Overview

A full-stack Next.js 16 application serving as a personal blog/portfolio across four content categories:
Coding, Guitar, Photography, Motorbikes.

- **Public site**: Minimalist, Medium-inspired reader experience with social shareability
- **Admin portal**: Authenticated CMS at `/admin` for content management
- **API**: REST endpoints under `/api` with Zod validation and rate limiting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Mantine v8 (admin) |
| Database | PostgreSQL (Neon) via Prisma 7 |
| Auth | NextAuth.js v5 (credentials) |
| Media | Uploadthing |
| Content | Markdown (stored in DB), rendered with next-mdx-remote |
| Code highlighting | shiki |
| Editor | TipTap |
| Validation | Zod |
| Testing | Vitest (unit/component/integration) + Playwright (E2E) |
| Deployment | Vercel + Neon + Uploadthing |

## Project Structure

```
wsid/
├── src/
│   ├── app/
│   │   ├── (public)/          Public site pages
│   │   ├── admin/             Admin portal (auth-gated)
│   │   └── api/               REST API route handlers
│   ├── components/
│   │   ├── public/            Public-facing components
│   │   └── admin/             Admin UI components
│   └── lib/
│       ├── auth.ts            NextAuth configuration
│       ├── prisma.ts          Prisma client singleton (pg adapter)
│       ├── validations.ts     Zod schemas
│       ├── slug.ts            Slug generation utility
│       ├── rate-limit.ts      In-memory rate limiter
│       └── ...
├── prisma/
│   ├── schema.prisma          Data models
│   └── seed.ts                DB seed (settings + admin account)
├── docs/architecture/         Architecture documentation
│   ├── HIGH_LEVEL.md
│   ├── COMPONENTS.md
│   ├── DATA_MODEL.md
│   ├── SECURITY.md
│   └── API.md
└── tests/e2e/                 Playwright E2E tests
```

## Key Conventions

1. **TDD**: Write failing tests before implementing features (Red → Green → Refactor)
2. **Self-documenting code**: Clear naming, no inline comments unless logic is genuinely non-obvious
3. **Server Components by default**: Only mark `"use client"` when the component needs event handlers, hooks, or browser APIs
4. **Zod validation on all API inputs**: Parse before any business logic
5. **Auth guard**: `/admin/*` pages and write API routes are protected by `src/middleware.ts`
6. **Prisma 7**: Always instantiate PrismaClient with `PrismaPg` adapter — never without

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local
# Fill in DATABASE_URL, AUTH_SECRET, UPLOADTHING_TOKEN, NEXT_PUBLIC_APP_URL

# 3. Generate Prisma client
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Seed database (set ADMIN_PASSWORD env var first)
ADMIN_PASSWORD="your-password" npm run db:seed

# 6. Start dev server
npm run dev
```

## Running Tests

```bash
npm test              # Unit + integration tests (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:e2e      # E2E tests (Playwright, requires running server)
npm run typecheck     # TypeScript check
```

## Architecture Docs

Full architecture documentation lives in `docs/architecture/`. Read these before making significant changes:
- `HIGH_LEVEL.md` — system overview, data flow, deployment
- `COMPONENTS.md` — component tree, props contracts, conventions
- `DATA_MODEL.md` — entity relationships, indexing, data lifecycle
- `SECURITY.md` — threat model, auth flow, rate limiting, headers
- `API.md` — all endpoints, request/response shapes

## Agent Skills & Specs

- `.agents/skills/` — reusable skill definitions for this project
- `.agents/specs/` — feature specifications
