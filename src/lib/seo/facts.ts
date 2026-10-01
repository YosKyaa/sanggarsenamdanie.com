import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import { formatOpeningHours } from "@/lib/utils/hours"
import { formatPhone } from "@/lib/utils/phone"
import type { ProgramRow } from "@/types/database"

/** "A, B, dan C" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ""
  return `${items.slice(0, -1).join(", ")}, dan ${items[items.length - 1]}`
}

export type StudioFact = { label: string; value: string; href?: string }

/**
 * One self-contained "X adalah Y" paragraph and a list of plain facts about
 * the studio. AI answer engines quote short, explicit statements like these,
 * so the same wording is used on /about, in /llms.txt and mirrors the JSON-LD.
 */
export function studioFacts(settings: SiteSettings, programs: Pick<ProgramRow, "title">[]) {
  const { address, founder } = settings
  const classes = programs.map((p) => p.title)
  const hours = settings.openingHours
    .map(formatOpeningHours)
    .filter((h) => h !== null)
    .map((h) => `${h.days} ${h.time} WIB`)

  const definition =
    `${site.name} adalah studio senam di ${address.street}, Kecamatan ${address.district}, Kota ${address.city}, ${address.region}, ` +
    `yang berdiri sejak ${settings.founded.label}. Sanggar ini didirikan dan dipimpin oleh ${founder.name}, instruktur senam bersertifikat ` +
    `${listJoin(settings.credentials)} dengan pengalaman lebih dari ${founder.experienceYears} tahun` +
    `${founder.roleLine ? `, yang juga menjabat ${founder.roleLine}` : ""}. ` +
    `${site.name} membuka kelas ${listJoin(classes)} untuk pemula hingga peserta rutin, serta menyewakan studio untuk kelas privat dan acara komunitas. ` +
    `Informasi jadwal, biaya, dan pendaftaran melalui WhatsApp ${formatPhone(settings.whatsapp)}.`

  const facts: StudioFact[] = [
    { label: "Nama", value: site.name },
    { label: "Jenis", value: "Studio senam dan kebugaran" },
    { label: "Berdiri", value: settings.founded.label },
    { label: "Pendiri & instruktur utama", value: `${founder.name} — ${listJoin(settings.credentials)}` },
    ...(founder.roleLine ? [{ label: "Organisasi", value: founder.organizationLong ? `${founder.roleLine} (${founder.organizationLong})` : founder.roleLine }] : []),
    { label: "Alamat", value: address.full },
    { label: "Kelas", value: listJoin(classes), href: "/program" },
    ...(hours.length ? [{ label: "Jam buka", value: hours.join("; ") }] : []),
    { label: "Layanan lain", value: "Sewa studio untuk kelas privat, komunitas, dan acara", href: "/rental" },
    {
      label: "Pendaftaran",
      value: `WhatsApp ${formatPhone(settings.whatsapp)}`,
      href: `https://wa.me/${settings.whatsapp}`,
    },
  ]

  return { definition, facts }
}
