import { AlertTriangle, ShieldCheck } from "lucide-react"

import { AdminPageHeader, TableCard } from "@/components/organisms/admin/admin-ui"
import { CreateUserDialog } from "@/components/organisms/admin/users/create-user-dialog"
import { UserRoleSelect, UserRowActions } from "@/components/organisms/admin/users/user-controls"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireAdmin } from "@/features/admin/auth"
import { listUsers } from "@/features/users/queries"
import { isServiceRoleConfigured } from "@/lib/supabase/admin"
import { formatDate } from "@/lib/utils/format"

export const metadata = { title: "Pengguna" }

const roleGuide = [
  { role: "Admin", can: "Semua menu, termasuk Pengguna dan Pengaturan Situs." },
  { role: "Editor", can: "Konten (program, jadwal, artikel, dll.) dan permintaan sewa. Tidak bisa mengelola pengguna & pengaturan." },
  { role: "Tanpa akses", can: "Tidak bisa membuka admin. Pakai untuk menonaktifkan akun tanpa menghapusnya." },
]

export default async function UsersPage() {
  const { user } = await requireAdmin()
  const users = await listUsers()

  return (
    <>
      <AdminPageHeader
        title="Pengguna"
        description="Siapa saja yang bisa masuk ke admin, dan apa yang boleh mereka kelola."
        actions={<CreateUserDialog disabled={!isServiceRoleConfigured} />}
      />

      {!isServiceRoleConfigured ? (
        <div role="note" className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p>
            Untuk <strong>membuat akun, reset password, dan menghapus akun</strong>, tambahkan{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> di
            Environment Variables Vercel (Supabase → Project Settings → API Keys → <em>service_role</em>), lalu
            redeploy. Mengubah peran tetap bisa dilakukan sekarang.
          </p>
        </div>
      ) : null}

      <TableCard count={users.length} noun="akun">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Pengguna</TableHead>
              <TableHead className="w-48">Peran</TableHead>
              <TableHead className="w-40">Dibuat</TableHead>
              <TableHead className="w-44">Login terakhir</TableHead>
              <TableHead className="w-56 text-right">
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const self = u.id === user.id
              const label = u.name ?? u.email ?? "Tanpa nama"
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink">
                        {label}
                        {self ? <span className="ml-2 text-xs font-medium text-brand-700">(Anda)</span> : null}
                      </span>
                      {u.email && u.email !== label ? <span className="text-sm text-ink-muted">{u.email}</span> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserRoleSelect id={u.id} role={u.role} name={label} disabled={self} />
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">{formatDate(u.createdAt)}</TableCell>
                  <TableCell className="text-sm text-ink-muted">
                    {u.lastSignInAt ? formatDate(u.lastSignInAt, true) : "—"}
                  </TableCell>
                  <TableCell>
                    {self ? (
                      <p className="text-right text-xs text-ink-muted">Akun Anda sendiri</p>
                    ) : (
                      <UserRowActions id={u.id} name={label} canManageAuth={isServiceRoleConfigured} />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableCard>

      <section aria-labelledby="roles-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6">
        <h2 id="roles-title" className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
          <ShieldCheck aria-hidden className="size-5 text-brand-700" />
          Hak akses tiap peran
        </h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          {roleGuide.map((item) => (
            <div key={item.role} className="rounded-2xl bg-surface-soft p-4 ring-1 ring-line">
              <dt className="font-semibold text-ink">{item.role}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{item.can}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
