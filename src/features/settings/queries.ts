import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { defaultSettingsRow } from "@/lib/content/defaults"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { SiteSettingsRow } from "@/types/database"

import { toSiteSettings, type SiteSettings } from "./types"

const getSettingsRow = unstable_cache(
  async (): Promise<SiteSettingsRow> => {
    if (!isSupabaseConfigured) return defaultSettingsRow

    const { data, error } = await getPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle()
    if (error) console.error("[settings] query failed:", error.message)
    return data ?? defaultSettingsRow
  },
  ["settings:row"],
  { tags: [cacheTags.settings], revalidate: PUBLIC_REVALIDATE_SECONDS },
)

/** Editable site settings (contact, address, founder, copy) — admin-managed, cached. */
export async function getSettings(): Promise<SiteSettings> {
  return toSiteSettings(await getSettingsRow())
}
