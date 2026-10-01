"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { FormAlert } from "@/components/organisms/form-feedback"
import { signIn, signInWithGoogle } from "@/features/admin/auth-actions"
import type { FormState } from "@/lib/forms"

/** Google's multicolour "G", as required by its sign-in branding guidelines. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-5">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}

function GoogleButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      variant="outline"
      disabled={pending}
      className="w-full border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50"
    >
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : <GoogleMark />}
      {pending ? "Menghubungkan ke Google…" : "Masuk dengan Google"}
    </Button>
  )
}

type LoginFormProps = {
  next?: string
  notice?: string
  /** Shown only once Google is enabled in Supabase → Authentication → Providers. */
  googleEnabled: boolean
}

export function LoginForm({ next, notice, googleEnabled }: LoginFormProps) {
  const [state, action, pending] = useActionState(signIn, { status: "idle" } as FormState<"email">)
  const [showPassword, setShowPassword] = useState(false)
  const message = state.message ?? notice

  return (
    <div className="flex flex-col gap-6">
      <FormAlert message={message} />

      {googleEnabled ? (
        <>
          <form action={signInWithGoogle}>
            <input type="hidden" name="next" value={next ?? "/admin"} />
            <GoogleButton />
          </form>
          <div className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-ink-muted uppercase">
            <span aria-hidden className="h-px flex-1 bg-line" />
            atau dengan email
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
        </>
      ) : null}

      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <FormField name="email" idPrefix="login" label="Email" required>
          {(p) => (
            <Input {...p} type="email" autoComplete="username" inputMode="email" placeholder="nama@email.com" defaultValue={state.values?.email} />
          )}
        </FormField>
        <FormField name="password" idPrefix="login" label="Kata sandi" required>
          {(p) => (
            <div className="relative">
              <Input {...p} type={showPassword ? "text" : "password"} autoComplete="current-password" className="pr-12" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-ink-muted hover:bg-brand-50 hover:text-brand-700"
              >
                {showPassword ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
                <span className="sr-only">{showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}</span>
              </button>
            </div>
          )}
        </FormField>
        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
          {pending ? "Memeriksa…" : "Masuk"}
        </Button>
      </form>
    </div>
  )
}
