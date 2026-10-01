import { ArrowLeft, ChartNoAxesColumn, Images, LockKeyhole, Warehouse, type LucideIcon } from "lucide-react"
import Link from "next/link"

import { BrandWatermark, Logo } from "@/components/atoms/logo"
import { LoginForm } from "@/components/organisms/admin/login-form"
import { getAuthProviders } from "@/features/admin/auth-providers"
import { site } from "@/lib/content/site"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const metadata = { title: "Masuk" }

const errors: Record<string, string> = {
  forbidden: "Akun ini belum memiliki akses ke panel. Minta admin mengatur perannya di menu Pengguna.",
  not_registered:
    "Akun Google ini belum terdaftar. Minta admin menambahkan email Anda di menu Pengguna, lalu coba lagi.",
  oauth: "Masuk dengan Google gagal. Coba lagi, atau masuk dengan email dan kata sandi.",
  cancelled: "Masuk dengan Google dibatalkan.",
}

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Warehouse, title: "Permintaan sewa", description: "Pantau dan tindak lanjuti booking studio." },
  { icon: Images, title: "Konten & galeri", description: "Program, jadwal, artikel, dan foto kegiatan." },
  { icon: ChartNoAxesColumn, title: "Statistik", description: "Pengunjung website dan klik WhatsApp." },
]

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const [{ next, error }, providers] = await Promise.all([searchParams, getAuthProviders()])
  const notice = !isSupabaseConfigured
    ? "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
    : error
      ? errors[error]
      : undefined

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop) */}
      <section
        aria-label={`Panel pengelola ${site.name}`}
        className="on-dark relative hidden overflow-hidden bg-[linear-gradient(160deg,#6d28d9_0%,#5b21b6_55%,#4c1d95_100%)] text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16"
      >
        <span aria-hidden className="absolute -top-32 -right-32 size-96 rounded-full border border-white/10" />
        <span aria-hidden className="absolute -top-16 -right-16 size-64 rounded-full bg-white/[0.06]" />
        <span aria-hidden className="absolute -bottom-40 -left-24 size-[28rem] rounded-full border border-white/10" />
        <BrandWatermark className="-right-10 bottom-[-4%] h-[62%] text-white/[0.07]" />

        <Link href="/" className="relative self-start rounded-xl">
          <Logo tone="inverse" withSlogan />
        </Link>

        <div className="relative flex max-w-md flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold tracking-[0.14em] text-brand-200 uppercase">Panel Pengelola</p>
            <h2 className="font-heading text-4xl leading-[1.12] font-extrabold tracking-[-0.02em] text-balance xl:text-[2.75rem]">
              Kelola sanggar dari satu tempat.
            </h2>
          </div>
          <ul className="flex flex-col gap-5">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold">{title}</span>
                  <span className="text-sm text-white/75">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} {site.name}
        </p>
      </section>

      {/* Sign-in */}
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="rounded-xl lg:hidden">
            <Logo />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-brand-50 hover:text-brand-700"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Ke website
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 py-12">
          <div className="flex flex-col gap-3">
            <span aria-hidden className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <LockKeyhole className="size-5" />
            </span>
            <h1 className="font-heading text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] text-ink">
              Selamat datang kembali
            </h1>
            <p className="text-ink-muted">Masuk untuk mengelola website {site.name}.</p>
          </div>

          <LoginForm next={next} notice={notice} googleEnabled={providers.google} />

          <p className="text-sm leading-relaxed text-ink-muted">
            Lupa kata sandi? Minta admin mengatur ulang di menu <span className="font-semibold text-ink">Pengguna</span>
            {providers.google ? ", atau masuk dengan Google memakai email yang terdaftar." : "."}
          </p>
        </div>

        <p className="text-center text-xs text-ink-muted">Halaman khusus pengelola {site.name}.</p>
      </div>
    </main>
  )
}
