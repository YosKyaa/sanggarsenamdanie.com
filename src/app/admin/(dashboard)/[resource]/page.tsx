import { cn } from "cn"
import { Plus } from "lucide-react"
import { notFound } from "next/navigation"

import { ButtonLink } from "@/components/atoms/button"
import { AdminPageHeader, BooleanBadge, EmptyState, StatusPill, TableCard } from "@/components/organisms/admin/admin-ui"
import { RowActions } from "@/components/organisms/admin/row-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireAdmin } from "@/features/admin/auth"
import { getRelationOptions, listResource, type AdminRow } from "@/features/admin/queries"
import { getResource, type ColumnConfig } from "@/features/admin/resources"
import { formatDate, formatTime, weekdayLabel } from "@/lib/utils/format"
import type { RequestStatus, Weekday } from "@/types/database"

type Props = { params: Promise<{ resource: string }> }

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource)
  return { title: resource?.label ?? "Admin" }
}

/** Sensible width/alignment per format, so every table lines up without per-page tweaks. */
function layoutOf(column: ColumnConfig): { align: "left" | "center" | "right"; width?: string } {
  const defaults: Partial<Record<NonNullable<ColumnConfig["format"]>, { align: "left" | "center" | "right"; width: string }>> = {
    boolean: { align: "center", width: "w-36" },
    number: { align: "right", width: "w-28" },
    year: { align: "right", width: "w-24" },
    time: { align: "center", width: "w-24" },
    day: { align: "left", width: "w-28" },
    date: { align: "left", width: "w-40" },
    status: { align: "left", width: "w-40" },
  }
  const base = column.format ? defaults[column.format] : undefined
  return { align: column.align ?? base?.align ?? "left", width: column.width ?? base?.width }
}

const alignClass = { left: "text-left", center: "text-center", right: "text-right" }

function renderCell(column: ColumnConfig, row: AdminRow, relations: Map<string, string>) {
  const value = row[column.name]
  const empty = <span className="text-ink-muted/60">—</span>
  switch (column.format) {
    case "boolean":
      return <BooleanBadge value={Boolean(value)} yes={column.labels?.yes} no={column.labels?.no} />
    case "time":
      return typeof value === "string" ? <span className="tabular-nums">{formatTime(value)}</span> : empty
    case "day":
      return weekdayLabel[value as Weekday] ?? String(value)
    case "relation":
      return relations.get(String(value)) ?? empty
    case "date":
      return typeof value === "string" ? formatDate(value) : empty
    case "status":
      return <StatusPill status={value as RequestStatus} />
    case "number":
    case "year":
      return value == null ? empty : <span className="tabular-nums">{String(value)}</span>
    case "text":
      return value ? <span className="line-clamp-2 text-ink-muted">{String(value)}</span> : empty
    default:
      return value == null || value === "" ? empty : String(value)
  }
}

export default async function ResourceListPage({ params }: Props) {
  const { resource: key } = await params
  const resource = getResource(key)
  if (!resource || resource.singleton) notFound()
  if (resource.adminOnly) await requireAdmin()

  const needsRelations = resource.columns.some((c) => c.format === "relation")
  const [rows, relationOptions] = await Promise.all([listResource(resource), needsRelations ? getRelationOptions() : null])
  const relations = new Map(
    relationOptions ? [...relationOptions.programs, ...relationOptions.instructors].map((o) => [o.value, o.label]) : [],
  )
  // Lists ordered by "Urutan tampil" show that number first, matching what visitors see.
  const showOrder = resource.orderBy[0]?.column === "sort_order"
  const nameOf = (row: AdminRow) => String(row[resource.columns[0].name] ?? resource.singular)

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

      <TableCard count={rows.length} noun={resource.singular}>
        {rows.length === 0 ? (
          <EmptyState
            title={`Belum ada ${resource.singular}.`}
            action={resource.allowCreate === false ? undefined : { href: `/admin/${resource.key}/new`, label: `Tambah ${resource.singular} pertama` }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {showOrder ? <TableHead className="w-16 text-center">#</TableHead> : null}
                {resource.columns.map((column) => {
                  const { align, width } = layoutOf(column)
                  return (
                    <TableHead key={column.name} className={cn(alignClass[align], width)}>
                      {column.label}
                    </TableHead>
                  )
                })}
                <TableHead className="w-44 text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {showOrder ? (
                    <TableCell className="text-center text-ink-muted tabular-nums">{String(row.sort_order ?? "")}</TableCell>
                  ) : null}
                  {resource.columns.map((column, index) => {
                    const { align, width } = layoutOf(column)
                    return (
                      <TableCell
                        key={column.name}
                        className={cn(alignClass[align], width, index === 0 && "font-semibold text-ink")}
                      >
                        {renderCell(column, row, relations)}
                      </TableCell>
                    )
                  })}
                  <TableCell className="w-44">
                    <RowActions
                      editHref={`/admin/${resource.key}/${row.id}`}
                      name={nameOf(row)}
                      deletable={
                        resource.allowDelete === false
                          ? undefined
                          : { resourceKey: resource.key, id: row.id, singular: resource.singular }
                      }
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
