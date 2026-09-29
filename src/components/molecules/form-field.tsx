import { cn } from "cn"
import type { ReactNode } from "react"

import { Label } from "@/components/atoms/input"

export type ControlProps = {
  id: string
  name: string
  required?: boolean
  "aria-invalid"?: true
  "aria-describedby"?: string
}

type FormFieldProps = {
  name: string
  label: string
  /** Prefix keeps ids unique when the same form appears twice on a page. */
  idPrefix?: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  labelClassName?: string
  children: (control: ControlProps) => ReactNode
}

/**
 * Label + control + hint + error, wired for assistive tech: the control gets
 * aria-invalid and aria-describedby pointing at the hint and error text.
 */
export function FormField({
  name,
  label,
  idPrefix = "f",
  hint,
  error,
  required,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const id = `${idPrefix}-${name}`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className={labelClassName}>
        {label}
        {required ? (
          <span aria-hidden className="text-brand-700">
            *
          </span>
        ) : (
          <span className="font-normal text-ink-muted">(opsional)</span>
        )}
      </Label>
      {children({
        id,
        name,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
