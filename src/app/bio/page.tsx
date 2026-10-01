import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Gift,
  Globe,
  Link2,
  MapPin,
  MessageCircle,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { BrandWatermark, brandFigurePath } from "@/components/atoms/logo"
import { SocialIcon, socialLabel } from "@/components/atoms/social-icon"
import { AnalyticsTracker } from "@/components/organisms/analytics-tracker"
import { getBioLinks } from "@/features/content/queries"
import { getFounder } from "@/features/instructors/queries"
import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { defaultOgImage } from "@/lib/seo/metadata"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export const metadata: Metadata = {
  title: "Link Bio",
  description: `Semua link ${site.name}: chat WhatsApp, program & jadwal kelas, lokasi, sewa studio, dan artikel.`,
  alternates: { canonical: "/bio" },
  // A hub of links to pages that rank on their own — keep it out of results, but let crawlers follow it.
  robots: { index: false, follow: true },
  openGraph: {
    title: `${site.name} — Link Bio`,
    url: "/bio",
    images: [defaultOgImage],
  },
}

const icons: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  "map-pin": MapPin,
  building: Building2,
  book: BookOpen,
  user: UserRound,
  globe: Globe,
  star: Star,
  gift: Gift,
  play: CirclePlay,
  link: Link2,
}

/** Linktree-style page for the Instagram bio: one WhatsApp action, then the site's key pages. */
export default async function BioPage() {
  const [settings, links, founder] = await Promise.all([getSettings(), getBioLinks(), getFounder()])
  const whatsappHref = whatsappLink(settings.whatsapp, whatsappMessages.join)
  const photo = founder.photo_url

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#f5f3ff_0%,#ffffff_55%,#f5f3ff_100%)]">
      <AnalyticsTracker />
      <span aria-hidden className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-brand-200/60 blur-3xl motion-safe:animate-blob" />
      <span aria-hidden className="pointer-events-none absolute top-1/2 -right-32 size-80 rounded-full bg-brand-100 blur-3xl motion-safe:animate-blob motion-safe:[animation-delay:-9s]" />
      <BrandWatermark className="-right-16 bottom-0 h-72 text-brand-500/[0.06]" />

      <main className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 pt-14 pb-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="relative size-24 overflow-hidden rounded-full bg-brand-700 shadow-brand ring-4 ring-white">
            {photo ? (
              <Image src={photo} alt={settings.founder.name} fill sizes="96px" priority className="object-cover" />
            ) : (
              <svg viewBox="8 5 24 28" aria-hidden className="absolute inset-0 m-auto size-14">
                <circle cx="24.5" cy="10.5" r="3.5" fill="#DDD6FE" />
                <path d={brandFigurePath} fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl font-extrabold tracking-[-0.02em] text-ink">{site.name}</h1>
            <p className="text-sm font-semibold tracking-[0.12em] text-brand-700 uppercase">{site.slogan}</p>
            <p className="flex items-center justify-center gap-1 text-sm text-ink-muted">
              <MapPin aria-hidden className="size-4" />
              {settings.address.district}, {settings.address.city}
            </p>
          </div>
        </header>

        <nav aria-label="Link Sanggar Senam Danie" className="w-full">
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shine group flex items-center gap-4 rounded-[20px] bg-brand-700 p-4 text-white shadow-brand transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 active:scale-[0.98] motion-reduce:transform-none"
              >
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15">
                  <MessageCircle className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-bold">Chat WhatsApp</span>
                  <span className="text-sm text-white/85">Tanya jadwal, biaya & daftar kelas</span>
                </span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0" />
                <span className="sr-only"> (membuka tab baru)</span>
              </a>
            </li>

            {links.map((link) => {
              const Icon = icons[link.icon] ?? Link2
              const internal = link.url.startsWith("/")
              const className = link.is_highlighted
                ? "border-brand-200 bg-brand-50/90 text-ink"
                : "border-white/80 bg-white/75 text-ink"
              const content = (
                <>
                  <span
                    aria-hidden
                    className={`grid size-11 shrink-0 place-items-center rounded-full ${link.is_highlighted ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-bold">{link.title}</span>
                    {link.subtitle ? <span className="truncate text-sm text-ink-muted">{link.subtitle}</span> : null}
                  </span>
                  {internal ? (
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-brand-700" />
                  ) : (
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-brand-700" />
                  )}
                </>
              )
              const classes = `group flex items-center gap-4 rounded-[20px] border p-4 shadow-soft backdrop-blur-xl transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 active:scale-[0.98] motion-reduce:transform-none ${className}`

              return (
                <li key={link.id}>
                  {internal ? (
                    <Link href={link.url} className={classes}>
                      {content}
                    </Link>
                  ) : (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={classes}>
                      {content}
                      <span className="sr-only"> (membuka tab baru)</span>
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {settings.socials.length ? (
          <ul aria-label="Media sosial" className="flex gap-3">
            {settings.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`${socialLabel[social.platform]} (membuka tab baru)`}
                  className="grid size-11 place-items-center rounded-full border border-white/80 bg-white/75 text-brand-700 shadow-soft backdrop-blur-xl transition-colors hover:bg-brand-700 hover:text-white"
                >
                  <SocialIcon platform={social.platform} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="text-center text-xs text-ink-muted">
          <Link href="/" className="font-semibold text-brand-700 underline-offset-4 hover:underline">
            {site.url.replace(/^https?:\/\/(www\.)?/, "")}
          </Link>
          <p className="mt-1">
            © {new Date().getFullYear()} {site.name}
          </p>
        </footer>
      </main>
    </div>
  )
}
