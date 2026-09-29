import { ButtonLink } from "@/components/atoms/button"
import { Container } from "@/components/atoms/layout"
import { Eyebrow, Heading, Text } from "@/components/atoms/typography"

export default function NotFound() {
  return (
    <section className="bg-surface-soft pt-40 pb-24">
      <Container className="flex flex-col items-center gap-5 text-center">
        <Eyebrow>Halaman tidak ditemukan</Eyebrow>
        <Heading as="h1" size="display">
          Ups, halaman ini tidak ada
        </Heading>
        <Text size="lead" className="max-w-lg">
          Mungkin tautannya sudah berubah. Silakan kembali ke beranda atau lihat program kami.
        </Text>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <ButtonLink href="/" size="lg">
            Ke Beranda
          </ButtonLink>
          <ButtonLink href="/program" size="lg" variant="outline">
            Lihat Program
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
