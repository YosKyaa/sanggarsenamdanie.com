"use client"

import { useEffect, useState, type ComponentType } from "react"

import { StaticMarquee, type MarqueeProps } from "./marquee-bands"

/**
 * Swaps the static bands for the scroll-velocity version once the browser is
 * idle, so Framer Motion's scroll engine never competes with the first paint.
 */
export function LazyMarquee(props: MarqueeProps) {
  const [Animated, setAnimated] = useState<ComponentType<MarqueeProps> | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    const load = () =>
      import("./velocity-marquee").then((mod) => {
        if (!cancelled) setAnimated(() => mod.VelocityMarquee)
      })
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    idle(load)
    return () => {
      cancelled = true
    }
  }, [])

  return Animated ? <Animated {...props} /> : <StaticMarquee {...props} />
}
