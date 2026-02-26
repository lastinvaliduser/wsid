import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { CATEGORY_LABELS } from "@/lib/category"

export const runtime = "nodejs"

const CATEGORY_COLORS: Record<string, string> = {
  CODING: "#3b82f6",
  GUITAR: "#8b5cf6",
  PHOTOGRAPHY: "#f59e0b",
  MOTORBIKES: "#ef4444",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 })
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, category: true, excerpt: true, status: true },
  })

  if (!post || post.status !== "PUBLISHED") {
    return new Response("Post not found", { status: 404 })
  }

  const categoryColor = CATEGORY_COLORS[post.category] ?? "#6b7280"
  const categoryLabel = CATEGORY_LABELS[post.category]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#0f172a",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: categoryColor,
              color: "white",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Post title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.1",
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          {post.title}
        </div>

        {/* Domain brand */}
        <div
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            fontWeight: "500",
          }}
        >
          wsid.now
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
