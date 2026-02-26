import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const DEFAULT_SETTINGS = [
  { key: "site.author", value: "CreoVibe Coding" },
  { key: "site.email", value: "creovibecoding@gmail.com" },
  { key: "site.bio", value: "" },
  { key: "site.avatar", value: "" },
  { key: "site.twitter", value: "" },
  { key: "site.github", value: "" },
]

async function main() {
  console.log("Seeding database...")

  for (const setting of DEFAULT_SETTINGS) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log("Settings seeded.")

  const adminEmail = process.env.ADMIN_EMAIL ?? "creovibecoding@gmail.com"
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.warn(
      "ADMIN_PASSWORD env var not set — skipping admin account creation.\n" +
        "Set ADMIN_PASSWORD and re-run to create the admin account."
    )
    return
  }

  const existing = await prisma.adminAccount.findUnique({
    where: { email: adminEmail },
  })

  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.adminAccount.create({
      data: { email: adminEmail, passwordHash },
    })
    console.log(`Admin account created for ${adminEmail}.`)
  } else {
    console.log(`Admin account already exists for ${adminEmail}.`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
