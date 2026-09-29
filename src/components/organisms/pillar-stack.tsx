import { cn } from "cn"
import { HeartPulse, Smile, Zap, type LucideIcon } from "lucide-react"
import type { CSSProperties } from "react"

import { BrandWatermark } from "@/components/atoms/logo"

type Pillar = { word: string; title: string; description: string }

const icons: LucideIcon[] = [HeartPulse, Zap, Smile]

const themes = [
  { card: "border border-line bg-white shadow-soft", word: "text-brand-700", text: "text-ink", muted: "text-ink-muted", mark: "text-brand-100", chip: "bg-brand-100 text-brand-700" },
  { card: "on-dark spotlight-light bg-brand-600 shadow-brand", word: "text-white", text: "text-white", muted: "text-white/90", mark: "text-white/10", chip: "bg-white/15 text-white" },
  { card: "on-dark spotlight-light bg-brand-900 shadow-lift", word: "text-brand-200", text: "text-white", muted: "text-white/85", mark: "text-white/[0.07]", chip: "bg-white/10 text-brand-200" },
]

/**
 * Sticky cards that stack as the visitor scrolls; earlier cards recede
 * ("pressed") as the next slides over. Pure CSS scroll timeline
 * (.stack / .stack-card in globals.css) — no JS on the main thread.
 */
export function PillarStack({ pillars }: { pillars: readonly Pillar[] }) {
  const last = pillars.length - 1

  return (
    <ol className="stack relative flex flex-col gap-8 pb-8">
      {pillars.map((pillar, index) => {
        const theme = themes[index % themes.length]
        const Icon = icons[index % icons.length]
        const pressed = {
          "--stack-scale": 1 - (last - index) * 0.06,
          "--stack-from": `${last > 0 ? (index / last) * 100 : 0}%`,
        } as CSSProperties

        return (
          <li key={pillar.word} className="sticky" style={{ top: `calc(7rem + ${index * 1.75}rem)` }}>
            <article
              style={index < last ? pressed : undefined}
              className={cn(
                "spotlight relative flex min-h-[19rem] flex-col justify-between gap-8 overflow-hidden rounded-[28px] p-7 sm:p-10",
                index < last && "stack-card",
                theme.card,
              )}
            >
              <BrandWatermark className={cn("-right-6 -bottom-10 h-56 sm:h-72", theme.mark)} />
              <div className="relative flex items-center justify-between gap-4">
                <span className={cn("grid size-12 place-items-center rounded-2xl", theme.chip)} aria-hidden>
                  <Icon className="size-6" />
                </span>
                <span aria-hidden className={cn("text-sm font-bold tracking-[0.16em]", theme.muted)}>
                  0{index + 1} / 0{pillars.length}
                </span>
              </div>
              <div className="relative flex flex-col gap-3">
                <h3 className="flex flex-col gap-1">
                  <span className={cn("text-5xl font-extrabold tracking-tight sm:text-6xl", theme.word)}>{pillar.word}</span>
                  <span className={cn("text-xl font-bold", theme.text)}>{pillar.title}</span>
                </h3>
                <p className={cn("max-w-md text-base leading-relaxed", theme.muted)}>{pillar.description}</p>
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
