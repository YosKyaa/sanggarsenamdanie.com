import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { GalleryPhotoRow } from "@/types/database"

/** Visible gallery photos, newest activity first. Empty until photos are uploaded. */
export const getGalleryPhotos = unstable_cache(
  async (): Promise<GalleryPhotoRow[]> => {
    if (!isSupabaseConfigured) return []

    const { data, error } = await getPublicClient()
      .from("gallery_photos")
      .select("*")
      .eq("is_active", true)
      .order("taken_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[gallery_photos] query failed:", error.message)
      return []
    }
    return data
  },
  ["gallery_photos:list"],
  { tags: [cacheTags.gallery], revalidate: PUBLIC_REVALIDATE_SECONDS },
)
