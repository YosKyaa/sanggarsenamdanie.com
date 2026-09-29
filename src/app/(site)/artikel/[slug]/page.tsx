import { ArrowRight, Clock } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/atoms/json-ld"
import { Container, Section } from "@/components/atoms/layout"
import { ProgramIcon } from "@/components/atoms/icon"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { Markdown } from "@/components/organisms/markdown"
import { ArticleSection } from "@/components/sections/article-section"
import { getArticleBySlug, getArticles } from "@/features/articles/queries"
import { getPrograms } from "@/features/programs/queries"
import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld"
import { formatDate, readingMinutes } from "@/lib/utils/format"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const path = `/artikel/${article.slug}`
  return {
    // Article titles are already descriptive; the brand suffix would push them past ~60 characters.
    title: { absolute: article.title },
    description: article.excerpt,
    alternates: { canonical: path },
    authors: [{ name: article.author_name }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: path,
      siteName: site.name,
      locale: site.locale,
      publishedTime: article.published_at ?? article.created_at,
      modifiedTime: article.updated_at,
      authors: [article.author_name],
      ...(article.cover_image_url ? { images: [{ url: article.cover_image_url }] } : {}),
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt },
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const settings = await getSettings()
  const { slug } = await params
  const [article, articles, programs] = await Promise.all([getArticleBySlug(slug), getArticles(), getPrograms()])
  if (!article) notFound()

  const date = article.published_at ?? article.created_at
  const program = programs.find((p) => p.id === article.program_id) ?? null
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3)
  const whatsappHref = whatsappLink(
    settings.whatsapp,
    program ? whatsappMessages.program(program.title) : whatsappMessages.join,
  )
  const trail = [
    { name: "Home", path: "/" },
    { name: "Artikel", path: "/artikel" },
    { name: article.title, path: `/artikel/${article.slug}` },
  ]

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-surface-soft pt-32 pb-12 lg:pt-40 lg:pb-16">
          <span aria-hidden className="absolute -top-32 -right-24 size-96 rounded-full bg-brand-100/70" />
          <Container className="relative flex max-w-3xl flex-col gap-5">
            <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
              <Link href="/artikel" className="hover:text-brand-700 hover:underline">
                ← Semua artikel
              </Link>
            </nav>
            <Eyebrow>Artikel</Eyebrow>
            <Heading as="h1" size="section" className="lg:text-[2.75rem]">
              {article.title}
            </Heading>
            <Text size="lead">{article.excerpt}</Text>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className="font-semibold text-ink">{article.author_name}</span>
              <span aria-hidden>·</span>
              <time dateTime={date}>{formatDate(date)}</time>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Clock aria-hidden className="size-4" />
                {readingMinutes(article.content)} menit baca
              </span>
            </p>
          </Container>
        </header>

        <Section className="pt-10 lg:pt-14">
          <Container className="grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              {article.cover_image_url ? (
                <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-brand-100">
                  <Image
                    src={article.cover_image_url}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 680px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <Markdown source={article.content} />
              <p className="mt-10 rounded-2xl bg-surface-soft p-5 text-sm leading-relaxed text-ink-muted ring-1 ring-line">
                Artikel ini berisi informasi umum dan bukan pengganti saran medis. Konsultasikan dengan dokter bila Anda
                memiliki kondisi kesehatan tertentu sebelum memulai olahraga baru.
              </p>
            </div>

            <aside aria-label="Mulai berlatih" className="lg:sticky lg:top-28 lg:self-start">
              <div className="on-dark flex flex-col gap-4 rounded-[var(--radius-card)] bg-brand-600 p-6 text-white shadow-brand">
                <p className="text-lg font-bold">Siap mencoba{program ? ` kelas ${program.title}` : ""}?</p>
                <p className="text-sm text-white/90">Tanya jadwal dan biaya langsung lewat WhatsApp.</p>
                <WhatsAppButton href={whatsappHref} variant="inverse" className="shine">
                  Chat via WhatsApp
                </WhatsAppButton>
                {program ? (
                  <Link
                    href={`/program/${program.slug}`}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-semibold hover:bg-white/15"
                  >
                    <span aria-hidden className="grid size-9 place-items-center rounded-full bg-white/15">
                      <ProgramIcon name={program.icon} className="size-4" />
                    </span>
                    Lihat kelas {program.title}
                    <ArrowRight aria-hidden className="ml-auto size-4" />
                  </Link>
                ) : null}
              </div>
            </aside>
          </Container>
        </Section>
      </article>

      <ArticleSection articles={related} eyebrow="Baca juga" title="Artikel Lainnya" tone="soft" />

      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  )
}
