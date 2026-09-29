import { createHmac } from "node:crypto"

import { site } from "@/lib/content/site"
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/admin"

// Crawlers, monitors and link previews shouldn't count as visitors.
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|lighthouse|headless|monitor|curl|wget|python|axios/i
const TYPES = new Set(["pageview", "whatsapp_click"])
const SALT = process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const ownHost = new URL(site.url).hostname.replace(/^www\./, "")

function deviceOf(ua: string) {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet" as const
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile" as const
  return "desktop" as const
}

/** 'direct', an external host, or null for navigation inside the site. */
function sourceOf(referrer: unknown): string | null {
  if (referrer === undefined) return null // not the first pageview of the visit
  if (typeof referrer !== "string" || !referrer) return "direct"
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase()
    if (host === ownHost || host.endsWith(".vercel.app") || host === "localhost") return null
    // Group the many Google/WhatsApp/Instagram subdomains under one name.
    if (/(^|\.)google\./.test(host)) return "google.com"
    if (/(^|\.)(l\.)?instagram\.com$/.test(host)) return "instagram.com"
    if (/(^|\.)(l\.|m\.|lm\.)?facebook\.com$/.test(host)) return "facebook.com"
    if (/whatsapp\.com$|wa\.me$/.test(host)) return "whatsapp.com"
    return host.slice(0, 200)
  } catch {
    return "direct"
  }
}

/**
 * Privacy-friendly beacon endpoint: no cookies and no stored IP. The visitor
 * hash is an HMAC of (day, IP, user agent), so it rotates every day.
 */
export async function POST(request: Request) {
  const noContent = new Response(null, { status: 204 })
  if (!isServiceRoleConfigured || !SALT) return noContent

  const ua = request.headers.get("user-agent") ?? ""
  if (!ua || BOT.test(ua)) return noContent

  const body = (await request.json().catch(() => null)) as { type?: unknown; path?: unknown; referrer?: unknown } | null
  if (!body || typeof body.type !== "string" || !TYPES.has(body.type)) return noContent
  if (typeof body.path !== "string" || !body.path.startsWith("/") || /^\/(admin|api)(\/|$)/.test(body.path)) {
    return noContent
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || ""
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date())
  const visitorHash = createHmac("sha256", SALT).update(`${day}|${ip}|${ua}`).digest("hex")
  const country = request.headers.get("x-vercel-ip-country")

  const { error } = await createServiceClient()
    .from("analytics_events")
    .insert({
      type: body.type as "pageview" | "whatsapp_click",
      path: body.path.split("?")[0].slice(0, 300),
      referrer_host: body.type === "pageview" ? sourceOf(body.referrer) : null,
      country: country && /^[A-Z]{2}$/.test(country) ? country : null,
      device: deviceOf(ua),
      visitor_hash: visitorHash,
    })
  if (error) console.error("[analytics] insert failed:", error.message)

  return noContent
}
