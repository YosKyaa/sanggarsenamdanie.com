import type { GalleryCategory } from "@/types/database"

/** Gallery filters, in display order. Shared by the public page and the admin. */
export const galleryCategories: readonly { value: GalleryCategory; label: string }[] = [
  { value: "kelas", label: "Kelas" },
  { value: "event", label: "Event" },
  { value: "komunitas", label: "Komunitas" },
  { value: "studio", label: "Studio" },
]

export const galleryCategoryLabel = (category: GalleryCategory) =>
  galleryCategories.find((c) => c.value === category)?.label ?? category

/** Caption, or a descriptive fallback — every gallery image gets meaningful alt text. */
export const galleryPhotoAlt = (photo: { caption: string | null; category: GalleryCategory }) =>
  photo.caption || `Kegiatan ${galleryCategoryLabel(photo.category).toLowerCase()} di Sanggar Senam Danie`
