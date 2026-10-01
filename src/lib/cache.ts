/** Cache tags shared by public queries and admin mutations (revalidateTag). */
export const cacheTags = {
  programs: "programs",
  instructors: "instructors",
  certificates: "certificates",
  testimonials: "testimonials",
  schedule: "schedule",
  articles: "articles",
  settings: "settings",
  faqs: "faqs",
  stats: "stats",
  pillars: "pillars",
  rentalUses: "rental-uses",
  bioLinks: "bio-links",
  gallery: "gallery",
} as const

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags]

/** Public content changes rarely; admin edits revalidate immediately via tags. */
export const PUBLIC_REVALIDATE_SECONDS = 3600
