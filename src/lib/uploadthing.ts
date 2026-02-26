import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new Error("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      await prisma.media.create({
        data: {
          filename: file.name,
          url: file.ufsUrl,
          mimeType: file.type,
          size: file.size,
        },
      })
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
