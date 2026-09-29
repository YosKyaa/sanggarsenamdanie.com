export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/**
 * The public site runs on bundled fallback content until Supabase is configured,
 * so a fresh clone renders without any backend.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
