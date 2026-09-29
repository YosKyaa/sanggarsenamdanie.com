import { Container, Section } from "@/components/atoms/layout"
import { SectionHeader } from "@/components/molecules/section-header"
import { CertificateCarousel } from "@/components/organisms/certificate-carousel"
import type { CertificateRow } from "@/types/database"

export function CertificateSection({ certificates }: { certificates: CertificateRow[] }) {
  if (certificates.length === 0) return null

  return (
    <Section aria-labelledby="certificate-title">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeader
          id="certificate-title"
          eyebrow="Sertifikasi"
          title="Kompetensi yang Bisa Anda Percaya"
          description="Sertifikasi resmi yang menjadi dasar setiap kelas: aman, terarah, dan sesuai standar instruktur."
        />
        <CertificateCarousel certificates={certificates} />
      </Container>
    </Section>
  )
}
