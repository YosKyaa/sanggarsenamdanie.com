import type { Metadata } from "next"

import { site } from "@/lib/content/site"

/** Keeps meta descriptions within ~155 characters (Google truncates around 160), cutting at a word. */
export function clampDescription(text: string, max = 155): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`
}

/**
 * Pages that define their own openGraph don't inherit the root share image,
 * so link previews (WhatsApp, Facebook) would show none. Always include it.
 */
export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — Studio Senam Profesional di Depok`,
}

type PageMetaInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
}

/** Per-page metadata with canonical URL and Open Graph/Twitter mirrors. */
export function pageMetadata({ title, description, path, keywords }: PageMetaInput): Metadata {
  return {
    title,
    description: clampDescription(description),
    keywords: keywords ?? [...site.keywords],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: clampDescription(description),
      url: path,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description: clampDescription(description),
      images: [defaultOgImage.url],
    },
  }
}
