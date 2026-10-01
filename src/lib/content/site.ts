/**
 * Fixed brand identity. Everything editable (contact, address, founder,
 * copy, lists) lives in the database and is managed from /admin — see
 * features/settings and lib/content/defaults.ts for the fallbacks.
 */
export const site = {
  name: "Sanggar Senam Danie",
  shortName: "Senam Danie",
  /** Brand promise carried by the logo, pillars and share images. */
  slogan: "Sehat · Aktif · Bahagia",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "id_ID",
  keywords: [
    "sanggar senam depok",
    "zumba depok",
    "aerobic depok",
    "yoga depok",
    "aquarobic depok",
    "senam tapos",
    "sewa studio senam depok",
  ],
} as const

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Tentang Danie" },
  { href: "/program", label: "Program" },
  { href: "/instructor", label: "Instruktur" },
  { href: "/galeri", label: "Galeri" },
  { href: "/artikel", label: "Artikel" },
  { href: "/contact", label: "Kontak" },
] as const
