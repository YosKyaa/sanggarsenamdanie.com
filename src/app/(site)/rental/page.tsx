import { Container, Section } from "@/components/atoms/layout"
import { Heading } from "@/components/atoms/typography"
import { RentalForm } from "@/components/organisms/rental-form"
import { PageHero } from "@/components/sections/page-hero"
import { RentalSection } from "@/components/sections/rental-section"
import { Card } from "@/components/ui/card"
import { getRentalUses } from "@/features/content/queries"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = pageMetadata({
  title: "Sewa Studio Senam di Depok",
  description:
    "Sewa studio Sanggar Senam Danie di Tapos, Depok untuk kelas privat, gathering komunitas, wellness event, dan sesi latihan. Kirim permintaan sewa online.",
  path: "/rental",
  keywords: ["sewa studio senam depok", "sewa studio tapos", "tempat senam depok", "sanggar senam depok"],
})

export default async function RentalPage() {
  const [settings, uses] = await Promise.all([getSettings(), getRentalUses()])

  return (
    <>
      <PageHero
        eyebrow="Sewa Studio"
        title="Ruang Nyaman untuk Kegiatan Sehat Anda"
        description="Kelas privat, gathering komunitas, wellness event, atau sesi latihan tim — ceritakan kebutuhan Anda dan kami siapkan studionya."
        breadcrumbs={[{ name: "Sewa Studio", path: "/rental" }]}
      />
      <RentalSection settings={settings} uses={uses} showCta={false} />
      <Section tone="soft" aria-labelledby="rental-form-title">
        <Container className="max-w-3xl">
          <Card className="px-6 sm:px-10 sm:py-10">
            <Heading id="rental-form-title" size="title" className="mb-2 text-2xl">
              Formulir permintaan sewa
            </Heading>
            <p className="mb-6 text-sm text-ink-muted">
              Kami akan mengonfirmasi ketersediaan tanggal dan biaya sebelum pemesanan dianggap final.
            </p>
            <RentalForm
              whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.rental)}
              responseTime={settings.responseTime}
            />
          </Card>
        </Container>
      </Section>
    </>
  )
}
