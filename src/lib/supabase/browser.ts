"use client"

import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/types/database"

import { supabaseAnonKey, supabaseUrl } from "./env"

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/** Signed-in client in the browser (reads the admin session cookie) — used for direct Storage uploads. */
export function getBrowserClient() {
  client ??= createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}
