"use server"

import { z } from "zod"

import { formValues, type FormState } from "@/lib/forms"
import { fieldErrorsOf } from "@/lib/validation"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import { referencePattern } from "@/lib/utils/reference"
import type { RequestStatus } from "@/types/database"

import { phoneSchema } from "./schema"

const statusSchema = z.object({
  reference: z
    .string()
    .trim()
    .toUpperCase()
    .regex(referencePattern, "Format kode: SSD-XXXXXX (6 huruf/angka)."),
  phone: phoneSchema,
})

type StatusField = "reference" | "phone"

export type StatusResult = FormState<StatusField> & {
  result?: { status: RequestStatus; createdAt: string; updatedAt: string }
}

export async function checkRequestStatus(_prev: StatusResult, formData: FormData): Promise<StatusResult> {
  const values = formValues(formData)
  const parsed = statusSchema.safeParse(values)

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsOf<StatusField>(parsed.error), values }
  }

  if (!isSupabaseConfigured) {
    return { status: "error", message: "Cek status sedang tidak tersedia. Hubungi kami via WhatsApp.", values }
  }

  const { data, error } = await getPublicClient().rpc("get_request_status", {
    p_reference: parsed.data.reference,
    p_phone: parsed.data.phone,
  })

  if (error) {
    console.error("[status] lookup failed:", error.message)
    return { status: "error", message: "Terjadi gangguan. Coba lagi beberapa saat lagi.", values }
  }

  const row = data?.[0]
  if (!row) {
    return {
      status: "error",
      message: "Permintaan tidak ditemukan. Pastikan kode dan nomor WhatsApp sama seperti saat mendaftar.",
      values,
    }
  }

  return {
    status: "success",
    values,
    result: { status: row.status, createdAt: row.created_at, updatedAt: row.updated_at },
  }
}
