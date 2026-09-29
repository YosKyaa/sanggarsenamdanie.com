import "server-only"

import { requireStaff } from "@/features/admin/auth"
import type { AnalyticsSummary } from "@/types/database"

export const ranges = [7, 30, 90] as const
export type Range = (typeof ranges)[number]

export function parseRange(value: string | undefined): Range {
  const n = Number(value)
  return (ranges as readonly number[]).includes(n) ? (n as Range) : 30
}

/** One RPC for the whole dashboard. Null when the analytics migration isn't installed yet. */
export async function getAnalyticsSummary(days: Range): Promise<AnalyticsSummary | null> {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase.rpc("analytics_summary", { p_days: days })
  if (error) {
    console.error("[analytics] summary failed:", error.message)
    return null
  }
  return data
}
