import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"

/**
 * Server-side gate for every admin page and action. The middleware only checks
 * for a session; the admin role is verified here (and again by RLS in the DB).
 */
export const requireAdmin = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login")

  const supabase = await createSessionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/admin/login?error=forbidden")

  return { supabase, user, profile }
})
