import { Plus } from "lucide-react"

import { ButtonLink } from "@/components/atoms/button"
import {
  AdminPageHeader,
  EmptyState,
  StatusFilter,
  TableCard,
  WhatsAppContact,
} from "@/components/organisms/admin/admin-ui"
import { RowActions } from "@/components/organisms/admin/row-actions"
import { StatusSelect } from "@/components/organisms/admin/status-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listRentals } from "@/features/admin/queries"
import { site } from "@/lib/content/site"
import { formatDate } from "@/lib/utils/format"
import { formatPhone } from "@/lib/utils/phone"
import type { RequestStatus } from "@/types/database"

export const metadata = { title: "Sewa Studio" }

const statuses: RequestStatus[] = ["new", "contacted", "completed"]

export default async function RentalsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: raw } = await searchParams
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
      <StatusFilter base="/admin/rentals" current={status} />

      <TableCard count={rentals.length} noun="permintaan">
        {rentals.length === 0 ? (
          <EmptyState title={status ? "Tidak ada permintaan dengan status ini." : "Belum ada permintaan sewa."} />
        ) : (
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Pemohon</TableHead>
                <TableHead>Acara</TableHead>
                <TableHead className="w-36">Kode</TableHead>
                <TableHead className="w-52">Status</TableHead>
                <TableHead className="w-44 text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-ink">{r.name}</span>
                      {r.organization ? <span className="text-sm text-ink-muted">{r.organization}</span> : null}
                      <span className="text-sm text-ink-muted tabular-nums">{formatPhone(r.phone)}</span>
                      <WhatsAppContact
                        phone={r.phone}
                        message={`Halo ${r.name}, terima kasih atas permintaan sewa studio di ${site.name} (kode ${r.reference_code}).`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="font-medium text-ink">
                      {formatDate(r.event_date)} · {r.participant_count} peserta
                    </p>
                    {r.message ? <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{r.message}</p> : null}
                    <p className="mt-1 text-xs text-ink-muted">Masuk {formatDate(r.created_at, true)}</p>
                  </TableCell>
                  <TableCell className="align-top font-mono text-sm">{r.reference_code}</TableCell>
                  <TableCell className="align-top">
                    <StatusSelect id={r.id} status={r.status} name={r.name} />
                  </TableCell>
                  <TableCell className="align-top">
                    <RowActions
                      editHref={`/admin/rentals/${r.id}`}
                      name={`permintaan ${r.name}`}
                      deletable={{ resourceKey: "rentals", id: r.id, singular: "permintaan sewa" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </>
  )
}
