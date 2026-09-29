import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

import { supabaseAnonKey, supabaseUrl } from "./env"

let client: SupabaseClient<Database> | null = null

/**
 * Cookie-less anon client for public reads. Because it never touches request
 * cookies, pages using it stay static and can be cached with revalidation tags.
 */
export function getPublicClient() {
  client ??= createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
