import { cn } from "cn"
import type { ReactNode } from "react"

import { Eyebrow, Heading, Text } from "@/components/atoms/typography"

type SectionHeaderProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  as?: "h1" | "h2"
  id?: string
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading as={as} id={id} size={as === "h1" ? "display" : "section"}>
        {title}
      </Heading>
      {description ? <Text size="lead">{description}</Text> : null}
    </header>
  )
}
