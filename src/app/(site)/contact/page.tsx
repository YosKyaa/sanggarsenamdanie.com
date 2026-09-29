import { ArrowRight, Warehouse } from "lucide-react"
import Link from "next/link"

import { Container, Section } from "@/components/atoms/layout"
import { BrandWatermark } from "@/components/atoms/logo"
import { Heading, Text } from "@/components/atoms/typography"
import { JoinSteps } from "@/components/molecules/join-steps"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { FaqSection } from "@/components/sections/faq-section"
import { LocationSection } from "@/components/sections/location-section"
import { PageHero } from "@/components/sections/page-hero"
import { getFaqs } from "@/features/content/queries"
import { getSettings } from "@/features/settings/queries"
import { site } from "@/lib/content/site"
import { pageMetadata } from "@/lib/seo/metadata"
import { formatPhone } from "@/lib/utils/phone"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export async function generateMetadata() {
  const settings = await getSettings()
  return pageMetadata({
    title: "Kontak & WhatsApp",
    description: `Hubungi ${site.name} di ${settings.address.district}, ${settings.address.city} lewat WhatsApp ${formatPhone(settings.whatsapp)} untuk info kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga.`,
    path: "/contact",
  })
}

export default async function ContactPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()])
  const joinHref = whatsappLink(settings.whatsapp, whatsappMessages.join)

  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Gabung Lewat WhatsApp"
        description="Tanya jadwal, biaya, atau kelas yang cocok — cukup kirim pesan, tim kami yang bantu atur semuanya."
        breadcrumbs={[{ name: "Kontak", path: "/contact" }]}
      />

      <Section aria-labelledby="wa-title">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
          <div className="on-dark spotlight spotlight-light relative flex flex-col justify-between gap-10 overflow-hidden rounded-[var(--radius-card)] bg-brand-600 p-8 text-white shadow-brand sm:p-12">
            <BrandWatermark className="-right-8 -bottom-12 h-72 text-white/10 motion-safe:animate-float-slow" />
            <div className="relative flex flex-col gap-4">
              <Heading id="wa-title" className="text-white">
                Chat langsung dengan Sanggar Senam Danie
              </Heading>
              <Text size="lead" tone="inverse" className="max-w-lg">
                Pesan sudah kami siapkan — tinggal tekan tombol, lalu kirim. Kami balas secepatnya.
              </Text>
            </div>
            <div className="relative flex flex-col gap-4">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{formatPhone(settings.whatsapp)}</p>
              <WhatsAppButton href={joinHref} size="lg" variant="inverse" className="shine self-start">
                Chat via WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[var(--radius-card)] bg-surface-soft p-6 ring-1 ring-line sm:p-8">
              <JoinSteps />
            </div>
            <Link
              href="/rental"
              className="spotlight group relative flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-soft transition-colors hover:border-brand-300"
            >
              <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                <Warehouse className="size-5" />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="font-bold text-ink">Ingin sewa studio?</span>
                <span className="text-sm text-ink-muted">Kirim permintaan untuk kelas privat atau acara komunitas.</span>
              </span>
              <ArrowRight aria-hidden className="size-5 text-brand-700 transition-transform group-hover:translate-x-1" />
            </Link>
          </aside>
        </Container>
      </Section>

      <FaqSection faqs={faqs} tone="soft" />
      <LocationSection settings={settings} whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.general)} />
    </>
  )
}
