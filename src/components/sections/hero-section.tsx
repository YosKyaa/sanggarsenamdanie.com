import { Award } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import { Parallax, Rise } from "@/components/atoms/scroll-effects"
import { Container } from "@/components/atoms/layout"
import { BrandWatermark } from "@/components/atoms/logo"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { GlassChip } from "@/components/molecules/glass-chip"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { Portrait } from "@/components/molecules/portrait"
import type { SiteSettings } from "@/features/settings/types"

/** Soft rings plus the oversized brand figure on the purple panel. */
function PanelShapes() {
  return (
    <>
      <BrandWatermark className="-right-[12%] bottom-[-6%] h-[78%] text-white/[0.09]" />
      <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 800">
        <circle cx="520" cy="120" r="180" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
        <circle cx="520" cy="120" r="110" fill="white" fillOpacity="0.06" />
        <circle cx="80" cy="640" r="220" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
        <circle cx="300" cy="420" r="3" fill="white" fillOpacity="0.5" />
        <circle cx="420" cy="560" r="2" fill="white" fillOpacity="0.4" />
      </svg>
    </>
  )
}

type HeroSectionProps = {
  settings: SiteSettings
  founderPhoto: string | null
  whatsappHref: string
}

/**
 * Kept deliberately sparse: headline, one line of copy, two actions and Danie.
 * Numbers live in the stats card that overlaps the hero's bottom edge.
 */
export function HeroSection({ settings, founderPhoto, whatsappHref }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#faf9ff_0%,#ffffff_100%)]">
      {/* Slow-drifting lavender light behind the copy. */}
      <span aria-hidden className="pointer-events-none absolute top-24 -left-32 size-96 rounded-full bg-brand-200/50 blur-3xl motion-safe:animate-blob" />
      <span aria-hidden className="pointer-events-none absolute bottom-10 left-1/3 size-72 rounded-full bg-brand-100/80 blur-3xl motion-safe:animate-blob motion-safe:[animation-delay:-9s]" />

      {/* Desktop: purple panel bleeding off the right edge, as in the reference. */}
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[40%] overflow-hidden bg-brand-500 lg:block">
        <Parallax distance={-70} className="absolute inset-0">
          <PanelShapes />
        </Parallax>
      </div>

      <Container className="relative grid items-center gap-10 pt-28 pb-40 sm:pt-32 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8 lg:pt-36 lg:pb-48">
        <Rise className="flex flex-col items-start gap-7">
          <Eyebrow>{settings.tagline}</Eyebrow>
          <Heading as="h1" id="hero-title" size="display" className="max-w-xl">
            Sehat, Aktif, dan Bahagia{" "}
            {/* Brand lockup: the studio name is the last thing read in the headline. */}
            <span className="mt-2 block text-[0.6em] leading-tight tracking-[-0.01em] text-brand-700">
              Bersama Sanggar Senam Danie
            </span>
          </Heading>
          <Text size="lead" className="max-w-lg">
            {settings.heroDescription}
          </Text>
          <div className="flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            <WhatsAppButton href={whatsappHref} size="lg" className="shine">
              Gabung via WhatsApp
            </WhatsAppButton>
            <ButtonLink href="#program" size="lg" variant="outline" className="bg-white/70">
              Lihat Program
            </ButtonLink>
          </div>
        </Rise>

        <Rise delay={0.15} className="relative mx-auto w-full max-w-md lg:mr-0 lg:max-w-[440px]">
          {/* Mobile/tablet: the panel becomes a rounded card behind the photo. */}
          <div aria-hidden className="absolute top-8 -right-2 -bottom-4 left-10 overflow-hidden rounded-[32px] bg-brand-500 sm:-right-6 lg:hidden">
            <PanelShapes />
          </div>
          <Parallax distance={24}>
            <Portrait
              src={founderPhoto}
              alt={`${settings.founder.name}, ${settings.founder.title}`}
              sizes="(min-width: 1024px) 440px, (min-width: 448px) 448px, 100vw"
              priority
              placeholderLabel="Foto Danie"
              className="relative mr-6 aspect-[4/5] rounded-[32px] shadow-lift ring-8 ring-white/60 lg:mr-0"
            />
          </Parallax>

          <GlassChip
            icon={Award}
            title={settings.founder.name}
            subtitle="Founder & ZIN Instructor"
            className="absolute -bottom-5 left-4 motion-safe:animate-float motion-safe:[animation-delay:-1.5s] sm:left-[-1.5rem]"
          />
        </Rise>
      </Container>
    </section>
  )
}
