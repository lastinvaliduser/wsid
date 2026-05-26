import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authConfig } from "@/lib/auth.config"

// Use the Edge-safe config — no Prisma, no bcrypt.
// JWT verification is stateless and runs fine on the Edge Runtime.
const { auth } = NextAuth(authConfig)

const ADMIN_API_METHODS = ["POST", "PATCH", "PUT", "DELETE"]

function isAdminPage(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login"
}

function isWriteApiRoute(pathname: string, method: string): boolean {
  return pathname.startsWith("/api/") && ADMIN_API_METHODS.includes(method)
}

export default auth((request: NextRequest & { auth: unknown }) => {
  const { pathname } = request.nextUrl
  const session = request.auth

  if (isAdminPage(pathname) && !session) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isWriteApiRoute(pathname, request.method) && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/posts/:path*",
    "/api/media/:path*",
    "/api/settings/:path*",
  ],
}
