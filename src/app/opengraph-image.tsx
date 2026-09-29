import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { ogContentType, ogSize, renderOg } from "@/lib/seo/og"

export const alt = `${site.name} — Studio Senam Profesional di Depok`
export const size = ogSize
export const contentType = ogContentType

export default async function OpengraphImage() {
  const settings = await getSettings()
  return renderOg({
    eyebrow: settings.tagline,
    lines: ["Sehat, Aktif,", "dan Bahagia", "Bersama Sanggar Senam Danie"],
    footer: "Aerobic · Zumba · Yoga · Aquarobic · Aquayoga",
  })
}
