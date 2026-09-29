import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { fallbackCertificates } from "@/lib/content/fallback"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { CertificateRow } from "@/types/database"

export const getCertificates = unstable_cache(
  async (): Promise<CertificateRow[]> => {
    if (!isSupabaseConfigured) return fallbackCertificates

    const { data, error } = await getPublicClient().from("certificates").select("*").order("sort_order")

    if (error) {
      console.error("[certificates] query failed:", error.message)
      return fallbackCertificates
    }
    return data
  },
  ["certificates:list"],
  { tags: [cacheTags.certificates], revalidate: PUBLIC_REVALIDATE_SECONDS },
)
