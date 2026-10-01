import "server-only"

import { site } from "@/lib/content/site"

/**
 * IndexNow ownership key. Not a secret — it's served publicly at /indexnow.txt
 * so Bing, Yandex, Naver and Seznam can verify that pings come from this site.
 */
export const INDEXNOW_KEY = "2aa2354edb643f05fffd06213331f5ba"

/** Pages whose content each admin resource feeds, for IndexNow pings after an edit. */
export function pathsForResource(key: string, record: Record<string, unknown>): string[] {
  const slug = typeof record.slug === "string" ? record.slug : null
  switch (key) {
    case "programs":
      return ["/", "/program", ...(slug ? [`/program/${slug}`] : [])]
    case "schedules":
      return ["/program"]
    case "articles":
      return record.is_published ? ["/", "/artikel", ...(slug ? [`/artikel/${slug}`] : [])] : []
    case "gallery":
      return ["/galeri"]
    case "faqs":
      return ["/", "/contact"]
    case "instructors":
    case "certificates":
      return ["/about", "/instructor", "/sertifikat"]
    case "rentalUses":
      return ["/", "/rental"]
    case "settings":
      return ["/", "/about", "/contact"]
    case "testimonials":
    case "stats":
    case "pillars":
      return ["/"]
    default:
      return []
  }
}

/**
 * Tells IndexNow engines (Bing feeds ChatGPT search and Copilot) that pages
 * changed, so they're recrawled in minutes instead of days. Production only;
 * failures are logged and never affect the admin action.
 */
export async function pingIndexNow(paths: string[]) {
  if (paths.length === 0 || process.env.VERCEL_ENV !== "production" || !site.url.startsWith("https://")) return

  const host = new URL(site.url).host
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${site.url}/indexnow.txt`,
        urlList: [...new Set(paths)].map((path) => `${site.url}${path === "/" ? "" : path}`),
      }),
    })
    if (!response.ok && response.status !== 202) console.error(`[indexnow] ping failed: ${response.status}`)
  } catch (error) {
    console.error("[indexnow] ping failed:", error)
  }
}
