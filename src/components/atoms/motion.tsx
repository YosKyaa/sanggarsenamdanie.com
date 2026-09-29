"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Number that counts up when scrolled into view. Server HTML holds the final
 * value (crawlers, no-JS); it only resets to 0 when it starts below the fold.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setDisplay(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400)
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: "0px 0px -60px 0px" },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

/** Feeds pointer position to any `.spotlight` card via CSS variables (one listener for the page). */
export function SpotlightTracker() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.<HTMLElement>(".spotlight")
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`)
      card.style.setProperty("--my", `${event.clientY - rect.top}px`)
    }
    document.addEventListener("pointermove", onMove, { passive: true })
    return () => document.removeEventListener("pointermove", onMove)
  }, [])
  return null
}
