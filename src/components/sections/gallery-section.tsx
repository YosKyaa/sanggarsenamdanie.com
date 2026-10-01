import { cn } from "cn"
import Image from "next/image"

import { ButtonLink } from "@/components/atoms/button"
import { Container, Section } from "@/components/atoms/layout"
import { SectionHeader } from "@/components/molecules/section-header"
import { galleryPhotoAlt } from "@/features/gallery/categories"
import type { GalleryPhotoRow } from "@/types/database"

/** Fewer photos than this and the home page skips the block (an almost-empty grid looks unfinished). */
const MIN_PHOTOS = 5

/**
 * Home-page glimpse of the latest activity photos: one large tile plus a few
 * smaller ones, linking to the full gallery. Pure server markup, no lightbox JS.
 */
export function GallerySection({ photos }: { photos: GalleryPhotoRow[] }) {
  if (photos.length < MIN_PHOTOS) return null
  // One large tile + four small ones fill whole rows at both 2 and 4 columns.
  const shown = photos.slice(0, MIN_PHOTOS)

  return (
    <Section aria-labelledby="gallery-title">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          id="gallery-title"
          eyebrow="Galeri"
          title="Momen di Sanggar"
          description="Suasana kelas dan kebersamaan peserta, langsung dari kegiatan kami."
        />
        <ul className="reveal grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:gap-4 md:grid-cols-4">
          {shown.map((photo, index) => (
            <li
              key={photo.id}
              className={cn("relative overflow-hidden rounded-2xl bg-brand-100", index === 0 && "col-span-2 row-span-2")}
            >
              <Image
                src={photo.image_url}
                alt={galleryPhotoAlt(photo)}
                fill
                sizes={index === 0 ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 300px, 50vw"}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <ButtonLink href="/galeri" variant="outline">
            Lihat semua foto
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
