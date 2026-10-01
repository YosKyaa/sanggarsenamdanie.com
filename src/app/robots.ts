import type { MetadataRoute } from "next"

import { site } from "@/lib/content/site"

const disallow = ["/admin", "/cek-status", "/api/"]

/**
 * AI search and assistant crawlers, named explicitly so the site stays
 * citable in ChatGPT, Perplexity, Claude, Gemini, Copilot and Apple answers
 * even if a host-level default ever starts blocking unnamed AI bots.
 */
const aiCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
  "CCBot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
