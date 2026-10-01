"use server"

import { randomUUID } from "node:crypto"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

import { formValues, type ActionResult, type FormState } from "@/lib/forms"
import { supabaseUrl } from "@/lib/supabase/env"
import { createReferenceCode } from "@/lib/utils/reference"
import { fieldErrorsOf } from "@/lib/validation"
import type { GalleryCategory, RequestStatus } from "@/types/database"

import { requireAdmin, requireStaff } from "./auth"
import { getResource, type FieldConfig, type ResourceConfig } from "./resources"
import { resourceSchemas } from "./schemas"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

type Supabase = Awaited<ReturnType<typeof requireStaff>>["supabase"]

/** Content is staff-editable; site settings are admin-only. */
const gateFor = (resource: ResourceConfig) => (resource.adminOnly ? requireAdmin() : requireStaff())

/** Uploads a replacement file for an image field; returns the new public URL, or an error message. */
async function uploadField(
  supabase: Supabase,
  resource: ResourceConfig,
  field: FieldConfig,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const allowed = field.allowPdf ? [...IMAGE_TYPES, "application/pdf"] : IMAGE_TYPES
  if (!allowed.includes(file.type)) {
    return { error: field.allowPdf ? "Gunakan JPG, PNG, WebP, atau PDF." : "Gunakan JPG, PNG, atau WebP." }
  }
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Ukuran file maksimal 5 MB." }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
  const path = `${resource.key}/${randomUUID()}.${ext}`
  const bucket = field.bucket ?? "images"

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  })
  if (error) return { error: `Upload gagal: ${error.message}` }

  return { url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl }
}

function revalidateResource(resource: ResourceConfig) {
  resource.tags.forEach((tag) => revalidateTag(tag))
  revalidatePath(`/admin/${resource.key}`)
  revalidatePath("/admin")
}

export async function saveResource(
  resourceKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const resource = getResource(resourceKey)
  if (!resource) return { status: "error", message: "Jenis data tidak dikenal." }
  if (!id && (resource.allowCreate === false || resource.singleton)) {
    return { status: "error", message: `Data ${resource.singular} tidak bisa ditambah dari sini.` }
  }

  const { supabase } = await gateFor(resource)
  const values = formValues(formData)

  // Image fields: new upload wins, "remove" clears, otherwise keep the current URL.
  for (const field of resource.fields.filter((f) => f.type === "image")) {
    const file = formData.get(`${field.name}__file`)
    if (formData.get(`${field.name}__remove`) === "on") values[field.name] = ""
    if (file instanceof File && file.size > 0) {
      const result = await uploadField(supabase, resource, field, file)
      if ("error" in result) {
        return { status: "error", message: "Periksa kembali isian.", fieldErrors: { [field.name]: result.error }, values }
      }
      values[field.name] = result.url
    }
  }

  const parsed = resourceSchemas[resource.key].safeParse(values)
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", fieldErrors: fieldErrorsOf(parsed.error), values }
  }

  const payload: Record<string, unknown> = { ...parsed.data }
  // A replaced gallery photo has a new size; let the page fall back to a fixed frame.
  if (resource.key === "gallery" && values.image_url !== formData.get("image_url")) {
    payload.width = null
    payload.height = null
  }
  // Rentals added by hand (WhatsApp/phone) get a reference code like form submissions.
  if (resource.key === "rentals" && !id) payload.reference_code = createReferenceCode()

  // The registry guarantees the payload matches resource.table; the generic
  // table union can't be narrowed by TypeScript here.
  const table = supabase.from(resource.table)
  const { error } = resource.singleton
    ? await table.upsert({ ...payload, id: 1 } as never)
    : id
      ? await table.update(payload as never).eq("id", id)
      : await table.insert(payload as never)

  if (error) {
    const message =
      error.code === "23505" ? "Slug atau data unik ini sudah dipakai. Gunakan nilai lain." : `Gagal menyimpan: ${error.message}`
    return { status: "error", message, values }
  }

  revalidateResource(resource)
  redirect(`/admin/${resource.key}?notice=${id ? "saved" : "created"}`)
}

export async function deleteResource(resourceKey: string, id: string): Promise<ActionResult> {
  const resource = getResource(resourceKey)
  if (!resource || resource.singleton || resource.allowDelete === false) {
    return { ok: false, message: "Data ini tidak bisa dihapus." }
  }

  const { supabase } = await gateFor(resource)
  const { error } = await supabase.from(resource.table).delete().eq("id", id)
  if (error) {
    const message =
      error.code === "23503"
        ? `Gagal menghapus: ${resource.singular} ini masih dipakai data lain (mis. jadwal).`
        : `Gagal menghapus: ${error.message}`
    return { ok: false, message }
  }

  revalidateResource(resource)
  return { ok: true, message: `${capitalize(resource.singular)} berhasil dihapus.` }
}

const galleryCategoryValues: GalleryCategory[] = ["kelas", "event", "komunitas", "studio"]

export type UploadedPhoto = { url: string; width: number; height: number }

/**
 * Records photos the browser already resized and uploaded straight to Storage
 * (large batches would exceed the server's request size limit otherwise).
 */
export async function addGalleryPhotos(
  photos: UploadedPhoto[],
  meta: { category: string; takenAt: string },
): Promise<ActionResult> {
  const { supabase } = await requireStaff()

  // Only files in this project's gallery folder can be registered.
  const prefix = `${supabaseUrl}/storage/v1/object/public/images/gallery/`
  const valid = photos.filter(
    (p) =>
      typeof p.url === "string" &&
      p.url.startsWith(prefix) &&
      Number.isInteger(p.width) &&
      Number.isInteger(p.height) &&
      p.width > 0 &&
      p.height > 0,
  )
  if (valid.length === 0 || valid.length !== photos.length) return { ok: false, message: "Data foto tidak valid." }

  const category = galleryCategoryValues.includes(meta.category as GalleryCategory) ? (meta.category as GalleryCategory) : "kelas"
  const takenAt = /^\d{4}-\d{2}-\d{2}$/.test(meta.takenAt) ? meta.takenAt : null

  const { error } = await supabase.from("gallery_photos").insert(
    valid.map((p) => ({ image_url: p.url, width: p.width, height: p.height, category, taken_at: takenAt })),
  )
  if (error) return { ok: false, message: `Gagal menyimpan foto: ${error.message}` }

  revalidateTag("gallery")
  revalidatePath("/admin/gallery")
  return { ok: true, message: `${valid.length} foto ditambahkan ke galeri.` }
}

const statuses: RequestStatus[] = ["new", "contacted", "completed"]

export async function updateRentalStatus(id: string, status: RequestStatus): Promise<ActionResult> {
  if (!id || !statuses.includes(status)) return { ok: false, message: "Status tidak dikenal." }

  const { supabase } = await requireStaff()
  const { error } = await supabase.from("studio_rental_requests").update({ status }).eq("id", id)
  if (error) return { ok: false, message: `Gagal mengubah status: ${error.message}` }

  revalidatePath("/admin/rentals")
  revalidatePath("/admin")
  return { ok: true, message: "Status permintaan sewa diperbarui." }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
