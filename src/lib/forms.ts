export type FormState<TField extends string = string> = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<TField, string>>
  /** Submitted values echoed back so fields keep their content after a failed submit. */
  values?: Partial<Record<TField, string>>
  reference?: string
}

/** Result of a one-shot admin action (delete, status change, user ops), shown as a toast. */
export type ActionResult = { ok: boolean; message: string }

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {}
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value
  })
  return values
}

/** Hidden field bots fill in; humans never see it. */
export const HONEYPOT_FIELD = "website"
