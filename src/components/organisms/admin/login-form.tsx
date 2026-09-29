"use client"

import { Loader2 } from "lucide-react"
import { useActionState } from "react"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { FormAlert } from "@/components/organisms/form-feedback"
import { signIn } from "@/features/admin/auth-actions"
import type { FormState } from "@/lib/forms"

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(signIn, { status: "idle" } as FormState<"email">)

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormAlert message={state.message ?? notice} />
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <FormField name="email" idPrefix="login" label="Email" required>
        {(p) => <Input {...p} type="email" autoComplete="email" defaultValue={state.values?.email} />}
      </FormField>
      <FormField name="password" idPrefix="login" label="Kata sandi" required>
        {(p) => <Input {...p} type="password" autoComplete="current-password" />}
      </FormField>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
        {pending ? "Masuk…" : "Masuk"}
      </Button>
    </form>
  )
}
