# Skill: Post Management

## Scope
Creating, updating, publishing, and deleting blog posts via the admin portal.

## Key Files
- `src/app/api/posts/route.ts` — list (GET) and create (POST) endpoints
- `src/app/api/posts/[id]/route.ts` — read (GET), update (PATCH), delete (DELETE) endpoints
- `src/lib/validations.ts` — `CreatePostSchema`, `UpdatePostSchema`, `PostQuerySchema`
- `src/lib/slug.ts` — `generateSlug()`, `appendSuffix()`
- `prisma/schema.prisma` — `Post` model

## Post Lifecycle
1. Created as `DRAFT` — not visible on public site
2. Published by setting `status: "PUBLISHED"` — sets `publishedAt` if null
3. ISR cache revalidated on publish via `revalidatePath()`

## Slug Generation Pattern
```typescript
let slug = generateSlug(title)
let suffix = 2
while (await prisma.post.findUnique({ where: { slug } })) {
  slug = appendSuffix(generateSlug(title), suffix++)
}
```

## Validation
Always parse with `CreatePostSchema` or `UpdatePostSchema` before DB access.

## Cache Revalidation
After publish/update/delete:
```typescript
revalidatePath(`/${categorySlug}`)
revalidatePath(`/${categorySlug}/${slug}`)
revalidatePath("/")
```
