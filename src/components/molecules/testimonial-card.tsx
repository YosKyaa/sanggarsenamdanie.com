import { Quote } from "lucide-react"

import { Avatar } from "@/components/atoms/avatar"
import type { TestimonialRow } from "@/types/database"

export function TestimonialCard({ testimonial }: { testimonial: TestimonialRow }) {
  return (
    <figure className="spotlight relative flex h-full flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 lg:p-7">
      <Quote aria-hidden className="size-8 fill-brand-100 text-brand-300" />
      <blockquote className="flex-1 text-base leading-relaxed text-ink">
        <p>&ldquo;{testimonial.message}&rdquo;</p>
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-line pt-5">
        <Avatar name={testimonial.name} src={testimonial.photo_url} size={44} />
        <span className="flex flex-col">
          <span className="font-semibold text-ink">{testimonial.name}</span>
          {testimonial.context ? <span className="text-sm text-ink-muted">{testimonial.context}</span> : null}
        </span>
      </figcaption>
    </figure>
  )
}
