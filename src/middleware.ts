import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_PATH_PREFIX = "/admin"
const ADMIN_API_METHODS = ["POST", "PATCH", "PUT", "DELETE"]

function isAdminPage(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PATH_PREFIX) && pathname !== "/admin/login"
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
