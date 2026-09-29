import type { VariantProps } from "class-variance-authority"
import { MessageCircle } from "lucide-react"
import type { ReactNode } from "react"

import { ButtonLink, buttonVariants } from "@/components/atoms/button"

type WhatsAppButtonProps = VariantProps<typeof buttonVariants> & {
  href: string
  children: ReactNode
  className?: string
}

/** Opens a WhatsApp chat in a new tab — every "join" action on the site goes through this. */
export function WhatsAppButton({ href, children, variant = "default", size, className }: WhatsAppButtonProps) {
  return (
    <ButtonLink href={href} external variant={variant} size={size} className={className}>
      <MessageCircle aria-hidden />
      {children}
    </ButtonLink>
  )
}
