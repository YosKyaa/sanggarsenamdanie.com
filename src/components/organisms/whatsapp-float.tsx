import { MessageCircle } from "lucide-react"

/** Persistent WhatsApp shortcut — the studio's main conversion channel. */
export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-5 font-semibold text-white shadow-[0_12px_28px_rgb(21_128_61/0.35)] transition-colors hover:bg-whatsapp-hover sm:right-6 sm:bottom-6"
    >
      <MessageCircle aria-hidden className="size-5" />
      <span className="max-sm:sr-only">Tanya via WhatsApp</span>
      <span className="sr-only"> (membuka tab baru)</span>
    </a>
  )
}
