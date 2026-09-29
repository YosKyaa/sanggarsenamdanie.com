import type { LucideIcon } from "lucide-react"

import { Heading, Text } from "@/components/atoms/typography"

/** Icon disc + title + description, as in the reference's "About" list. */
export function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-brand"
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="subtitle">
          {title}
        </Heading>
        <Text size="small">{description}</Text>
      </div>
    </li>
  )
}
