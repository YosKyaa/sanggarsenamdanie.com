import "server-only"

import { weekdays } from "@/lib/utils/format"
import type { RequestStatus, StudioRentalRequestRow, Weekday } from "@/types/database"

import { requireAdmin } from "./auth"
import type { ResourceConfig } from "./resources"

export type AdminRow = Record<string, unknown> & { id: string }

export async function listResource(resource: ResourceConfig): Promise<AdminRow[]> {
  const { supabase } = await requireAdmin()
  let query = supabase.from(resource.table).select("*")
  for (const order of resource.orderBy) query = query.order(order.column, { ascending: order.ascending })

  const { data, error } = await query
  if (error) throw new Error(`Gagal memuat ${resource.label}: ${error.message}`)

  const rows = (data ?? []) as AdminRow[]
  // Weekday names don't sort alphabetically; order Monday → Sunday.
  if (resource.key === "schedules") {
    rows.sort(
      (a, b) =>
        weekdays.indexOf(a.day as Weekday) - weekdays.indexOf(b.day as Weekday) ||
        String(a.time_start).localeCompare(String(b.time_start)),
    )
  }
  return rows
}

export async function getResourceRow(resource: ResourceConfig, id: string): Promise<AdminRow | null> {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle()
  return (data as AdminRow | null) ?? null
}

/** Options for relation selects (program_id, instructor_id). */
export async function getRelationOptions() {
  const { supabase } = await requireAdmin()
  const [programs, instructors] = await Promise.all([
    supabase.from("programs").select("id, title").order("sort_order"),
    supabase.from("instructors").select("id, name").order("sort_order"),
  ])
  return {
    programs: (programs.data ?? []).map((p) => ({ value: p.id, label: p.title })),
    instructors: (instructors.data ?? []).map((i) => ({ value: i.id, label: i.name })),
  }
}

export async function listRentals(status?: RequestStatus): Promise<StudioRentalRequestRow[]> {
  const { supabase } = await requireAdmin()
  let query = supabase.from("studio_rental_requests").select("*").order("created_at", { ascending: false }).limit(200)
  if (status) query = query.eq("status", status)
  const { data, error } = await query
  if (error) throw new Error(`Gagal memuat permintaan sewa: ${error.message}`)
  return data
}

export async function getDashboardStats() {
  const { supabase } = await requireAdmin()
  const count = { count: "exact" as const, head: true }

  const [newRentals, programs, schedules, pendingTestimonials] = await Promise.all([
    supabase.from("studio_rental_requests").select("id", count).eq("status", "new"),
    supabase.from("programs").select("id", count).eq("is_active", true),
    supabase.from("class_schedule").select("id", count).eq("is_active", true),
    supabase.from("testimonials").select("id", count).eq("is_published", false),
  ])

  return {
    newRentals: newRentals.count ?? 0,
    programs: programs.count ?? 0,
    schedules: schedules.count ?? 0,
    pendingTestimonials: pendingTestimonials.count ?? 0,
  }
}
