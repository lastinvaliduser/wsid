import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UpdateSettingSchema } from "@/lib/validations"

export async function GET() {
  const settings = await prisma.setting.findMany()

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return NextResponse.json({ settings: settingsMap })
}

export async function PATCH(request: Request) {
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

  const parseResult = UpdateSettingSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parseResult.error.issues },
      { status: 400 }
    )
  }

  const { key, value } = parseResult.data

  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })

  return NextResponse.json({ setting })
}
