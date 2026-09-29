import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { fallbackPrograms } from "@/lib/content/fallback"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { ProgramRow } from "@/types/database"

export const getPrograms = unstable_cache(
  async (): Promise<ProgramRow[]> => {
    if (!isSupabaseConfigured) return fallbackPrograms

    const { data, error } = await getPublicClient()
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    if (error) {
      console.error("[programs] query failed:", error.message)
      return fallbackPrograms
    }
    return data
  },
  ["programs:list"],
  { tags: [cacheTags.programs], revalidate: PUBLIC_REVALIDATE_SECONDS },
)

export async function getProgramBySlug(slug: string): Promise<ProgramRow | null> {
  const programs = await getPrograms()
  return programs.find((program) => program.slug === slug) ?? null
}
