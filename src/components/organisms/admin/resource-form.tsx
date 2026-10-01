"use client"

import { cn } from "cn"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/atoms/button"
import { Input, NativeSelect, Textarea } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { ConfirmDialog } from "@/components/organisms/admin/confirm-dialog"
import { FormAlert } from "@/components/organisms/form-feedback"
import type { FieldConfig, ResourceKey } from "@/features/admin/resources"
import { resources } from "@/features/admin/resources"
import type { FormState } from "@/lib/forms"

type Option = { value: string; label: string }

type ResourceFormProps = {
  resourceKey: ResourceKey
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  initialValues: Record<string, unknown>
  relationOptions: { programs: Option[]; instructors: Option[] }
}

/** Serialise DB values into the string form inputs expect. */
function toInputValue(field: FieldConfig, value: unknown): string {
  if (value == null) return ""
  if (field.type === "tags" && Array.isArray(value)) return value.join("\n")
  if (field.type === "time" && typeof value === "string") return value.slice(0, 5)
  return String(value)
}

export function ResourceForm({ resourceKey, action, initialValues, relationOptions }: ResourceFormProps) {
  const resource = resources[resourceKey]
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState)
  const alertRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  // Tracks unsaved edits so "Batal" can ask before throwing them away.
  const [dirty, setDirty] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const listHref = `/admin/${resource.key}`

  useEffect(() => {
    if (state.status !== "error") return
    alertRef.current?.focus()
    toast.error(state.message ?? "Gagal menyimpan. Periksa kembali isian.")
  }, [state])

  // Warn before closing the tab or reloading with unsaved edits.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  const errors = state.fieldErrors ?? {}
  // A field with `section` starts a new titled group.
  const groups = resource.fields.reduce<{ title: string | null; fields: FieldConfig[] }[]>((acc, field) => {
    if (field.section || acc.length === 0) acc.push({ title: field.section ?? null, fields: [] })
    acc[acc.length - 1].fields.push(field)
    return acc
  }, [])
  const valueOf = (field: FieldConfig) =>
    state.values && field.name in state.values ? (state.values[field.name] ?? "") : toInputValue(field, initialValues[field.name])

  return (
    <form
      action={formAction}
      noValidate
      onChange={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
      className="flex flex-col gap-6"
    >
      <div ref={alertRef} tabIndex={-1} className="outline-none">
        <FormAlert message={state.message} />
      </div>

      {groups.map((group) => (
        <fieldset key={group.title ?? "main"} className="flex min-w-0 flex-col gap-5">
          {group.title ? (
            <legend className="mb-1 w-full border-b border-line pb-2 text-base font-bold text-ink">{group.title}</legend>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2">
            {group.fields.map((field) => {
              const value = valueOf(field)
              const wide = field.wide || field.type === "boolean"

              if (field.type === "boolean") {
                const stored = initialValues[field.name]
                const checked = state.values
                  ? state.values[field.name] === "on"
                  : typeof stored === "boolean"
                    ? stored
                    : (field.defaultChecked ?? false)
                return (
                  <div key={field.name} className={cn("flex flex-col gap-1", wide && "md:col-span-2")}>
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
                      <input
                        type="checkbox"
                        name={field.name}
                        defaultChecked={checked}
                        className="size-5 cursor-pointer rounded accent-brand-700"
                        aria-describedby={field.hint ? `adm-${field.name}-hint` : undefined}
                      />
                      {field.label}
                    </label>
                    {field.hint ? (
                      <p id={`adm-${field.name}-hint`} className="pl-8 text-sm text-ink-muted">
                        {field.hint}
                      </p>
                    ) : null}
                  </div>
                )
              }

              return (
                <FormField
                  key={field.name}
                  name={field.name}
                  idPrefix="adm"
                  label={field.label}
                  required={field.required}
                  hint={field.hint}
                  error={errors[field.name]}
                  className={cn(wide && "md:col-span-2")}
                >
                  {(p) => {
                    switch (field.type) {
                      case "textarea":
                      case "tags":
                        return <Textarea {...p} defaultValue={value} rows={field.rows ?? (field.type === "tags" ? 5 : 4)} />
                      case "number":
                        return <Input {...p} type="number" inputMode={field.step ? "decimal" : "numeric"} step={field.step} defaultValue={value} />
                      case "date":
                        return <Input {...p} type="date" defaultValue={value} />
                      case "time":
                        return <Input {...p} type="time" defaultValue={value} />
                      case "select": {
                        const options = field.relation ? relationOptions[field.relation] : (field.options ?? [])
                        return (
                          <NativeSelect {...p} defaultValue={value}>
                            {!field.required || !value ? (
                              <option value="">{field.required ? "Pilih…" : "— Tidak ada —"}</option>
                            ) : null}
                            {options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </NativeSelect>
                        )
                      }
                      case "image":
                        return (
                          <div className="flex flex-col gap-3">
                            <input type="hidden" name={field.name} value={toInputValue(field, initialValues[field.name])} />
                            {initialValues[field.name] ? (
                              <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-soft p-3 ring-1 ring-line">
                                {String(initialValues[field.name]).toLowerCase().endsWith(".pdf") ? (
                                  <span className="text-sm font-semibold text-ink">Dokumen PDF</span>
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary upload
                                  <img
                                    src={String(initialValues[field.name])}
                                    alt="Gambar saat ini"
                                    className="size-20 rounded-xl object-cover"
                                  />
                                )}
                                <Link
                                  href={String(initialValues[field.name])}
                                  target="_blank"
                                  className="text-sm font-semibold text-brand-700 underline underline-offset-4"
                                >
                                  Buka file
                                </Link>
                                <label className="flex items-center gap-2 text-sm text-ink">
                                  <input type="checkbox" name={`${field.name}__remove`} className="size-4 accent-brand-700" />
                                  Hapus file ini
                                </label>
                              </div>
                            ) : null}
                            <Input
                              id={p.id}
                              name={`${field.name}__file`}
                              type="file"
                              accept={field.allowPdf ? "image/*,application/pdf" : "image/*"}
                              aria-invalid={p["aria-invalid"]}
                              aria-describedby={p["aria-describedby"]}
                              className="h-auto py-2.5 file:mr-3 file:rounded-full file:bg-brand-100 file:px-4 file:py-1.5 file:text-brand-800"
                            />
                          </div>
                        )
                      default:
                        return <Input {...p} defaultValue={value} />
                    }
                  }}
                </FormField>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
          {pending ? "Menyimpan…" : "Simpan"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => (dirty ? setConfirmLeave(true) : router.push(listHref))}
        >
          Batal
        </Button>
        {dirty ? <span className="self-center text-sm text-ink-muted">Ada perubahan yang belum disimpan</span> : null}
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        tone="danger"
        title="Buang perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmLabel="Ya, buang perubahan"
        onConfirm={() => {
          setDirty(false)
          router.push(listHref)
        }}
      />
    </form>
  )
}
