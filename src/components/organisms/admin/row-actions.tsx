"use client"

import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import { deleteResource } from "@/features/admin/actions"

type RowActionsProps = {
  editHref: string
  /** Human name of the row, used in labels and the confirmation text. */
  name: string
  /** Omit to hide the delete button. */
  deletable?: { resourceKey: string; id: string; singular: string }
}

/** Edit + delete icons at the end of every table row. Delete always asks first. */
export function RowActions({ editHref, name, deletable }: RowActionsProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={editHref}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
      >
        <Pencil aria-hidden className="size-4" />
        Ubah<span className="sr-only"> {name}</span>
      </Link>
      {deletable ? (
        <>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 aria-hidden className="size-4" />
            <span className="sr-only">Hapus {name}</span>
          </button>
          <ConfirmDialog
            open={confirming}
            onOpenChange={setConfirming}
            tone="danger"
            title={`Hapus ${deletable.singular}?`}
            description={
              <>
                <strong className="text-ink">{name}</strong> akan dihapus permanen dan langsung hilang dari website.
              </>
            }
            confirmLabel="Ya, hapus"
            onConfirm={() => deleteResource(deletable.resourceKey, deletable.id)}
          />
        </>
      ) : null}
    </div>
  )
}
