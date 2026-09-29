import { Plus } from "lucide-react"
import Link from "next/link"

import { ButtonLink } from "@/components/atoms/button"
import {
  AdminNotice,
  AdminPageHeader,
  StatusFilter,
  StatusForm,
  StatusPill,
  WhatsAppContact,
} from "@/components/organisms/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateRentalStatus } from "@/features/admin/actions"
import { listRentals } from "@/features/admin/queries"
import { site } from "@/lib/content/site"
import { formatDate } from "@/lib/utils/format"
import { formatPhone } from "@/lib/utils/phone"
import type { RequestStatus } from "@/types/database"

export const metadata = { title: "Sewa Studio" }

const statuses: RequestStatus[] = ["new", "contacted", "completed"]

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; notice?: string }>
}) {
  const { status: raw, notice } = await searchParams
  const status = statuses.includes(raw as RequestStatus) ? (raw as RequestStatus) : undefined
  const rentals = await listRentals(status)

  return (
    <>
      <AdminPageHeader
        title="Permintaan Sewa Studio"
        description="Konfirmasi ketersediaan tanggal dan biaya lewat WhatsApp. Permintaan dari telepon/WhatsApp bisa ditambahkan manual."
        actions={
          <ButtonLink href="/admin/rentals/new">
            <Plus aria-hidden />
            Tambah permintaan
          </ButtonLink>
        }
      />
      <AdminNotice notice={notice} />
      <StatusFilter base="/admin/rentals" current={status} />

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
        {rentals.length === 0 ? (
          <p className="p-6 text-ink-muted">Belum ada data.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pemohon</TableHead>
                <TableHead>Acara</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ubah status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((r) => (
                <TableRow key={r.id} className="align-top">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-ink">{r.name}</span>
                      {r.organization ? <span className="text-sm text-ink-muted">{r.organization}</span> : null}
                      <span className="text-sm text-ink-muted">{formatPhone(r.phone)}</span>
                      <WhatsAppContact
                        phone={r.phone}
                        message={`Halo ${r.name}, terima kasih atas permintaan sewa studio di ${site.name} (kode ${r.reference_code}).`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal">
                    <span className="font-medium">
                      {formatDate(r.event_date)} · {r.participant_count} peserta
                    </span>
                    {r.message ? <p className="mt-1 text-sm text-ink-muted">{r.message}</p> : null}
                    <p className="mt-1 text-xs text-ink-muted">Masuk {formatDate(r.created_at, true)}</p>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{r.reference_code}</TableCell>
                  <TableCell>
                    <StatusPill status={r.status} />
                  </TableCell>
                  <TableCell>
                    <StatusForm id={r.id} status={r.status} action={updateRentalStatus} label={r.name} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/rentals/${r.id}`} className="text-sm font-semibold text-brand-700 hover:underline">
                      Ubah<span className="sr-only"> permintaan {r.name}</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
