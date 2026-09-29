import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { InstructorCard } from "@/components/molecules/instructor-card"
import { SectionHeader } from "@/components/molecules/section-header"
import type { InstructorRow } from "@/types/database"

export function InstructorSection({ instructors }: { instructors: InstructorRow[] }) {
  if (instructors.length === 0) return null
  const single = instructors.length === 1

  return (
    <Section tone="soft" aria-labelledby="instructor-title">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeader
          id="instructor-title"
          eyebrow="Tim Kami"
          title="Instruktur Profesional"
          description="Dibimbing langsung oleh instruktur berpengalaman yang memahami kebutuhan setiap peserta."
        />
        {single ? (
          <Reveal>
            <InstructorCard instructor={instructors[0]} layout="wide" />
          </Reveal>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <Reveal as="li" key={instructor.id}>
                <InstructorCard instructor={instructor} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}
