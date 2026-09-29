/**
 * Content shown when Supabase is not configured (local preview, first deploy).
 * Mirrors supabase/seed.sql. Only facts supplied by the studio live here —
 * schedules and testimonials must come from the database.
 */
import type { CertificateRow, InstructorRow, ProgramRow, TestimonialRow } from "@/types/database"

const stamp = { created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" }

export const fallbackPrograms: ProgramRow[] = [
  {
    id: "program-aerobic",
    title: "Aerobic",
    slug: "aerobic",
    summary: "Gerakan ritmis intensitas sedang untuk jantung, stamina, dan koordinasi.",
    description:
      "Kelas aerobic dengan gerakan ritmis berintensitas sedang yang melatih daya tahan jantung, stamina, dan koordinasi tubuh. Gerakan diajarkan bertahap sehingga nyaman untuk pemula maupun peserta yang sudah rutin berlatih.",
    category: "studio",
    icon: "heart-pulse",
    image_url: null,
    benefits: ["Melatih daya tahan jantung dan paru", "Meningkatkan stamina untuk aktivitas sehari-hari", "Melatih koordinasi dan keseimbangan", "Membantu menjaga berat badan bersama pola makan sehat"],
    audience: "Pemula hingga peserta rutin yang ingin meningkatkan stamina dan kebugaran jantung. Gerakan bisa dibuat lebih ringan sesuai kemampuan.",
    intensity: "sedang",
    sort_order: 1,
    is_active: true,
    ...stamp,
  },
  {
    id: "program-zumba",
    title: "Zumba",
    slug: "zumba",
    summary: "Kardio dengan musik Latin yang energik — berkeringat sambil bersenang-senang.",
    description:
      'Zumba memadukan gerakan tari dan musik Latin dalam latihan kardio yang menyenangkan. Dipandu instruktur berlisensi ZIN (Zumba Instructor Network), kelas ini cocok bagi Anda yang ingin aktif tanpa merasa sedang "berolahraga berat".',
    category: "studio",
    icon: "music",
    image_url: null,
    benefits: ["Membakar kalori lewat gerakan kardio yang menyenangkan", "Melatih koordinasi dan ritme", "Membantu memperbaiki suasana hati lewat musik yang energik", "Melatih daya tahan jantung"],
    audience: "Siapa saja yang ingin berolahraga sambil bersenang-senang — tidak perlu bisa menari. Cocok untuk yang mudah bosan dengan latihan biasa.",
    intensity: "sedang",
    sort_order: 2,
    is_active: true,
    ...stamp,
  },
  {
    id: "program-yoga",
    title: "Yoga",
    slug: "yoga",
    summary: "Latihan napas, kelenturan, dan keseimbangan untuk tubuh yang lebih rileks.",
    description:
      "Kelas yoga berfokus pada pernapasan, kelenturan, kekuatan inti, dan keseimbangan. Setiap pose memiliki variasi sehingga dapat disesuaikan dengan kondisi tubuh masing-masing peserta.",
    category: "studio",
    icon: "flower",
    image_url: null,
    benefits: ["Meningkatkan kelenturan tubuh", "Melatih kekuatan otot inti dan keseimbangan", "Membantu relaksasi lewat latihan pernapasan", "Membantu memperbaiki postur tubuh"],
    audience: "Pemula, pekerja kantoran dengan badan kaku, hingga siapa saja yang ingin lebih rileks. Setiap pose punya variasi yang lebih mudah.",
    intensity: "ringan",
    sort_order: 3,
    is_active: true,
    ...stamp,
  },
  {
    id: "program-aquarobic",
    title: "Aquarobic",
    slug: "aquarobic",
    summary: "Senam aerobik di air — ringan untuk sendi, tetap efektif.",
    description:
      "Aquarobic adalah senam aerobik yang dilakukan di dalam air. Daya apung air mengurangi beban pada sendi, sehingga latihan tetap efektif namun lebih aman bagi peserta dengan keluhan lutut atau berat badan berlebih.",
    category: "aqua",
    icon: "waves",
    image_url: null,
    benefits: ["Beban pada sendi lebih ringan berkat daya apung air", "Air memberi tahanan alami untuk melatih otot", "Melatih daya tahan jantung", "Tubuh terasa sejuk selama berlatih"],
    audience: "Peserta dengan keluhan lutut atau sendi, berat badan berlebih, lansia, atau siapa saja yang ingin olahraga ringan tapi efektif. Konsultasikan dengan dokter bila memiliki kondisi khusus.",
    intensity: "ringan",
    sort_order: 4,
    is_active: true,
    ...stamp,
  },
  {
    id: "program-aquayoga",
    title: "Aquayoga",
    slug: "aquayoga",
    summary: "Gerakan yoga di air yang menenangkan dengan beban minimal pada sendi.",
    description:
      "Aquayoga membawa gerakan yoga ke dalam air. Air membantu menopang tubuh sehingga peregangan terasa lebih ringan, cocok untuk pemulihan, relaksasi, dan meningkatkan kelenturan.",
    category: "aqua",
    icon: "droplets",
    image_url: null,
    benefits: ["Peregangan terasa lebih ringan karena air menopang tubuh", "Meningkatkan kelenturan dan rentang gerak", "Membantu relaksasi dan mengurangi ketegangan", "Melatih keseimbangan dengan aman"],
    audience: "Siapa saja yang ingin peregangan lembut dan relaksasi, termasuk peserta dalam masa pemulihan atas saran tenaga kesehatan.",
    intensity: "ringan",
    sort_order: 5,
    is_active: true,
    ...stamp,
  },
]

export const fallbackInstructors: InstructorRow[] = [
  {
    id: "instructor-danie",
    name: "Danie",
    slug: "danie",
    role_title: "Founder & Head Instructor",
    bio: "Danie adalah instruktur senam profesional dengan pengalaman lebih dari 10 tahun di dunia olahraga kebugaran dan senam. Selain memimpin Sanggar Senam Danie, Danie aktif sebagai Sekretaris IOSKI Depok (Ikatan Olahraga Senam Kreasi Indonesia).",
    photo_url: process.env.NEXT_PUBLIC_FOUNDER_PHOTO_URL || null,
    specialization: "Aerobic, Zumba, Yoga, Aquarobic, Aquayoga",
    certifications: ["ZIN (Zumba Instructor Network)", "Aerobic", "Yoga", "Aero Boxing", "Jantung Sehat"],
    experience_years: 10,
    is_founder: true,
    sort_order: 0,
    is_active: true,
    ...stamp,
  },
]

export const fallbackCertificates: CertificateRow[] = [
  ["ZIN — Zumba Instructor Network", "Zumba Fitness, LLC"],
  ["Sertifikasi Instruktur Aerobic", null],
  ["Sertifikasi Instruktur Yoga", null],
  ["Sertifikasi Aero Boxing", null],
  ["Sertifikasi Senam Jantung Sehat", null],
].map(([title, issuer], i) => ({
  id: `certificate-${i + 1}`,
  instructor_id: "instructor-danie",
  title: title as string,
  issuer,
  year: null,
  image_url: null,
  sort_order: i + 1,
  ...stamp,
}))

/**
 * Layout previews for local development only. Never rendered in production,
 * where testimonials must be real entries approved in /admin.
 */
export const developmentTestimonials: TestimonialRow[] =
  process.env.NODE_ENV === "production"
    ? []
    : [
        {
          id: "dev-testimonial-1",
          name: "Contoh Peserta",
          context: "Contoh — ganti dari /admin",
          message: "Kelasnya menyenangkan, instruktur sabar dan suasananya nyaman.",
          photo_url: null,
          is_published: true,
          ...stamp,
        },
        {
          id: "dev-testimonial-2",
          name: "Contoh Peserta",
          context: "Contoh — ganti dari /admin",
          message: "Gerakannya dijelaskan pelan-pelan, jadi saya yang pemula tidak merasa tertinggal.",
          photo_url: null,
          is_published: true,
          ...stamp,
        },
        {
          id: "dev-testimonial-3",
          name: "Contoh Peserta",
          context: "Contoh — ganti dari /admin",
          message: "Aquarobic cocok untuk saya yang punya keluhan lutut. Tetap berkeringat tapi tidak sakit.",
          photo_url: null,
          is_published: true,
          ...stamp,
        },
      ]
