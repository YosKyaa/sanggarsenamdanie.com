import { cn } from "cn"
import type { LucideIcon } from "lucide-react"

type GlassChipProps = {
  icon: LucideIcon
  title: string
  subtitle: string
  className?: string
}

/** Frosted floating badge used around the hero portrait. */
export function GlassChip({ icon: Icon, title, subtitle, className }: GlassChipProps) {
  return (
    <p className={cn("glass flex items-center gap-3 rounded-2xl px-4 py-3", className)}>
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
        <Icon className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold whitespace-nowrap text-ink">{title}</span>
        <span className="text-xs font-medium whitespace-nowrap text-brand-800">{subtitle}</span>
      </span>
    </p>
  )
}
