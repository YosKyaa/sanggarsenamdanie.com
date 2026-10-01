import { getArticles } from "@/features/articles/queries"
import { getFaqs } from "@/features/content/queries"
import { getPrograms } from "@/features/programs/queries"
import { getSchedule } from "@/features/schedule/queries"
import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { studioFacts } from "@/lib/seo/facts"
import { formatTime, weekdayLabel } from "@/lib/utils/format"

export const revalidate = 3600

const url = (path: string) => `${site.url}${path}`

/**
 * /llms.txt (llmstxt.org): a plain-Markdown brief of the studio for AI
 * assistants and answer engines — facts, classes with schedules, FAQ and the
 * pages worth citing. Built from the same data as the site, so it never drifts.
 */
export async function GET() {
  const [settings, programs, schedule, faqs, articles] = await Promise.all([
    getSettings(),
    getPrograms(),
    getSchedule(),
    getFaqs(),
    getArticles(),
  ])
  const { definition, facts } = studioFacts(settings, programs)
  const absolute = (href: string) => (href.startsWith("/") ? url(href) : href)

  const programLines = programs.map((program) => {
    const slots = schedule
      .filter((entry) => entry.program_id === program.id)
      .map((entry) => `${weekdayLabel[entry.day]} ${formatTime(entry.time_start)}–${formatTime(entry.time_end)} (${entry.location})`)
    return [
      `- [Kelas ${program.title}](${url(`/program/${program.slug}`)}): ${program.summary}`,
      slots.length ? `  Jadwal: ${slots.join("; ")}.` : "  Jadwal: tanyakan via WhatsApp.",
    ].join("\n")
  })

  const body = [
    `# ${site.name}`,
    "",
    `> ${definition}`,
    "",
    `Slogan: ${site.slogan}. Bahasa situs: Indonesia. Situs resmi: ${site.url}`,
    "",
    "## Fakta utama",
    "",
    ...facts.map((fact) => `- ${fact.label}: ${fact.value}${fact.href ? ` (${absolute(fact.href)})` : ""}`),
    ...settings.socials.map((social) => `- ${social.platform[0].toUpperCase()}${social.platform.slice(1)}: ${social.url}`),
    ...(settings.googleMapsUrl ? [`- Google Maps: ${settings.googleMapsUrl}`] : []),
    "",
    "## Program kelas",
    "",
    ...programLines,
    "",
    "Biaya kelas berbeda per program dan diinformasikan langsung lewat WhatsApp.",
    "",
    "## Pertanyaan umum",
    "",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    "## Halaman utama",
    "",
    `- [Beranda](${url("/")}): ringkasan studio, program, dan lokasi`,
    `- [Tentang ${settings.founder.name}](${url("/about")}): profil pendiri dan sertifikasi`,
    `- [Program & jadwal](${url("/program")}): semua kelas dan jadwal mingguan`,
    `- [Sertifikat](${url("/sertifikat")}): sertifikasi instruktur`,
    `- [Galeri](${url("/galeri")}): foto kegiatan sanggar`,
    `- [Sewa studio](${url("/rental")}): formulir sewa ruang latihan`,
    `- [Kontak & lokasi](${url("/contact")}): alamat, peta, dan WhatsApp`,
    ...(articles.length
      ? ["", "## Artikel", "", ...articles.map((a) => `- [${a.title}](${url(`/artikel/${a.slug}`)}): ${a.excerpt}`)]
      : []),
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
