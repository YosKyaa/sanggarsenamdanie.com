"use client"

import { Loader2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/atoms/button"
import { Input, NativeSelect } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { FormAlert } from "@/components/organisms/form-feedback"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createUser } from "@/features/users/actions"
import type { FormState } from "@/lib/forms"

import { PasswordInput } from "./password-input"

type Field = "name" | "email" | "password" | "role"
const initial: FormState<Field> = { status: "idle" }

/** "Tambah pengguna": creates a confirmed login account with a role, in one step. */
export function CreateUserDialog({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  // Remounts the form (fresh state) every time the dialog opens.
  const [formKey, setFormKey] = useState(0)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setFormKey((k) => k + 1)
      }}
    >
      <DialogTrigger render={<Button disabled={disabled} />}>
        <UserPlus aria-hidden />
        Tambah pengguna
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah pengguna</DialogTitle>
          <DialogDescription>
            Akun langsung aktif tanpa verifikasi email. Berikan email dan password ini ke orang tersebut.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm key={formKey} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CreateUserForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState(createUser, initial)
  const [password, setPassword] = useState("")
  const router = useRouter()
  const e = state.fieldErrors ?? {}
  const v = state.values ?? {}

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Akun berhasil dibuat.")
      router.refresh()
      onDone()
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message ?? "Gagal membuat akun.")
    }
  }, [state, router, onDone])

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      {state.fieldErrors ? <FormAlert message={state.message} /> : null}
      <FormField name="name" idPrefix="new-user" label="Nama" required error={e.name}>
        {(p) => <Input {...p} defaultValue={v.name} autoComplete="off" />}
      </FormField>
      <FormField name="email" idPrefix="new-user" label="Email" required error={e.email}>
        {(p) => <Input {...p} type="email" defaultValue={v.email} autoComplete="off" />}
      </FormField>
      <FormField
        name="password"
        idPrefix="new-user"
        label="Password"
        required
        hint="Minimal 8 karakter, berisi huruf dan angka."
        error={e.password}
      >
        {(p) => <PasswordInput {...p} value={password} onValueChange={setPassword} />}
      </FormField>
      <FormField
        name="role"
        idPrefix="new-user"
        label="Peran"
        required
        hint="Editor: kelola konten & permintaan. Admin: semua, termasuk pengguna & pengaturan."
        error={e.role}
      >
        {(p) => (
          <NativeSelect {...p} defaultValue={v.role ?? "editor"}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="member">Tanpa akses</option>
          </NativeSelect>
        )}
      </FormField>
      <Button type="submit" size="lg" disabled={pending} className="sm:self-end">
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
        {pending ? "Membuat akun…" : "Buat akun"}
      </Button>
    </form>
  )
}
