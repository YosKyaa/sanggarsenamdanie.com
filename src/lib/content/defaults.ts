/**
 * Default content, in database shape. Used when Supabase isn't configured
 * (or a table is still empty) and mirrored in supabase/seed.sql, so the site
 * looks the same before and after the first admin edit.
 */
import type { BioLinkRow, BrandPillarRow, FaqRow, RentalUseRow, SiteSettingsRow, StatRow } from "@/types/database"

const stamp = { created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" }

export const defaultSettingsRow: SiteSettingsRow = {
  id: 1,
  whatsapp: "6288975351853",
  instagram_url: null,
  response_time: "dalam 1×24 jam",
  tagline: "Studio Senam Profesional Depok",
  description:
    "Studio senam profesional di Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga bersama instruktur bersertifikasi.",
  hero_description:
    "Studio senam di Tapos, Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga — dipandu instruktur bersertifikasi.",
  founded_date: "2017-07-27",
  credentials: ["ZIN Certified", "Aerobic", "Yoga", "Aero Boxing", "Jantung Sehat"],
  address_street: "Sukamaju Baru",
  address_district: "Tapos",
  address_city: "Depok",
  address_region: "Jawa Barat",
  address_postal_code: "16455",
  maps_query: "Sukamaju Baru, Tapos, Depok, Jawa Barat 16455",
  founder_name: "Danie",
  founder_title: "Founder Sanggar Senam Danie",
  founder_experience_years: 10,
  organization: "IOSKI Depok",
  organization_long: "Ikatan Olahraga Senam Kreasi Indonesia",
  organization_role: "Sekretaris",
  founder_photo_2_url: null,
  class_photo_url: null,
  studio_photo_url: null,
  tiktok_url: null,
  facebook_url: null,
  youtube_url: null,
  google_maps_url: null,
  latitude: null,
  longitude: null,
  opening_hours: [],
  updated_at: stamp.updated_at,
}

const rows = <T,>(items: T[], prefix: string) =>
  items.map((item, index) => ({ id: `${prefix}-${index + 1}`, sort_order: index + 1, is_active: true, ...stamp, ...item }))

export const defaultStats: StatRow[] = rows(
  [
    { value: 2017, suffix: "", label: "Berdiri Sejak", count_up: false },
    { value: 10, suffix: "+", label: "Tahun Pengalaman", count_up: true },
    { value: 500, suffix: "+", label: "Peserta Terlatih", count_up: true },
    { value: 5, suffix: "", label: "Program Kelas", count_up: true },
  ],
  "stat",
)

export const defaultPillars: BrandPillarRow[] = rows(
  [
    {
      word: "Sehat",
      title: "Gerakan aman dan terarah",
      description:
        "Setiap kelas dipandu instruktur bersertifikat, dengan variasi gerakan untuk pemula hingga peserta rutin.",
    },
    {
      word: "Aktif",
      title: "Pilihan kelas yang beragam",
      description: "Aerobic, Zumba, Yoga, hingga kelas di air — tetap semangat bergerak tanpa merasa bosan.",
    },
    {
      word: "Bahagia",
      title: "Komunitas yang saling mendukung",
      description: "Berlatih bersama teman-teman satu sanggar, sehingga olahraga menjadi momen yang dinanti.",
    },
  ],
  "pillar",
)

export const defaultRentalUses: RentalUseRow[] = rows(
  [
    { title: "Private class", description: "Sesi eksklusif untuk Anda atau kelompok kecil." },
    { title: "Community gathering", description: "Arisan sehat, komunitas, dan acara kantor." },
    { title: "Wellness event", description: "Workshop, seminar kesehatan, dan kelas tamu." },
    { title: "Training", description: "Latihan tim, persiapan lomba, dan pelatihan instruktur." },
  ],
  "rental-use",
)

export const defaultFaqs: FaqRow[] = rows(
  [
    {
      question: "Apakah pemula boleh ikut kelas?",
      answer:
        "Boleh. Gerakan diajarkan bertahap dan setiap gerakan punya variasi yang lebih ringan, jadi Anda bisa berlatih sesuai kemampuan.",
    },
    {
      question: "Bagaimana cara bergabung?",
      answer:
        "Cukup chat kami di WhatsApp +62 889-7535-1853. Kami bantu pilihkan kelas dan jadwal yang paling cocok untuk Anda.",
    },
    {
      question: "Berapa biaya kelas senam di Sanggar Senam Danie?",
      answer:
        "Biaya berbeda untuk setiap program. Silakan tanyakan info biaya terbaru lewat WhatsApp — kami jawab dengan senang hati.",
    },
    {
      question: "Di mana lokasi Sanggar Senam Danie?",
      answer:
        "Sanggar Senam Danie berada di Sukamaju Baru, Kecamatan Tapos, Kota Depok, Jawa Barat 16455. Lokasi kelas air (Aquarobic dan Aquayoga) tercantum pada jadwal masing-masing kelas.",
    },
    {
      question: "Apa yang perlu dibawa saat kelas pertama?",
      answer:
        "Pakaian olahraga yang nyaman, sepatu olahraga untuk kelas studio, air minum, dan handuk kecil. Untuk kelas air, bawa pakaian renang, handuk, dan sandal.",
    },
    {
      question: "Kelas mana yang cocok untuk yang punya keluhan lutut atau sendi?",
      answer:
        "Aquarobic dan Aquayoga biasanya paling nyaman karena air mengurangi beban pada sendi. Beri tahu instruktur tentang kondisi Anda, dan konsultasikan dengan dokter bila perlu.",
    },
    {
      question: "Apakah studio bisa disewa?",
      answer:
        "Bisa. Studio dapat disewa untuk kelas privat, gathering komunitas, wellness event, dan sesi latihan melalui halaman Sewa Studio.",
    },
  ],
  "faq",
)

/** Links on /bio (Instagram "link in bio"); the WhatsApp button above them is built in. */
export const defaultBioLinks: BioLinkRow[] = rows(
  [
    { title: "Program & Jadwal Kelas", subtitle: "Aerobic, Zumba, Yoga, Aquarobic, Aquayoga", url: "/program", icon: "calendar", is_highlighted: true },
    { title: "Lokasi Sanggar", subtitle: "Sukamaju Baru, Tapos, Depok", url: "/contact#location-title", icon: "map-pin", is_highlighted: false },
    { title: "Sewa Studio", subtitle: "Kelas privat, komunitas, dan acara", url: "/rental", icon: "building", is_highlighted: false },
    { title: "Tips Sehat & Artikel", subtitle: "Panduan senam untuk pemula", url: "/artikel", icon: "book", is_highlighted: false },
    { title: "Kenali Danie", subtitle: "Pendiri & instruktur bersertifikat", url: "/about", icon: "user", is_highlighted: false },
    { title: "Website Lengkap", subtitle: "sanggarsenamdanie.com", url: "/", icon: "globe", is_highlighted: false },
  ],
  "bio-link",
)
