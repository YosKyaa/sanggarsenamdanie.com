import { cn } from "cn"
import { ChevronDown } from "lucide-react"
import type { ComponentProps } from "react"

export { Input } from "@/components/ui/input"
export { Textarea } from "@/components/ui/textarea"
export { Label } from "@/components/ui/label"

/**
 * Native select styled like Input: works with FormData without JavaScript
 * and keeps the platform picker on mobile.
 */
export function NativeSelect({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full cursor-pointer appearance-none rounded-2xl border border-input bg-white pr-11 pl-4 text-base text-ink transition-[border-color,box-shadow] outline-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-200 focus-visible:outline-none aria-invalid:border-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted" />
    </div>
  )
}
