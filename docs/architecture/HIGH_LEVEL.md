# High-Level Architecture — wsid.now

## System Overview

`wsid.now` is a portfolio and blog platform for personal content across four categories:
Coding, Guitar, Photography, and Motorbikes. It consists of three logical systems:

1. **Public Site** — statically rendered pages consumed by visitors
2. **Admin Portal** — authenticated, server-rendered CMS for content management
3. **API Layer** — RESTful endpoints handling data operations, auth, and media

---

## C4 Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet                               │
│                                                                 │
│  ┌───────────────┐        ┌──────────────────────────────────┐  │
│  │   Visitor     │──────▶│          wsid.now                │  │
│  │ (read posts,  │        │   (Next.js 16 on Vercel Edge)   │  │
│  │  share links) │        └──────────────┬───────────────────┘  │
│  └───────────────┘                       │                       │
│                                          │                       │
│  ┌───────────────┐        ┌─────────────▼──────────────────┐   │
│  │  Site Owner   │──────▶│       /admin portal            │   │
│  │ (CreoVibe     │        │  (authenticated, same app)     │   │
│  │  Coding)      │        └─────────────┬──────────────────┘   │
│  └───────────────┘                      │                       │
│                                         │                       │
│         ┌───────────────────────────────┼──────────────────┐   │
│         │                               │                  │   │
│  ┌──────▼──────┐              ┌─────────▼──────┐  ┌───────▼─┐ │
│  │    Neon     │              │  Uploadthing   │  │ Vercel  │ │
│  │ PostgreSQL  │              │  (Image CDN)   │  │  Edge   │ │
│  │ (serverless)│              │                │  │  Cache  │ │
│  └─────────────┘              └────────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## C4 Container Diagram

```
wsid.now (Next.js 16 App)
├── (public)/                    ← Static/SSR public pages
│   ├── page.tsx                 ← Landing page (SSG)
│   ├── [category]/page.tsx      ← Category listing (ISR, 60s revalidate)
│   ├── [category]/[slug]/       ← Post detail (ISR, on-demand revalidate)
│   └── about/page.tsx           ← About (SSG)
│
├── admin/                       ← Dynamic, auth-gated admin pages
│   ├── layout.tsx               ← Session check wrapper
│   ├── posts/                   ← Post management
│   └── media/                   ← Media library
│
├── api/                         ← REST API (Next.js Route Handlers)
│   ├── auth/[...nextauth]/      ← NextAuth.js v5
│   ├── posts/                   ← Post CRUD
│   ├── media/                   ← File upload (Uploadthing)
│   └── og/                      ← Dynamic OG image generation
│
└── middleware.ts                ← Route-level auth guard
```

---

## Data Flow

### Visitor reads a post

```
Browser → Vercel Edge → Next.js ISR cache hit → HTML response
                     ↓ (cache miss)
                     → Next.js → Prisma → Neon PostgreSQL
                     → render → cache → HTML response
```

### Admin creates a post

```
Admin Browser → POST /api/posts
             → middleware validates session (NextAuth cookie)
             → Zod schema validates request body
             → Prisma INSERT into posts table (Neon)
             → revalidate ISR cache for affected paths
             → 201 response
```

### Image upload

```
Admin Browser → POST /api/uploadthing
             → Uploadthing SDK validates (type, size)
             → Upload to Uploadthing CDN
             → URL stored in Media table (Neon)
             → URL returned to TipTap editor
```

### Social share

```
User clicks share → Web Share API (mobile) or opens pre-filled URL (desktop)
OG image:  /api/og?slug=... → Next.js ImageResponse → 1200x630 PNG → Vercel Edge cache
```

---

## Deployment Topology

```
GitHub (source) ──→ GitHub Actions CI (Vitest + Playwright) ──→ Vercel
                                                                    │
                                                     ┌──────────────┤
                                                     │              │
                                               Production      Preview
                                               (main branch)   (per PR)
                                                     │
                                               wsid.now (custom domain, SSL)
```

---

## Technology Decisions

| Decision | Choice | Alternative Considered | Reason |
|----------|--------|----------------------|--------|
| Framework | Next.js 16 | Remix, Astro | App Router, ISR, edge OG images, Vercel synergy |
| UI Library | Mantine + Tailwind | shadcn/ui, Chakra | TypeScript-first, comprehensive admin components |
| Database | PostgreSQL (Neon) | SQLite, PlanetScale | Relational integrity, serverless scaling, Prisma support |
| Auth | NextAuth.js v5 | Clerk, custom JWT | Battle-tested, free, supports credentials |
| Media | Uploadthing | S3, Cloudinary | TypeScript-first, free tier, zero AWS config |
| Content format | Markdown (stored in DB) | MDX files, CMS | Admin-editable without file system access |
| Testing | Vitest + Playwright | Jest, Cypress | Speed, native ESM, unified config |
