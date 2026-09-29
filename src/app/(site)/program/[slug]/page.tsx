import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Container, Section } from "@/components/atoms/layout"
import { JsonLd } from "@/components/atoms/json-ld"
import { ProgramIcon } from "@/components/atoms/icon"
import { Heading, Text } from "@/components/atoms/typography"
import { CheckItem } from "@/components/molecules/check-item"
import { JoinSteps } from "@/components/molecules/join-steps"
import { ProgramCard } from "@/components/molecules/program-card"
import { SectionHeader } from "@/components/molecules/section-header"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { ScheduleBoard } from "@/components/organisms/schedule-board"
import { ArticleSection } from "@/components/sections/article-section"
import { PageHero } from "@/components/sections/page-hero"
import { getArticlesForProgram } from "@/features/articles/queries"
import { getProgramBySlug, getPrograms } from "@/features/programs/queries"
import { getSchedule } from "@/features/schedule/queries"
import { getSettings } from "@/features/settings/queries"
import { programJsonLd } from "@/lib/seo/jsonld"
import { clampDescription, pageMetadata } from "@/lib/seo/metadata"
import { intensityLabel } from "@/lib/utils/format"
import { formatPhone } from "@/lib/utils/phone"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const programs = await getPrograms()
  return programs.map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return {}

  const keyword = `${program.title.toLowerCase()} depok`
  return pageMetadata({
    title: `Kelas ${program.title} di Depok`,
    description: clampDescription(
      `Kelas ${program.title} di Tapos, Depok bersama instruktur bersertifikasi. ${program.summary} Tanya jadwal via WhatsApp.`,
    ),
    path: `/program/${program.slug}`,
    keywords: [keyword, `kelas ${keyword}`, "sanggar senam depok", `${program.title.toLowerCase()} tapos`],
  })
}

export default async function ProgramDetailPage({ params }: { params: Promise<Params> }) {
  const settings = await getSettings()
  const { slug } = await params
  const [program, programs, schedule] = await Promise.all([getProgramBySlug(slug), getPrograms(), getSchedule()])
  if (!program) notFound()
  const relatedArticles = await getArticlesForProgram(program.id)

  const programSchedule = schedule.filter((entry) => entry.program_id === program.id)
  const others = programs.filter((p) => p.id !== program.id).slice(0, 3)
  const whatsappHref = whatsappLink(settings.whatsapp, whatsappMessages.program(program.title))

  return (
    <>
      <PageHero
        eyebrow={program.category === "aqua" ? "Kelas Air" : "Kelas Studio"}
        title={`Kelas ${program.title} di Depok`}
        description={program.summary}
        breadcrumbs={[
          { name: "Program", path: "/program" },
          { name: program.title, path: `/program/${program.slug}` },
        ]}
      />

      <Section aria-labelledby="detail-title">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            {program.image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-brand-100">
                <Image
                  src={program.image_url}
                  alt={`Kelas ${program.title} di Sanggar Senam Danie`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex items-center gap-4">
              <span aria-hidden className="grid size-14 place-items-center rounded-full bg-brand-500 text-white shadow-brand">
                <ProgramIcon name={program.icon} className="size-6" />
              </span>
              <Heading id="detail-title">Tentang kelas {program.title}</Heading>
            </div>
            <Text size="lead" className="whitespace-pre-line">
              {program.description}
            </Text>

            <dl className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 ring-1 ring-brand-100">
                <dt className="text-ink-muted">Intensitas</dt>
                <dd className="font-bold text-brand-800">{intensityLabel[program.intensity]}</dd>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 ring-1 ring-brand-100">
                <dt className="text-ink-muted">Jenis</dt>
                <dd className="font-bold text-brand-800">{program.category === "aqua" ? "Kelas di air" : "Kelas studio"}</dd>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 ring-1 ring-brand-100">
                <dt className="text-ink-muted">Pemula</dt>
                <dd className="font-bold text-brand-800">Boleh ikut</dd>
              </div>
            </dl>

            {program.audience ? (
              <div className="flex flex-col gap-3">
                <Heading as="h2" size="title">
                  Cocok untuk siapa?
                </Heading>
                <Text>{program.audience}</Text>
              </div>
            ) : null}

            {program.benefits.length > 0 ? (
              <div className="flex flex-col gap-4">
                <Heading as="h2" size="title">
                  Manfaat kelas {program.title}
                </Heading>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {program.benefits.map((benefit) => (
                    <CheckItem key={benefit} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line">
                      {benefit}
                    </CheckItem>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-col gap-5 pt-4">
              <Heading as="h2" size="title">
                Jadwal {program.title}
              </Heading>
              <ScheduleBoard entries={programSchedule} whatsappHref={whatsappHref} />
            </div>
          </div>

          <aside aria-labelledby="book-title" className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-8 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-col gap-2">
                <Heading as="h2" id="book-title" size="title">
                  Tertarik kelas {program.title}?
                </Heading>
                <Text size="small">
                  Tanya jadwal dan biaya kelas {program.title} langsung lewat WhatsApp — pesannya sudah kami siapkan.
                </Text>
              </div>
              <div className="flex flex-col gap-3">
                <WhatsAppButton href={whatsappHref} size="lg" className="shine">
                  Tanya Kelas {program.title}
                </WhatsAppButton>
                <p className="text-center text-sm text-ink-muted">
                  atau hubungi <span className="font-semibold text-ink">{formatPhone(settings.whatsapp)}</span>
                </p>
              </div>
              <div className="border-t border-line pt-8">
                <JoinSteps headingLevel="h3" />
              </div>
            </div>
          </aside>
        </Container>
      </Section>

      <ArticleSection
        articles={relatedArticles}
        eyebrow="Bacaan terkait"
        title={`Seputar Kelas ${program.title}`}
        showAllLink={false}
      />

      {others.length > 0 ? (
        <Section tone="soft" aria-labelledby="others-title">
          <Container className="flex flex-col gap-10">
            <SectionHeader id="others-title" eyebrow="Program lain" title="Mungkin Anda juga suka" />
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <ProgramCard program={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <JsonLd data={programJsonLd(program)} />
    </>
  )
}
