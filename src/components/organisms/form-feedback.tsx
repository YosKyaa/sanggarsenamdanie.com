import { cn } from "cn"
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { ButtonLink } from "@/components/atoms/button"
import { HONEYPOT_FIELD } from "@/lib/forms"

/** Error summary announced to screen readers when a submit fails. */
export function FormAlert({
  message,
  whatsappHref,
  tone = "default",
}: {
  message?: string
  whatsappHref?: string | null
  tone?: "default" | "inverse"
}) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-2xl p-4 text-sm",
        tone === "default" ? "bg-red-50 text-red-800 ring-1 ring-red-200" : "bg-white text-red-800",
      )}
    >
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-1.5">
        <p>{message}</p>
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
            Hubungi via WhatsApp<span className="sr-only"> (membuka tab baru)</span>
          </a>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Confirmation after a request is stored. Shows the reference code, the current
 * status and the next step, so visitors know exactly what happens now.
 */
export function SubmissionSuccess({
  title,
  reference,
  nextStep,
  whatsappHref,
  children,
}: {
  title: string
  reference?: string
  nextStep: string
  whatsappHref?: string | null
  children?: ReactNode
}) {
  return (
    <div role="status" className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-brand-50 p-6 ring-1 ring-brand-100 lg:p-8">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden className="size-7 shrink-0 text-brand-700" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-ink">{title}</p>
          <p className="text-sm text-ink-muted">{nextStep}</p>
        </div>
      </div>

      {reference ? (
        <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-brand-100">
          <div>
            <dt className="text-ink-muted">Kode permintaan</dt>
            <dd className="font-mono text-base font-bold tracking-wider text-brand-800">{reference}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Status</dt>
            <dd className="font-semibold text-ink">Diterima — menunggu dihubungi</dd>
          </div>
        </dl>
      ) : null}

      {reference ? (
        <p className="text-sm text-ink-muted">
          Simpan kode ini. Anda bisa memantau prosesnya di{" "}
          <Link href="/cek-status" className="font-semibold text-brand-700 underline underline-offset-4">
            halaman Cek Status
          </Link>
          .
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {whatsappHref ? (
          <ButtonLink href={whatsappHref} external variant="whatsapp">
            <MessageCircle aria-hidden />
            Konfirmasi via WhatsApp
          </ButtonLink>
        ) : null}
        {children}
      </div>
    </div>
  )
}

/** Visually hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Jangan isi kolom ini
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}
