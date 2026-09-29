import { Container, Section } from "@/components/atoms/layout"
import { SectionHeader } from "@/components/molecules/section-header"
import { PillarStack } from "@/components/organisms/pillar-stack"
import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import type { BrandPillarRow } from "@/types/database"

const count = ["Satu", "Dua", "Tiga", "Empat", "Lima", "Enam"]

type BrandSectionProps = {
  settings: SiteSettings
  pillars: BrandPillarRow[]
  tone?: "default" | "soft"
}

/**
 * The studio's promise, spelled out with the words of the slogan.
 * Header stays pinned while the pillar cards stack over each other.
 */
export function BrandSection({ settings, pillars, tone = "default" }: BrandSectionProps) {
  if (pillars.length === 0) return null

  return (
    <Section tone={tone} aria-labelledby="brand-title">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            id="brand-title"
            align="left"
            eyebrow="Kenapa Sanggar Senam Danie"
            title={`Satu Sanggar, ${count[pillars.length - 1] ?? pillars.length} Janji`}
            description={`Sejak ${settings.founded.label}, ${site.name} menjadi rumah bagi siapa saja yang ingin bergerak — apa pun usia dan kemampuannya.`}
          />
        </div>
        <PillarStack pillars={pillars} />
      </Container>
    </Section>
  )
}
