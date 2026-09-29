"use client"

import { useState } from "react"

import { NativeSelect } from "@/components/atoms/input"
import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import { updateRentalStatus } from "@/features/admin/actions"
import { statusLabel } from "@/lib/utils/format"
import type { RequestStatus } from "@/types/database"

const statuses = Object.keys(statusLabel) as RequestStatus[]

/** Changing a request's status asks for confirmation, then toasts the result. */
export function StatusSelect({ id, status, name }: { id: string; status: RequestStatus; name: string }) {
  const [pending, setPending] = useState<RequestStatus | null>(null)

  return (
    <>
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status permintaan {name}
      </label>
      <NativeSelect
        id={`status-${id}`}
        value={status}
        onChange={(event) => {
          const next = event.target.value as RequestStatus
          if (next !== status) setPending(next)
        }}
        className="h-9 w-44 rounded-xl text-sm"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {statusLabel[s]}
          </option>
        ))}
      </NativeSelect>
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Ubah status permintaan?"
        description={
          <>
            Status permintaan <strong className="text-ink">{name}</strong> akan diubah dari{" "}
            <strong className="text-ink">{statusLabel[status]}</strong> menjadi{" "}
            <strong className="text-ink">{pending ? statusLabel[pending] : ""}</strong>. Pemohon bisa melihat status
            ini di halaman Cek Status.
          </>
        }
        confirmLabel="Ya, ubah status"
        onConfirm={() => (pending ? updateRentalStatus(id, pending) : undefined)}
        onSuccess={() => setPending(null)}
      />
    </>
  )
}
