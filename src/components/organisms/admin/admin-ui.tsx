import { cn } from "cn"
import { CheckCircle2, MessageCircle } from "lucide-react"
import type { ReactNode } from "react"

import { NativeSelect } from "@/components/atoms/input"
import { statusLabel } from "@/lib/utils/format"
import type { RequestStatus } from "@/types/database"

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">{title}</h1>
        {description ? <p className="text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

const notices: Record<string, string> = {
  saved: "Perubahan tersimpan dan website sudah diperbarui.",
  deleted: "Data berhasil dihapus.",
  "delete-failed": "Gagal menghapus. Data mungkin masih dipakai oleh jadwal atau data lain.",
}

export function AdminNotice({ notice }: { notice?: string }) {
  if (!notice || !notices[notice]) return null
  const failed = notice.endsWith("failed")
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ring-1",
        failed ? "bg-red-50 text-red-800 ring-red-200" : "bg-emerald-50 text-emerald-800 ring-emerald-200",
      )}
    >
      <CheckCircle2 aria-hidden className="size-4" />
      {notices[notice]}
    </p>
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

/** Plain server-action form: works without client JS. */
export function StatusForm({
  id,
  status,
  action,
  label,
}: {
  id: string
  status: RequestStatus
  action: (formData: FormData) => Promise<void>
  label: string
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Ubah status {label}
      </label>
      <div className="w-40">
        <NativeSelect id={`status-${id}`} name="status" defaultValue={status} className="h-9 rounded-xl text-sm">
          {(Object.keys(statusLabel) as RequestStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </NativeSelect>
      </div>
      <button
        type="submit"
        className="h-9 rounded-xl bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Simpan
      </button>
    </form>
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
              <a
                href={option.value ? `${base}?status=${option.value}` : base}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold ring-1",
                  active ? "bg-brand-700 text-white ring-brand-700" : "bg-white text-ink ring-line hover:bg-brand-50",
                )}
              >
                {option.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
