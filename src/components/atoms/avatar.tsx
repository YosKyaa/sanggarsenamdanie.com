import { cn } from "cn"
import Image from "next/image"

type AvatarProps = {
  name: string
  src?: string | null
  size?: number
  className?: string
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

/** Photo when available, otherwise initials on soft purple. Decorative next to a visible name. */
export function Avatar({ name, src, size = 48, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-800",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        initialsOf(name)
      )}
    </span>
  )
}
