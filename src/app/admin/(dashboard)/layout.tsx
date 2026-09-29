import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { Logo } from "@/components/atoms/logo"
import { AdminNav } from "@/components/organisms/admin/admin-nav"
import { RolePill } from "@/components/organisms/admin/admin-ui"
import { SignOutButton } from "@/components/organisms/admin/sign-out-button"
import { AdminToaster, NoticeToast } from "@/components/organisms/admin/toaster"
import { requireStaff, type StaffRole } from "@/features/admin/auth"

// Session-dependent: never prerender.
export const dynamic = "force-dynamic"

function AccountLinks({ label, email, role }: { label: string; email?: string; role: StaffRole }) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
      <div className="flex flex-col gap-1">
        <p className="truncate font-semibold text-ink" title={email}>
          {label}
        </p>
        <RolePill role={role} />
      </div>
      <Link href="/" target="_blank" className="flex items-center gap-2 font-semibold text-brand-700 hover:underline">
        <ExternalLink aria-hidden className="size-4" />
        Lihat website<span className="sr-only"> (membuka tab baru)</span>
      </Link>
      <SignOutButton />
    </div>
  )
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, user } = await requireStaff()
  const account = <AccountLinks label={profile.name ?? user.email ?? "Admin"} email={user.email} role={profile.role} />

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6 border-b border-line bg-white p-4 lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0 lg:p-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="rounded-full">
            <Logo />
          </Link>
        </div>
        <details className="group lg:hidden">
          <summary className="flex h-10 cursor-pointer list-none items-center rounded-xl px-3 text-sm font-semibold text-brand-800 ring-1 ring-line">
            Menu admin
          </summary>
          <div className="flex flex-col gap-4 pt-4">
            <AdminNav role={profile.role} />
            {account}
          </div>
        </details>
        <div className="hidden flex-1 overflow-y-auto lg:block">
          <AdminNav role={profile.role} />
        </div>
        <div className="hidden lg:block">{account}</div>
      </aside>
      <main className="flex min-w-0 flex-col gap-8 p-4 sm:p-6 lg:p-10">{children}</main>
      <AdminToaster />
      <Suspense>
        <NoticeToast />
      </Suspense>
    </div>
  )
}
