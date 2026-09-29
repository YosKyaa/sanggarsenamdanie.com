import { cn } from "cn"
import type { CSSProperties, ReactNode } from "react"

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Pixels travelled while the element crosses the viewport. Negative reverses. */
  distance?: number
}

/**
 * Scroll-linked depth via CSS scroll timelines (.parallax in globals.css):
 * runs on the compositor with zero JS, and is static where unsupported or
 * when the visitor prefers reduced motion.
 */
export function Parallax({ children, className, distance = 40 }: ParallaxProps) {
  return (
    <div className={cn("parallax", className)} style={{ "--parallax": `${distance}px` } as CSSProperties}>
      {children}
    </div>
  )
}

/** Reading-progress bar driven by the page scroll timeline. */
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-50 h-1 bg-brand-600" />
}

type RiseProps = {
  children: ReactNode
  className?: string
  /** Seconds to wait before rising. */
  delay?: number
}

/** Above-the-fold entrance (.rise in globals.css): slides up on load, transform only. */
export function Rise({ children, className, delay = 0 }: RiseProps) {
  return (
    <div className={cn("rise", className)} style={delay ? ({ "--rise-delay": `${delay * 1000}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  )
}
