import { formatCount } from "@/lib/utils/analytics"

type BarListProps = {
  title: string
  description?: string
  rows: { label: string; value: number }[]
  /** Unit after the value in the accessible label, e.g. "pengunjung". */
  unit: string
  empty?: string
}

/**
 * Ranked horizontal bars, one hue (identity is the label, not the color).
 * Every value is printed at the bar tip, so nothing hides behind hover.
 */
export function BarList({ title, description, rows, unit, empty = "Belum ada data." }: BarListProps) {
  const max = Math.max(1, ...rows.map((r) => r.value))

  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6">
      <header className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      </header>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">{empty}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.label} className="group flex flex-col gap-1.5" aria-label={`${row.label}: ${row.value} ${unit}`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate font-medium text-ink" title={row.label}>
                  {row.label}
                </span>
                <span className="shrink-0 font-semibold text-ink tabular-nums">{formatCount(row.value)}</span>
              </div>
              <div aria-hidden className="h-2 rounded-r-full bg-brand-50">
                <div
                  className="h-2 rounded-r-full bg-brand-600 transition-opacity group-hover:opacity-80"
                  style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
