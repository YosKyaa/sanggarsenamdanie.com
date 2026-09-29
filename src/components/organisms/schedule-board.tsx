import { CalendarClock, Clock, MapPin } from "lucide-react"
import Link from "next/link"

import { Text } from "@/components/atoms/typography"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ScheduleEntry } from "@/features/schedule/queries"
import { formatTime, weekdayLabel, weekdays } from "@/lib/utils/format"

/** Weekly timetable grouped by day. Empty state points to WhatsApp instead of showing a blank grid. */
export function ScheduleBoard({ entries, whatsappHref }: { entries: ScheduleEntry[]; whatsappHref: string }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-brand-200 bg-white p-8 text-center lg:p-12">
        <span aria-hidden className="grid size-14 place-items-center rounded-full bg-brand-100 text-brand-700">
          <CalendarClock className="size-7" />
        </span>
        <p className="text-lg font-bold text-ink">Jadwal kelas diperbarui setiap pekan</p>
        <Text className="max-w-md">
          Tanyakan jadwal terbaru dan kelas yang paling cocok untuk Anda — kami bantu pilihkan.
        </Text>
        <WhatsAppButton href={whatsappHref}>Tanya Jadwal via WhatsApp</WhatsAppButton>
      </div>
    )
  }

  const days = weekdays.filter((day) => entries.some((entry) => entry.day === day))

  return (
    <Tabs defaultValue={days[0]} className="gap-6">
      <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <TabsList aria-label="Pilih hari">
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>
              {weekdayLabel[day]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {days.map((day) => (
        <TabsContent key={day} value={day}>
          <ul className="grid gap-4 md:grid-cols-2">
            {entries
              .filter((entry) => entry.day === day)
              .map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-[20px] border border-line bg-white p-5 shadow-soft"
                >
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={`/program/${entry.programSlug}`}
                      className="text-lg font-bold text-ink underline-offset-4 hover:text-brand-700 hover:underline"
                    >
                      {entry.programTitle}
                    </Link>
                    <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                      <MapPin aria-hidden className="size-4" />
                      {entry.location}
                    </p>
                  </div>
                  <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800">
                    <Clock aria-hidden className="size-4" />
                    <span>
                      <time dateTime={entry.time_start.slice(0, 5)}>{formatTime(entry.time_start)}</time>–
                      <time dateTime={entry.time_end.slice(0, 5)}>{formatTime(entry.time_end)}</time>
                    </span>
                  </p>
                </li>
              ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  )
}
