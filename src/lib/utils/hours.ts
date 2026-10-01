/**
 * Opening hours are stored in schema.org `openingHours` format
 * ("Mo-Fr 06:00-20:00") so they feed Google directly, and shown in Indonesian.
 */
const days = { Mo: "Senin", Tu: "Selasa", We: "Rabu", Th: "Kamis", Fr: "Jumat", Sa: "Sabtu", Su: "Minggu" } as const
type Day = keyof typeof days

export const openingHoursPattern =
  /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))? ([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-4]):[0-5]\d$/

/** "Mo-Fr 06:00-20:00" → { days: "Senin–Jumat", time: "06.00–20.00" }; null when malformed. */
export function formatOpeningHours(entry: string): { days: string; time: string } | null {
  if (!openingHoursPattern.test(entry)) return null
  const [range, time] = entry.split(" ")
  const [from, to] = range.split("-") as [Day, Day | undefined]
  const [open, close] = time.split("-")
  return {
    days: to ? `${days[from]}–${days[to]}` : days[from],
    time: `${open.replace(":", ".")}–${close.replace(":", ".")}`,
  }
}
