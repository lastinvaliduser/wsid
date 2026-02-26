# Skill: Media Upload

## Scope
Image upload from the admin portal using Uploadthing, stored on CDN, URL saved in DB.

## Key Files
- `src/app/api/uploadthing/route.ts` — Uploadthing route handler
- `src/lib/uploadthing.ts` — Uploadthing file router definition
- `src/app/api/media/route.ts` — Media record list (GET)
- `src/app/api/media/[id]/route.ts` — Media record delete (DELETE)
- `src/lib/validations.ts` — `MediaMetaSchema`
- `prisma/schema.prisma` — `Media` model

## Upload Flow
1. Admin drags/drops image in the media picker or post editor
2. Uploadthing SDK handles upload directly to CDN (browser → Uploadthing)
3. On success, URL returned to client and stored in `Media` table
4. URL inserted into TipTap editor or saved as `coverImage`

## Constraints
- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Max size: 5MB per file

## Uploadthing File Router Pattern
```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "5MB" } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new Error("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      await prisma.media.create({
        data: { filename: file.name, url: file.ufsUrl, mimeType: file.type, size: file.size }
      })
    }),
} satisfies FileRouter
```
