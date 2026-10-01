/** Human labels for analytics dimensions (client-safe). */

const pageNames: Record<string, string> = {
  "/": "Beranda",
  "/about": "Tentang Danie",
  "/program": "Program & jadwal",
  "/instructor": "Instruktur",
  "/sertifikat": "Sertifikat",
  "/artikel": "Artikel",
  "/contact": "Kontak",
  "/rental": "Sewa studio",
  "/cek-status": "Cek status",
  "/bio": "Link bio (Instagram)",
  "/galeri": "Galeri",
}

const titleCase = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

export function pageLabel(path: string): string {
  if (pageNames[path]) return pageNames[path]
  const [, section, slug] = path.split("/")
  if (section === "program" && slug) return `Program: ${titleCase(slug)}`
  if (section === "artikel" && slug) return `Artikel: ${titleCase(slug)}`
  return path
}

const sourceNames: Record<string, string> = {
  direct: "Langsung / tidak diketahui",
  "google.com": "Google",
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "whatsapp.com": "WhatsApp",
  "bing.com": "Bing",
  "tiktok.com": "TikTok",
}

export function sourceLabel(source: string): string {
  return sourceNames[source] ?? source
}

export const deviceLabel = { mobile: "HP", tablet: "Tablet", desktop: "Desktop" } as const

const compact = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 })
const plain = new Intl.NumberFormat("id-ID")

/** 1.284 / 12,9 rb — full digits below 10k, compact above. */
export function formatCount(n: number): string {
  return n < 10_000 ? plain.format(n) : compact.format(n)
}

export function formatPercent(ratio: number): string {
  return new Intl.NumberFormat("id-ID", { style: "percent", maximumFractionDigits: 1 }).format(ratio)
}

/** "5 Sep" for axis ticks and tooltips. */
export function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(iso))
}

/** Signed change vs the previous period, or null when there's no baseline. */
export function changeOf(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return (current - previous) / previous
}
