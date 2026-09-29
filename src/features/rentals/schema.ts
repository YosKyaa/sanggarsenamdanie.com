import { z } from "zod"

import { normalizePhone } from "@/lib/utils/phone"

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Nomor WhatsApp wajib diisi.")
  .transform((value, ctx) => {
    const phone = normalizePhone(value)
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "Gunakan nomor Indonesia yang valid, contoh 0812 3456 7890." })
      return z.NEVER
    }
    return phone
  })

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 huruf.")
  .max(80, "Nama maksimal 80 karakter.")

export const messageSchema = z
  .string()
  .trim()
  .max(1000, "Pesan maksimal 1000 karakter.")
  .optional()
  .transform((value) => value || null)

function todayInJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date())
}

export const rentalSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  organization: z
    .string()
    .trim()
    .max(120, "Maksimal 120 karakter.")
    .optional()
    .transform((value) => value || null),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pilih tanggal acara.")
    .refine((date) => date >= todayInJakarta(), "Tanggal acara tidak boleh di masa lalu."),
  participant_count: z.coerce
    .number({ message: "Isi perkiraan jumlah peserta." })
    .int("Gunakan angka bulat.")
    .min(1, "Minimal 1 peserta.")
    .max(500, "Untuk lebih dari 500 peserta, hubungi kami via WhatsApp."),
  message: messageSchema,
})

export type RentalField = "name" | "phone" | "organization" | "event_date" | "participant_count" | "message"
