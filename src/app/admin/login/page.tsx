import Link from "next/link"

import { Logo } from "@/components/atoms/logo"
import { LoginForm } from "@/components/organisms/admin/login-form"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const metadata = { title: "Masuk" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const notice = !isSupabaseConfigured
    ? "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
    : error === "forbidden"
      ? "Akun ini belum memiliki akses admin."
      : undefined

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Link href="/" className="self-center rounded-full">
          <Logo />
        </Link>
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft sm:p-8">
          <h1 className="mb-1 text-2xl font-extrabold text-ink">Masuk ke Admin</h1>
          <p className="mb-6 text-sm text-ink-muted">Kelola program, jadwal, dan pendaftaran.</p>
          <LoginForm next={next} notice={notice} />
        </div>
      </div>
    </main>
  )
}
