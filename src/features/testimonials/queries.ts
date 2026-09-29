import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { developmentTestimonials } from "@/lib/content/fallback"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { TestimonialRow } from "@/types/database"

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialRow[]> => {
    if (!isSupabaseConfigured) return developmentTestimonials

    const { data, error } = await getPublicClient()
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(12)

    if (error) {
      console.error("[testimonials] query failed:", error.message)
      return []
    }
    return data
  },
  ["testimonials:list"],
  { tags: [cacheTags.testimonials], revalidate: PUBLIC_REVALIDATE_SECONDS },
)
