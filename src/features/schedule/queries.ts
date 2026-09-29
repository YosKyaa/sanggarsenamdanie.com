import "server-only"

import { unstable_cache } from "next/cache"

import { getPrograms } from "@/features/programs/queries"
import { cacheTags, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { getPublicClient } from "@/lib/supabase/public"
import { weekdays } from "@/lib/utils/format"
import type { ClassScheduleRow } from "@/types/database"

export type ScheduleEntry = ClassScheduleRow & { programTitle: string; programSlug: string }

const getScheduleRows = unstable_cache(
  async (): Promise<ClassScheduleRow[]> => {
    if (!isSupabaseConfigured) return []

    const { data, error } = await getPublicClient()
      .from("class_schedule")
      .select("*")
      .eq("is_active", true)
      .order("time_start")

    if (error) {
      console.error("[schedule] query failed:", error.message)
      return []
    }
    return data
  },
  ["schedule:list"],
  { tags: [cacheTags.schedule], revalidate: PUBLIC_REVALIDATE_SECONDS },
)

/** Active classes of active programs, ordered Monday → Sunday, then by start time. */
export async function getSchedule(): Promise<ScheduleEntry[]> {
  const [rows, programs] = await Promise.all([getScheduleRows(), getPrograms()])
  const programById = new Map(programs.map((p) => [p.id, p]))

  return rows
    .flatMap((row) => {
      const program = programById.get(row.program_id)
      return program ? [{ ...row, programTitle: program.title, programSlug: program.slug }] : []
    })
    .sort(
      (a, b) =>
        weekdays.indexOf(a.day) - weekdays.indexOf(b.day) || a.time_start.localeCompare(b.time_start),
    )
}
