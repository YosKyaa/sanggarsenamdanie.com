"use server"

import { formValues, HONEYPOT_FIELD, type FormState } from "@/lib/forms"
import { fieldErrorsOf } from "@/lib/validation"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import { createReferenceCode } from "@/lib/utils/reference"

import { rentalSchema, type RentalField } from "./schema"

const UNAVAILABLE =
  "Formulir online sedang tidak tersedia. Silakan hubungi kami langsung melalui WhatsApp."

export async function submitRental(
  _prev: FormState<RentalField>,
  formData: FormData,
): Promise<FormState<RentalField>> {
  const values = formValues(formData)

  if (values[HONEYPOT_FIELD]) return { status: "success", reference: "SSD-000000" }

  const parsed = rentalSchema.safeParse(values)
  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang ditandai.",
      fieldErrors: fieldErrorsOf<RentalField>(parsed.error),
      values,
    }
  }

  if (!isSupabaseConfigured) return { status: "error", message: UNAVAILABLE, values }

  const reference = createReferenceCode()
  const { error } = await getPublicClient()
    .from("studio_rental_requests")
    .insert({ ...parsed.data, reference_code: reference })

  if (error) {
    console.error("[rental] insert failed:", error.message)
    return { status: "error", message: UNAVAILABLE, values }
  }

  return { status: "success", reference }
}
