import { Container, Section } from "@/components/atoms/layout"
import { InstructorCard } from "@/components/molecules/instructor-card"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { getInstructors } from "@/features/instructors/queries"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = pageMetadata({
  title: "Instruktur",
  description:
    "Kenali instruktur Sanggar Senam Danie di Depok: bersertifikat ZIN, Aerobic, Yoga, Aero Boxing, dan Senam Jantung Sehat.",
  path: "/instructor",
})

export default async function InstructorPage() {
  const settings = await getSettings()
  const instructors = await getInstructors()
  const single = instructors.length === 1

  return (
    <>
      <PageHero
        eyebrow="Instruktur"
        title="Instruktur Profesional & Bersertifikat"
        description="Setiap kelas dipandu instruktur yang terlatih secara resmi dan terbiasa membimbing peserta dari berbagai usia dan kemampuan."
        breadcrumbs={[{ name: "Instruktur", path: "/instructor" }]}
      />
      <Section aria-label="Daftar instruktur">
        <Container>
          {single ? (
            <InstructorCard instructor={instructors[0]} layout="wide" headingLevel="h2" />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((instructor) => (
                <li key={instructor.id}>
                  <InstructorCard instructor={instructor} headingLevel="h2" />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <CtaSection whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.join)} />
    </>
  )
}
