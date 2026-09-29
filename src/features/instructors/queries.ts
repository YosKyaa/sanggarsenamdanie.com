import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { fallbackInstructors } from "@/lib/content/fallback"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { InstructorRow } from "@/types/database"

export const getInstructors = unstable_cache(
  async (): Promise<InstructorRow[]> => {
    if (!isSupabaseConfigured) return fallbackInstructors

    const { data, error } = await getPublicClient()
      .from("instructors")
      .select("*")
      .eq("is_active", true)
      .order("is_founder", { ascending: false })
      .order("sort_order")

    if (error) {
      console.error("[instructors] query failed:", error.message)
      return fallbackInstructors
    }
    return data
  },
  ["instructors:list"],
  { tags: [cacheTags.instructors], revalidate: PUBLIC_REVALIDATE_SECONDS },
)

export async function getFounder(): Promise<InstructorRow> {
  const instructors = await getInstructors()
  return instructors.find((i) => i.is_founder) ?? fallbackInstructors[0]
}
