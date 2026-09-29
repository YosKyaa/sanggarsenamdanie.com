import { ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { BrandWatermark } from "@/components/atoms/logo"
import { Heading, Text } from "@/components/atoms/typography"
import { formatDate, readingMinutes } from "@/lib/utils/format"
import type { ArticleRow } from "@/types/database"

type ArticleCardProps = {
  article: ArticleRow
  headingLevel?: "h2" | "h3"
}

/** Whole card is one link (stretched from the title) for a single tab stop. */
export function ArticleCard({ article, headingLevel = "h3" }: ArticleCardProps) {
  const date = article.published_at ?? article.created_at

  return (
    <article className="spotlight group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-600">
        {article.cover_image_url ? (
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BrandWatermark className="right-4 -bottom-6 h-40 text-white/15 transition-transform duration-500 group-hover:-translate-y-1" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="flex items-center gap-3 text-xs font-semibold text-ink-muted">
          <time dateTime={date}>{formatDate(date)}</time>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {readingMinutes(article.content)} menit baca
          </span>
        </p>
        <Heading as={headingLevel} size="subtitle" className="text-balance">
          <Link
            href={`/artikel/${article.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </Heading>
        <Text size="small" className="flex-1">
          {article.excerpt}
        </Text>
        <span aria-hidden className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Baca artikel
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
