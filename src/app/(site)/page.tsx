import { LazyMarquee } from "@/components/organisms/lazy-marquee"
import { AboutSection } from "@/components/sections/about-section"
import { ArticleSection } from "@/components/sections/article-section"
import { BrandSection } from "@/components/sections/brand-section"
import { FaqSection } from "@/components/sections/faq-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { HeroSection } from "@/components/sections/hero-section"
import { ProgramSection } from "@/components/sections/program-section"
import { RentalSection } from "@/components/sections/rental-section"
import { StatsSection } from "@/components/sections/stats-section"
import { TestimonialSection } from "@/components/sections/testimonial-section"
import { VisitSection } from "@/components/sections/visit-section"
import { getArticles } from "@/features/articles/queries"
import { getFaqs, getPillars, getRentalUses, getStats } from "@/features/content/queries"
import { getGalleryPhotos } from "@/features/gallery/queries"
import { getInstructors } from "@/features/instructors/queries"
import { getPrograms } from "@/features/programs/queries"
import { getSettings } from "@/features/settings/queries"
import { getTestimonials } from "@/features/testimonials/queries"
import { whatsappLink, whatsappMessages } from "@/lib/utils/whatsapp"

/**
 * Each fact has one home on this page: numbers in the stats card, credentials
 * in the About block, address and hours in the closing Visit block.
 */
export default async function HomePage() {
  const [settings, programs, instructors, testimonials, articles, stats, pillars, rentalUses, faqs, photos] = await Promise.all([
    getSettings(),
    getPrograms(),
    getInstructors(),
    getTestimonials(),
    getArticles(),
    getStats(),
    getPillars(),
    getRentalUses(),
    getFaqs(),
    getGalleryPhotos(),
  ])

  const founder = instructors.find((i) => i.is_founder) ?? null
  const joinHref = whatsappLink(settings.whatsapp, whatsappMessages.join)

  return (
    <>
      {/* Attention */}
      <HeroSection settings={settings} founderPhoto={founder?.photo_url ?? null} whatsappHref={joinHref} />
      <StatsSection stats={stats} variant="floating" />
      {/* Interest */}
      <LazyMarquee primary={programs.map((p) => p.title)} secondary={pillars.map((p) => p.word)} />
      <ProgramSection programs={programs} whatsappHref={whatsappLink(settings.whatsapp, whatsappMessages.schedule)} />
      <BrandSection pillars={pillars} tone="soft" />
      {/* Desire */}
      <AboutSection settings={settings} founder={founder} hasTeam={instructors.length > 1} />
      <GallerySection photos={photos} />
      <TestimonialSection testimonials={testimonials} />
      <RentalSection settings={settings} uses={rentalUses} />
      <ArticleSection articles={articles} tone="soft" />
      {/* Action */}
      <FaqSection faqs={faqs} />
      <VisitSection settings={settings} whatsappHref={joinHref} />
    </>
  )
}
