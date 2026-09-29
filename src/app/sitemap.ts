import type { MetadataRoute } from "next"

import { getArticles } from "@/features/articles/queries"
import { getPrograms } from "@/features/programs/queries"
import { site } from "@/lib/content/site"

/**
 * Last real content change of the hand-written pages. Update when their copy
 * changes, so search engines aren't told every page changed on every deploy.
 */
const STATIC_PAGES_UPDATED = new Date("2026-09-28")

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/program", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/artikel", priority: 0.7, changeFrequency: "weekly" },
  { path: "/instructor", priority: 0.6, changeFrequency: "monthly" },
  { path: "/rental", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sertifikat", priority: 0.5, changeFrequency: "monthly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, articles] = await Promise.all([getPrograms(), getArticles()])

  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: `${site.url}${path}`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency,
      priority,
    })),
    ...programs.map((program) => ({
      url: `${site.url}/program/${program.slug}`,
      lastModified: new Date(program.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${site.url}/artikel/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
