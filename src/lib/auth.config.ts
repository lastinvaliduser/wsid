import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth config — no Node.js-only imports (no Prisma, no bcrypt).
 * Used by the proxy (middleware) to verify JWT sessions on the Edge Runtime.
 * The full auth config in auth.ts extends this and adds the Credentials provider.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [],
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig
