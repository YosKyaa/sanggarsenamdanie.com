import { site } from "@/lib/content/site"

/** wa.me link with a prefilled message — the site's single conversion channel. */
export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const whatsappMessages = {
  general: `Halo ${site.name}, saya ingin bertanya tentang kelas senam.`,
  join: `Halo ${site.name}, saya ingin ikut kelas senam. Boleh info jadwal dan biayanya?`,
  rental: `Halo ${site.name}, saya ingin menanyakan sewa studio.`,
  schedule: `Halo ${site.name}, boleh minta jadwal kelas terbaru?`,
  program: (title: string) => `Halo ${site.name}, saya tertarik dengan kelas ${title}. Boleh info jadwal dan biayanya?`,
} as const
