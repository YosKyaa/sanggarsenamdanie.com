import { ChevronDown } from "lucide-react"

import { JsonLd } from "@/components/atoms/json-ld"
import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { SectionHeader } from "@/components/molecules/section-header"
import { faqJsonLd } from "@/lib/seo/jsonld"
import type { FaqRow } from "@/types/database"

/**
 * Answers the questions people type into Google before joining. Native
 * <details> — keyboard and screen-reader friendly, and the answers stay in
 * the HTML for crawlers even when collapsed.
 */
export function FaqSection({ faqs, tone = "default" }: { faqs: FaqRow[]; tone?: "default" | "soft" }) {
  if (faqs.length === 0) return null

  return (
    <Section tone={tone} aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <SectionHeader
          id="faq-title"
          align="left"
          eyebrow="Tanya Jawab"
          title="Pertanyaan yang Sering Diajukan"
          description="Belum menemukan jawabannya? Tanyakan langsung lewat WhatsApp."
          className="lg:sticky lg:top-32 lg:self-start"
        />
        <ul className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <Reveal as="li" key={faq.id}>
              <details className="group rounded-[20px] border border-line bg-white shadow-soft open:border-brand-200 open:shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left text-base font-bold text-ink hover:text-brand-800 [&::-webkit-details-marker]:hidden">
                  <h3>{faq.question}</h3>
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 transition-transform duration-300 group-open:rotate-180"
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </summary>
                <p className="px-6 pb-6 leading-relaxed text-ink-muted">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </ul>
      </Container>
      <JsonLd data={faqJsonLd(faqs)} />
    </Section>
  )
}
