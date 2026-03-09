import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance Mode check (cookie-based, no DB)
  const isMaintenanceOn = request.cookies.get("maintenance-mode")?.value === "1"
  const isExempt =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/maintenance"

  if (isMaintenanceOn && !isExempt) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Auth guard — only for /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
