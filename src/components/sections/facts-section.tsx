import Link from "next/link"

import { Container, Section } from "@/components/atoms/layout"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import type { StudioFact } from "@/lib/seo/facts"
import { site } from "@/lib/content/site"

type FactsSectionProps = {
  definition: string
  facts: StudioFact[]
  tone?: "default" | "soft"
}

/**
 * "Sekilas" block: a quotable one-paragraph definition plus a plain fact table.
 * Written for people skimming and for AI answer engines that cite short facts.
 */
export function FactsSection({ definition, facts, tone = "soft" }: FactsSectionProps) {
  return (
    <Section tone={tone} aria-labelledby="facts-title">
      <Container className="flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Eyebrow>Sekilas</Eyebrow>
          <Heading id="facts-title">Apa itu {site.name}?</Heading>
          <Text size="lead">{definition}</Text>
        </div>
        <dl className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6 sm:px-6">
              <dt className="text-sm font-semibold text-ink-muted">{fact.label}</dt>
              <dd className="text-ink">
                {fact.href ? (
                  <Link
                    href={fact.href}
                    {...(fact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-medium text-brand-700 underline-offset-4 hover:underline"
                  >
                    {fact.value}
                  </Link>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
