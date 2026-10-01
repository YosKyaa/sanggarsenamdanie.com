import type { SiteSettings } from "@/features/settings/types"
import { site } from "@/lib/content/site"
import { galleryPhotoAlt } from "@/features/gallery/categories"
import type { ArticleRow, GalleryPhotoRow, ProgramRow } from "@/types/database"

const businessId = `${site.url}/#business`
const websiteId = `${site.url}/#website`
const founderId = `${site.url}/about#danie`
const logoUrl = `${site.url}/icon.svg`
const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

/** Profiles that are the same business — lets Google tie the site to IG, Maps, etc. */
function sameAs(settings: SiteSettings) {
  return [...settings.socials.map((s) => s.url), ...(settings.googleMapsUrl ? [settings.googleMapsUrl] : [])]
}

export function localBusinessJsonLd(
  settings: SiteSettings,
  programs: Pick<ProgramRow, "title" | "slug" | "summary">[],
  founderPhoto: string | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": businessId,
    name: site.name,
    slogan: site.slogan,
    description: settings.description,
    foundingDate: settings.founded.iso,
    url: site.url,
    logo: logoUrl,
    image: founderPhoto || `${site.url}/opengraph-image`,
    telephone: `+${settings.whatsapp}`,
    hasMap: settings.googleMapsUrl ?? mapsUrl(settings.mapsQuery),
    ...(settings.geo ? { geo: { "@type": "GeoCoordinates", ...settings.geo } } : {}),
    ...(settings.openingHours.length ? { openingHours: settings.openingHours } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${settings.address.street}, Kec. ${settings.address.district}`,
      addressLocality: settings.address.city,
      addressRegion: settings.address.region,
      postalCode: settings.address.postalCode,
      addressCountry: settings.address.country,
    },
    areaServed: [settings.address.city, settings.address.district, settings.address.region],
    founder: { "@id": founderId },
    knowsAbout: programs.map((p) => p.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Program Senam",
      itemListElement: [
        ...programs.map((p) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `Kelas ${p.title}`, description: p.summary, url: `${site.url}/program/${p.slug}` },
        })),
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Sewa Studio", url: `${site.url}/rental` },
        },
      ],
    },
    ...(sameAs(settings).length ? { sameAs: sameAs(settings) } : {}),
  }
}

/** Site entity for Google's site name in results. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    inLanguage: "id-ID",
    publisher: { "@id": businessId },
  }
}

/** Danie as a person with credentials — strengthens E-E-A-T on the About page. */
export function founderJsonLd(settings: SiteSettings, certifications: readonly string[], photo: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": founderId,
    name: settings.founder.name,
    jobTitle: settings.founder.title,
    url: `${site.url}/about`,
    ...(photo ? { image: photo } : {}),
    worksFor: { "@id": businessId },
    ...(settings.founder.organization
      ? {
          memberOf: {
            "@type": "SportsOrganization",
            name: settings.founder.organizationLong
              ? `${settings.founder.organizationLong} (${settings.founder.organization})`
              : settings.founder.organization,
          },
        }
      : {}),
    hasCredential: certifications.map((name) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name,
    })),
    knowsAbout: ["Aerobic", "Zumba", "Yoga", "Aquarobic", "Aquayoga", "Senam Jantung Sehat"],
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path === "/" ? "" : item.path}`,
    })),
  }
}

export function programJsonLd(program: ProgramRow) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Kelas ${program.title} di Depok`,
    description: program.description,
    serviceType: program.title,
    url: `${site.url}/program/${program.slug}`,
    provider: { "@id": businessId },
    areaServed: { "@type": "City", name: "Depok" },
    ...(program.image_url ? { image: program.image_url } : {}),
  }
}

export function articleJsonLd(article: ArticleRow) {
  const url = `${site.url}/artikel/${article.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: url,
    // Per-article OG routes carry a build hash, so fall back to the stable site image.
    image: article.cover_image_url || `${site.url}/opengraph-image`,
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    inLanguage: "id-ID",
    author: { "@type": "Organization", name: article.author_name, url: site.url },
    publisher: { "@id": businessId, "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: logoUrl } },
  }
}

/** Gallery page as an ImageGallery of the studio's own photos (eligible for Google Images). */
export function galleryJsonLd(photos: GalleryPhotoRow[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `Galeri Kegiatan ${site.name}`,
    url: `${site.url}/galeri`,
    about: { "@id": businessId },
    image: photos.slice(0, 50).map((photo) => ({
      "@type": "ImageObject",
      contentUrl: photo.image_url,
      caption: galleryPhotoAlt(photo),
      ...(photo.width && photo.height ? { width: photo.width, height: photo.height } : {}),
      ...(photo.taken_at ? { dateCreated: photo.taken_at } : {}),
      creditText: site.name,
      copyrightHolder: { "@id": businessId },
    })),
  }
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}
