import { ButtonLink } from "@/components/atoms/button"
import { Container } from "@/components/atoms/layout"
import { BrandWatermark } from "@/components/atoms/logo"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"

type CtaSectionProps = {
  whatsappHref: string
  title?: string
  description?: string
}

export function CtaSection({
  whatsappHref,
  title = "Mulai Hidup Lebih Sehat Hari Ini",
  description = "Mulai perjalanan sehat bersama komunitas yang mendukung Anda. Coba satu kelas dulu, rasakan suasananya.",
}: CtaSectionProps) {
  return (
    <section aria-labelledby="cta-title" className="pb-16 lg:pb-[100px]">
      <Container>
        <div className="on-dark reveal-scale relative overflow-hidden rounded-[32px] bg-brand-700 px-6 py-14 text-center sm:px-10 lg:py-20">
          <span aria-hidden className="absolute -top-24 -left-24 size-72 rounded-full border-2 border-dashed border-white/15 motion-safe:animate-spin-slow" />
          <span aria-hidden className="absolute -right-20 -bottom-28 size-80 rounded-full bg-white/[0.07]" />
          <BrandWatermark className="right-6 -bottom-10 hidden h-64 text-white/[0.08] motion-safe:animate-float-slow md:block" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <Eyebrow tone="inverse">Keluarga Sanggar Senam Danie</Eyebrow>
            <Heading id="cta-title" className="text-white">
              {title}
            </Heading>
            <Text size="lead" tone="inverse">
              {description}
            </Text>
            <div className="flex w-full flex-col justify-center gap-3 pt-2 xs:w-auto xs:flex-row">
              <WhatsAppButton href={whatsappHref} size="lg" variant="inverse" className="shine">
                Gabung via WhatsApp
              </WhatsAppButton>
              <ButtonLink
                href="/program"
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                Lihat Program
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
