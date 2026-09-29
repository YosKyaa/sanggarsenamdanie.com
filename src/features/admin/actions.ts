"use server"

import { randomUUID } from "node:crypto"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

import { formValues, type FormState } from "@/lib/forms"
import { createReferenceCode } from "@/lib/utils/reference"
import { fieldErrorsOf } from "@/lib/validation"
import type { RequestStatus } from "@/types/database"

import { requireAdmin } from "./auth"
import { getResource, type FieldConfig, type ResourceConfig } from "./resources"
import { resourceSchemas } from "./schemas"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"]

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

  const { supabase, user } = await requireAdmin()
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

  // Never let an admin lock themselves out by removing their own admin role.
  if (resource.key === "users" && id === user.id && (parsed.data as { role: string }).role !== "admin") {
    return { status: "error", message: "Anda tidak bisa mencabut akses admin akun Anda sendiri.", values }
  }

  const payload: Record<string, unknown> = { ...parsed.data }
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
  redirect(`/admin/${resource.key}?notice=saved`)
}

export async function deleteResource(resourceKey: string, id: string) {
  const resource = getResource(resourceKey)
  if (!resource || resource.singleton || resource.allowDelete === false) return

  const { supabase } = await requireAdmin()
  const { error } = await supabase.from(resource.table).delete().eq("id", id)
  if (error) redirect(`/admin/${resource.key}/${id}?notice=delete-failed`)

  revalidateResource(resource)
  redirect(`/admin/${resource.key}?notice=deleted`)
}

const statuses: RequestStatus[] = ["new", "contacted", "completed"]

export async function updateRentalStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as RequestStatus
  if (!id || !statuses.includes(status)) return

  const { supabase } = await requireAdmin()
  const { error } = await supabase.from("studio_rental_requests").update({ status }).eq("id", id)
  if (error) console.error("[admin] rental status update failed:", error.message)

  revalidatePath("/admin/rentals")
  revalidatePath("/admin")
}
