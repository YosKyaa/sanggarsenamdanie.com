import { Camera } from "lucide-react"

import { JsonLd } from "@/components/atoms/json-ld"
import { Container, Section } from "@/components/atoms/layout"
import { Heading, Text } from "@/components/atoms/typography"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { GalleryGrid } from "@/components/organisms/gallery-grid"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { getGalleryPhotos } from "@/features/gallery/queries"
import { getSettings } from "@/features/settings/queries"
import { galleryJsonLd } from "@/lib/seo/jsonld"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = pageMetadata({
  title: "Galeri Kegiatan",
  description:
    "Foto kegiatan Sanggar Senam Danie di Tapos, Depok: suasana kelas Aerobic, Zumba, Yoga, senam air, event, dan komunitas peserta.",
  path: "/galeri",
})

export default async function GalleryPage() {
  const [settings, photos] = await Promise.all([getSettings(), getGalleryPhotos()])
  const joinHref = whatsappLink(settings.whatsapp, whatsappMessages.join)

  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Suasana Kegiatan di Sanggar"
        description="Momen kelas, event, dan kebersamaan peserta Sanggar Senam Danie — lihat sendiri serunya bergerak bersama."
        breadcrumbs={[{ name: "Galeri", path: "/galeri" }]}
      />

      <Section aria-label="Foto kegiatan">
        <Container>
          {photos.length > 0 ? (
            <GalleryGrid photos={photos} />
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
              <span aria-hidden className="grid size-16 place-items-center rounded-full bg-brand-100 text-brand-700">
                <Camera className="size-7" />
              </span>
              <Heading as="h2" size="title">
                Foto kegiatan segera hadir
              </Heading>
              <Text>Sambil menunggu, tanyakan jadwal kelas terdekat dan rasakan sendiri suasananya.</Text>
              <WhatsAppButton href={joinHref}>Tanya Jadwal</WhatsAppButton>
            </div>
          )}
        </Container>
      </Section>

      <CtaSection whatsappHref={joinHref} />
      {photos.length > 0 ? <JsonLd data={galleryJsonLd(photos)} /> : null}
    </>
  )
}
