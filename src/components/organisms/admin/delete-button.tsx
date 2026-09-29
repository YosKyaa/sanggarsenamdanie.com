"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/atoms/button"
import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import { deleteResource } from "@/features/admin/actions"

type DeleteButtonProps = {
  resourceKey: string
  id: string
  singular: string
  name: string
  /** Where to go after a successful delete (the list page). */
  redirectTo: string
}

/** Delete on the edit page: confirm, toast, then back to the list. */
export function DeleteButton({ resourceKey, id, singular, name, redirectTo }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden />
        Hapus
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="danger"
        title={`Hapus ${singular}?`}
        description={
          <>
            <strong className="text-ink">{name}</strong> akan dihapus permanen dan langsung hilang dari website.
          </>
        }
        confirmLabel="Ya, hapus"
        onConfirm={() => deleteResource(resourceKey, id)}
        onSuccess={() => router.push(redirectTo)}
      />
    </>
  )
}
