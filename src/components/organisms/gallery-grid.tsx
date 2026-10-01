"use client"

import { cn } from "cn"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  galleryCategories,
  galleryCategoryLabel as labelOf,
  galleryPhotoAlt as photoAlt,
} from "@/features/gallery/categories"
import { formatDate } from "@/lib/utils/format"
import type { GalleryCategory, GalleryPhotoRow } from "@/types/database"

type Photo = Pick<GalleryPhotoRow, "id" | "image_url" | "caption" | "category" | "taken_at" | "width" | "height">


/** Masonry gallery with category filters and a keyboard-friendly lightbox. */
export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all")
  const [open, setOpen] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const present = galleryCategories.filter((c) => photos.some((p) => p.category === c.value))
  const visible = filter === "all" ? photos : photos.filter((p) => p.category === filter)
  const current = open === null ? null : visible[open]

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + visible.length) % visible.length)),
    [visible.length],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open !== null && !dialog.open) dialog.showModal()
    if (open === null && dialog.open) dialog.close()
  }, [open])

  return (
    <div className="flex flex-col gap-10">
      {present.length > 1 ? (
        <div role="group" aria-label="Filter kategori" className="flex flex-wrap justify-center gap-2">
          {[{ value: "all" as const, label: "Semua" }, ...present].map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={filter === c.value}
              onClick={() => setFilter(c.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                filter === c.value ? "bg-brand-700 text-white shadow-brand" : "bg-white text-ink ring-1 ring-line hover:bg-brand-50",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {visible.map((photo, index) => (
          <li key={photo.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <span className="sr-only">Perbesar foto: </span>
              {photo.width && photo.height ? (
                <Image
                  src={photo.image_url}
                  alt={photoAlt(photo)}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                />
              ) : (
                <span className="relative block aspect-[4/3]">
                  <Image
                    src={photo.image_url}
                    alt={photoAlt(photo)}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </span>
              )}
              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Foto galeri"
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1)
          if (e.key === "ArrowLeft") step(-1)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null)
        }}
        className="m-auto size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        {current ? (
          <div className="flex size-full flex-col items-center justify-center gap-4 p-4 sm:p-10" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
            <div className="relative h-[75vh] w-full max-w-5xl">
              <Image src={current.image_url} alt={photoAlt(current)} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="max-w-2xl text-center text-sm text-white/90">
              {current.caption ?? labelOf(current.category)}
              {current.taken_at ? <span className="text-white/60"> · {formatDate(current.taken_at)}</span> : null}
              <span className="block pt-1 text-xs text-white/50 tabular-nums">
                {open! + 1} / {visible.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X aria-hidden className="size-5" />
            </button>
            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Foto sebelumnya"
                  className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft aria-hidden className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Foto berikutnya"
                  className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight aria-hidden className="size-6" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </div>
  )
}
