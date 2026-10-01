import { cn } from "cn"

import { Container } from "@/components/atoms/layout"
import { StatsCard } from "@/components/molecules/stats-card"
import type { StatRow } from "@/types/database"

type StatsSectionProps = {
  stats: StatRow[]
  /** "floating" overlaps the hero's bottom edge (home); "inline" sits in the page flow. */
  variant?: "inline" | "floating"
}

export function StatsSection({ stats, variant = "inline" }: StatsSectionProps) {
  if (stats.length === 0) return null

  return (
    <section
      aria-label="Sanggar Senam Danie dalam angka"
      className={cn(variant === "floating" ? "relative z-10 -mt-24 lg:-mt-28" : "pb-20 sm:pb-24 lg:pb-32")}
    >
      <Container>
        <dl
          className={cn(
            "grid grid-cols-2 gap-y-10 rounded-[var(--radius-card)] border px-4 py-10 md:grid-cols-4 md:divide-x md:divide-line lg:py-12",
            variant === "floating"
              ? "border-white/70 bg-white/90 shadow-lift backdrop-blur-xl"
              : "reveal-scale border-line bg-white shadow-soft",
          )}
        >
          {stats.map((stat) => (
            <StatsCard key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} count={stat.count_up} />
          ))}
        </dl>
      </Container>
    </section>
  )
}
