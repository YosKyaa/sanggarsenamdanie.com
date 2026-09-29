import type { MetadataRoute } from "next"

import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings()
  return {
    name: site.name,
    short_name: site.shortName,
    description: settings.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6d28d9",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}
