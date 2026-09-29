import type { ProgramIntensity, RequestStatus, Weekday } from "@/types/database"

export const weekdays: Weekday[] = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"]

export const weekdayLabel: Record<Weekday, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
}

export const intensityLabel: Record<ProgramIntensity, string> = {
  ringan: "Ringan",
  sedang: "Sedang",
  tinggi: "Tinggi",
}

export const statusLabel: Record<RequestStatus, string> = {
  new: "Diterima",
  contacted: "Sudah dihubungi",
  completed: "Selesai",
}

/** "07:30:00" → "07.30" (Indonesian time notation) */
export function formatTime(time: string): string {
  return time.slice(0, 5).replace(":", ".")
}

export function formatDate(value: string, withTime = false): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Jakarta",
  }).format(new Date(value))
}

/** Rough reading time at ~200 words per minute. */
export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 200))
}
