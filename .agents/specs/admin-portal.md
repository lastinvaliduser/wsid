# Spec: Admin Portal

## Layout
- Mantine `AppShell` with navbar (sidebar on desktop, drawer on mobile)
- Sidebar: logo, nav links (Dashboard, Posts, Media, Settings), sign out button
- Protected by `src/middleware.ts` — unauthenticated access redirects to `/admin/login`

## Login Page (`/admin/login`)
- Simple centered card: email + password inputs, submit button
- Shows generic error on invalid credentials (no user enumeration)
- Shows lockout message when rate limited
- On success: redirect to `/admin` (or `callbackUrl` from query)

## Dashboard (`/admin`)
- StatsGrid: 4 Mantine stat cards — Total Posts, Published, Drafts, Categories used
- RecentDrafts: table of last 5 DRAFT posts with "Edit" link

## Posts List (`/admin/posts`)
- PostsToolbar: search by title, filter by category (Select), filter by status (SegmentedControl)
- PostsTable: Mantine Table — columns: Title, Category, Status (Badge), Published Date, Actions
  - Actions: Edit (link), Delete (with Mantine Confirm modal)
- "New Post" button in toolbar → `/admin/posts/new`
- Pagination

## Create/Edit Post (`/admin/posts/new`, `/admin/posts/[id]/edit`)
- PostTitleInput: large, prominent text input (no label, placeholder "Post title...")
- Inline meta panel (right sidebar on desktop, accordion on mobile):
  - Category: Mantine `Select`
  - Status: Mantine `Switch` (Draft / Published toggle)
  - Tags: Mantine `TagsInput`
  - Cover Image: Uploadthing `UploadButton`, preview thumbnail
  - SEO Title (optional): `TextInput`, character count indicator
  - SEO Description (optional): `Textarea`, character count indicator
- RichEditor: TipTap with toolbar (bold, italic, H1-H3, code, codeblock, link, image, bullet/ordered list, blockquote, hr)
- Action bar (sticky bottom): "Save Draft" | "Publish" | "Update" buttons
- Auto-generates slug from title (shown as preview, not editable directly)

## Media Library (`/admin/media`)
- MediaUploader: Uploadthing drag-drop zone at top
- MediaGrid: masonry-style grid of uploaded images
  - Each card: thumbnail, filename, size, "Copy URL" button (Mantine notification on copy)
  - Delete button with confirm

## Settings (`/admin/settings`)
- SiteSettingsForm: Author name, email, bio (Textarea), avatar (Uploadthing), Twitter handle, GitHub username
- AdminPasswordForm: current password, new password, confirm (with strength indicator)
- Both forms: Mantine form with validation, success notification on save
