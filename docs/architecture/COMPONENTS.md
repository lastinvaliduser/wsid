# Component Architecture — wsid.now

## Component Tree

```
App
├── (public) layout — minimal nav + footer
│   ├── SiteNav             — logo, category links, theme toggle
│   ├── SiteFooter          — copyright, social links (CreoVibe Coding)
│   │
│   ├── Landing page
│   │   ├── HeroSection     — tagline, subtitle, CTA
│   │   ├── CategoryGrid    — 4 CategoryCard components
│   │   │   └── CategoryCard — icon, name, description, link
│   │   └── RecentPosts     — latest 3 posts across all categories
│   │       └── PostCard (compact)
│   │
│   ├── Category page
│   │   ├── CategoryHeader  — category name, description, post count
│   │   └── PostGrid        — paginated grid
│   │       └── PostCard    — cover, title, excerpt, date, read time
│   │
│   ├── Post page
│   │   ├── PostHeader      — title, category badge, date, read time
│   │   ├── CoverImage      — Next.js <Image>, responsive
│   │   ├── ScrollProgress  — thin top bar, scroll-driven width
│   │   ├── PostContent     — MDX rendered HTML, shiki code blocks
│   │   ├── ShareToolbar    — sticky float (desktop) / inline (mobile)
│   │   │   ├── WebShareButton     — native mobile share
│   │   │   ├── TwitterShareButton — pre-filled tweet
│   │   │   ├── LinkedInShareButton
│   │   │   ├── WhatsAppShareButton
│   │   │   └── CopyLinkButton    — clipboard + Mantine notification
│   │   ├── AuthorCard      — avatar, name (CreoVibe Coding), email
│   │   └── TagList         — clickable tags
│   │
│   └── About page
│       ├── AboutHero
│       └── CategoryPassions — cards for each passion
│
└── admin layout — Mantine AppShell (sidebar nav + content area)
    ├── AdminNav          — sidebar: Dashboard, Posts, Media, Settings
    │
    ├── Dashboard page
    │   ├── StatsGrid     — total posts, drafts, published, categories
    │   └── RecentDrafts  — table of unpublished posts
    │
    ├── Posts list page
    │   ├── PostsToolbar  — search, filter by category/status, New Post button
    │   └── PostsTable    — Mantine Table: title, category, status, date, actions
    │
    ├── Post create/edit page
    │   ├── PostTitleInput   — large text input
    │   ├── PostMetaPanel    — category Select, status Switch, tags, SEO fields
    │   ├── CoverImagePicker — Uploadthing dropzone
    │   ├── RichEditor       — TipTap with Mantine toolbar
    │   │   ├── EditorToolbar — bold, italic, headings, code, link, image
    │   │   └── EditorContent
    │   └── PostActions      — Save Draft / Publish buttons
    │
    ├── Media library page
    │   ├── MediaUploader   — drag-drop zone, Uploadthing
    │   └── MediaGrid       — grid of uploaded images with copy URL button
    │
    └── Settings page
        ├── SiteSettingsForm — bio, author name, email, social links
        └── AdminPasswordForm — change admin password
```

---

## Component Responsibility Rules

1. **Server Components by default** — all `page.tsx` and layout files are server components unless they explicitly need interactivity.
2. **Client Components** — only components with event handlers, hooks, or browser APIs are marked `"use client"`. Examples: `ShareToolbar`, `ScrollProgress`, `RichEditor`, `CopyLinkButton`.
3. **No prop drilling beyond 2 levels** — use React context or co-locate state near the component that uses it.
4. **Mantine for admin, Tailwind for public** — public site uses only Tailwind classes for a custom minimal look. Admin uses Mantine components for consistency and productivity.

---

## Key Props Contracts

### PostCard
```typescript
interface PostCardProps {
  title: string
  slug: string
  category: Category
  excerpt: string
  coverImage: string | null
  publishedAt: Date
  readingTimeMinutes: number
  compact?: boolean
}
```

### ShareToolbar
```typescript
interface ShareToolbarProps {
  title: string
  url: string
  sticky?: boolean
}
```

### RichEditor (admin)
```typescript
interface RichEditorProps {
  content: string         // initial Markdown/HTML content
  onChange: (markdown: string) => void
}
```

### PostContent
```typescript
interface PostContentProps {
  markdown: string        // raw Markdown from DB
}
```

---

## Naming Conventions

- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Components: named exports (not default) from feature directories
- Test files: co-located as `ComponentName.test.tsx`
- Page files: always `page.tsx` (Next.js convention), default export
