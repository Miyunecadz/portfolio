import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Session check will be added in plan 01-03 after BetterAuth is configured.
  // For now, all /admin/* requests pass through.
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
