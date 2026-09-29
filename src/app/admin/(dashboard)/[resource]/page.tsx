import { Check, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ButtonLink } from "@/components/atoms/button"
import { AdminNotice, AdminPageHeader, StatusPill } from "@/components/organisms/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRelationOptions, listResource, type AdminRow } from "@/features/admin/queries"
import { getResource, type ColumnConfig } from "@/features/admin/resources"
import { formatDate, formatTime, weekdayLabel } from "@/lib/utils/format"
import type { RequestStatus, Weekday } from "@/types/database"

type Props = {
  params: Promise<{ resource: string }>
  searchParams: Promise<{ notice?: string }>
}

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource)
  return { title: resource?.label ?? "Admin" }
}

function renderCell(column: ColumnConfig, row: AdminRow, relations: Map<string, string>) {
  const value = row[column.name]
  switch (column.format) {
    case "boolean":
      return value ? (
        <span className="inline-flex items-center gap-1 text-emerald-700">
          <Check aria-hidden className="size-4" />
          Ya
        </span>
      ) : (
        <span className="text-ink-muted">Tidak</span>
      )
    case "time":
      return typeof value === "string" ? formatTime(value) : "—"
    case "day":
      return weekdayLabel[value as Weekday] ?? String(value)
    case "relation":
      return relations.get(String(value)) ?? "—"
    case "date":
      return typeof value === "string" ? formatDate(value) : "—"
    case "status":
      return <StatusPill status={value as RequestStatus} />
    default:
      return value == null || value === "" ? "—" : String(value)
  }
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const [{ resource: key }, { notice }] = await Promise.all([params, searchParams])
  const resource = getResource(key)
  if (!resource || resource.singleton) notFound()

  const needsRelations = resource.columns.some((c) => c.format === "relation")
  const [rows, relationOptions] = await Promise.all([
    listResource(resource),
    needsRelations ? getRelationOptions() : null,
  ])
  const relations = new Map(
    relationOptions ? [...relationOptions.programs, ...relationOptions.instructors].map((o) => [o.value, o.label]) : [],
  )

  return (
    <>
      <AdminPageHeader
        title={resource.label}
        description={resource.description}
        actions={
          resource.allowCreate === false ? undefined : (
            <ButtonLink href={`/admin/${resource.key}/new`}>
              <Plus aria-hidden />
              Tambah {resource.singular}
            </ButtonLink>
          )
        }
      />
      <AdminNotice notice={notice} />

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
        {rows.length === 0 ? (
          <p className="p-6 text-ink-muted">Belum ada {resource.singular}. Tambahkan yang pertama.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {resource.columns.map((column) => (
                  <TableHead key={column.name}>{column.label}</TableHead>
                ))}
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {resource.columns.map((column, index) => (
                    <TableCell key={column.name} className={index === 0 ? "font-semibold text-ink" : undefined}>
                      {renderCell(column, row, relations)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/${resource.key}/${row.id}`}
                      className="text-sm font-semibold text-brand-700 hover:underline"
                    >
                      Ubah<span className="sr-only"> {String(row[resource.columns[0].name] ?? "")}</span>
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
