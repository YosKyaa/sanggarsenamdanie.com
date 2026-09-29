"use client"

import { KeyRound, Loader2, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/atoms/button"
import { NativeSelect } from "@/components/atoms/input"
import { roleLabel } from "@/components/organisms/admin/admin-ui"
import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteUser, resetUserPassword, updateUserRole } from "@/features/users/actions"
import type { ProfileRole } from "@/types/database"

import { PasswordInput } from "./password-input"

const roles: ProfileRole[] = ["admin", "editor", "member"]

/** Role dropdown; every change is confirmed first. */
export function UserRoleSelect({ id, role, name, disabled }: { id: string; role: ProfileRole; name: string; disabled?: boolean }) {
  const [pending, setPending] = useState<ProfileRole | null>(null)

  return (
    <>
      <label className="sr-only" htmlFor={`role-${id}`}>
        Peran {name}
      </label>
      <NativeSelect
        id={`role-${id}`}
        value={role}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.value as ProfileRole
          if (next !== role) setPending(next)
        }}
        className="h-9 w-40 rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {roleLabel[r]}
          </option>
        ))}
      </NativeSelect>
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        tone={pending === "member" ? "danger" : "default"}
        title="Ubah peran pengguna?"
        description={
          <>
            <strong className="text-ink">{name}</strong> akan diubah dari{" "}
            <strong className="text-ink">{roleLabel[role]}</strong> menjadi{" "}
            <strong className="text-ink">{pending ? roleLabel[pending] : ""}</strong>.
            {pending === "member" ? " Akun ini tidak akan bisa membuka admin lagi." : null}
            {pending === "admin" ? " Admin bisa mengelola pengguna dan pengaturan situs." : null}
          </>
        }
        confirmLabel="Ya, ubah peran"
        onConfirm={() => (pending ? updateUserRole(id, pending) : undefined)}
        onSuccess={() => setPending(null)}
      />
    </>
  )
}

/** Reset password + delete, both behind a dialog. Hidden for your own account. */
export function UserRowActions({ id, name, canManageAuth }: { id: string; name: string; canManageAuth: boolean }) {
  const [resetting, setResetting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [password, setPassword] = useState("")
  const [pending, startTransition] = useTransition()

  const submitReset = () =>
    startTransition(async () => {
      const result = await resetUserPassword(id, password)
      if (result.ok) {
        toast.success(result.message)
        setResetting(false)
        setPassword("")
      } else {
        toast.error(result.message)
      }
    })

  const disabledHint = canManageAuth ? undefined : "Butuh SUPABASE_SERVICE_ROLE_KEY"

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => setResetting(true)}
        disabled={!canManageAuth}
        title={disabledHint}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <KeyRound aria-hidden className="size-4" />
        Reset password<span className="sr-only"> {name}</span>
      </button>
      <button
        type="button"
        onClick={() => setDeleting(true)}
        disabled={!canManageAuth}
        title={disabledHint}
        className="inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 aria-hidden className="size-4" />
        <span className="sr-only">Hapus akun {name}</span>
      </button>

      <Dialog open={resetting} onOpenChange={(open) => !pending && setResetting(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ganti password {name}?</DialogTitle>
            <DialogDescription>
              Password lama langsung tidak berlaku. Berikan password baru ini ke pengguna tersebut.
            </DialogDescription>
          </DialogHeader>
          <PasswordInput
            aria-label="Password baru"
            placeholder="Password baru"
            value={password}
            onValueChange={setPassword}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" disabled={pending} />}>Batal</DialogClose>
            <Button onClick={submitReset} disabled={pending || password.length < 8}>
              {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {pending ? "Menyimpan…" : "Ganti password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        tone="danger"
        title="Hapus akun?"
        description={
          <>
            Akun <strong className="text-ink">{name}</strong> akan dihapus permanen dan tidak bisa login lagi.
          </>
        }
        confirmLabel="Ya, hapus akun"
        onConfirm={() => deleteUser(id)}
      />
    </div>
  )
}
