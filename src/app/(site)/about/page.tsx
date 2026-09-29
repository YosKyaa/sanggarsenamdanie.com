import { Award, HeartPulse, Users } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import { JsonLd } from "@/components/atoms/json-ld"
import { Container, Section } from "@/components/atoms/layout"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { CertificateCard } from "@/components/molecules/certificate-card"
import { FeatureItem } from "@/components/molecules/feature-item"
import { Portrait } from "@/components/molecules/portrait"
import { SectionHeader } from "@/components/molecules/section-header"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { BrandSection } from "@/components/sections/brand-section"
import { CtaSection } from "@/components/sections/cta-section"
import { PageHero } from "@/components/sections/page-hero"
import { StatsSection } from "@/components/sections/stats-section"
import { getCertificates } from "@/features/certificates/queries"
import { getPillars, getStats } from "@/features/content/queries"
import { getFounder } from "@/features/instructors/queries"
import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { founderJsonLd } from "@/lib/seo/jsonld"
import { pageMetadata } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export async function generateMetadata() {
  const { founder } = await getSettings()
  return pageMetadata({
    title: `Tentang ${founder.name}`,
    description: `Kenali ${founder.name}, pendiri ${site.name}: instruktur bersertifikat ZIN, Aerobic, dan Yoga dengan ${founder.experienceYears}+ tahun pengalaman${founder.roleLine ? `, ${founder.roleLine}` : ""}.`,
    path: "/about",
  })
}

export default async function AboutPage() {
  const [settings, founder, certificates, stats, pillars] = await Promise.all([
    getSettings(),
    getFounder(),
    getCertificates(),
    getStats(),
    getPillars(),
  ])
  const photo = founder.photo_url
  const joinHref = whatsappLink(settings.whatsapp, whatsappMessages.join)

  return (
    <>
      <PageHero
        eyebrow="Tentang Danie"
        title={`Membimbing Hidup Sehat Lebih dari ${settings.founder.experienceYears} Tahun`}
        description="Di balik setiap kelas di Sanggar Senam Danie ada instruktur yang percaya bahwa olahraga seharusnya menyenangkan, aman, dan bisa dinikmati siapa saja."
        breadcrumbs={[{ name: "Tentang Danie", path: "/about" }]}
      />

      <Section aria-labelledby="story-title">
        <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <Portrait
            src={photo}
            alt={`${settings.founder.name}, ${settings.founder.title}`}
            sizes="(min-width: 1024px) 460px, 100vw"
            placeholderLabel="Foto Danie"
            className="aspect-[4/5] rounded-[var(--radius-card)] shadow-soft lg:sticky lg:top-28"
          />
          <div className="flex flex-col gap-6">
            <Eyebrow>{founder.role_title}</Eyebrow>
            <Heading id="story-title">Halo, saya {settings.founder.name}</Heading>
            <Text size="lead">{founder.bio}</Text>
            <Text>
              {site.name} berdiri pada {settings.founded.label}, lahir dari keinginan sederhana: menghadirkan tempat berolahraga yang dekat, ramah,
              dan dipandu dengan benar. Di sini, peserta pemula belajar dengan tenang, dan peserta rutin terus
              ditantang dengan aman.
            </Text>
            <ul className="flex flex-col gap-6 pt-2">
              <FeatureItem
                icon={Award}
                title="Bersertifikat resmi"
                description={founder.certifications.join(", ")}
              />
              {settings.founder.roleLine ? (
                <FeatureItem
                  icon={Users}
                  title={settings.founder.roleLine}
                  description={`Turut mengembangkan senam bersama ${settings.founder.organizationLong ?? settings.founder.organization}.`}
                />
              ) : null}
              <FeatureItem
                icon={HeartPulse}
                title="Fokus pada keamanan"
                description="Setiap gerakan punya variasi, sehingga peserta bisa berlatih sesuai kondisi tubuhnya."
              />
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <WhatsAppButton href={joinHref} size="lg" className="shine">
                Ikut Kelas Bersama Danie
              </WhatsAppButton>
              <ButtonLink href="/program" size="lg" variant="outline">
                Lihat Program
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <StatsSection stats={stats} />

      <BrandSection settings={settings} pillars={pillars} tone="soft" />

      <Section aria-labelledby="cert-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader id="cert-title" eyebrow="Sertifikasi" title="Kredensial Danie" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <li key={certificate.id}>
                <CertificateCard certificate={certificate} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection whatsappHref={joinHref} />
      <JsonLd data={founderJsonLd(settings, founder.certifications, photo)} />
    </>
  )
}
