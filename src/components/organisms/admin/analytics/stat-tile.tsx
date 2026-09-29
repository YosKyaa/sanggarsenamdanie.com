import { cn } from "cn"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { formatPercent } from "@/lib/utils/analytics"

type StatTileProps = {
  label: string
  value: string
  /** Relative change vs the previous period; null when there is no baseline. */
  change: number | null
  hint?: string
  /** The one number the dashboard leads with (WhatsApp clicks). */
  featured?: boolean
}

/** KPI tile: label · value · signed change vs the previous period (icon + text, never color alone). */
export function StatTile({ label, value, change, hint, featured }: StatTileProps) {
  const direction = change === null || change === 0 ? "flat" : change > 0 ? "up" : "down"
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[20px] border bg-white p-5 shadow-soft",
        featured ? "border-brand-300 ring-2 ring-brand-100" : "border-line",
      )}
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">{value}</p>
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        {change === null ? (
          <span>Belum ada pembanding</span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              direction === "up" && "bg-emerald-50 text-emerald-800",
              direction === "down" && "bg-red-50 text-red-800",
              direction === "flat" && "bg-surface-soft text-ink-muted",
            )}
          >
            <Icon aria-hidden className="size-3.5" />
            {change > 0 ? "+" : ""}
            {formatPercent(change)}
          </span>
        )}
        <span>{change === null ? "" : "vs periode sebelumnya"}</span>
      </p>
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}
