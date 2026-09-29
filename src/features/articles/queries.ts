import "server-only"

import { unstable_cache } from "next/cache"

import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { fallbackArticles } from "@/lib/content/articles"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import type { ArticleRow } from "@/types/database"

/** Published articles, newest first. */
export const getArticles = unstable_cache(
  async (): Promise<ArticleRow[]> => {
    if (!isSupabaseConfigured) return fallbackArticles

    const { data, error } = await getPublicClient()
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("[articles] query failed:", error.message)
      return []
    }
    return data
  },
  ["articles:list"],
  { tags: [cacheTags.articles], revalidate: PUBLIC_REVALIDATE_SECONDS },
)

export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const articles = await getArticles()
  return articles.find((article) => article.slug === slug) ?? null
}

export async function getArticlesForProgram(programId: string, limit = 3): Promise<ArticleRow[]> {
  const articles = await getArticles()
  return articles.filter((article) => article.program_id === programId).slice(0, limit)
}
