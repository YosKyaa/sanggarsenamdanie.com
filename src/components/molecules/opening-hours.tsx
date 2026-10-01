import { cn } from "cn"
import { Clock } from "lucide-react"

import { formatOpeningHours } from "@/lib/utils/hours"

type OpeningHoursProps = {
  entries: string[]
  /** "inverse" for dark panels. */
  tone?: "default" | "inverse"
  className?: string
}

/** Opening hours from settings ("Mo-Fr 06:00-20:00"), shown in Indonesian. Renders nothing until set. */
export function OpeningHours({ entries, tone = "default", className }: OpeningHoursProps) {
  const rows = entries.map(formatOpeningHours).filter((row) => row !== null)
  if (rows.length === 0) return null

  return (
    <div className={cn("flex gap-3", className)}>
      <Clock aria-hidden className={cn("mt-0.5 size-5 shrink-0", tone === "inverse" ? "text-white/80" : "text-brand-700")} />
      <dl className={cn("grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm", tone === "inverse" ? "text-white/90" : "text-ink-muted")}>
        {rows.map((row) => (
          <div key={row.days} className="contents">
            <dt className={cn("font-semibold", tone === "inverse" ? "text-white" : "text-ink")}>{row.days}</dt>
            <dd className="tabular-nums">{row.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
