import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreatePostSchema, PostQuerySchema } from "@/lib/validations"
import { generateSlug, appendSuffix } from "@/lib/slug"
import { categoryToUrlSegment } from "@/lib/category"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryResult = PostQuerySchema.safeParse(Object.fromEntries(searchParams))

  if (!queryResult.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", issues: queryResult.error.issues },
      { status: 400 }
    )
  }

  const { category, status, page, limit } = queryResult.data
  const session = await auth()

  // DRAFT posts require authentication
  if (status === "DRAFT" && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const where = {
    ...(category && { category }),
    status,
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        status: true,
        coverImage: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parseResult = CreatePostSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parseResult.error.issues },
      { status: 400 }
    )
  }

  const data = parseResult.data

  // Generate a unique slug
  let slug = generateSlug(data.title)
  if (!slug) {
    return NextResponse.json({ error: "Could not generate slug from title" }, { status: 400 })
  }

  let suffix = 2
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = appendSuffix(generateSlug(data.title), suffix++)
  }

  const publishedAt =
    data.status === "PUBLISHED" ? new Date() : null

  const post = await prisma.post.create({
    data: {
      ...data,
      slug,
      publishedAt,
    },
  })

  if (post.status === "PUBLISHED") {
    revalidatePath("/")
    revalidatePath(`/${categoryToUrlSegment(post.category)}`)
  }

  return NextResponse.json({ post }, { status: 201 })
}
