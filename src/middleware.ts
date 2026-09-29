import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

export function middleware(request: NextRequest) {
  return updateSession(request)
}

// Only admin routes need a session; public pages stay fully static.
export const config = {
  matcher: ["/admin/:path*"],
}
