import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"
import type { ProfileRole } from "@/types/database"

export type StaffRole = Extract<ProfileRole, "admin" | "editor">

/**
 * Server-side gate for admin pages and actions. The middleware only checks for
 * a session; the role is verified here and enforced again by RLS in the DB.
 * Editors manage content and requests; admins additionally manage users and settings.
 */
export const requireStaff = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login")

  const supabase = await createSessionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user.id).single()
  if (profile?.role !== "admin" && profile?.role !== "editor") redirect("/admin/login?error=forbidden")

  return { supabase, user, profile: { name: profile.name, role: profile.role as StaffRole } }
})

/** Admin-only areas (users, site settings). Editors are sent back to the dashboard. */
export async function requireAdmin() {
  const staff = await requireStaff()
  if (staff.profile.role !== "admin") redirect("/admin?notice=forbidden")
  return staff
}
