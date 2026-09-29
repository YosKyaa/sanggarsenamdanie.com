import { Container, Section } from "@/components/atoms/layout"
import { CertificateCard } from "@/components/molecules/certificate-card"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { getCertificates } from "@/features/certificates/queries"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = pageMetadata({
  title: "Sertifikat Instruktur",
  description:
    "Sertifikasi instruktur Sanggar Senam Danie: ZIN (Zumba Instructor Network), Aerobic, Yoga, Aero Boxing, dan Senam Jantung Sehat.",
  path: "/sertifikat",
})

export default async function CertificatePage() {
  const settings = await getSettings()
  const certificates = await getCertificates()

  return (
    <>
      <PageHero
        eyebrow="Sertifikat"
        title="Sertifikasi yang Menjadi Dasar Setiap Kelas"
        description="Kami percaya latihan yang baik dimulai dari instruktur yang terlatih. Berikut sertifikasi resmi yang dimiliki instruktur kami."
        breadcrumbs={[{ name: "Sertifikat", path: "/sertifikat" }]}
      />
      <Section aria-label="Daftar sertifikat">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <li key={certificate.id}>
                <CertificateCard certificate={certificate} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaSection whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.join)} />
    </>
  )
}
