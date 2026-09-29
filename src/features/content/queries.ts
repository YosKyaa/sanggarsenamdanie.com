import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS, type CacheTag } from "@/lib/cache"
import { defaultFaqs, defaultPillars, defaultRentalUses, defaultStats } from "@/lib/content/defaults"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { BrandPillarRow, FaqRow, RentalUseRow, StatRow } from "@/types/database"

type ListTable = "faqs" | "stats" | "brand_pillars" | "rental_uses"

/** Active rows of a simple ordered content table, with defaults when Supabase is off. */
function orderedList<Row>(table: ListTable, tag: CacheTag, fallback: Row[]) {
  return unstable_cache(
    async (): Promise<Row[]> => {
      if (!isSupabaseConfigured) return fallback

      const { data, error } = await getPublicClient()
        .from(table)
        .select("*")
        .eq("is_active", true)
        .order("sort_order")

      if (error) {
        console.error(`[${table}] query failed:`, error.message)
        return fallback
      }
      return data as Row[]
    },
    [`${table}:list`],
    { tags: [tag], revalidate: PUBLIC_REVALIDATE_SECONDS },
  )
}

export const getFaqs = orderedList<FaqRow>("faqs", cacheTags.faqs, defaultFaqs)
export const getStats = orderedList<StatRow>("stats", cacheTags.stats, defaultStats)
export const getPillars = orderedList<BrandPillarRow>("brand_pillars", cacheTags.pillars, defaultPillars)
export const getRentalUses = orderedList<RentalUseRow>("rental_uses", cacheTags.rentalUses, defaultRentalUses)
