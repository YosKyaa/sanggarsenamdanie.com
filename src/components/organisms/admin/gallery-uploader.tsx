"use client"

import { ImagePlus, Loader2, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/atoms/button"
import { Input, Label, NativeSelect } from "@/components/atoms/input"
import { addGalleryPhotos, type UploadedPhoto } from "@/features/admin/actions"
import { galleryCategories } from "@/features/gallery/categories"
import { getBrowserClient } from "@/lib/supabase/browser"

/** Long edge after resizing: sharp on large screens, ~300–700 KB per photo. */
const MAX_EDGE = 2000
const MAX_FILES = 30
const CONCURRENCY = 3

async function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

/** Downscales a camera photo in the browser (respecting EXIF rotation) to WebP, or JPEG where WebP can't be encoded. */
async function resize(file: File): Promise<{ blob: Blob; width: number; height: number; ext: string }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const webp = await encode(canvas, "image/webp", 0.82)
  if (webp?.type === "image/webp") return { blob: webp, width, height, ext: "webp" }
  const jpeg = await encode(canvas, "image/jpeg", 0.85)
  if (!jpeg) throw new Error("encode failed")
  return { blob: jpeg, width, height, ext: "jpg" }
}

/**
 * Multi-photo upload for the gallery: pick or drop up to 30 photos, choose a
 * category and date for the batch, and they go straight to Storage.
 */
export function GalleryUploader() {
  const id = useId()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState<string>(galleryCategories[0].value)
  const [takenAt, setTakenAt] = useState("")
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const pick = (list: FileList | null) => {
    const images = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"))
    if (images.length > MAX_FILES) toast.info(`Maksimal ${MAX_FILES} foto sekali unggah; ${MAX_FILES} foto pertama dipilih.`)
    setFiles(images.slice(0, MAX_FILES))
  }

  const reset = () => {
    setFiles([])
    if (inputRef.current) inputRef.current.value = ""
  }

  async function upload() {
    const supabase = getBrowserClient()
    const uploaded: UploadedPhoto[] = []
    const failed: string[] = []
    let next = 0
    setProgress({ done: 0, total: files.length })

    async function worker() {
      while (next < files.length) {
        const file = files[next++]
        try {
          const { blob, width, height, ext } = await resize(file)
          const path = `gallery/${crypto.randomUUID()}.${ext}`
          const { error } = await supabase.storage
            .from("images")
            .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" })
          if (error) throw error
          uploaded.push({ url: supabase.storage.from("images").getPublicUrl(path).data.publicUrl, width, height })
        } catch {
          failed.push(file.name)
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p))
      }
    }

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker))

    if (uploaded.length > 0) {
      const result = await addGalleryPhotos(uploaded, { category, takenAt })
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    }
    if (failed.length > 0) {
      toast.error(`${failed.length} foto gagal diunggah: ${failed.slice(0, 3).join(", ")}${failed.length > 3 ? "…" : ""}`)
    }

    setProgress(null)
    reset()
    router.refresh()
  }

  const busy = progress !== null

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="mb-6 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6"
    >
      <h2 id={`${id}-title`} className="text-lg font-bold text-ink">
        Unggah foto kegiatan
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Pilih beberapa foto sekaligus (maks. {MAX_FILES}). Foto otomatis diperkecil agar website tetap cepat. Keterangan
        bisa ditambahkan per foto lewat tombol Ubah.
      </p>

      <label
        htmlFor={`${id}-files`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!busy) pick(e.dataTransfer.files)
        }}
        className={`mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging ? "border-brand-600 bg-brand-50" : "border-line bg-surface-soft hover:border-brand-300"
        }`}
      >
        <ImagePlus aria-hidden className="size-8 text-brand-700" />
        <span className="font-semibold text-ink">
          {files.length > 0 ? `${files.length} foto dipilih` : "Klik untuk memilih foto, atau seret ke sini"}
        </span>
        <span className="text-xs text-ink-muted">JPG, PNG, atau WebP dari kamera/HP</span>
        <input
          ref={inputRef}
          id={`${id}-files`}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => pick(e.target.files)}
          className="sr-only"
        />
      </label>

      {files.length > 0 ? (
        <div className="mt-5 flex flex-col gap-5">
          <ul className="flex flex-wrap gap-2" aria-label="Foto yang dipilih">
            {files.slice(0, 12).map((file) => (
              <li key={`${file.name}-${file.lastModified}`}>
                <Thumb file={file} />
              </li>
            ))}
            {files.length > 12 ? (
              <li className="grid size-16 place-items-center rounded-lg bg-surface-soft text-sm font-semibold text-ink-muted">
                +{files.length - 12}
              </li>
            ) : null}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-category`}>Kategori</Label>
              <NativeSelect id={`${id}-category`} value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy}>
                {galleryCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-date`}>Tanggal kegiatan (opsional)</Label>
              <Input id={`${id}-date`} type="date" value={takenAt} onChange={(e) => setTakenAt(e.target.value)} disabled={busy} />
            </div>
          </div>

          {progress ? (
            <div className="flex flex-col gap-2" role="status">
              <div className="h-2 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-ink-muted">
                Mengunggah {progress.done} dari {progress.total} foto…
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={upload} disabled={busy}>
              {busy ? <Loader2 aria-hidden className="animate-spin" /> : <Upload aria-hidden />}
              {busy ? "Mengunggah…" : `Unggah ${files.length} foto`}
            </Button>
            <Button variant="ghost" onClick={reset} disabled={busy}>
              <X aria-hidden />
              Batal
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function Thumb({ file }: { file: File }) {
  const [src] = useState(() => URL.createObjectURL(file))
  // eslint-disable-next-line @next/next/no-img-element -- local preview of a file that isn't uploaded yet
  return <img src={src} alt={file.name} onLoad={() => URL.revokeObjectURL(src)} className="size-16 rounded-lg object-cover ring-1 ring-line" />
}
