import { cn } from "cn"

/** The figure mid-stretch from the logo mark; reused as a large brand watermark. */
export const brandFigurePath =
  "M11 30.5c3.2-1.6 5.8-4.4 7.4-8.2l1.6-3.6m0 0 7.5 1.6m-7.5-1.6 4.2 7.3 3.3 4.5M20 18.7l-6.4-4.1"

/** Oversized, low-contrast brand figure for purple surfaces. Purely decorative. */
export function BrandWatermark({ className }: { className?: string }) {
  return (
    <svg viewBox="8 5 24 28" aria-hidden className={cn("pointer-events-none absolute", className)}>
      <circle cx="24.5" cy="10.5" r="3.5" fill="currentColor" />
      <path d={brandFigurePath} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type LogoProps = {
  className?: string
  tone?: "brand" | "inverse"
  /** Adds the slogan under the name (footer, larger placements). */
  withSlogan?: boolean
}

/** Logotype: mark + "Sanggar Senam / Danie" set as one name, not a person's name with a label. */
export function Logo({ className, tone = "brand", withSlogan = false }: LogoProps) {
  const brand = tone === "brand"
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" aria-hidden className="size-10 shrink-0">
        <rect width="40" height="40" rx="12" fill={brand ? "#6D28D9" : "#FFFFFF"} />
        <circle cx="24.5" cy="10.5" r="3.5" fill={brand ? "#DDD6FE" : "#8B5CF6"} />
        <path
          d={brandFigurePath}
          fill="none"
          stroke={brand ? "#FFFFFF" : "#6D28D9"}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col">
        <span className="text-[0.9375rem] leading-[1.1] font-extrabold tracking-tight whitespace-nowrap sm:text-base">
          <span className={brand ? "text-ink" : "text-white"}>Sanggar Senam</span>
          <br />
          <span className={brand ? "text-brand-700" : "text-brand-200"}>Danie</span>
        </span>
        {withSlogan ? (
          <span className={cn("mt-1.5 text-xs font-semibold tracking-[0.08em] uppercase", brand ? "text-ink-muted" : "text-brand-200")}>
            Sehat · Aktif · Bahagia
          </span>
        ) : null}
      </span>
    </span>
  )
}
