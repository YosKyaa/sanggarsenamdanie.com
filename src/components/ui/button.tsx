import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-brand-300/60 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125em]",
  {
    variants: {
      variant: {
        default: "bg-brand-700 text-white shadow-brand hover:bg-brand-800",
        outline: "border-brand-700 bg-white text-brand-700 hover:bg-brand-50",
        secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200",
        inverse: "bg-white text-brand-800 hover:bg-brand-50",
        ghost: "text-ink hover:bg-brand-50 hover:text-brand-800",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "rounded-md px-0 text-brand-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
