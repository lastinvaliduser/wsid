import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { SignInSchema } from "@/lib/validations"
import { authConfig } from "@/lib/auth.config"
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Apply rate limiting based on IP
        const headerList = await headers()
        const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? 
                   headerList.get("x-real-ip") ?? 
                   "unknown"
        
        const { allowed } = checkRateLimit(`auth:${ip}`, AUTH_RATE_LIMIT)
        if (!allowed) {
          throw new Error("Too many attempts. Please try again later.")
        }

        const parsed = SignInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const admin = await prisma.adminAccount.findUnique({
          where: { email },
        })

        if (!admin) return null

        const passwordMatches = await bcrypt.compare(password, admin.passwordHash)
        if (!passwordMatches) return null

        return { id: admin.id, email: admin.email }
      },
    }),
  ],
})
