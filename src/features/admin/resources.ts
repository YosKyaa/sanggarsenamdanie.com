/**
 * CMS resource registry. Plain serialisable config shared by server pages and
 * the client form; validation lives in ./schemas.ts (server only).
 */
import { programIcons } from "@/components/atoms/icon"
import type { CacheTag } from "@/lib/cache"
import { weekdayLabel, weekdays } from "@/lib/utils/format"

export type Bucket = "images" | "certificates" | "founder"

export type FieldConfig = {
  name: string
  label: string
  type: "text" | "textarea" | "number" | "boolean" | "select" | "time" | "date" | "tags" | "image"
  required?: boolean
  hint?: string
  /** Static options, or a relation filled in by the page. */
  options?: { value: string; label: string }[]
  relation?: "programs" | "instructors"
  bucket?: Bucket
  /** Accepts PDF as well as images (certificates). */
  allowPdf?: boolean
  wide?: boolean
  /** Initial state of a boolean field on new records. */
  defaultChecked?: boolean
  /** Visible rows for textarea fields. */
  rows?: number
  /** Starts a titled group in the form (long forms like site settings). */
  section?: string
  /** Input step for number fields ("any" allows decimals, e.g. coordinates). */
  step?: string
}

export type ColumnConfig = {
  name: string
  label: string
  format?: "boolean" | "time" | "day" | "relation" | "year" | "date" | "status" | "number" | "text"
  /** Numbers read best right-aligned; short flags centred. */
  align?: "left" | "center" | "right"
  /** Tailwind width class for fixed-size columns (e.g. "w-32"); the first column takes the rest. */
  width?: string
  /** Wording for boolean badges (default Aktif / Nonaktif). */
  labels?: { yes: string; no: string }
}

export type ResourceConfig = {
  key: ResourceKey
  table:
    | "programs"
    | "class_schedule"
    | "instructors"
    | "certificates"
    | "testimonials"
    | "articles"
    | "faqs"
    | "stats"
    | "brand_pillars"
    | "rental_uses"
    | "bio_links"
    | "studio_rental_requests"
    | "site_settings"
  label: string
  singular: string
  description: string
  tags: CacheTag[]
  orderBy: { column: string; ascending: boolean }[]
  columns: ColumnConfig[]
  fields: FieldConfig[]
  /** Records can be added from the admin (false for accounts created in Supabase Auth). */
  allowCreate?: boolean
  allowDelete?: boolean
  /** A single row edited in place (site settings) — no list, no create, no delete. */
  singleton?: boolean
  /** Custom list page lives at /admin/<key> (e.g. the rentals inbox). */
  customList?: boolean
  /** Only admins (not editors) may open or change it. */
  adminOnly?: boolean
}

export type ResourceKey =
  | "programs"
  | "schedules"
  | "instructors"
  | "certificates"
  | "testimonials"
  | "articles"
  | "faqs"
  | "stats"
  | "pillars"
  | "rentalUses"
  | "bioLinks"
  | "rentals"
  | "settings"

const activeField: FieldConfig = {
  name: "is_active",
  label: "Tampilkan di website",
  type: "boolean",
  defaultChecked: true,
}

const sortField: FieldConfig = {
  name: "sort_order",
  label: "Urutan tampil",
  type: "number",
  hint: "Angka kecil tampil lebih dulu.",
}

export const resources: Record<ResourceKey, ResourceConfig> = {
  programs: {
    key: "programs",
    table: "programs",
    label: "Program",
    singular: "program",
    description: "Kelas yang tampil di beranda dan halaman Program.",
    tags: ["programs", "schedule"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "title", label: "Nama" },
      { name: "slug", label: "Slug" },
      { name: "category", label: "Kategori" },
      { name: "is_active", label: "Aktif", format: "boolean" },
    ],
    fields: [
      { name: "title", label: "Nama program", type: "text", required: true },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        hint: "Huruf kecil dan tanda hubung, mis. zumba → /program/zumba",
      },
      {
        name: "summary",
        label: "Ringkasan (kartu)",
        type: "textarea",
        required: true,
        hint: "Satu kalimat, maks. 200 karakter.",
        wide: true,
      },
      { name: "description", label: "Deskripsi lengkap", type: "textarea", required: true, wide: true, rows: 6 },
      {
        name: "audience",
        label: "Cocok untuk siapa",
        type: "textarea",
        hint: "Satu-dua kalimat. Tampil di halaman program dan membantu Google memahami kelas ini.",
        wide: true,
      },
      {
        name: "benefits",
        label: "Manfaat",
        type: "tags",
        hint: "Satu manfaat per baris (3–5 poin). Hindari janji hasil yang berlebihan.",
        wide: true,
      },
      {
        name: "intensity",
        label: "Intensitas",
        type: "select",
        required: true,
        options: [
          { value: "ringan", label: "Ringan" },
          { value: "sedang", label: "Sedang" },
          { value: "tinggi", label: "Tinggi" },
        ],
      },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        required: true,
        options: [
          { value: "studio", label: "Kelas studio" },
          { value: "aqua", label: "Kelas air" },
        ],
      },
      {
        name: "icon",
        label: "Ikon",
        type: "select",
        required: true,
        options: Object.keys(programIcons).map((key) => ({ value: key, label: key })),
      },
      { name: "image_url", label: "Foto program", type: "image", bucket: "images", wide: true },
      sortField,
      activeField,
    ],
  },
  schedules: {
    key: "schedules",
    table: "class_schedule",
    label: "Jadwal",
    singular: "jadwal",
    description: "Jadwal kelas mingguan di halaman Program.",
    tags: ["schedule"],
    orderBy: [
      { column: "day", ascending: true },
      { column: "time_start", ascending: true },
    ],
    columns: [
      { name: "program_id", label: "Program", format: "relation" },
      { name: "day", label: "Hari", format: "day" },
      { name: "time_start", label: "Mulai", format: "time" },
      { name: "time_end", label: "Selesai", format: "time" },
      { name: "location", label: "Lokasi" },
      { name: "is_active", label: "Aktif", format: "boolean" },
    ],
    fields: [
      { name: "program_id", label: "Program", type: "select", relation: "programs", required: true },
      { name: "instructor_id", label: "Instruktur", type: "select", relation: "instructors" },
      {
        name: "day",
        label: "Hari",
        type: "select",
        required: true,
        options: weekdays.map((day) => ({ value: day, label: weekdayLabel[day] })),
      },
      { name: "time_start", label: "Jam mulai", type: "time", required: true },
      { name: "time_end", label: "Jam selesai", type: "time", required: true },
      {
        name: "location",
        label: "Lokasi",
        type: "text",
        required: true,
        hint: "Mis. Studio Sanggar Senam Danie, atau nama kolam untuk kelas air.",
        wide: true,
      },
      activeField,
    ],
  },
  instructors: {
    key: "instructors",
    table: "instructors",
    label: "Instruktur",
    singular: "instruktur",
    description: "Profil instruktur. Foto founder dipakai di hero beranda.",
    tags: ["instructors"],
    orderBy: [
      { column: "is_founder", ascending: false },
      { column: "sort_order", ascending: true },
    ],
    columns: [
      { name: "name", label: "Nama" },
      { name: "role_title", label: "Peran" },
      { name: "is_founder", label: "Founder", format: "boolean", labels: { yes: "Ya", no: "Tidak" } },
      { name: "is_active", label: "Aktif", format: "boolean" },
    ],
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, hint: "Huruf kecil dan tanda hubung." },
      { name: "role_title", label: "Peran", type: "text", required: true, hint: "Mis. Founder & Head Instructor" },
      { name: "specialization", label: "Spesialisasi", type: "text", hint: "Mis. Zumba, Yoga" },
      { name: "bio", label: "Bio", type: "textarea", wide: true },
      {
        name: "certifications",
        label: "Sertifikasi",
        type: "tags",
        hint: "Satu sertifikasi per baris.",
        wide: true,
      },
      { name: "experience_years", label: "Pengalaman (tahun)", type: "number" },
      { name: "photo_url", label: "Foto", type: "image", bucket: "founder", wide: true },
      { name: "is_founder", label: "Founder (tampil di hero)", type: "boolean" },
      sortField,
      activeField,
    ],
  },
  certificates: {
    key: "certificates",
    table: "certificates",
    label: "Sertifikat",
    singular: "sertifikat",
    description: "Galeri sertifikat di beranda, Tentang, dan Sertifikat.",
    tags: ["certificates"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "title", label: "Judul" },
      { name: "issuer", label: "Penerbit" },
      { name: "year", label: "Tahun", format: "year" },
    ],
    fields: [
      { name: "title", label: "Judul sertifikat", type: "text", required: true, wide: true },
      { name: "issuer", label: "Penerbit", type: "text" },
      { name: "year", label: "Tahun", type: "number" },
      { name: "instructor_id", label: "Milik instruktur", type: "select", relation: "instructors" },
      {
        name: "image_url",
        label: "Scan sertifikat",
        type: "image",
        bucket: "certificates",
        allowPdf: true,
        wide: true,
      },
      sortField,
    ],
  },
  articles: {
    key: "articles",
    table: "articles",
    label: "Artikel",
    singular: "artikel",
    description: "Artikel membantu website ditemukan di Google. Tulis 1–2 artikel per bulan tentang pertanyaan nyata peserta.",
    tags: ["articles"],
    orderBy: [{ column: "created_at", ascending: false }],
    columns: [
      { name: "title", label: "Judul" },
      { name: "slug", label: "Slug" },
      { name: "is_published", label: "Terbit", format: "boolean", labels: { yes: "Terbit", no: "Draf" } },
    ],
    fields: [
      {
        name: "title",
        label: "Judul",
        type: "text",
        required: true,
        hint: "Gunakan kata yang dicari orang, mis. \"Zumba untuk Pemula\". Maks. 110 karakter.",
        wide: true,
      },
      { name: "slug", label: "Slug URL", type: "text", required: true, hint: "mis. zumba-untuk-pemula → /artikel/zumba-untuk-pemula" },
      { name: "author_name", label: "Penulis", type: "text", required: true },
      {
        name: "excerpt",
        label: "Ringkasan",
        type: "textarea",
        required: true,
        hint: "50–180 karakter. Tampil di kartu artikel dan sebagai deskripsi di hasil Google.",
        wide: true,
      },
      {
        name: "content",
        label: "Isi artikel (Markdown)",
        type: "textarea",
        required: true,
        rows: 18,
        hint: "Gunakan ## untuk subjudul, - untuk daftar, **tebal**, dan [teks](/program/zumba) untuk tautan.",
        wide: true,
      },
      { name: "cover_image_url", label: "Gambar sampul", type: "image", bucket: "images", wide: true },
      { name: "program_id", label: "Program terkait", type: "select", relation: "programs" },
      { name: "is_published", label: "Terbitkan di website", type: "boolean" },
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    label: "Testimoni",
    singular: "testimoni",
    description: "Hanya testimoni yang dipublikasikan yang tampil di website.",
    tags: ["testimonials"],
    orderBy: [{ column: "created_at", ascending: false }],
    columns: [
      { name: "name", label: "Nama" },
      { name: "context", label: "Keterangan", format: "text" },
      { name: "is_published", label: "Publik", format: "boolean", labels: { yes: "Publik", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "name", label: "Nama peserta", type: "text", required: true },
      { name: "context", label: "Keterangan", type: "text", hint: "Mis. Peserta Zumba sejak 2023" },
      { name: "message", label: "Testimoni", type: "textarea", required: true, wide: true },
      { name: "photo_url", label: "Foto (opsional)", type: "image", bucket: "images", wide: true },
      {
        name: "is_published",
        label: "Publikasikan di website",
        type: "boolean",
        hint: "Pastikan peserta sudah mengizinkan testimoninya ditampilkan.",
      },
    ],
  },
  faqs: {
    key: "faqs",
    table: "faqs",
    label: "FAQ",
    singular: "pertanyaan",
    description: "Tanya jawab di beranda dan halaman Kontak (juga dibaca Google sebagai FAQ).",
    tags: ["faqs"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "question", label: "Pertanyaan" },
      { name: "is_active", label: "Tampil", format: "boolean", labels: { yes: "Tampil", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "question", label: "Pertanyaan", type: "text", required: true, wide: true, hint: "Tulis seperti yang diketik orang di Google." },
      { name: "answer", label: "Jawaban", type: "textarea", required: true, wide: true, rows: 5 },
      sortField,
      activeField,
    ],
  },
  stats: {
    key: "stats",
    table: "stats",
    label: "Statistik",
    singular: "statistik",
    description: "Angka di beranda dan Tentang. Statistik berlabel \"Peserta\" juga tampil di badge hero dan kolase.",
    tags: ["stats"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "label", label: "Label" },
      { name: "value", label: "Angka", format: "number" },
      { name: "suffix", label: "Akhiran", align: "center", width: "w-28" },
      { name: "is_active", label: "Tampil", format: "boolean", labels: { yes: "Tampil", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "value", label: "Angka", type: "number", required: true },
      { name: "suffix", label: "Akhiran", type: "text", hint: "Mis. + atau %. Kosongkan bila tidak perlu." },
      { name: "label", label: "Label", type: "text", required: true, hint: "Mis. Peserta Terlatih" },
      {
        name: "count_up",
        label: "Animasi hitung naik",
        type: "boolean",
        defaultChecked: true,
        hint: "Matikan untuk angka seperti tahun (2017).",
      },
      sortField,
      activeField,
    ],
  },
  pillars: {
    key: "pillars",
    table: "brand_pillars",
    label: "Janji Brand",
    singular: "janji",
    description: "Kartu \"Satu Sanggar, Tiga Janji\" (Sehat · Aktif · Bahagia) yang bertumpuk saat di-scroll.",
    tags: ["pillars"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "word", label: "Kata" },
      { name: "title", label: "Judul" },
      { name: "is_active", label: "Tampil", format: "boolean", labels: { yes: "Tampil", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "word", label: "Kata utama", type: "text", required: true, hint: "Satu kata besar, mis. Sehat" },
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea", required: true, wide: true },
      sortField,
      activeField,
    ],
  },
  rentalUses: {
    key: "rentalUses",
    table: "rental_uses",
    label: "Kegunaan Studio",
    singular: "kegunaan",
    description: "Daftar kegunaan di bagian Sewa Studio (beranda dan halaman Sewa Studio).",
    tags: ["rental-uses"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "title", label: "Judul" },
      { name: "description", label: "Deskripsi", format: "text" },
      { name: "is_active", label: "Tampil", format: "boolean", labels: { yes: "Tampil", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "text", required: true, wide: true },
      sortField,
      activeField,
    ],
  },
  rentals: {
    key: "rentals",
    table: "studio_rental_requests",
    label: "Permintaan Sewa",
    singular: "permintaan sewa",
    description: "Tambah permintaan yang masuk lewat WhatsApp/telepon, atau perbaiki data yang dikirim lewat formulir.",
    tags: [],
    orderBy: [{ column: "created_at", ascending: false }],
    customList: true,
    columns: [
      { name: "name", label: "Nama" },
      { name: "event_date", label: "Tanggal", format: "date" },
      { name: "status", label: "Status", format: "status" },
    ],
    fields: [
      { name: "name", label: "Nama penanggung jawab", type: "text", required: true },
      { name: "phone", label: "Nomor WhatsApp", type: "text", required: true, hint: "Contoh 0812 3456 7890" },
      { name: "organization", label: "Komunitas / instansi", type: "text" },
      { name: "event_date", label: "Tanggal acara", type: "date", required: true },
      { name: "participant_count", label: "Jumlah peserta", type: "number", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "new", label: "Diterima" },
          { value: "contacted", label: "Sudah dihubungi" },
          { value: "completed", label: "Selesai" },
        ],
      },
      { name: "message", label: "Detail acara", type: "textarea", wide: true },
    ],
  },
  bioLinks: {
    key: "bioLinks",
    table: "bio_links",
    label: "Link Bio",
    singular: "link",
    description: "Tombol di halaman /bio untuk link di bio Instagram. Tombol WhatsApp di paling atas sudah otomatis.",
    tags: ["bio-links"],
    orderBy: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "title", label: "Judul" },
      { name: "url", label: "Tujuan", format: "text" },
      { name: "is_active", label: "Tampil", format: "boolean", labels: { yes: "Tampil", no: "Disembunyikan" } },
    ],
    fields: [
      { name: "title", label: "Judul tombol", type: "text", required: true, hint: "Singkat, mis. Jadwal Kelas" },
      { name: "subtitle", label: "Keterangan kecil", type: "text", hint: "Opsional, mis. Aerobic, Zumba, Yoga" },
      {
        name: "url",
        label: "Tujuan link",
        type: "text",
        required: true,
        wide: true,
        hint: "Halaman website diawali / (mis. /program), atau link lengkap https://…",
      },
      {
        name: "icon",
        label: "Ikon",
        type: "select",
        required: true,
        options: [
          { value: "calendar", label: "Kalender" },
          { value: "map-pin", label: "Lokasi" },
          { value: "building", label: "Gedung" },
          { value: "book", label: "Buku/artikel" },
          { value: "user", label: "Orang" },
          { value: "globe", label: "Website" },
          { value: "star", label: "Bintang" },
          { value: "gift", label: "Promo" },
          { value: "play", label: "Video" },
          { value: "link", label: "Link" },
        ],
      },
      { name: "is_highlighted", label: "Tonjolkan (warna ungu)", type: "boolean" },
      sortField,
      activeField,
    ],
  },
  settings: {
    key: "settings",
    table: "site_settings",
    label: "Pengaturan Situs",
    singular: "pengaturan",
    description: "Kontak, alamat, profil pendiri, dan teks utama yang tampil di seluruh website.",
    tags: ["settings"],
    orderBy: [],
    singleton: true,
    adminOnly: true,
    columns: [],
    fields: [
      {
        section: "Kontak",
        name: "whatsapp",
        label: "Nomor WhatsApp",
        type: "text",
        required: true,
        hint: "Semua tombol WhatsApp memakai nomor ini. Boleh ditulis 0889… atau 62889…",
      },
      { name: "instagram_url", label: "Link Instagram", type: "text", hint: "https://instagram.com/…" },
      {
        name: "response_time",
        label: "Janji waktu balas",
        type: "text",
        required: true,
        hint: "Tampil setelah formulir sewa terkirim, mis. \"dalam 1×24 jam\".",
      },
      { section: "Teks utama & SEO", name: "tagline", label: "Tagline", type: "text", required: true, hint: "Tampil di atas judul beranda." },
      {
        name: "hero_description",
        label: "Deskripsi hero",
        type: "textarea",
        required: true,
        wide: true,
        hint: "Paragraf di bawah judul beranda.",
      },
      {
        name: "description",
        label: "Deskripsi untuk Google",
        type: "textarea",
        required: true,
        wide: true,
        hint: "50–200 karakter. Tampil di hasil pencarian untuk halaman yang tidak punya deskripsi sendiri.",
      },
      { name: "founded_date", label: "Tanggal berdiri", type: "date", required: true },
      {
        name: "credentials",
        label: "Sertifikasi singkat (kartu beranda)",
        type: "tags",
        hint: "Satu per baris, mis. ZIN Certified",
        wide: true,
      },
      { section: "Alamat & peta", name: "address_street", label: "Jalan / kelurahan", type: "text", required: true },
      { name: "address_district", label: "Kecamatan", type: "text", required: true },
      { name: "address_city", label: "Kota", type: "text", required: true },
      { name: "address_region", label: "Provinsi", type: "text", required: true },
      { name: "address_postal_code", label: "Kode pos", type: "text", required: true },
      {
        name: "maps_query",
        label: "Pencarian Google Maps",
        type: "text",
        required: true,
        hint: "Teks yang dicari di peta, atau nama tempat di Google Maps.",
        wide: true,
      },
      { section: "Pendiri", name: "founder_name", label: "Nama pendiri", type: "text", required: true },
      { name: "founder_title", label: "Jabatan", type: "text", required: true },
      { name: "founder_experience_years", label: "Pengalaman (tahun)", type: "number", required: true },
      { name: "organization", label: "Organisasi", type: "text", hint: "Mis. IOSKI Depok. Kosongkan bila tidak ada." },
      { name: "organization_long", label: "Nama lengkap organisasi", type: "text" },
      { name: "organization_role", label: "Peran di organisasi", type: "text", hint: "Mis. Sekretaris" },
      {
        section: "Media sosial & Google",
        name: "google_maps_url",
        label: "Link Google Maps / Google Business Profile",
        type: "text",
        hint: "Buka profil sanggar di Google Maps → Bagikan → salin link. Dipakai untuk tombol arah & SEO lokal.",
        wide: true,
      },
      { name: "tiktok_url", label: "Link TikTok", type: "text", hint: "https://tiktok.com/@…" },
      { name: "facebook_url", label: "Link Facebook", type: "text", hint: "https://facebook.com/…" },
      { name: "youtube_url", label: "Link YouTube", type: "text", hint: "https://youtube.com/@…" },
      {
        name: "latitude",
        label: "Latitude",
        type: "number",
        step: "any",
        hint: "Di Google Maps, klik kanan titik sanggar → angka pertama, mis. -6.4012",
      },
      { name: "longitude", label: "Longitude", type: "number", step: "any", hint: "Angka kedua, mis. 106.8714" },
      {
        section: "Jam operasional",
        name: "opening_hours",
        label: "Jam buka",
        type: "tags",
        wide: true,
        hint: "Satu baris per hari/rentang, format Google: Mo-Fr 06:00-20:00 atau Sa 07:00-12:00 (Mo Tu We Th Fr Sa Su). Tampil di website & Google.",
      },
      {
        section: "Foto",
        name: "founder_photo_2_url",
        label: "Foto pendiri saat mengajar (kolase)",
        type: "image",
        bucket: "founder",
        hint: "Foto utama pendiri diatur di menu Instruktur.",
      },
      { name: "class_photo_url", label: "Foto suasana kelas", type: "image", bucket: "images" },
      { name: "studio_photo_url", label: "Foto studio", type: "image", bucket: "images" },
    ],
  },
}

export function getResource(key: string): ResourceConfig | null {
  return key in resources ? resources[key as ResourceKey] : null
}
