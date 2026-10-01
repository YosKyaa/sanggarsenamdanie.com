import "server-only"

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env"

/**
 * Which sign-in methods are switched on in the Supabase dashboard. The login
 * page only shows "Masuk dengan Google" once the provider is enabled there, so
 * the button never leads to a "provider is not enabled" error.
 */
export async function getAuthProviders(): Promise<{ google: boolean }> {
  if (!isSupabaseConfigured) return { google: false }
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: 300 },
    })
    if (!response.ok) return { google: false }
    const settings = (await response.json()) as { external?: Record<string, boolean> }
    return { google: settings.external?.google === true }
  } catch {
    return { google: false }
  }
}
