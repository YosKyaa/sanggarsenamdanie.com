import { LazyMarquee } from "@/components/organisms/lazy-marquee"
import { AboutSection } from "@/components/sections/about-section"
import { ArticleSection } from "@/components/sections/article-section"
import { BrandSection } from "@/components/sections/brand-section"
import { CertificateSection } from "@/components/sections/certificate-section"
import { CtaSection } from "@/components/sections/cta-section"
import { FaqSection } from "@/components/sections/faq-section"
import { HeroSection } from "@/components/sections/hero-section"
import { InstructorSection } from "@/components/sections/instructor-section"
import { LocationSection } from "@/components/sections/location-section"
import { ProgramSection } from "@/components/sections/program-section"
import { RentalSection } from "@/components/sections/rental-section"
import { StatsSection } from "@/components/sections/stats-section"
import { TestimonialSection } from "@/components/sections/testimonial-section"
import { TrustCards } from "@/components/sections/trust-cards"
import { getArticles } from "@/features/articles/queries"
import { getCertificates } from "@/features/certificates/queries"
import { getFaqs, getPillars, getRentalUses, getStats } from "@/features/content/queries"
import { getInstructors } from "@/features/instructors/queries"
import { getPrograms } from "@/features/programs/queries"
import { getSettings } from "@/features/settings/queries"
import { getTestimonials } from "@/features/testimonials/queries"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

export default async function HomePage() {
  const [settings, programs, instructors, certificates, testimonials, articles, stats, pillars, rentalUses, faqs] =
    await Promise.all([
      getSettings(),
      getPrograms(),
      getInstructors(),
      getCertificates(),
      getTestimonials(),
      getArticles(),
      getStats(),
      getPillars(),
      getRentalUses(),
      getFaqs(),
    ])

  const founderPhoto = instructors.find((i) => i.is_founder)?.photo_url ?? null
  // The community-size stat ("500+ Peserta") is echoed in the hero chip and collage badge.
  const highlight = stats.find((stat) => /peserta/i.test(stat.label)) ?? null
  const joinHref = whatsappLink(settings.whatsapp, whatsappMessages.join)

  return (
    <>
      {/* Attention */}
      <HeroSection settings={settings} founderPhoto={founderPhoto} whatsappHref={joinHref} highlight={highlight} />
      <TrustCards settings={settings} whatsappHref={joinHref} />
      {/* Interest */}
      <LazyMarquee
        primary={programs.map((p) => p.title)}
        secondary={[
          ...pillars.map((p) => p.word),
          `Sejak ${settings.founded.year}`,
          `${settings.address.district}, ${settings.address.city}`,
        ]}
      />
      <BrandSection settings={settings} pillars={pillars} tone="soft" />
      <AboutSection settings={settings} founderPhoto={founderPhoto} highlight={highlight} />
      <StatsSection stats={stats} />
      <ProgramSection programs={programs} whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.schedule)} />
      {/* Desire */}
      <CertificateSection certificates={certificates} />
      <InstructorSection instructors={instructors} />
      <RentalSection settings={settings} uses={rentalUses} />
      <TestimonialSection testimonials={testimonials} />
      <ArticleSection articles={articles} />
      {/* Action */}
      <FaqSection faqs={faqs} tone="soft" />
      <LocationSection settings={settings} whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.general)} />
      <CtaSection whatsappHref={joinHref} />
    </>
  )
}
