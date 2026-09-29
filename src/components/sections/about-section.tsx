import { ArrowRight, Award, Medal, Sparkles, Users } from "lucide-react"
import Link from "next/link"

import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { Parallax } from "@/components/atoms/scroll-effects"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { FeatureItem } from "@/components/molecules/feature-item"
import { Portrait } from "@/components/molecules/portrait"
import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import type { StatRow } from "@/types/database"

type AboutSectionProps = {
  settings: SiteSettings
  founderPhoto: string | null
  /** Community-size stat for the round badge (e.g. 500+ peserta). */
  highlight: StatRow | null
}

export function AboutSection({ settings, founderPhoto, highlight }: AboutSectionProps) {
  const { founder } = settings
  const points = [
    {
      icon: Sparkles,
      title: `Founder ${site.name}`,
      description: `Membangun studio dan komunitas senam yang hangat di ${settings.address.district}, ${settings.address.city}.`,
    },
    {
      icon: Award,
      title: "ZIN Instructor",
      description: "Berlisensi Zumba Instructor Network untuk memimpin kelas Zumba resmi.",
    },
    ...(founder.roleLine
      ? [
          {
            icon: Users,
            title: founder.roleLine,
            description: founder.organizationLong
              ? `Aktif di ${founder.organizationLong}.`
              : `Aktif di ${founder.organization}.`,
          },
        ]
      : []),
    {
      icon: Medal,
      title: "Certified Fitness Instructor",
      description: `Bersertifikat ${settings.credentials.filter((c) => !c.startsWith("ZIN")).join(", ")}.`,
    },
  ]

  return (
    <Section aria-labelledby="about-title">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Collage: main portrait, a class moment, and the participant badge. */}
        <Reveal className="relative mx-auto w-full max-w-lg pb-10 pl-10 sm:pl-16">
          <Portrait
            src={settings.photos.founderSecondary || founderPhoto}
            alt={`${founder.name} saat memimpin kelas`}
            sizes="(min-width: 1024px) 460px, 90vw"
            placeholderLabel="Foto Danie"
            className="aspect-[4/5] rounded-[var(--radius-card)] shadow-soft"
          />
          <Parallax distance={50} className="absolute bottom-24 left-0 w-[42%]">
            <Portrait
              src={settings.photos.classMoment}
              alt="Suasana kelas di Sanggar Senam Danie"
              sizes="220px"
              placeholderLabel="Foto kelas"
              className="aspect-[3/4] rounded-[20px] shadow-lift ring-[6px] ring-white"
            />
          </Parallax>
          {highlight ? (
            <p className="absolute bottom-2 left-[30%] grid size-32 place-items-center rounded-full bg-brand-600 text-center text-white shadow-brand ring-[6px] ring-white motion-safe:animate-float sm:size-36">
              <span className="flex flex-col px-2">
                <span className="text-3xl font-extrabold">
                  {highlight.value}
                  <span className="align-top text-xl">{highlight.suffix}</span>
                </span>
                <span className="text-xs font-semibold">{highlight.label}</span>
              </span>
            </p>
          ) : null}
        </Reveal>

        <div className="flex flex-col gap-6">
          <Eyebrow>Pendiri Sanggar</Eyebrow>
          <Heading id="about-title">Kenali Danie, Pendiri Sanggar Senam Danie</Heading>
          <Text size="lead">
            {founder.name} adalah instruktur senam profesional dengan pengalaman lebih dari {founder.experienceYears}{" "}
            tahun dalam dunia olahraga kebugaran. Setiap peserta dibimbing sesuai
            kemampuannya — dari pemula hingga yang sudah rutin berlatih.
          </Text>
          <ul className="flex flex-col gap-6 pt-2">
            {points.map((point) => (
              <FeatureItem key={point.title} {...point} />
            ))}
          </ul>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 self-start text-base font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Kenali Danie lebih dekat
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
