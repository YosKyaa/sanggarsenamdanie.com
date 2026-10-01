import type { SiteSettingsRow } from "@/types/database"

/** Site settings in the shape components use (derived from the single DB row). */
export type SiteSettings = {
  whatsapp: string
  instagram: string
  /** Every public profile of the studio (schema.org sameAs, footer, /bio). */
  socials: { platform: "instagram" | "tiktok" | "facebook" | "youtube"; url: string }[]
  googleMapsUrl: string | null
  geo: { latitude: number; longitude: number } | null
  /** schema.org format, e.g. "Mo-Fr 06:00-20:00". */
  openingHours: string[]
  responseTime: string
  tagline: string
  description: string
  heroDescription: string
  founded: { iso: string; label: string; year: number }
  credentials: string[]
  address: {
    street: string
    district: string
    city: string
    region: string
    postalCode: string
    country: "ID"
    full: string
  }
  mapsQuery: string
  founder: {
    name: string
    title: string
    experienceYears: number
    organization: string | null
    organizationLong: string | null
    organizationRole: string | null
    /** "Sekretaris IOSKI Depok", or null when no organisation is set. */
    roleLine: string | null
  }
  photos: { founderSecondary: string | null; classMoment: string | null; studio: string | null }
}

export function toSiteSettings(row: SiteSettingsRow): SiteSettings {
  const founded = new Date(`${row.founded_date}T00:00:00+07:00`)
  const roleLine = row.organization ? [row.organization_role, row.organization].filter(Boolean).join(" ") : null

  return {
    whatsapp: row.whatsapp,
    instagram: row.instagram_url ?? "",
    // `?? null` keeps working before migration 0006 adds these columns.
    socials: (
      [
        ["instagram", row.instagram_url],
        ["tiktok", row.tiktok_url],
        ["facebook", row.facebook_url],
        ["youtube", row.youtube_url],
      ] as const
    ).flatMap(([platform, url]) => (url ? [{ platform, url }] : [])),
    googleMapsUrl: row.google_maps_url ?? null,
    geo:
      row.latitude != null && row.longitude != null
        ? { latitude: Number(row.latitude), longitude: Number(row.longitude) }
        : null,
    openingHours: row.opening_hours ?? [],
    responseTime: row.response_time,
    tagline: row.tagline,
    description: row.description,
    heroDescription: row.hero_description,
    founded: {
      iso: row.founded_date,
      label: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(founded),
      year: Number(row.founded_date.slice(0, 4)),
    },
    credentials: row.credentials,
    address: {
      street: row.address_street,
      district: row.address_district,
      city: row.address_city,
      region: row.address_region,
      postalCode: row.address_postal_code,
      country: "ID",
      full: `${row.address_street}, ${row.address_district}, ${row.address_city}, ${row.address_region} ${row.address_postal_code}`,
    },
    mapsQuery: row.maps_query,
    founder: {
      name: row.founder_name,
      title: row.founder_title,
      experienceYears: row.founder_experience_years,
      organization: row.organization,
      organizationLong: row.organization_long,
      organizationRole: row.organization_role,
      roleLine,
    },
    photos: {
      founderSecondary: row.founder_photo_2_url,
      classMoment: row.class_photo_url,
      studio: row.studio_photo_url,
    },
  }
}
