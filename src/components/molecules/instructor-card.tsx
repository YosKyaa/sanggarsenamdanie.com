import { Badge } from "@/components/atoms/badge"
import { Heading, Text } from "@/components/atoms/typography"
import { Portrait } from "@/components/molecules/portrait"
import type { InstructorRow } from "@/types/database"

type InstructorCardProps = {
  instructor: InstructorRow
  headingLevel?: "h2" | "h3"
  /** Horizontal layout for a single featured instructor. */
  layout?: "stacked" | "wide"
}

export function InstructorCard({ instructor, headingLevel = "h3", layout = "stacked" }: InstructorCardProps) {
  const wide = layout === "wide"

  return (
    <article
      className={
        wide
          ? "spotlight relative grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          : "spotlight relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
      }
    >
      <Portrait
        src={instructor.photo_url}
        alt={`Foto ${instructor.name}`}
        sizes={wide ? "(min-width: 768px) 480px, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
        placeholderLabel={`Foto ${instructor.name}`}
        className={wide ? "aspect-[4/5] md:aspect-auto md:min-h-[420px]" : "aspect-[4/5]"}
      />

      <div className={wide ? "flex flex-col justify-center gap-4 p-6 lg:p-10" : "flex flex-1 flex-col gap-3 p-6"}>
        <div className="flex flex-col gap-1">
          <Heading as={headingLevel} size={wide ? "section" : "title"}>
            {instructor.name}
          </Heading>
          <p className="text-sm font-semibold text-brand-700">{instructor.role_title}</p>
        </div>

        {instructor.specialization ? (
          <Text size="small">
            <span className="font-semibold text-ink">Spesialisasi:</span> {instructor.specialization}
          </Text>
        ) : null}

        {wide && instructor.bio ? <Text>{instructor.bio}</Text> : null}

        {instructor.certifications.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">Sertifikasi</p>
            <ul className="flex flex-wrap gap-2">
              {instructor.certifications.map((cert) => (
                <li key={cert}>
                  <Badge>{cert}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {instructor.experience_years > 0 ? (
          <p className="mt-auto pt-2 text-sm text-ink-muted">
            <span className="font-bold text-ink">{instructor.experience_years}+ tahun</span> pengalaman mengajar
          </p>
        ) : null}
      </div>
    </article>
  )
}
