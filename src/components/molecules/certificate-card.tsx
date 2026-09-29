import { Award } from "lucide-react"
import Image from "next/image"

import { Heading } from "@/components/atoms/typography"
import type { CertificateRow } from "@/types/database"

type CertificateCardProps = {
  certificate: Pick<CertificateRow, "title" | "issuer" | "year" | "image_url">
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const meta = [certificate.issuer, certificate.year].filter(Boolean).join(" · ")
  const isImage = certificate.image_url && !certificate.image_url.toLowerCase().endsWith(".pdf")

  return (
    <article className="spotlight group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] bg-surface-soft">
        {isImage ? (
          <Image
            src={certificate.image_url!}
            alt={`Sertifikat ${certificate.title}`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 85vw"
            className="object-contain p-4"
          />
        ) : (
          // Certificate-style frame shown until a scan is uploaded.
          <div aria-hidden className="absolute inset-4 grid place-items-center rounded-2xl border border-dashed border-brand-200 bg-white">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-brand-100 text-brand-700 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 motion-reduce:transition-none">
                <Award className="size-7" />
              </span>
              <span className="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase">Certified</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <Heading as="h3" size="subtitle">
          {certificate.title}
        </Heading>
        {meta ? <p className="text-sm text-ink-muted">{meta}</p> : null}
        {certificate.image_url && !isImage ? (
          <a
            href={certificate.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Lihat dokumen (PDF)<span className="sr-only">, membuka tab baru</span>
          </a>
        ) : null}
      </div>
    </article>
  )
}
