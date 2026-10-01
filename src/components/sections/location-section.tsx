import { MapPin, Navigation } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { OpeningHours } from "@/components/molecules/opening-hours"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import { mapLinks } from "@/lib/utils/maps"

export function LocationSection({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  const { embedSrc, directionsHref } = mapLinks(settings)

  return (
    <Section aria-labelledby="location-title">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="flex flex-col justify-center gap-6">
          <Eyebrow>Lokasi</Eyebrow>
          <Heading id="location-title">
            Temukan Kami di {settings.address.district}, {settings.address.city}
          </Heading>
          <address className="flex gap-4 rounded-[20px] border border-line bg-white p-5 not-italic shadow-soft">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
              <MapPin className="size-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-bold text-ink">{site.name}</span>
              <span className="text-ink-muted">
                {settings.address.street}, {settings.address.district},<br />
                {settings.address.city}, {settings.address.region} {settings.address.postalCode}
              </span>
            </span>
          </address>
          <OpeningHours entries={settings.openingHours} />
          <Text size="small">Lokasi kelas air (Aquarobic & Aquayoga) tercantum pada jadwal masing-masing kelas.</Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={directionsHref} external>
              <Navigation aria-hidden />
              Petunjuk Arah
            </ButtonLink>
            <WhatsAppButton href={whatsappHref} variant="outline">
              Tanya Lokasi
            </WhatsAppButton>
          </div>
        </div>

        <div className="reveal-scale overflow-hidden rounded-[var(--radius-card)] border border-line bg-brand-50 shadow-soft">
          <iframe
            title={`Peta lokasi ${site.name}`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] h-full min-h-80 w-full border-0 lg:aspect-auto lg:min-h-[440px]"
          />
        </div>
      </Container>
    </Section>
  )
}
