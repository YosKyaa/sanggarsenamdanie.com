import { cn } from "cn"
import { UserRound } from "lucide-react"
import Image from "next/image"

type PortraitProps = {
  src?: string | null
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  /** Shown on the placeholder so admins know which photo belongs here. */
  placeholderLabel?: string
}

/**
 * Photo frame. Until a real photo is uploaded it renders a calm placeholder
 * instead of a stock image, so the site never shows someone who isn't Danie.
 */
export function Portrait({ src, alt, sizes, priority, className, placeholderLabel = "Foto" }: PortraitProps) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-100", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-brand-700">
            <span className="grid size-20 place-items-center rounded-full bg-white/70">
              <UserRound aria-hidden className="size-10" strokeWidth={1.5} />
            </span>
            <span className="text-xs font-semibold tracking-[0.12em] uppercase">{placeholderLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}
