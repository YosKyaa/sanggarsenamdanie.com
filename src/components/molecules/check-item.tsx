import { cn } from "cn"
import { Check } from "lucide-react"
import type { ReactNode } from "react"

export function CheckItem({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode
  tone?: "brand" | "inverse"
  className?: string
}) {
  return (
    <li className={cn("flex items-start gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
          tone === "brand" ? "bg-brand-100 text-brand-700" : "bg-white/20 text-white",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span className={cn("text-[0.9375rem] leading-snug", tone === "brand" ? "text-ink" : "text-white")}>
        {children}
      </span>
    </li>
  )
}
