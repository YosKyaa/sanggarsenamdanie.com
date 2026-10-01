import { ArrowRight, BadgeCheck } from "lucide-react"
import Link from "next/link"

import { Container, Section } from "@/components/atoms/layout"
import { Reveal } from "@/components/atoms/reveal"
import { Parallax } from "@/components/atoms/scroll-effects"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { Portrait } from "@/components/molecules/portrait"
import type { SiteSettings } from "@/features/settings/types"
import type { InstructorRow } from "@/types/database"

type AboutSectionProps = {
  settings: SiteSettings
  founder: Pick<InstructorRow, "bio"> | null
  /** More than one instructor → link to the team page. */
  hasTeam: boolean
}

/**
 * Who teaches the classes: Danie's story, credentials and links to the full
 * profile and certificates. Replaces the separate trust, instructor and
 * certificate blocks so each fact appears once on the home page.
 */
export function AboutSection({ settings, founder, hasTeam }: AboutSectionProps) {
  const { founder: person } = settings
  // The hero already shows Danie's main portrait; only a different photo earns a place here.
  const photo = settings.photos.classMoment ?? settings.photos.founderSecondary
  const credentials = [...settings.credentials, ...(person.roleLine ? [person.roleLine] : [])]
  const links = [
    { href: "/about", label: `Kenali ${person.name} lebih dekat` },
    { href: "/sertifikat", label: "Lihat sertifikat" },
    ...(hasTeam ? [{ href: "/instructor", label: "Tim instruktur" }] : []),
  ]

  const copy = (
    <div className="flex flex-col gap-7">
      <Eyebrow>Instruktur & Pendiri</Eyebrow>
      <Heading id="about-title">Dipandu Langsung oleh {person.name}, Instruktur Senam Bersertifikat</Heading>
      <Text size="lead">
        {founder?.bio ||
          `${person.name} mendirikan sanggar ini dan memimpin kelasnya sendiri. Setiap peserta dibimbing sesuai kemampuannya — dari pemula hingga yang sudah rutin berlatih.`}
      </Text>
      <ul aria-label={`Sertifikasi ${person.name}`} className="flex flex-wrap gap-2.5">
        {credentials.map((credential) => (
          <li
            key={credential}
            className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-800"
          >
            <BadgeCheck aria-hidden className="size-4 text-brand-700" />
            {credential}
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {link.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <Section aria-labelledby="about-title">
      {photo ? (
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute -inset-4 rounded-[32px] bg-brand-50 lg:-inset-6" />
            <Parallax distance={30}>
              <Portrait
                src={photo}
                alt={`${person.name} saat memimpin kelas`}
                sizes="(min-width: 1024px) 448px, 90vw"
                className="relative aspect-[4/5] rounded-[var(--radius-card)] shadow-soft"
              />
            </Parallax>
          </Reveal>
          {copy}
        </Container>
      ) : (
        <Container className="max-w-3xl">{copy}</Container>
      )}
    </Section>
  )
}
