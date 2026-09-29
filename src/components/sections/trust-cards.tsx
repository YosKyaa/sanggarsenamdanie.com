import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/atoms/layout"
import { Rise } from "@/components/atoms/scroll-effects"
import { Heading, Text } from "@/components/atoms/typography"
import { CheckItem } from "@/components/molecules/check-item"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import type { SiteSettings } from "@/features/settings/types"
import { formatPhone } from "@/lib/utils/phone"

/** Two cards overlapping the hero's bottom edge (reference: newsletter + "How can I help"). */
export function TrustCards({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  return (
    <section aria-label="Pengalaman dan sertifikasi" className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <Rise delay={0.1} className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="on-dark spotlight spotlight-light relative overflow-hidden rounded-[var(--radius-card)] bg-brand-600 p-6 text-white shadow-brand sm:p-8">
            <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 motion-safe:animate-float-slow" />
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Heading as="h2" size="title" className="text-2xl text-white">
                  {settings.founder.experienceYears}+ Tahun Pengalaman
                </Heading>
                <Text tone="inverse" size="small">
                  Membantu banyak peserta membangun gaya hidup sehat. Tanya jadwal, biaya, dan kelas yang cocok —
                  langsung lewat WhatsApp.
                </Text>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton href={whatsappHref} variant="inverse" className="shine">
                  Chat via WhatsApp
                </WhatsAppButton>
                <p className="text-sm font-semibold text-white/90">{formatPhone(settings.whatsapp)}</p>
              </div>
            </div>
          </div>

          <div className="spotlight relative grid gap-6 rounded-[var(--radius-card)] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur-xl sm:p-8 md:grid-cols-2 md:gap-8">
            <ul className="flex flex-col gap-3" aria-label="Sertifikasi Danie">
              {settings.credentials.map((credential) => (
                <CheckItem key={credential}>{credential}</CheckItem>
              ))}
              {settings.founder.roleLine ? <CheckItem>{settings.founder.roleLine}</CheckItem> : null}
            </ul>
            <div className="flex flex-col gap-3 md:justify-center">
              <Heading as="h2" size="title">
                Instruktur Bersertifikat
              </Heading>
              <Text size="small">
                Setiap kelas dipandu langsung oleh instruktur yang terlatih secara resmi, sehingga gerakan aman, tepat,
                dan sesuai kemampuan Anda.
              </Text>
              <Link
                href="/sertifikat"
                className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                Lihat sertifikat
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </Rise>
      </Container>
    </section>
  )
}
