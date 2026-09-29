import { ArrowRight, BarChart3 } from "lucide-react"
import Link from "next/link"

import { AdminPageHeader, StatusPill } from "@/components/organisms/admin/admin-ui"
import { AnalyticsFrame } from "@/components/organisms/admin/analytics/analytics-frame"
import { BarList } from "@/components/organisms/admin/analytics/bar-list"
import { StatTile } from "@/components/organisms/admin/analytics/stat-tile"
import { TrendChart } from "@/components/organisms/admin/analytics/trend-chart"
import { getDashboardStats, listRentals } from "@/features/admin/queries"
import { getAnalyticsSummary, parseRange, ranges } from "@/features/analytics/queries"
import { changeOf, deviceLabel, formatCount, formatPercent, pageLabel, sourceLabel } from "@/lib/utils/analytics"
import { formatDate } from "@/lib/utils/format"
import { formatPhone } from "@/lib/utils/phone"
import type { AnalyticsSummary } from "@/types/database"

export const metadata = { title: "Dashboard" }

function Traffic({ summary }: { summary: AnalyticsSummary }) {
  const { totals, previous } = summary
  const conversion = totals.visitors ? totals.whatsapp_clicks / totals.visitors : 0
  const prevConversion = previous.visitors ? previous.whatsapp_clicks / previous.visitors : 0

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <li>
          <StatTile
            label="Pengunjung"
            value={formatCount(totals.visitors)}
            change={changeOf(totals.visitors, previous.visitors)}
            hint="Dihitung unik per hari, tanpa cookie."
          />
        </li>
        <li>
          <StatTile
            label="Tampilan halaman"
            value={formatCount(totals.pageviews)}
            change={changeOf(totals.pageviews, previous.pageviews)}
          />
        </li>
        <li>
          <StatTile
            featured
            label="Klik WhatsApp"
            value={formatCount(totals.whatsapp_clicks)}
            change={changeOf(totals.whatsapp_clicks, previous.whatsapp_clicks)}
            hint="Calon peserta yang membuka chat."
          />
        </li>
        <li>
          <StatTile
            label="Tingkat konversi"
            value={formatPercent(conversion)}
            change={previous.visitors ? changeOf(conversion, prevConversion) : null}
            hint="Klik WhatsApp ÷ pengunjung."
          />
        </li>
      </ul>

      {/* Two charts, not one dual-axis chart: the scales differ by an order of magnitude. */}
      <div className="grid gap-5 xl:grid-cols-2">
        <TrendChart
          title="Pengunjung per hari"
          unit="pengunjung"
          data={summary.daily.map((d) => ({ date: d.date, value: d.visitors }))}
        />
        <TrendChart
          title="Klik WhatsApp per hari"
          unit="klik"
          data={summary.daily.map((d) => ({ date: d.date, value: d.whatsapp_clicks }))}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <BarList
          title="Halaman terpopuler"
          description="Program dan artikel yang paling banyak dilihat."
          unit="tampilan"
          rows={summary.top_pages.map((p) => ({ label: pageLabel(p.path), value: p.pageviews }))}
        />
        <BarList
          title="Halaman pemicu klik WhatsApp"
          description="Tempat pengunjung memutuskan untuk menghubungi."
          unit="klik"
          rows={summary.whatsapp_pages.map((p) => ({ label: pageLabel(p.path), value: p.clicks }))}
          empty="Belum ada klik WhatsApp."
        />
        <BarList
          title="Sumber pengunjung"
          description="Dari mana pengunjung pertama kali datang."
          unit="pengunjung"
          rows={summary.referrers.map((r) => ({ label: sourceLabel(r.source), value: r.visitors }))}
        />
        <BarList
          title="Perangkat"
          unit="pengunjung"
          rows={summary.devices.map((d) => ({ label: deviceLabel[d.device], value: d.visitors }))}
        />
      </div>
    </>
  )
}

function AnalyticsSetup() {
  return (
    <div className="flex gap-4 rounded-[var(--radius-card)] border border-dashed border-brand-200 bg-white p-6">
      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
        <BarChart3 className="size-5" />
      </span>
      <div className="flex flex-col gap-2 text-sm text-ink-muted">
        <p className="text-base font-bold text-ink">Statistik pengunjung belum aktif</p>
        <p>
          Jalankan migrasi <code className="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-xs">0005_analytics.sql</code>{" "}
          dan pastikan <code className="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          sudah diisi di Vercel. Data mulai terkumpul sejak saat itu.
        </p>
      </div>
    </div>
  )
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range)
  const [summary, stats, rentals] = await Promise.all([getAnalyticsSummary(range), getDashboardStats(), listRentals("new")])

  const cards = [
    { label: "Permintaan sewa baru", value: stats.newRentals, href: "/admin/rentals?status=new", highlight: stats.newRentals > 0 },
    { label: "Program aktif", value: stats.programs, href: "/admin/programs" },
    { label: "Jadwal aktif", value: stats.schedules, href: "/admin/schedules" },
    { label: "Testimoni belum publik", value: stats.pendingTestimonials, href: "/admin/testimonials" },
  ]

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Kinerja website dan hal yang perlu ditindaklanjuti." />

      <section aria-labelledby="traffic-title" className="flex flex-col gap-4">
        <h2 id="traffic-title" className="text-lg font-bold text-ink">
          Pengunjung website
        </h2>
        {summary ? (
          <AnalyticsFrame range={range} ranges={ranges}>
            <Traffic summary={summary} />
          </AnalyticsFrame>
        ) : (
          <AnalyticsSetup />
        )}
      </section>

      <section aria-labelledby="ops-title" className="flex flex-col gap-4">
        <h2 id="ops-title" className="text-lg font-bold text-ink">
          Operasional
        </h2>
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

        <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-ink">Permintaan sewa yang perlu dihubungi</h3>
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
        </div>
      </section>
    </>
  )
}
