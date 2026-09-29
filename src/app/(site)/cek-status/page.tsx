import { Container, Section } from "@/components/atoms/layout"
import { StatusCheckForm } from "@/components/organisms/status-check-form"
import { PageHero } from "@/components/sections/page-hero"
import { Card } from "@/components/ui/card"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = {
  ...pageMetadata({
    title: "Cek Status Sewa Studio",
    description: "Pantau status permintaan sewa studio Sanggar Senam Danie.",
    path: "/cek-status",
  }),
  robots: { index: false, follow: true },
}

export default async function StatusPage() {
  const settings = await getSettings()
  return (
    <>
      <PageHero
        eyebrow="Cek Status"
        title="Pantau Permintaan Sewa Anda"
        description="Masukkan kode permintaan (dimulai dengan SSD-) dan nomor WhatsApp yang Anda gunakan saat mengirim permintaan sewa."
        breadcrumbs={[{ name: "Cek Status", path: "/cek-status" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <Card className="px-6 sm:px-10 sm:py-10">
            <StatusCheckForm whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.general)} />
          </Card>
        </Container>
      </Section>
    </>
  )
}
