"use client"

import { Loader2 } from "lucide-react"
import { useActionState, useEffect, useRef, useState } from "react"

import { Button } from "@/components/atoms/button"
import { Input, Textarea } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { FormAlert, Honeypot, SubmissionSuccess } from "@/components/organisms/form-feedback"
import { submitRental } from "@/features/rentals/actions"
import type { RentalField } from "@/features/rentals/schema"
import type { FormState } from "@/lib/forms"

const initial: FormState<RentalField> = { status: "idle" }

export function RentalForm({ whatsappHref, responseTime }: { whatsappHref: string; responseTime: string }) {
  const [state, action, pending] = useActionState(submitRental, initial)
  const alertRef = useRef<HTMLDivElement>(null)
  // Set after mount so the page stays static; the server re-validates the date anyway.
  const [minDate, setMinDate] = useState<string>()

  useEffect(() => {
    setMinDate(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date()))
  }, [])

  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus()
  }, [state])

  if (state.status === "success") {
    return (
      <SubmissionSuccess
        title="Permintaan sewa studio sudah kami terima!"
        reference={state.reference}
        nextStep={`Kami akan mengonfirmasi ketersediaan tanggal dan biaya melalui WhatsApp ${responseTime}.`}
        whatsappHref={whatsappHref}
      />
    )
  }

  const v = state.values ?? {}
  const e = state.fieldErrors ?? {}

  return (
    <form action={action} noValidate className="relative flex flex-col gap-5">
      <div ref={alertRef} tabIndex={-1} className="outline-none">
        <FormAlert message={state.message} whatsappHref={state.fieldErrors ? null : whatsappHref} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField name="name" idPrefix="rental" label="Nama penanggung jawab" required error={e.name}>
          {(p) => <Input {...p} autoComplete="name" defaultValue={v.name} />}
        </FormField>
        <FormField name="phone" idPrefix="rental" label="Nomor WhatsApp" required error={e.phone}>
          {(p) => <Input {...p} type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} placeholder="0812 3456 7890" />}
        </FormField>
      </div>

      <FormField
        name="organization"
        idPrefix="rental"
        label="Komunitas / instansi"
        hint="Misalnya nama komunitas, kantor, atau sekolah."
        error={e.organization}
      >
        {(p) => <Input {...p} autoComplete="organization" defaultValue={v.organization} />}
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField name="event_date" idPrefix="rental" label="Tanggal acara" required error={e.event_date}>
          {(p) => <Input {...p} type="date" min={minDate} defaultValue={v.event_date} />}
        </FormField>
        <FormField name="participant_count" idPrefix="rental" label="Perkiraan jumlah peserta" required error={e.participant_count}>
          {(p) => <Input {...p} type="number" inputMode="numeric" min={1} max={500} defaultValue={v.participant_count} />}
        </FormField>
      </div>

      <FormField
        name="message"
        idPrefix="rental"
        label="Detail acara"
        hint="Jenis kegiatan, jam mulai–selesai, dan kebutuhan khusus (sound system, instruktur, dll)."
        error={e.message}
      >
        {(p) => <Textarea {...p} rows={4} maxLength={1000} defaultValue={v.message} />}
      </FormField>

      <Honeypot />

      <Button type="submit" size="lg" disabled={pending} className="sm:self-end">
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
        {pending ? "Mengirim…" : "Kirim Permintaan Sewa"}
      </Button>
    </form>
  )
}
