"use client"

import { CertificateCard } from "@/components/molecules/certificate-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CertificateRow } from "@/types/database"

export function CertificateCarousel({ certificates }: { certificates: CertificateRow[] }) {
  return (
    <Carousel opts={{ align: "start" }} aria-label="Galeri sertifikat" className="w-full">
      <CarouselContent className="-ml-5 py-4">
        {certificates.map((certificate, index) => (
          <CarouselItem
            key={certificate.id}
            aria-label={`${index + 1} dari ${certificates.length}`}
            className="basis-[85%] pl-5 sm:basis-1/2 lg:basis-1/3"
          >
            <CertificateCard certificate={certificate} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-center gap-3">
        <CarouselPrevious className="static my-0 size-11 translate-y-0 border-brand-200 text-brand-700 disabled:opacity-40" />
        <CarouselNext className="static my-0 size-11 translate-y-0 border-brand-200 text-brand-700 disabled:opacity-40" />
      </div>
    </Carousel>
  )
}
