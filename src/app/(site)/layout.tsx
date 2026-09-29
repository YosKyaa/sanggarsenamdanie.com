import { JsonLd } from "@/components/atoms/json-ld"
import { SpotlightTracker } from "@/components/atoms/motion"
import { ScrollProgress } from "@/components/atoms/scroll-effects"
import { AnalyticsTracker } from "@/components/organisms/analytics-tracker"
import { Footer } from "@/components/organisms/footer"
import { Navbar } from "@/components/organisms/navbar"
import { WhatsAppFloat } from "@/components/organisms/whatsapp-float"
import { getFounder } from "@/features/instructors/queries"
import { getPrograms } from "@/features/programs/queries"
import { getSettings } from "@/features/settings/queries"
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo/jsonld"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, programs, founder] = await Promise.all([getSettings(), getPrograms(), getFounder()])
  const whatsappHref = whatsappLink(settings.whatsapp, whatsappMessages.general)

  return (
    <>
      <ScrollProgress />
      <SpotlightTracker />
      <AnalyticsTracker />
      <a
        href="#konten"
        className="sr-only z-50 rounded-full bg-brand-700 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Langsung ke konten
      </a>
      <Navbar whatsappHref={whatsappHref} />
      <main id="konten" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} programs={programs} />
      <WhatsAppFloat href={whatsappHref} />
      <JsonLd data={localBusinessJsonLd(settings, programs, founder.photo_url)} />
      <JsonLd data={websiteJsonLd()} />
    </>
  )
}
