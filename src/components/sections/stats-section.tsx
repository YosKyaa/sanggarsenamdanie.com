import { Container } from "@/components/atoms/layout"
import { StatsCard } from "@/components/molecules/stats-card"
import type { StatRow } from "@/types/database"

export function StatsSection({ stats }: { stats: StatRow[] }) {
  if (stats.length === 0) return null

  return (
    <section aria-label="Sanggar Senam Danie dalam angka" className="pb-16 lg:pb-[100px]">
      <Container>
        <dl className="reveal-scale grid grid-cols-2 gap-y-10 rounded-[var(--radius-card)] border border-line bg-white px-4 py-10 shadow-soft md:grid-cols-4 md:divide-x md:divide-line">
          {stats.map((stat) => (
            <StatsCard key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} count={stat.count_up} />
          ))}
        </dl>
      </Container>
    </section>
  )
}
