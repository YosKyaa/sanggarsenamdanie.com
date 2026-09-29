import "server-only"

import { requireAdmin } from "@/features/admin/auth"
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/admin"
import type { ProfileRole } from "@/types/database"

export type AdminUser = {
  id: string
  name: string | null
  email: string | null
  role: ProfileRole
  createdAt: string
  lastSignInAt: string | null
}

const roleOrder: Record<ProfileRole, number> = { admin: 0, editor: 1, member: 2 }

/** All accounts: profiles (always) plus last sign-in time when the service key is available. */
export async function listUsers(): Promise<AdminUser[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from("profiles").select("id, name, email, role, created_at")
  if (error) throw new Error(`Gagal memuat pengguna: ${error.message}`)

  const lastSignIn = new Map<string, string | null>()
  if (isServiceRoleConfigured) {
    const { data: auth } = await createServiceClient().auth.admin.listUsers({ perPage: 1000 })
    auth?.users.forEach((u) => lastSignIn.set(u.id, u.last_sign_in_at ?? null))
  }

  return data
    .map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      createdAt: p.created_at,
      lastSignInAt: lastSignIn.get(p.id) ?? null,
    }))
    .sort((a, b) => roleOrder[a.role] - roleOrder[b.role] || (a.name ?? "").localeCompare(b.name ?? ""))
}
