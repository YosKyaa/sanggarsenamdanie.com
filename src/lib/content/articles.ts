/**
 * Starter articles, shown when Supabase isn't configured and mirrored in
 * supabase/seed.sql. Written for real search intent ("zumba pemula",
 * "manfaat senam aerobik", "aquarobic adalah") with general, conservative
 * health information — no promises of results.
 */
import type { ArticleRow } from "@/types/database"

const published = "2026-09-28T08:00:00+07:00"

type Seed = Pick<ArticleRow, "slug" | "title" | "excerpt" | "content"> & { programSlug: string | null }

export const articleSeeds: Seed[] = [
  {
    slug: "zumba-untuk-pemula",
    title: "Zumba untuk Pemula: Panduan Mengikuti Kelas Pertama",
    excerpt:
      "Baru pertama kali ikut Zumba? Ini yang perlu disiapkan, apa yang terjadi di kelas, dan tips agar tetap nyaman mengikuti gerakan.",
    programSlug: "zumba",
    content: `Zumba sering jadi pilihan pertama orang yang ingin mulai rutin berolahraga. Musiknya ceria, gerakannya berulang, dan suasananya lebih mirip pesta daripada latihan berat. Kalau Anda baru akan mencoba, panduan ini membantu Anda datang dengan tenang.

## Apa itu Zumba?

Zumba adalah latihan kardio yang memadukan gerakan tari dengan musik Latin dan internasional — salsa, merengue, cumbia, reggaeton, hingga lagu pop. Program ini dikembangkan di Kolombia pada 1990-an oleh Alberto "Beto" Pérez. Kelas Zumba resmi dipimpin instruktur berlisensi **ZIN (Zumba Instructor Network)**.

## Apakah Zumba cocok untuk pemula?

Cocok. Anda tidak perlu bisa menari. Setiap lagu biasanya terdiri dari beberapa langkah dasar yang diulang, dan instruktur memberi isyarat sebelum gerakan berganti. Di pertemuan pertama, wajar jika Anda baru mengikuti langkah kakinya saja — itu sudah cukup.

## Yang perlu disiapkan

- **Pakaian olahraga** yang menyerap keringat dan nyaman untuk bergerak.
- **Sepatu olahraga** dengan sol yang tidak terlalu mencengkeram lantai, agar gerakan memutar terasa aman untuk lutut.
- **Air minum** dan handuk kecil.
- **Makan ringan** satu sampai dua jam sebelum kelas, bukan makan besar tepat sebelum berlatih.

## Apa yang terjadi di kelas?

Kelas diawali pemanasan dengan gerakan yang lebih pelan. Setelah itu intensitas naik turun mengikuti lagu — ada lagu yang cepat, ada yang lebih santai untuk mengatur napas. Kelas ditutup dengan pendinginan dan peregangan.

## Tips untuk kelas pertama

1. **Pilih posisi yang bisa melihat instruktur dengan jelas.** Barisan tengah sering jadi tempat paling nyaman.
2. **Ikuti langkah kaki dulu**, gerakan tangan bisa menyusul di pertemuan berikutnya.
3. **Atur intensitas sendiri.** Kalau lelah, buat gerakan lebih kecil atau berjalan di tempat — tetap bergerak lebih baik daripada berhenti mendadak.
4. **Minum sedikit-sedikit** di sela lagu.
5. **Beri tahu instruktur** bila Anda memiliki kondisi kesehatan, sedang hamil, atau baru pulih dari cedera. Jika ragu, konsultasikan dulu dengan dokter.

## Mulai Zumba di Depok

Di Sanggar Senam Danie, kelas Zumba dipandu instruktur berlisensi ZIN dengan suasana yang santai dan bersahabat untuk pemula. Lihat detail [kelas Zumba](/program/zumba) atau tanyakan jadwal terbaru lewat WhatsApp.`,
  },
  {
    slug: "manfaat-senam-aerobic",
    title: "Manfaat Senam Aerobic untuk Jantung dan Stamina",
    excerpt:
      "Senam aerobic melatih jantung dan paru, membantu menjaga berat badan, dan baik untuk suasana hati. Simak manfaat dan cara memulainya dengan aman.",
    programSlug: "aerobic",
    content: `Senam aerobic adalah salah satu olahraga paling mudah dimulai: tidak butuh alat, bisa dilakukan bersama-sama, dan intensitasnya bisa disesuaikan. Berikut manfaat yang bisa Anda rasakan jika melakukannya secara rutin.

## Apa itu senam aerobic?

Senam aerobic adalah rangkaian gerakan ritmis yang melibatkan otot-otot besar tubuh — kaki, lengan, dan tubuh bagian tengah — secara terus-menerus mengikuti musik. Karena dilakukan tanpa henti dalam waktu cukup lama, detak jantung dan napas meningkat secara stabil. Inilah yang melatih sistem jantung dan paru.

## Manfaat senam aerobic

- **Kebugaran jantung dan paru.** Latihan aerobik teratur membuat jantung dan paru bekerja lebih efisien, sehingga aktivitas sehari-hari seperti naik tangga terasa lebih ringan.
- **Stamina lebih baik.** Tubuh terbiasa bergerak lebih lama sebelum merasa lelah.
- **Membantu mengelola berat badan**, terutama bila diimbangi pola makan yang seimbang.
- **Koordinasi dan keseimbangan.** Mengikuti rangkaian gerakan melatih kerja sama antara otak dan otot.
- **Suasana hati dan tidur.** Aktivitas fisik yang teratur berkaitan dengan berkurangnya rasa cemas dan kualitas tidur yang lebih baik.
- **Teman dan motivasi.** Berlatih bersama membuat olahraga lebih mudah dijadikan kebiasaan.

## Seberapa sering sebaiknya?

Organisasi Kesehatan Dunia (WHO) menganjurkan orang dewasa melakukan aktivitas fisik aerobik intensitas sedang **150–300 menit per minggu**, atau 75–150 menit intensitas tinggi. Artinya, tiga kali kelas senam berdurasi sekitar satu jam per minggu sudah memenuhi anjuran minimal. Bagi pemula, mulailah dari satu atau dua kali seminggu, lalu tingkatkan perlahan.

## Memulai dengan aman

1. **Jangan lewatkan pemanasan dan pendinginan.**
2. **Gunakan "tes bicara".** Pada intensitas sedang, Anda masih bisa berbicara tetapi sulit bernyanyi.
3. **Cukupi cairan** sebelum, selama, dan setelah latihan.
4. **Konsultasikan dengan dokter** bila Anda memiliki penyakit jantung, tekanan darah tinggi, diabetes, sedang hamil, atau sudah lama tidak berolahraga.

## Senam aerobic di Sanggar Senam Danie

Kelas aerobic di Sanggar Senam Danie diajarkan bertahap dan setiap gerakan memiliki versi yang lebih ringan. Danie juga bersertifikasi **Senam Jantung Sehat**, sehingga kelas dirancang dengan memperhatikan keamanan jantung peserta. Lihat detail [kelas Aerobic](/program/aerobic).`,
  },
  {
    slug: "aquarobic-aquayoga-olahraga-ramah-sendi",
    title: "Aquarobic dan Aquayoga: Olahraga di Air yang Ramah Sendi",
    excerpt:
      "Daya apung air mengurangi beban pada sendi sehingga olahraga terasa lebih ringan. Kenali aquarobic dan aquayoga serta siapa yang cocok mengikutinya.",
    programSlug: "aquarobic",
    content: `Tidak semua orang nyaman melompat atau berlari di lantai studio. Lutut yang sering nyeri, berat badan berlebih, atau usia bisa membuat olahraga terasa berat. Di sinilah olahraga di air menjadi pilihan menarik.

## Kenapa berolahraga di air?

- **Beban pada sendi berkurang.** Daya apung air menopang sebagian berat tubuh, sehingga lutut, pinggul, dan pinggang menanggung beban lebih ringan dibanding latihan di darat.
- **Otot tetap bekerja.** Air memberi tahanan ke segala arah. Setiap gerakan mendorong air, sehingga otot terlatih tanpa perlu beban tambahan.
- **Tubuh terasa sejuk.** Air membantu tubuh tidak cepat kepanasan, walaupun Anda tetap berkeringat dan perlu minum.

## Apa bedanya aquarobic dan aquayoga?

**Aquarobic** adalah senam aerobik di dalam air: gerakan berirama dengan musik, seperti berjalan, menendang, dan mengayun lengan. Fokusnya melatih daya tahan jantung dan kekuatan otot.

**Aquayoga** membawa pose dan pernapasan yoga ke dalam air. Temponya lebih pelan, fokus pada kelenturan, keseimbangan, dan relaksasi. Air membantu menopang tubuh sehingga peregangan terasa lebih ringan.

## Siapa yang cocok?

- Pemula yang ingin mulai berolahraga dengan intensitas ringan.
- Peserta dengan berat badan berlebih.
- Lansia yang ingin tetap aktif dengan risiko benturan yang lebih kecil.
- Peserta dengan keluhan lutut atau pinggang ringan — **dengan persetujuan dokter atau fisioterapis**.

## Apakah harus bisa berenang?

Umumnya tidak. Kelas di air biasanya dilakukan di bagian kolam yang cukup dangkal sehingga kaki tetap menapak. Tanyakan kedalaman kolam kepada kami jika Anda belum percaya diri di air.

## Yang perlu dibawa

- Pakaian renang yang nyaman untuk bergerak.
- Handuk dan sandal.
- Air minum — tubuh tetap berkeringat walaupun di dalam air.
- Penutup kepala renang bila diwajibkan oleh pengelola kolam.

## Kelas air di Sanggar Senam Danie

Sanggar Senam Danie membuka kelas [Aquarobic](/program/aquarobic) dan [Aquayoga](/program/aquayoga). Lokasi dan jadwal kelas air bisa Anda tanyakan langsung lewat WhatsApp.`,
  },
]

/** Seeds as rows (ids stable for keys); program ids match the fallback programs. */
export const fallbackArticles: ArticleRow[] = articleSeeds.map(({ programSlug, ...article }) => ({
  ...article,
  id: `article-${article.slug}`,
  cover_image_url: null,
  program_id: programSlug ? `program-${programSlug}` : null,
  author_name: "Tim Sanggar Senam Danie",
  is_published: true,
  published_at: published,
  created_at: published,
  updated_at: published,
}))
