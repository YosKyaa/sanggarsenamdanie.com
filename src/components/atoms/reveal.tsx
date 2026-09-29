import { cn } from "cn"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}

/** Rise-in on scroll via CSS scroll timelines (see .reveal in globals.css). Zero JS. */
export function Reveal({ children, className, as: Tag = "div" }: RevealProps) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>
}
