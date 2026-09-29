import { Dumbbell, HeartHandshake, Sparkles, UserRound, type LucideIcon } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { Parallax } from "@/components/atoms/scroll-effects"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { Portrait } from "@/components/molecules/portrait"
import type { SiteSettings } from "@/features/settings/types"
import type { RentalUseRow } from "@/types/database"

const icons: LucideIcon[] = [UserRound, HeartHandshake, Sparkles, Dumbbell]

type RentalSectionProps = {
  settings: SiteSettings
  uses: RentalUseRow[]
  /** Hide the "Booking Studio" link when the form is already on the page. */
  showCta?: boolean
}

export function RentalSection({ settings, uses, showCta = true }: RentalSectionProps) {
  return (
    <Section aria-labelledby="rental-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-6">
          <Eyebrow>Sewa Studio</Eyebrow>
          <Heading id="rental-title">
            Studio Untuk Aktivitas Anda
          </Heading>
          <Text size="lead">
            Ruang latihan yang bersih dan nyaman di Tapos, Depok — siap dipakai untuk kelas privat, kegiatan komunitas,
            hingga acara kesehatan.
          </Text>
          <ul className="grid gap-4 sm:grid-cols-2">
            {uses.map((use, index) => {
              const Icon = icons[index % icons.length]
              return (
                <li key={use.title} className="spotlight group relative flex gap-3 rounded-[20px] border border-line bg-white p-4 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-bold text-ink">{use.title}</span>
                    <span className="text-sm text-ink-muted">{use.description}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          {showCta ? (
            <ButtonLink href="/rental" size="lg" className="shine self-start">
              Booking Studio
            </ButtonLink>
          ) : null}
        </div>

        <Reveal className="relative">
          <div aria-hidden className="absolute -inset-4 -z-0 rounded-[32px] bg-brand-50 lg:-inset-6" />
          <Parallax distance={30}>
            <Portrait
              src={settings.photos.studio}
              alt="Ruang studio Sanggar Senam Danie"
              sizes="(min-width: 1024px) 560px, 100vw"
              placeholderLabel="Foto studio"
              className="relative aspect-[4/3] rounded-[var(--radius-card)] shadow-soft"
            />
          </Parallax>
        </Reveal>
      </Container>
    </Section>
  )
}
