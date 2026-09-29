import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { ArticleCard } from "@/components/molecules/article-card"
import { SectionHeader } from "@/components/molecules/section-header"
import type { ArticleRow } from "@/types/database"

type ArticleSectionProps = {
  articles: ArticleRow[]
  title?: string
  eyebrow?: string
  tone?: "default" | "soft"
  showAllLink?: boolean
}

export function ArticleSection({
  articles,
  title = "Tips Sehat dari Sanggar",
  eyebrow = "Artikel",
  tone = "default",
  showAllLink = true,
}: ArticleSectionProps) {
  if (articles.length === 0) return null

  return (
    <Section tone={tone} aria-labelledby="articles-title">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeader
          id="articles-title"
          eyebrow={eyebrow}
          title={title}
          description="Panduan praktis seputar senam, kebugaran, dan gaya hidup aktif."
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <Reveal as="li" key={article.id}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
        {showAllLink ? (
          <div className="flex justify-center">
            <ButtonLink href="/artikel" variant="outline">
              Lihat semua artikel
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
