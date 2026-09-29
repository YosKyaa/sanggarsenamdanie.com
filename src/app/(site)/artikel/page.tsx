import { Container, Section } from "@/components/atoms/layout"
import { ArticleCard } from "@/components/molecules/article-card"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { getArticles } from "@/features/articles/queries"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = {
  ...pageMetadata({
    title: "Artikel & Tips Senam",
    description:
      "Tips senam, kebugaran, dan gaya hidup sehat dari Sanggar Senam Danie Depok: panduan Zumba untuk pemula, manfaat senam aerobic, hingga olahraga di air.",
    path: "/artikel",
    keywords: ["tips senam", "senam untuk pemula", "manfaat senam aerobik", "zumba pemula", "senam depok"],
  }),
  alternates: {
    canonical: "/artikel",
    types: { "application/rss+xml": "/artikel/rss.xml" },
  },
}

export default async function ArticlesPage() {
  const settings = await getSettings()
  const articles = await getArticles()

  return (
    <>
      <PageHero
        eyebrow="Artikel"
        title="Tips Sehat dari Sanggar Senam Danie"
        description="Panduan praktis seputar senam, kebugaran, dan gaya hidup aktif — ditulis agar mudah dipraktikkan siapa saja."
        breadcrumbs={[{ name: "Artikel", path: "/artikel" }]}
      />
      <Section aria-label="Daftar artikel">
        <Container>
          {articles.length === 0 ? (
            <p className="text-center text-ink-muted">Artikel baru segera hadir.</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} headingLevel="h2" />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <CtaSection whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.join)} />
    </>
  )
}
