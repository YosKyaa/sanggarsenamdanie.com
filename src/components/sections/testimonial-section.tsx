import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { SectionHeader } from "@/components/molecules/section-header"
import { TestimonialCard } from "@/components/molecules/testimonial-card"
import type { TestimonialRow } from "@/types/database"

/** Hidden entirely until real, admin-approved testimonials exist. */
export function TestimonialSection({ testimonials }: { testimonials: TestimonialRow[] }) {
  if (testimonials.length === 0) return null

  return (
    <Section tone="soft" aria-labelledby="testimonial-title">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeader
          id="testimonial-title"
          eyebrow="Cerita Peserta"
          title="Apa Kata Mereka"
          description="Pengalaman peserta yang sudah berlatih bersama kami."
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => (
            <Reveal as="li" key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
