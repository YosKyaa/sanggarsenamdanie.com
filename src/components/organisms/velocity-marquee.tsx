"use client"

import { cn } from "cn"
import {
  domAnimation,
  LazyMotion,
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import { Pause, Play } from "lucide-react"
import { useRef, useState } from "react"

import { bandClasses, MarqueeItems, type MarqueeProps } from "./marquee-bands"

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

type RowProps = {
  items: readonly string[]
  /** Percent of the row width moved per second at rest; sign sets direction. */
  baseVelocity: number
  paused: boolean
  className?: string
}

/** One band that drifts on its own and speeds up with scroll velocity. */
function MarqueeRow({ items, baseVelocity, paused, className }: RowProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const smoothVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const direction = useRef(1)
  const translate = useTransform(x, (v) => `translateX(${v}%)`)

  useAnimationFrame((_, delta) => {
    if (reduce || paused) return
    let move = direction.current * baseVelocity * (delta / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    move += direction.current * move * factor
    x.set(wrap(-50, 0, x.get() + move))
  })

  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <m.div style={{ transform: translate }} className="flex shrink-0 items-center">
        <MarqueeItems items={items} />
      </m.div>
    </div>
  )
}

/**
 * Two crossing ribbons of program names. Decorative (the same names are real
 * links further down), so hidden from assistive tech — but the motion can be
 * paused (WCAG 2.2.2) and is off entirely with reduced motion.
 */
export function VelocityMarquee({ primary, secondary }: MarqueeProps) {
  const [paused, setPaused] = useState(false)

  return (
    <LazyMotion features={domAnimation} strict>
      <section aria-label="Program dan nilai sanggar" className="relative overflow-hidden py-14 lg:py-20">
        <div aria-hidden className="relative">
          <MarqueeRow
            items={secondary}
            baseVelocity={2}
            paused={paused}
            className={bandClasses.secondary}
          />
          <MarqueeRow
            items={primary}
            baseVelocity={-2.5}
            paused={paused}
            className={bandClasses.primary}
          />
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="glass absolute right-4 bottom-3 z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand-800 motion-reduce:hidden sm:right-8"
        >
          {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
          {paused ? "Putar animasi" : "Jeda animasi"}
        </button>
      </section>
    </LazyMotion>
  )
}
