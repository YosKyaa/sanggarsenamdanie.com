import { MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/atoms/layout"
import { Logo } from "@/components/atoms/logo"
import { SocialIcon, socialLabel } from "@/components/atoms/social-icon"
import { OpeningHours } from "@/components/molecules/opening-hours"
import type { SiteSettings } from "@/features/settings/types"
import { navItems, site } from "@/lib/content/site"
import { formatPhone } from "@/lib/utils/phone"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"
import type { ProgramRow } from "@/types/database"

type FooterProps = {
  settings: SiteSettings
  programs: Pick<ProgramRow, "title" | "slug">[]
}

export function Footer({ settings, programs }: FooterProps) {
  const whatsappHref = whatsappLink(settings.whatsapp, whatsappMessages.general)
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark bg-brand-900 text-brand-100">
      <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="flex flex-col gap-4">
          <Logo tone="inverse" withSlogan />
          <p className="max-w-xs text-sm leading-relaxed text-brand-100/85">
            Studio senam di Depok untuk hidup yang lebih sehat, aktif, dan bahagia — bersama komunitas yang mendukung
            Anda.
          </p>
          {settings.socials.length ? (
            <ul className="flex gap-2 pt-1">
              {settings.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${socialLabel[social.platform]} ${site.name} (membuka tab baru)`}
                    className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <SocialIcon platform={social.platform} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className="mb-4 text-sm font-bold tracking-[0.1em] text-white uppercase">
            Jelajahi
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[...navItems, { href: "/rental", label: "Sewa Studio" }, { href: "/cek-status", label: "Cek Status Sewa" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-100/85 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <nav aria-labelledby="footer-programs">
          <h2 id="footer-programs" className="mb-4 text-sm font-bold tracking-[0.1em] text-white uppercase">
            Program
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link href={`/program/${program.slug}`} className="text-brand-100/85 transition-colors hover:text-white">
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-bold tracking-[0.1em] text-white uppercase">Kontak</h2>
          <address className="flex flex-col gap-3 text-sm not-italic">
            <p className="flex gap-2.5 text-brand-100/85">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              {settings.address.full}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2.5 text-brand-100/85 transition-colors hover:text-white"
            >
              <MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
              WhatsApp {formatPhone(settings.whatsapp)}
              <span className="sr-only"> (membuka tab baru)</span>
            </a>
          </address>
          <OpeningHours entries={settings.openingHours} tone="inverse" className="mt-4 [&_dd]:text-brand-100/85 [&_svg]:size-4" />
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-brand-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {settings.founded.year}–{year} {site.name} · Berdiri {settings.founded.label}.
          </p>
          {settings.founder.roleLine ? <p>{settings.founder.roleLine}</p> : null}
        </Container>
      </div>
    </footer>
  )
}
