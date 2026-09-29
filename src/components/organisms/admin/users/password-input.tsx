"use client"

import { Eye, EyeOff, Wand2 } from "lucide-react"
import { useState, type ComponentProps } from "react"

import { Input } from "@/components/atoms/input"

/** 12 characters, always with letters and digits (meets the server rules). */
export function generatePassword(): string {
  const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  const digits = "23456789"
  const all = letters + digits
  const pick = (set: string) => set[crypto.getRandomValues(new Uint32Array(1))[0] % set.length]
  const chars = [pick(letters), pick(digits), ...Array.from({ length: 10 }, () => pick(all))]
  return chars.sort(() => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 - 0.5).join("")
}

type PasswordInputProps = Omit<ComponentProps<"input">, "type" | "value" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
}

/** Password field with show/hide and a "generate" button, for admins creating accounts. */
export function PasswordInput({ value, onValueChange, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          {...props}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          autoComplete="new-password"
          className="pr-12 font-mono"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-ink-muted hover:bg-brand-50 hover:text-brand-700"
        >
          {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          <span className="sr-only">{visible ? "Sembunyikan password" : "Tampilkan password"}</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          onValueChange(generatePassword())
          setVisible(true)
        }}
        className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
      >
        <Wand2 aria-hidden className="size-4" />
        Buat acak
      </button>
    </div>
  )
}
