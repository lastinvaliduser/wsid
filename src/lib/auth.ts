import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SignInSchema } from "@/lib/validations"
import { authConfig } from "@/lib/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
