import { randomInt } from "node:crypto"

// No 0/O/1/I so codes are easy to read aloud over WhatsApp.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function createReferenceCode(): string {
  let code = ""
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)]
  return `SSD-${code}`
}

export const referencePattern = /^SSD-[A-Z0-9]{6}$/
