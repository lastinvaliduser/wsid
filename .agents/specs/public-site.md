# Spec: Public Site

## Landing Page (`/`)
- Full-screen hero section: site tagline "What Should I Do Now?", short subtitle
- 4 CategoryCard components: Coding, Guitar, Photography, Motorbikes
  - Each has an icon (Tabler Icons), name, short description, link to category page
- RecentPosts section: latest 3 published posts across all categories (compact PostCard)
- SiteNav: logo/domain name + category nav links + no auth UI
- SiteFooter: "CreoVibe Coding" copyright, email link, social links
- Rendered as SSG (no revalidation needed unless settings change)

## Category Listing Page (`/[category]`)
- CategoryHeader: category name + description + total published post count
- PostGrid: paginated 2-col (mobile: 1-col) grid of PostCard
- PostCard: cover image, category badge, title, excerpt, date, reading time badge
- Pagination: page number buttons
- ISR: `revalidate = 60` (revalidates when new post published)
- 404 if category enum invalid

## Post Detail Page (`/[category]/[slug]`)
- Only renders PUBLISHED posts (404 for DRAFT)
- ScrollProgress: thin accent-colored bar at top of viewport
- PostHeader: title, category badge, date, reading time
- CoverImage (if present): full-width, Next.js <Image>
- PostContent: MDX rendered with shiki code highlighting
- ShareToolbar: sticky on desktop, inline at post bottom on mobile
  - Web Share API button (hidden on desktop)
  - Twitter/X, LinkedIn, WhatsApp links
  - Copy link button with Mantine Notification feedback
- AuthorCard: small section below post — avatar, "CreoVibe Coding", email
- TagList: clickable tags (link to future tag page — no-op for now)
- SEO: dynamic metadata, Open Graph, Twitter Card, JSON-LD
- ISR: `revalidate = false` with on-demand revalidation via `revalidatePath()`

## About Page (`/about`)
- AboutHero: photo/avatar, name, short bio (from settings)
- CategoryPassions: 4 cards with category icons and personal blurb
- SSG

## OG Image Route (`/api/og?slug=...`)
- Next.js ImageResponse
- 1200×630px
- Design: category badge (color coded), post title (large), wsid.now brand
- Cache: `max-age=3600` (1 hour at edge)
- 404 if post not found or not published
