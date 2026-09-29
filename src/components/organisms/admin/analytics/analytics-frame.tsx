"use client"

import { cn } from "cn"
import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTransition, type ReactNode } from "react"

type AnalyticsFrameProps = {
  range: number
  ranges: readonly number[]
  children: ReactNode
}

/**
 * Period filter in one row above everything it scopes. Switching keeps the
 * current charts on screen (dimmed) until the new data arrives — no skeleton flash.
 */
export function AnalyticsFrame({ range, ranges, children }: AnalyticsFrameProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Periode" className="inline-flex rounded-full bg-white p-1 ring-1 ring-line">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={r === range}
              onClick={() => startTransition(() => router.push(`${pathname}?range=${r}`, { scroll: false }))}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold transition-colors",
                r === range ? "bg-brand-700 text-white" : "text-ink hover:bg-brand-50",
              )}
            >
              {r} hari
            </button>
          ))}
        </div>
        {pending ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Memuat…
          </span>
        ) : null}
      </div>
      <div aria-busy={pending} className={cn("flex flex-col gap-5 transition-opacity", pending && "opacity-50")}>
        {children}
      </div>
    </div>
  )
}
