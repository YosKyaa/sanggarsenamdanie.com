import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { Heading, Text } from "@/components/atoms/typography"
import { ProgramCard } from "@/components/molecules/program-card"
import { SectionHeader } from "@/components/molecules/section-header"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import type { ProgramRow } from "@/types/database"

type ProgramSectionProps = {
  programs: ProgramRow[]
  whatsappHref: string
}

export function ProgramSection({ programs, whatsappHref }: ProgramSectionProps) {
  return (
    <Section id="program" tone="soft" aria-labelledby="program-title">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          id="program-title"
          eyebrow="Program Kami"
          title="Program Senam Kami"
          description="Lima kelas untuk berbagai tujuan dan kondisi tubuh — dari kardio yang energik hingga latihan air yang ramah sendi."
        />

        <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Reveal as="li" key={program.id}>
              <ProgramCard program={program} />
            </Reveal>
          ))}

          {/* Guidance card fills the grid (reference: "Explore More Services"). */}
          <Reveal as="li">
            <div className="relative mt-7 flex h-[calc(100%-1.75rem)] flex-col justify-between gap-6 on-dark spotlight spotlight-light overflow-hidden rounded-[var(--radius-card)] bg-brand-600 p-6 text-white shadow-brand">
              <span aria-hidden className="absolute -right-12 -bottom-12 size-40 rounded-full bg-white/10 motion-safe:animate-float-slow" />
              <div className="relative flex flex-col gap-2">
                <Heading as="h3" size="title" className="text-white">
                  Belum tahu mulai dari mana?
                </Heading>
                <Text tone="inverse" size="small">
                  Ceritakan tujuan dan kondisi Anda. Kami bantu pilihkan kelas yang paling cocok.
                </Text>
              </div>
              <WhatsAppButton href={whatsappHref} variant="inverse" className="relative self-start">
                Konsultasi via WhatsApp
              </WhatsAppButton>
            </div>
          </Reveal>
        </ul>

        <div className="flex justify-center">
          <ButtonLink href="/program" variant="outline">
            Lihat jadwal & detail program
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
