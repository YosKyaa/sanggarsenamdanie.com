"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

type Payload = { type: "pageview" | "whatsapp_click"; path: string; referrer?: string }

/** Fire-and-forget: sendBeacon never delays navigation or rendering. */
function send(payload: Payload) {
  const body = JSON.stringify(payload)
  if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(
    () => {},
  )
}

/**
 * Counts pageviews (including client-side navigations) and WhatsApp clicks.
 * No cookies or storage; visitors who ask not to be tracked (Do Not Track /
 * Global Privacy Control) are skipped.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const firstView = useRef(true)

  const optedOut = () =>
    navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true

  useEffect(() => {
    if (optedOut()) return
    // Only the visit's first pageview carries the external referrer (the traffic source).
    send({ type: "pageview", path: pathname, referrer: firstView.current ? document.referrer : undefined })
    firstView.current = false
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="https://wa.me/"]')
      if (link && !optedOut()) send({ type: "whatsapp_click", path: window.location.pathname })
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}
