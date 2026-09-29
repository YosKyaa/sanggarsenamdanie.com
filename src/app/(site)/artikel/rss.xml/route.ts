import { getArticles } from "@/features/articles/queries"
import { site } from "@/lib/content/site"

export const revalidate = 3600

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** RSS feed so readers and aggregators pick up new articles. */
export async function GET() {
  const articles = await getArticles()
  const items = articles
    .map((article) => {
      const url = `${site.url}/artikel/${article.slug}`
      return `<item>
  <title>${escape(article.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escape(article.excerpt)}</description>
  <pubDate>${new Date(article.published_at ?? article.created_at).toUTCString()}</pubDate>
</item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escape(`Artikel ${site.name}`)}</title>
  <link>${site.url}/artikel</link>
  <description>${escape("Tips senam, kebugaran, dan gaya hidup sehat dari Sanggar Senam Danie, Depok.")}</description>
  <language>id</language>
${items}
</channel>
</rss>`

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
