/**
 * Normalises Indonesian phone input ("0812-3456 7890", "+62 812…", "812…")
 * to the 62xxxxxxxxxx form stored in the database. Returns null when invalid.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "")
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`
  else if (digits.startsWith("8")) digits = `62${digits}`
  return /^62\d{8,13}$/.test(digits) ? digits : null
}

/** 6281234567890 → +62 812-3456-7890 */
export function formatPhone(phone: string): string {
  const local = phone.replace(/^62/, "")
  const parts = [local.slice(0, 3), local.slice(3, 7), local.slice(7)].filter(Boolean)
  return `+62 ${parts.join("-")}`
}
