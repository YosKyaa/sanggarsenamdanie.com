import "server-only"

import { z } from "zod"

import { programIcons } from "@/components/atoms/icon"
import { nameSchema, phoneSchema } from "@/features/rentals/schema"
import { weekdays } from "@/lib/utils/format"
import { openingHoursPattern } from "@/lib/utils/hours"

import type { ResourceKey } from "./resources"

/* FormData arrives as strings; these helpers coerce to column types. */
const text = (max: number, message = "Wajib diisi.") => z.string().trim().min(1, message).max(max)
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null)
const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean())
const intIn = (min: number, max: number) => z.coerce.number().int("Gunakan angka bulat.").min(min).max(max)
const optionalInt = (min: number, max: number) =>
  z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().int().min(min).max(max).nullable())
const optionalId = z.preprocess((v) => (v === "" || v == null ? null : v), z.uuid().nullable())
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan tanda hubung saja.")
const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Isi jam dengan format JJ:MM.")
const lines = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean),
  )
const imageUrl = optionalText(1000)
const httpUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || null)
  .refine((v) => v === null || /^https?:\/\//.test(v), "Awali dengan https://")
const coordinate = (limit: number) =>
  z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.coerce.number({ message: "Isi angka, mis. -6.4012" }).min(-limit).max(limit).nullable(),
  )
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pilih tanggal.")

export const resourceSchemas = {
  programs: z.object({
    title: text(80),
    slug,
    summary: text(200),
    description: text(4000),
    category: z.enum(["studio", "aqua"]),
    icon: z.enum(Object.keys(programIcons) as [string, ...string[]]),
    image_url: imageUrl,
    audience: z.string().trim().max(600, "Maksimal 600 karakter.").default(""),
    benefits: lines,
    intensity: z.enum(["ringan", "sedang", "tinggi"]),
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  schedules: z
    .object({
      program_id: z.uuid("Pilih program."),
      instructor_id: optionalId,
      day: z.enum(weekdays),
      time_start: time,
      time_end: time,
      location: text(160),
      is_active: checkbox,
    })
    .refine((v) => v.time_end > v.time_start, { path: ["time_end"], message: "Jam selesai harus setelah jam mulai." }),
  instructors: z.object({
    name: text(80),
    slug,
    role_title: text(80),
    specialization: z.string().trim().max(200).default(""),
    bio: z.string().trim().max(4000).default(""),
    certifications: lines,
    experience_years: intIn(0, 80).catch(0),
    photo_url: imageUrl,
    is_founder: checkbox,
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  certificates: z.object({
    title: text(120),
    issuer: optionalText(120),
    year: optionalInt(1980, 2100),
    instructor_id: optionalId,
    image_url: imageUrl,
    sort_order: intIn(0, 999).catch(0),
  }),
  articles: z.object({
    title: z.string().trim().min(10, "Minimal 10 karakter.").max(110, "Maksimal 110 karakter."),
    slug,
    author_name: text(80),
    excerpt: z.string().trim().min(50, "Minimal 50 karakter.").max(180, "Maksimal 180 karakter."),
    content: z.string().trim().min(200, "Artikel minimal 200 karakter."),
    cover_image_url: imageUrl,
    program_id: optionalId,
    is_published: checkbox,
  }),
  testimonials: z.object({
    name: text(80),
    context: optionalText(120),
    message: z.string().trim().min(10, "Minimal 10 karakter.").max(600, "Maksimal 600 karakter."),
    photo_url: imageUrl,
    is_published: checkbox,
  }),
  faqs: z.object({
    question: z.string().trim().min(5, "Minimal 5 karakter.").max(200),
    answer: z.string().trim().min(10, "Minimal 10 karakter.").max(1000, "Maksimal 1000 karakter."),
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  stats: z.object({
    value: intIn(0, 1_000_000),
    suffix: z.string().trim().max(4, "Maksimal 4 karakter.").default(""),
    label: z.string().trim().min(2, "Minimal 2 karakter.").max(40),
    count_up: checkbox,
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  pillars: z.object({
    word: z.string().trim().min(2).max(20, "Maksimal 20 karakter."),
    title: z.string().trim().min(3).max(80),
    description: z.string().trim().min(10, "Minimal 10 karakter.").max(300),
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  gallery: z.object({
    image_url: z.string().trim().min(1, "Pilih foto."),
    caption: optionalText(140),
    category: z.enum(["kelas", "event", "komunitas", "studio"]),
    taken_at: z.preprocess((v) => (v === "" || v == null ? null : v), date.nullable()),
    is_active: checkbox,
  }),
  rentalUses: z.object({
    title: z.string().trim().min(2).max(60),
    description: z.string().trim().min(5, "Minimal 5 karakter.").max(200),
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
  rentals: z.object({
    name: nameSchema,
    phone: phoneSchema,
    organization: optionalText(120),
    event_date: date,
    participant_count: intIn(1, 500),
    status: z.enum(["new", "contacted", "completed"]),
    message: optionalText(1000),
  }),
  settings: z.object({
    whatsapp: phoneSchema,
    instagram_url: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || null)
      .refine((v) => v === null || /^https?:\/\//.test(v), "Awali dengan https://"),
    response_time: text(40),
    tagline: z.string().trim().min(5, "Minimal 5 karakter.").max(80),
    hero_description: z.string().trim().min(20, "Minimal 20 karakter.").max(240, "Maksimal 240 karakter."),
    description: z.string().trim().min(50, "Minimal 50 karakter.").max(200, "Maksimal 200 karakter."),
    founded_date: date,
    credentials: lines,
    address_street: text(120),
    address_district: text(60),
    address_city: text(60),
    address_region: text(60),
    address_postal_code: z.string().trim().regex(/^\d{5}$/, "Kode pos 5 angka."),
    maps_query: text(200),
    founder_name: text(80),
    founder_title: text(120),
    founder_experience_years: intIn(0, 80),
    organization: optionalText(80),
    organization_long: optionalText(160),
    organization_role: optionalText(60),
    founder_photo_2_url: imageUrl,
    class_photo_url: imageUrl,
    studio_photo_url: imageUrl,
    google_maps_url: httpUrl,
    tiktok_url: httpUrl,
    facebook_url: httpUrl,
    youtube_url: httpUrl,
    latitude: coordinate(90),
    longitude: coordinate(180),
    opening_hours: lines.refine((entries) => entries.every((e) => openingHoursPattern.test(e)), {
      message: "Gunakan format seperti Mo-Fr 06:00-20:00 (satu per baris).",
    }),
  }),
  bioLinks: z.object({
    title: z.string().trim().min(2, "Minimal 2 karakter.").max(60),
    subtitle: optionalText(80),
    url: z
      .string()
      .trim()
      .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Awali dengan / atau https://"),
    icon: z.enum(["calendar", "map-pin", "building", "book", "user", "globe", "star", "gift", "play", "link"]),
    is_highlighted: checkbox,
    sort_order: intIn(0, 999).catch(0),
    is_active: checkbox,
  }),
} satisfies Record<ResourceKey, z.ZodType>
