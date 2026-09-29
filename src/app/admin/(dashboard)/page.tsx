import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { AdminPageHeader, StatusPill } from "@/components/organisms/admin/admin-ui"
import { getDashboardStats, listRentals } from "@/features/admin/queries"
import { formatDate } from "@/lib/utils/format"
import { formatPhone } from "@/lib/utils/phone"

export const metadata = { title: "Dashboard" }

export default async function AdminDashboard() {
  const [stats, rentals] = await Promise.all([getDashboardStats(), listRentals("new")])

  const cards = [
    { label: "Permintaan sewa baru", value: stats.newRentals, href: "/admin/rentals?status=new", highlight: stats.newRentals > 0 },
    { label: "Program aktif", value: stats.programs, href: "/admin/programs" },
    { label: "Jadwal aktif", value: stats.schedules, href: "/admin/schedules" },
    { label: "Testimoni belum publik", value: stats.pendingTestimonials, href: "/admin/testimonials" },
  ]

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Ringkasan permintaan sewa dan konten website. Calon peserta kelas menghubungi langsung via WhatsApp." />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <li key={card.label}>
            <Link
              href={card.href}
              className={
                card.highlight
                  ? "flex h-full flex-col gap-2 rounded-[20px] bg-brand-700 p-5 text-white shadow-brand"
                  : "flex h-full flex-col gap-2 rounded-[20px] border border-line bg-white p-5 shadow-soft hover:border-brand-200"
              }
            >
              <span className="text-3xl font-extrabold">{card.value}</span>
              <span className={card.highlight ? "text-sm text-white/90" : "text-sm text-ink-muted"}>{card.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="latest" className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="latest" className="text-lg font-bold text-ink">
            Permintaan sewa yang perlu dihubungi
          </h2>
          <Link href="/admin/rentals" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            Semua <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        {rentals.length === 0 ? (
          <p className="text-ink-muted">Tidak ada permintaan sewa baru.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rentals.slice(0, 6).map((rental) => (
              <li key={rental.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-ink">{rental.name}</span>
                  <span className="text-sm text-ink-muted">
                    {formatDate(rental.event_date)} · {rental.participant_count} peserta · {formatPhone(rental.phone)}
                  </span>
                </div>
                <StatusPill status={rental.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
