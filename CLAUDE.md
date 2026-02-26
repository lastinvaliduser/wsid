# CLAUDE.md — wsid

Instructions for Claude Code when working in this project.

## Code Style

- **TypeScript strict mode** — no `any`, no type assertions unless unavoidable
- **Named exports** for components — no `export default` in component files (only in `page.tsx` / `layout.tsx` per Next.js convention)
- **No inline comments** — write self-explanatory code; comments only for non-obvious algorithms
- **No unused variables or imports** — clean up as you go
- Prefer `const` over `let`, never `var`
- Async/await over `.then()` chains

## Development Workflow

1. **Always TDD** — write failing test first, then implementation, then refactor
2. Run `npm test` after every feature to confirm green
3. Run `npm run typecheck` before considering work complete
4. Keep tests co-located: `Foo.ts` → `Foo.test.ts` in the same directory

## Prisma 7 Rules

- **Always** use the `PrismaPg` adapter when instantiating `PrismaClient`
- Import from `@/lib/prisma` — never create a new `PrismaClient` directly
- Never write raw SQL — use Prisma query methods
- After schema changes: `npm run db:generate` then `npm run db:migrate`

## Security Rules (never skip these)

- **Validate all API inputs** with Zod before any DB access — use schemas from `src/lib/validations.ts`
- **Check auth** in every write API route — rely on middleware but also verify session in complex handlers
- **Never expose admin routes** to unauthenticated users — middleware handles this but don't bypass
- **Never commit secrets** — use `.env.local` (gitignored)
- **Sanitize slugs** — use `generateSlug()` from `src/lib/slug.ts`

## Component Rules

- Public pages: **Tailwind only** — no Mantine imports in `(public)` routes
- Admin pages: **Mantine for UI components** — use AppShell, forms, tables, modals
- Mark `"use client"` only when the component has event handlers, state, effects, or browser APIs
- Next.js `<Image>` for all images — never `<img>`
- Next.js `<Link>` for internal navigation — never `<a>`

## What NOT to Do

- Do not add features beyond what is explicitly requested
- Do not add docstrings or JSDoc comments to code you didn't change
- Do not refactor working code unless directly asked
- Do not use `console.log` in production code (only in dev scripts/seed)
- Do not use `any` type
- Do not create wrapper components for single-use logic
- Do not use `export default` in component files (only pages/layouts)

## File Paths Quick Reference

| Need | File |
|------|------|
| Prisma client | `src/lib/prisma.ts` |
| Auth config | `src/lib/auth.ts` |
| Zod schemas | `src/lib/validations.ts` |
| Slug utility | `src/lib/slug.ts` |
| Rate limiter | `src/lib/rate-limit.ts` |
| Env validation | `src/env.ts` |
| Middleware | `src/middleware.ts` |
| Security headers | `next.config.ts` |
| DB schema | `prisma/schema.prisma` |
| DB seed | `prisma/seed.ts` |
| Architecture docs | `docs/architecture/` |
