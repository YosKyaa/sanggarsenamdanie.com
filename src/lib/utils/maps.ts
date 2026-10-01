import type { SiteSettings } from "@/features/settings/types"

/** Map embed + directions links; prefers the studio's own Google Maps profile when set. */
export function mapLinks(settings: Pick<SiteSettings, "mapsQuery" | "googleMapsUrl">) {
  const query = encodeURIComponent(settings.mapsQuery)
  return {
    embedSrc: `https://maps.google.com/maps?q=${query}&z=15&output=embed`,
    directionsHref: settings.googleMapsUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  }
}
