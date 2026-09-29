import { cn } from "cn"
import { ArrowLeft, Inbox, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { statusLabel } from "@/lib/utils/format"
import type { ProfileRole, RequestStatus } from "@/types/database"

export function AdminPageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string
  description?: string
  actions?: ReactNode
  /** "← Kembali" link above the title on add/edit pages. */
  back?: { href: string; label: string }
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-3xl flex-col gap-1">
        {back ? (
          <Link href={back.href} className="mb-1 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-700 hover:underline">
            <ArrowLeft aria-hidden className="size-4" />
            {back.label}
          </Link>
        ) : null}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">{title}</h1>
        {description ? <p className="text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

/** Card around every admin table, with an optional row-count footer. */
export function TableCard({ children, count, noun }: { children: ReactNode; count?: number; noun?: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
      {children}
      {count !== undefined && count > 0 ? (
        <p className="border-t border-line bg-surface-soft px-5 py-3 text-sm text-ink-muted">
          {count} {noun ?? "data"}
        </p>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span aria-hidden className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Inbox className="size-6" />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {action ? (
        <Link href={action.href} className="text-sm font-semibold text-brand-700 hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}

/** Yes/no values as a coloured pill instead of plain text. */
export function BooleanBadge({ value, yes = "Aktif", no = "Nonaktif" }: { value: boolean; yes?: string; no?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        value ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "bg-surface-soft text-ink-muted ring-1 ring-line",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", value ? "bg-emerald-500" : "bg-ink-muted/50")} />
      {value ? yes : no}
    </span>
  )
}

const statusTone: Record<RequestStatus, string> = {
  new: "bg-brand-100 text-brand-800",
  contacted: "bg-amber-100 text-amber-900",
  completed: "bg-emerald-100 text-emerald-900",
}

export function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", statusTone[status])}>
      {statusLabel[status]}
    </span>
  )
}

export const roleLabel: Record<ProfileRole, string> = {
  admin: "Admin",
  editor: "Editor",
  member: "Tanpa akses",
}

const roleTone: Record<ProfileRole, string> = {
  admin: "bg-brand-700 text-white",
  editor: "bg-brand-100 text-brand-800",
  member: "bg-surface-soft text-ink-muted ring-1 ring-line",
}

export function RolePill({ role }: { role: ProfileRole }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", roleTone[role])}>
      {roleLabel[role]}
    </span>
  )
}

export function WhatsAppContact({ phone, message }: { phone: string; message: string }) {
  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp hover:underline"
    >
      <MessageCircle aria-hidden className="size-4" />
      Chat
      <span className="sr-only"> via WhatsApp (membuka tab baru)</span>
    </a>
  )
}

export function StatusFilter({ base, current }: { base: string; current?: RequestStatus }) {
  const options: { value?: RequestStatus; label: string }[] = [
    { label: "Semua" },
    ...(Object.keys(statusLabel) as RequestStatus[]).map((value) => ({ value, label: statusLabel[value] })),
  ]
  return (
    <nav aria-label="Filter status">
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === current
          return (
            <li key={option.label}>
              <Link
                href={option.value ? `${base}?status=${option.value}` : base}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold ring-1",
                  active ? "bg-brand-700 text-white ring-brand-700" : "bg-white text-ink ring-line hover:bg-brand-50",
                )}
              >
                {option.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
