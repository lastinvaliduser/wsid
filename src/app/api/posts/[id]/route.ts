import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UpdatePostSchema } from "@/lib/validations"
import { categoryToUrlSegment } from "@/lib/category"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json({ post })
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parseResult = UpdatePostSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parseResult.error.issues },
      { status: 400 }
    )
  }

  const existing = await prisma.post.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const updates = parseResult.data

  // Set publishedAt on first publish
  const isFirstPublish =
    updates.status === "PUBLISHED" &&
    existing.status === "DRAFT" &&
    !existing.publishedAt

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...updates,
      ...(isFirstPublish && { publishedAt: new Date() }),
    },
  })

  // Revalidate affected public routes
  const categorySegment = categoryToUrlSegment(post.category)
  revalidatePath("/")
  revalidatePath(`/${categorySegment}`)
  revalidatePath(`/${categorySegment}/${post.slug}`)

  return NextResponse.json({ post })
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const existing = await prisma.post.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  await prisma.post.delete({ where: { id } })

  const categorySegment = categoryToUrlSegment(existing.category)
  revalidatePath("/")
  revalidatePath(`/${categorySegment}`)

  return new NextResponse(null, { status: 204 })
}
