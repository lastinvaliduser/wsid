# API Reference — wsid.now

All write endpoints require a valid NextAuth session (set via `Authorization: Cookie` or session cookie).
All responses are `application/json`. All error responses include `{ error: string }`.

---

## Authentication

### `POST /api/auth/signin`
Sign in as admin.

**Request**
```json
{ "email": "creovibecoding@gmail.com", "password": "..." }
```

**Response**
- `200 OK` — session cookie set, returns NextAuth session object
- `401 Unauthorized` — invalid credentials
- `429 Too Many Requests` — rate limit exceeded (5 attempts / 15 min)

### `POST /api/auth/signout`
Sign out. Clears session cookie.

**Response**
- `200 OK`

---

## Posts

### `GET /api/posts`
List posts. Public for PUBLISHED, requires auth for DRAFT.

**Query params**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `CODING\|GUITAR\|PHOTOGRAPHY\|MOTORBIKES` | all | Filter by category |
| `status` | `DRAFT\|PUBLISHED` | `PUBLISHED` | Filter by status (DRAFT requires auth) |
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Items per page (max 50) |

**Response `200 OK`**
```json
{
  "posts": [
    {
      "id": "cuid",
      "title": "string",
      "slug": "string",
      "excerpt": "string | null",
      "category": "CODING",
      "status": "PUBLISHED",
      "coverImage": "string | null",
      "tags": ["string"],
      "publishedAt": "ISO8601 | null",
      "readingTimeMinutes": 5
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

---

### `POST /api/posts`
Create a new post. Requires auth.

**Request**
```json
{
  "title": "string",
  "category": "CODING",
  "content": "# Markdown string",
  "excerpt": "string | null",
  "coverImage": "string | null",
  "tags": ["string"],
  "seoTitle": "string | null",
  "seoDesc": "string | null",
  "status": "DRAFT"
}
```

**Response**
- `201 Created` — `{ post: PostWithContent }`
- `400 Bad Request` — Zod validation error `{ error: string, issues: ZodIssue[] }`
- `401 Unauthorized`
- `409 Conflict` — slug already exists

---

### `GET /api/posts/[id]`
Get a single post by ID. Requires auth (use public page route for public access).

**Response**
- `200 OK` — `{ post: PostWithContent }`
- `404 Not Found`

---

### `PATCH /api/posts/[id]`
Update a post. Requires auth. All fields optional (partial update).

**Request** — same shape as POST, all fields optional.

**Response**
- `200 OK` — `{ post: PostWithContent }`
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

Special behavior:
- If `status` changes from `DRAFT` → `PUBLISHED` and `publishedAt` is null, sets `publishedAt = now()`
- Triggers `revalidatePath()` for the post URL and category page

---

### `DELETE /api/posts/[id]`
Delete a post permanently. Requires auth.

**Response**
- `204 No Content`
- `401 Unauthorized`
- `404 Not Found`

---

## Media

### `GET /api/media`
List uploaded media files. Requires auth.

**Query params**: `page`, `limit` (same as posts)

**Response `200 OK`**
```json
{
  "media": [
    {
      "id": "cuid",
      "filename": "string",
      "url": "https://utfs.io/...",
      "mimeType": "image/jpeg",
      "size": 204800,
      "createdAt": "ISO8601"
    }
  ],
  "total": 15
}
```

### `POST /api/uploadthing`
Handled by Uploadthing SDK router. Requires auth.

Accepts `imageUploader` route: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, max 5MB.

**Response** — Uploadthing standard response with `url` field.

### `DELETE /api/media/[id]`
Delete a media record from DB. Does not delete from Uploadthing CDN (manual cleanup required). Requires auth.

**Response**
- `204 No Content`
- `401 Unauthorized`
- `404 Not Found`

---

## OG Image

### `GET /api/og`
Generate dynamic Open Graph image for a post. Public.

**Query params**
| Param | Type | Required |
|-------|------|----------|
| `slug` | `string` | Yes |

**Response**
- `200 OK` — `image/png`, 1200×630, cached at edge for 1 hour
- `404 Not Found` — post not found or not published

---

## Settings

### `GET /api/settings`
Get all site settings. Public (no sensitive data).

**Response `200 OK`**
```json
{
  "settings": {
    "site.author": "CreoVibe Coding",
    "site.email": "creovibecoding@gmail.com",
    "site.bio": "...",
    "site.avatar": "...",
    "site.twitter": "...",
    "site.github": "..."
  }
}
```

### `PATCH /api/settings`
Update site settings. Requires auth.

**Request**
```json
{ "key": "site.bio", "value": "new bio text" }
```

**Response**
- `200 OK` — `{ setting: { key, value } }`
- `400 Bad Request` — unknown key or invalid value
- `401 Unauthorized`
