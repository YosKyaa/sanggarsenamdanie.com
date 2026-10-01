import { Container } from "@/components/atoms/layout"
import { StatsCard } from "@/components/molecules/stats-card"
import type { StatRow } from "@/types/database"

/** The home page's numbers, in a glass card overlapping the hero's bottom edge. */
export function StatsSection({ stats }: { stats: StatRow[] }) {
  if (stats.length === 0) return null

  return (
    <section aria-label="Sanggar Senam Danie dalam angka" className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 rounded-[var(--radius-card)] border border-white/70 bg-white/90 px-4 py-10 shadow-lift backdrop-blur-xl md:grid-cols-4 md:divide-x md:divide-line lg:py-12">
          {stats.map((stat) => (
            <StatsCard key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} count={stat.count_up} />
          ))}
        </dl>
      </Container>
    </section>
  )
}
