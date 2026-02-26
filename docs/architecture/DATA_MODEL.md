# Data Model — wsid.now

## Entity Relationship Diagram

```
┌──────────────────────────────────────┐
│                Post                  │
├──────────────────────────────────────┤
│ id           String  (cuid, PK)      │
│ title        String                  │
│ slug         String  (UNIQUE)        │
│ excerpt      String? (nullable)      │
│ content      Text    (Markdown)      │
│ category     Category (enum)         │
│ status       PostStatus (enum)       │
│ coverImage   String? (Uploadthing URL│
│ tags         String[]                │
│ seoTitle     String? (nullable)      │
│ seoDesc      String? (nullable)      │
│ publishedAt  DateTime? (nullable)    │
│ createdAt    DateTime (auto)         │
│ updatedAt    DateTime (auto)         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│                Media                 │
├──────────────────────────────────────┤
│ id           String  (cuid, PK)      │
│ filename     String                  │
│ url          String  (CDN URL)       │
│ mimeType     String                  │
│ size         Int     (bytes)         │
│ createdAt    DateTime (auto)         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│              Setting                 │
├──────────────────────────────────────┤
│ key          String  (PK)            │
│ value        Text                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│            AdminAccount              │
├──────────────────────────────────────┤
│ id           String  (cuid, PK)      │
│ email        String  (UNIQUE)        │
│ passwordHash String                  │
│ createdAt    DateTime (auto)         │
│ updatedAt    DateTime (auto)         │
└──────────────────────────────────────┘
```

> Note: There is a single admin account. No public user registration. No Post-to-User foreign key — all posts are authored by the site owner.

---

## Enums

```prisma
enum Category {
  CODING
  GUITAR
  PHOTOGRAPHY
  MOTORBIKES
}

enum PostStatus {
  DRAFT
  PUBLISHED
}
```

URL path mapping:
| Enum | URL segment |
|------|-------------|
| CODING | `/coding` |
| GUITAR | `/guitar` |
| PHOTOGRAPHY | `/photography` |
| MOTORBIKES | `/motorbikes` |

---

## Indexing Strategy

| Table | Index | Reason |
|-------|-------|--------|
| Post | `slug` (UNIQUE) | Primary post lookup |
| Post | `(category, status, publishedAt DESC)` | Category page queries |
| Post | `(status, publishedAt DESC)` | Landing page latest posts |
| Post | `status` | Admin post list filtered by status |
| Media | `createdAt DESC` | Media library sorted by newest |

---

## Settings Keys (seeded at startup)

| Key | Default Value | Description |
|-----|---------------|-------------|
| `site.author` | `CreoVibe Coding` | Author name for meta tags |
| `site.email` | `creovibecoding@gmail.com` | Contact email |
| `site.bio` | `` | Short bio for About page |
| `site.avatar` | `` | Avatar image URL |
| `site.twitter` | `` | Twitter/X handle |
| `site.github` | `` | GitHub username |

---

## Data Lifecycle

### Post creation
1. Admin submits form → `POST /api/posts` with `status: DRAFT`
2. Slug auto-generated from title (kebab-case, uniqueness enforced)
3. `publishedAt` is `null` for drafts

### Post publishing
1. Admin toggles status → `PATCH /api/posts/:id` with `{ status: "PUBLISHED" }`
2. `publishedAt` set to `NOW()` on first publish, unchanged on subsequent saves
3. ISR cache revalidated via `revalidatePath()` for the post URL and category page

### Post deletion
- Soft delete not implemented — posts are hard-deleted
- Orphaned `coverImage` URLs in Uploadthing are not auto-cleaned (manual cleanup via media library)
