import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/atoms/badge"
import { ProgramIcon } from "@/components/atoms/icon"
import { Heading, Text } from "@/components/atoms/typography"
import type { ProgramRow } from "@/types/database"

type ProgramCardProps = {
  program: Pick<ProgramRow, "title" | "slug" | "summary" | "icon" | "category">
  headingLevel?: "h2" | "h3"
}

/** Icon disc overlaps the top edge (reference: services grid). Whole card is one link. */
export function ProgramCard({ program, headingLevel = "h3" }: ProgramCardProps) {
  return (
    <article className="spotlight group relative mt-7 flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white px-6 pt-12 pb-6 shadow-soft transition-[box-shadow,transform,border-color] duration-300 focus-within:border-brand-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <span
        aria-hidden
        className="absolute -top-7 left-6 z-10 grid size-14 place-items-center rounded-full bg-brand-500 text-white shadow-brand ring-[6px] ring-white transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[8deg] motion-reduce:transition-none"
      >
        <ProgramIcon name={program.icon} className="size-6" />
      </span>

      <div className="flex items-center justify-between gap-3">
        <Heading as={headingLevel} size="title">
          <Link
            href={`/program/${program.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none"
          >
            {program.title}
          </Link>
        </Heading>
        {program.category === "aqua" ? <Badge variant="secondary">Kelas air</Badge> : null}
      </div>

      <Text size="small" className="flex-1">
        {program.summary}
      </Text>

      <span aria-hidden className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        Selengkapnya
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </article>
  )
}
