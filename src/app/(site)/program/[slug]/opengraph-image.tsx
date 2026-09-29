import { getProgramBySlug, getPrograms } from "@/features/programs/queries"
import { site } from "@/lib/content/site"
import { ogContentType, ogSize, renderOg } from "@/lib/seo/og"

export const alt = `Kelas di ${site.name}`
export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
  const programs = await getPrograms()
  return programs.map((program) => ({ slug: program.slug }))
}

export default async function ProgramOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  return renderOg({
    eyebrow: program?.category === "aqua" ? "Kelas Air" : "Kelas Studio",
    lines: [`Kelas ${program?.title ?? "Senam"}`, "di Depok"],
    footer: program?.summary ?? site.name,
  })
}
