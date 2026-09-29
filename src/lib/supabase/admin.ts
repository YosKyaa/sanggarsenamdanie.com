import "server-only"

import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

import { supabaseUrl } from "./env"

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

/** Creating and deleting login accounts needs the service-role key (server-only, never NEXT_PUBLIC). */
export const isServiceRoleConfigured = Boolean(supabaseUrl && serviceRoleKey)

/** Bypasses RLS — use only after requireAdmin(), and only for auth user management. */
export function createServiceClient() {
  if (!isServiceRoleConfigured) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
