import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps, ElementType, ReactNode } from "react"

const headingVariants = cva("font-heading font-extrabold tracking-[-0.02em] text-balance text-ink", {
  variants: {
    size: {
      display: "text-[2.25rem] leading-[1.12] lg:text-[3.5rem] lg:leading-[1.08]",
      section: "text-[1.875rem] leading-[1.18] lg:text-[2.625rem] lg:leading-[1.14]",
      title: "text-xl leading-snug font-bold tracking-[-0.01em]",
      subtitle: "text-lg leading-snug font-bold tracking-normal",
    },
  },
  defaultVariants: { size: "section" },
})

type HeadingProps = ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & { as?: "h1" | "h2" | "h3" | "h4" | "p" }

export function Heading({ as: Tag = "h2", size, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />
}

const textVariants = cva("text-pretty", {
  variants: {
    size: {
      lead: "text-base leading-relaxed lg:text-lg",
      body: "text-base leading-relaxed",
      small: "text-sm leading-relaxed",
    },
    tone: {
      default: "text-ink",
      muted: "text-ink-muted",
      inverse: "text-white/90",
    },
  },
  defaultVariants: { size: "body", tone: "muted" },
})

type TextProps = ComponentProps<"p"> & VariantProps<typeof textVariants> & { as?: ElementType }

export function Text({ as: Tag = "p", size, tone, className, ...props }: TextProps) {
  return <Tag className={cn(textVariants({ size, tone }), className)} {...props} />
}

/** Small label above headings, with the ringed dot from the reference design. */
export function Eyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode
  className?: string
  tone?: "brand" | "inverse"
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold",
        tone === "brand" ? "text-brand-700" : "text-white",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-4 place-items-center rounded-full ring-[1.5px]",
          tone === "brand" ? "ring-brand-500" : "ring-white/80",
        )}
      >
        <span className={cn("size-1.5 rounded-full", tone === "brand" ? "bg-brand-500" : "bg-white")} />
      </span>
      {children}
    </p>
  )
}
