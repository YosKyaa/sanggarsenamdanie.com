import { getArticleBySlug, getArticles } from "@/features/articles/queries"
import { site } from "@/lib/content/site"
import { ogContentType, ogSize, renderOg, splitTitle } from "@/lib/seo/og"

export const alt = `Artikel ${site.name}`
export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export default async function ArticleOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  return renderOg({
    eyebrow: "Artikel · Tips Sehat",
    lines: splitTitle(article?.title ?? site.name),
    footer: "sanggar senam depok",
  })
}
