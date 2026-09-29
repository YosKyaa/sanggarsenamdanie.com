import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

/** 1200px content column with mobile-safe gutters. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6 xl:px-0", className)} {...props} />
}

const sectionVariants = cva("relative py-16 lg:py-[100px]", {
  variants: {
    tone: {
      default: "bg-white",
      soft: "bg-surface-soft",
    },
  },
  defaultVariants: { tone: "default" },
})

export function Section({
  className,
  tone,
  ...props
}: ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
  return <section className={cn(sectionVariants({ tone }), className)} {...props} />
}
