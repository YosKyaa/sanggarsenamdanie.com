import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// Brand typeface (Plus Jakarta Sans, OFL) — the default OG font has no bold weight.
const font = (weight: 600 | 800) => readFile(join(process.cwd(), "src/app/_og-fonts", `jakarta-${weight}.woff`))

type OgInput = {
  eyebrow: string
  /** Headline lines; the last line is set in brand purple. */
  lines: string[]
  footer: string
}

/** One branded share-card layout for the home page, programs and articles. */
export async function renderOg({ eyebrow, lines, footer }: OgInput) {
  const [semibold, extrabold, settings] = await Promise.all([font(600), font(800), getSettings()])
  const longest = Math.max(...lines.map((l) => l.length))
  const size = longest > 26 ? 54 : longest > 18 ? 62 : 70

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#FFFFFF", fontFamily: "Jakarta" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 64px", width: "66%" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#6D28D9" }}>{eyebrow}</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: size, fontWeight: 800, lineHeight: 1.1, color: "#171717" }}>
            {lines.map((line, i) => (
              <span key={line} style={{ color: i === lines.length - 1 && lines.length > 1 ? "#6D28D9" : "#171717" }}>
                {line}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#666666" }}>{footer}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "34%",
            background: "#8B5CF6",
            padding: 52,
            gap: 12,
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
            <span>Sanggar Senam</span>
            <span style={{ color: "#DDD6FE" }}>Danie</span>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 600, letterSpacing: 2 }}>{site.slogan.toUpperCase()}</div>
          <div style={{ display: "flex", fontSize: 20, opacity: 0.9 }}>{settings.address.district}, {settings.address.city} · Sejak {settings.founded.year}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Jakarta", data: semibold, weight: 600, style: "normal" },
        { name: "Jakarta", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  )
}

/** Splits a title into up to three balanced lines for the share card. */
export function splitTitle(title: string, maxLine = 24): string[] {
  const lines: string[] = []
  let current = ""
  for (const word of title.split(/\s+/)) {
    if ((current + " " + word).trim().length > maxLine && current) {
      lines.push(current)
      current = word
    } else {
      current = (current + " " + word).trim()
    }
  }
  if (current) lines.push(current)
  return lines.length > 3 ? [...lines.slice(0, 2), `${lines.slice(2).join(" ").slice(0, maxLine - 1)}…`] : lines
}
