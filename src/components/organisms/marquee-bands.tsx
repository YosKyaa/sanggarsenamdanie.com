import { cn } from "cn"

export type MarqueeProps = { primary: readonly string[]; secondary: readonly string[] }

/** The words of one band, doubled so a -50% → 0 translate loops seamlessly. */
export function MarqueeItems({ items }: { items: readonly string[] }) {
  return (
    <>
      {[...items, ...items].map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center">
          <span className="px-6 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{item}</span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 opacity-70 sm:size-7">
            <path fill="currentColor" d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </>
  )
}

export const bandClasses = {
  secondary: "absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] bg-brand-100 py-4 text-brand-700/70",
  primary: "relative -mx-[5%] -rotate-[2deg] bg-brand-600 py-5 text-white shadow-brand",
}

/** Server-rendered, motionless bands: shown before the animated version loads (same size, no layout shift). */
export function StaticMarquee({ primary, secondary }: MarqueeProps) {
  return (
    <section aria-label="Program dan nilai sanggar" className="relative overflow-hidden py-14 lg:py-20">
      <div aria-hidden className="relative">
        <div className={cn("flex overflow-hidden whitespace-nowrap", bandClasses.secondary)}>
          <div className="flex shrink-0 items-center">
            <MarqueeItems items={secondary} />
          </div>
        </div>
        <div className={cn("flex overflow-hidden whitespace-nowrap", bandClasses.primary)}>
          <div className="flex shrink-0 items-center">
            <MarqueeItems items={primary} />
          </div>
        </div>
      </div>
    </section>
  )
}
