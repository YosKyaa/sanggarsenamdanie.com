import { MapPin, Navigation } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { BrandWatermark } from "@/components/atoms/logo"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { OpeningHours } from "@/components/molecules/opening-hours"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import { mapLinks } from "@/lib/utils/maps"

/**
 * Closing block of the home page: where to come and how to start, in one place.
 * Merges the former location and final-CTA sections.
 */
export function VisitSection({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  const { embedSrc, directionsHref } = mapLinks(settings)
  const { address } = settings

  return (
    <Section aria-labelledby="visit-title">
      <Container>
        <div className="on-dark reveal-scale relative grid overflow-hidden rounded-[32px] bg-brand-700 text-white lg:grid-cols-2">
          <span aria-hidden className="absolute -top-24 -left-24 size-72 rounded-full border-2 border-dashed border-white/15 motion-safe:animate-spin-slow" />
          <BrandWatermark className="bottom-[-3rem] left-[38%] hidden h-64 text-white/[0.07] lg:block" />

          <div className="relative flex flex-col gap-7 px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <Eyebrow tone="inverse">Kunjungi Kami</Eyebrow>
            <Heading id="visit-title" className="text-white">
              Mulai Senam di {address.district}, {address.city}
            </Heading>
            <Text size="lead" tone="inverse">
              Coba satu kelas dulu dan rasakan suasananya. Chat kami untuk memilih kelas dan jadwal yang paling cocok.
            </Text>

            <address className="flex flex-col gap-4 not-italic">
              <p className="flex gap-3 text-sm text-white/90">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-white/80" />
                <span>
                  <span className="block font-semibold text-white">{site.name}</span>
                  {address.street}, Kec. {address.district}, {address.city}, {address.region} {address.postalCode}
                </span>
              </p>
              <OpeningHours entries={settings.openingHours} tone="inverse" />
            </address>

            <div className="flex w-full flex-col gap-3 pt-1 xs:w-auto xs:flex-row">
              <WhatsAppButton href={whatsappHref} size="lg" variant="inverse" className="shine">
                Gabung via WhatsApp
              </WhatsAppButton>
              <ButtonLink
                href={directionsHref}
                external
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                <Navigation aria-hidden />
                Petunjuk Arah
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-80 bg-brand-50 lg:min-h-full">
            <iframe
              title={`Peta lokasi ${site.name}`}
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
