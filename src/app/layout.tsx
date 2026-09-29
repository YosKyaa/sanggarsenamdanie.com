import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"

import "./globals.css"

// "optional": the preloaded 27 KB font lands inside the block period on normal
// connections; on a slow first visit the size-matched fallback stays, so text
// never repaints late (a swap repaint was pushing LCP to ~3.3 s).
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "optional",
})

export async function generateMetadata(): Promise<Metadata> {
  const { description } = await getSettings()
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — Senam Aerobic, Zumba & Yoga Depok`,
      template: `%s | ${site.name}`,
    },
    description,
    keywords: [...site.keywords],
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: "/",
      siteName: site.name,
      title: `${site.name} — Studio Senam Profesional di Depok`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — Studio Senam Profesional di Depok`,
      description,
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  }
}

export const viewport: Viewport = {
  themeColor: "#6d28d9",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  )
}
