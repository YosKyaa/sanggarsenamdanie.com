"use client"

import { cn } from "cn"
import {
  Award,
  CalendarDays,
  ChartNoAxesColumn,
  CircleHelp,
  Dumbbell,
  LayoutDashboard,
  ListChecks,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Sparkles,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const groups = [
  {
    label: "Permintaan",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/rentals", label: "Sewa Studio", icon: Warehouse },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/programs", label: "Program", icon: Dumbbell },
      { href: "/admin/schedules", label: "Jadwal", icon: CalendarDays },
      { href: "/admin/instructors", label: "Instruktur", icon: Users },
      { href: "/admin/certificates", label: "Sertifikat", icon: Award },
      { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquareQuote },
      { href: "/admin/articles", label: "Artikel", icon: Newspaper },
    ],
  },
  {
    label: "Halaman",
    items: [
      { href: "/admin/faqs", label: "FAQ", icon: CircleHelp },
      { href: "/admin/stats", label: "Statistik", icon: ChartNoAxesColumn },
      { href: "/admin/pillars", label: "Janji Brand", icon: Sparkles },
      { href: "/admin/rentalUses", label: "Kegunaan Studio", icon: ListChecks },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { href: "/admin/settings", label: "Pengaturan Situs", icon: Settings },
      { href: "/admin/users", label: "Pengguna", icon: UserCog },
    ],
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi admin" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                      active ? "bg-brand-100 text-brand-800" : "text-ink hover:bg-brand-50",
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
