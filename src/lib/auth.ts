import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SignInSchema } from "@/lib/validations"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.AUTH_SECRET,
})
