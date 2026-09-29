import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/types/database"

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env"

/** Refreshes the auth session and guards /admin routes. */
export async function updateSession(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login"

  if (!isSupabaseConfigured) {
    if (isLogin) return NextResponse.next()
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isLogin) {
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}
