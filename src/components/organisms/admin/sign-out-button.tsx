"use client"

import { LogOut } from "lucide-react"
import { useState } from "react"

import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import { signOut } from "@/features/admin/auth-actions"

export function SignOutButton() {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 font-semibold text-ink hover:text-brand-700"
      >
        <LogOut aria-hidden className="size-4" />
        Keluar
      </button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Keluar dari admin?"
        description="Anda perlu login lagi untuk mengelola website."
        confirmLabel="Ya, keluar"
        onConfirm={() => signOut()}
      />
    </>
  )
}
