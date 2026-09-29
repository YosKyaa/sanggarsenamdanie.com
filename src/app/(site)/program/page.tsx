import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { ProgramCard } from "@/components/molecules/program-card"
import { SectionHeader } from "@/components/molecules/section-header"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { ScheduleBoard } from "@/components/organisms/schedule-board"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { getPrograms } from "@/features/programs/queries"
import { getSchedule } from "@/features/schedule/queries"
import { getSettings } from "@/features/settings/queries"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata = pageMetadata({
  title: "Program & Jadwal Kelas",
  description:
    "Kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga di Depok bersama instruktur bersertifikasi. Lihat detail program dan jadwal mingguan Sanggar Senam Danie.",
  path: "/program",
})

export default async function ProgramPage() {
  const settings = await getSettings()
  const [programs, schedule] = await Promise.all([getPrograms(), getSchedule()])

  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Pilih Kelas yang Sesuai dengan Anda"
        description="Dari kardio yang energik hingga latihan air yang ramah sendi — semua kelas dipandu instruktur bersertifikasi dan bisa diikuti pemula."
        breadcrumbs={[{ name: "Program", path: "/program" }]}
        actions={
          <>
            <WhatsAppButton href={whatsappLink(settings.whatsapp, whatsappMessages.join)} size="lg" className="shine">
              Gabung via WhatsApp
            </WhatsAppButton>
            <ButtonLink href="#jadwal" size="lg" variant="outline">
              Lihat Jadwal
            </ButtonLink>
          </>
        }
      />

      <Section aria-label="Daftar program">
        <Container>
          <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <li key={program.id}>
                <ProgramCard program={program} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="jadwal" tone="soft" aria-labelledby="jadwal-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            id="jadwal-title"
            eyebrow="Jadwal"
            title="Jadwal Kelas Mingguan"
            description="Pilih hari untuk melihat kelas yang tersedia. Jadwal dapat berubah — konfirmasi via WhatsApp sebelum datang."
          />
          <ScheduleBoard entries={schedule} whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.schedule)} />
        </Container>
      </Section>

      <div className="pt-16 lg:pt-[100px]">
        <CtaSection whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.join)} />
      </div>
    </>
  )
}
