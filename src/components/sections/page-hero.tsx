import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { JsonLd } from "@/components/atoms/json-ld"
import { Container } from "@/components/atoms/layout"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { breadcrumbJsonLd } from "@/lib/seo/jsonld"

type Crumb = { name: string; path: string }

type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  /** Trail after "Home"; the last item is the current page. */
  breadcrumbs: Crumb[]
  actions?: ReactNode
}

export function PageHero({ eyebrow, title, description, breadcrumbs, actions }: PageHeroProps) {
  const trail = [{ name: "Home", path: "/" }, ...breadcrumbs]

  return (
    <section className="relative overflow-hidden bg-surface-soft pt-32 pb-14 lg:pt-40 lg:pb-20">
      <span aria-hidden className="absolute -top-32 -right-24 size-96 rounded-full bg-brand-100/70" />
      <span aria-hidden className="absolute top-24 -right-10 size-40 rounded-full border border-brand-200" />
      <Container className="relative flex flex-col gap-5">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
            {trail.map((crumb, index) => {
              const last = index === trail.length - 1
              return (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="font-semibold text-ink">
                      {crumb.name}
                    </span>
                  ) : (
                    <>
                      <Link href={crumb.path} className="hover:text-brand-700 hover:underline">
                        {crumb.name}
                      </Link>
                      <ChevronRight aria-hidden className="size-3.5" />
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading as="h1" size="display" className="max-w-3xl">
          {title}
        </Heading>
        <Text size="lead" className="max-w-2xl">
          {description}
        </Text>
        {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
      </Container>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </section>
  )
}
