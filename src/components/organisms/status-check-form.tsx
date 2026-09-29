"use client"

import { cn } from "cn"
import { Check, Loader2 } from "lucide-react"
import { useActionState } from "react"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { FormAlert } from "@/components/organisms/form-feedback"
import { checkRequestStatus, type StatusResult } from "@/features/rentals/status"
import { formatDate, statusLabel } from "@/lib/utils/format"
import type { RequestStatus } from "@/types/database"

const steps: RequestStatus[] = ["new", "contacted", "completed"]
const initial: StatusResult = { status: "idle" }

export function StatusCheckForm({ whatsappHref }: { whatsappHref: string | null }) {
  const [state, action, pending] = useActionState(checkRequestStatus, initial)
  const v = state.values ?? {}
  const e = state.fieldErrors ?? {}
  const result = state.result

  return (
    <div className="flex flex-col gap-8">
      <form action={action} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField name="reference" idPrefix="status" label="Kode permintaan" required hint="Contoh: SSD-7KQ2MX" error={e.reference}>
            {(p) => <Input {...p} autoCapitalize="characters" defaultValue={v.reference} className="font-mono uppercase" />}
          </FormField>
          <FormField name="phone" idPrefix="status" label="Nomor WhatsApp saat mendaftar" required error={e.phone}>
            {(p) => <Input {...p} type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} />}
          </FormField>
        </div>
        <FormAlert message={state.message} whatsappHref={whatsappHref} />
        <Button type="submit" size="lg" disabled={pending} className="sm:self-start">
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
          {pending ? "Memeriksa…" : "Cek Status"}
        </Button>
      </form>

      {result ? (
        <section aria-live="polite" aria-labelledby="status-result" className="rounded-[var(--radius-card)] bg-brand-50 p-6 ring-1 ring-brand-100 lg:p-8">
          <h2 id="status-result" className="text-lg font-bold text-ink">
            Permintaan sewa studio
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Dikirim {formatDate(result.createdAt, true)} · diperbarui {formatDate(result.updatedAt, true)}
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => {
              const reached = steps.indexOf(result.status) >= index
              const current = result.status === step
              return (
                <li
                  key={step}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-white p-4 ring-1",
                    current ? "ring-brand-500" : "ring-brand-100",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                      reached ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-800",
                    )}
                  >
                    {reached ? <Check className="size-4" strokeWidth={3} /> : index + 1}
                  </span>
                  <span className={cn("text-sm font-semibold", reached ? "text-ink" : "text-ink-muted")}>
                    {statusLabel[step]}
                    {current ? <span className="sr-only"> (status saat ini)</span> : null}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
