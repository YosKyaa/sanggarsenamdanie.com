import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import Link from "next/link"
import type { ComponentProps } from "react"

import { Button, buttonVariants } from "@/components/ui/button"

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    /** Opens in a new tab with safe rel attributes (e.g. WhatsApp, Maps). */
    external?: boolean
  }

/** Link styled as a button — navigation must stay an <a>, never a <button>. */
function ButtonLink({ className, variant, size, external, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (membuka tab baru)</span> : null}
    </Link>
  )
}

export { Button, ButtonLink, buttonVariants }
