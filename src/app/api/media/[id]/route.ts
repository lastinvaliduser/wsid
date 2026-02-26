import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const existing = await prisma.media.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 })
  }

  await prisma.media.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
