import "server-only"

import { z } from "zod"

/** First message per field, in the shape FormState.fieldErrors expects. */
export function fieldErrorsOf<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  const { fieldErrors } = z.flattenError(error)
  const result: Partial<Record<T, string>> = {}
  for (const [key, messages] of Object.entries(fieldErrors) as [T, string[] | undefined][]) {
    if (messages?.[0]) result[key] = messages[0]
  }
  return result
}
