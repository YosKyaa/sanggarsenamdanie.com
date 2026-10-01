/**
 * Database types mirroring supabase/migrations/0001_init.sql.
 * Regenerate with `npx supabase gen types typescript` once a project is linked.
 */

export type RequestStatus = "new" | "contacted" | "completed"
export type ProgramCategory = "studio" | "aqua"
export type ProgramIntensity = "ringan" | "sedang" | "tinggi"
export type Weekday = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu"
export type ProfileRole = "admin" | "editor" | "member"

type Timestamps = { created_at: string; updated_at: string }

export type ProfileRow = { id: string; name: string | null; email: string | null; role: ProfileRole; created_at: string }

export type ProgramRow = Timestamps & {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  category: ProgramCategory
  icon: string
  image_url: string | null
  benefits: string[]
  audience: string
  intensity: ProgramIntensity
  sort_order: number
  is_active: boolean
}

export type InstructorRow = Timestamps & {
  id: string
  name: string
  slug: string
  role_title: string
  bio: string
  photo_url: string | null
  specialization: string
  certifications: string[]
  experience_years: number
  is_founder: boolean
  sort_order: number
  is_active: boolean
}

export type CertificateRow = Timestamps & {
  id: string
  instructor_id: string | null
  title: string
  issuer: string | null
  year: number | null
  image_url: string | null
  sort_order: number
}

export type ArticleRow = Timestamps & {
  id: string
  title: string
  slug: string
  /** Also used as the meta description. */
  excerpt: string
  /** Markdown. */
  content: string
  cover_image_url: string | null
  program_id: string | null
  author_name: string
  is_published: boolean
  published_at: string | null
}

export type SiteSettingsRow = {
  id: number
  whatsapp: string
  instagram_url: string | null
  response_time: string
  tagline: string
  description: string
  hero_description: string
  founded_date: string
  credentials: string[]
  address_street: string
  address_district: string
  address_city: string
  address_region: string
  address_postal_code: string
  maps_query: string
  founder_name: string
  founder_title: string
  founder_experience_years: number
  organization: string | null
  organization_long: string | null
  organization_role: string | null
  founder_photo_2_url: string | null
  class_photo_url: string | null
  studio_photo_url: string | null
  tiktok_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  google_maps_url: string | null
  latitude: number | null
  longitude: number | null
  opening_hours: string[]
  updated_at: string
}

export type BioLinkRow = Timestamps & {
  id: string
  title: string
  subtitle: string | null
  /** Absolute URL or a site path starting with "/". */
  url: string
  icon: string
  is_highlighted: boolean
  sort_order: number
  is_active: boolean
}

export type FaqRow = Timestamps & {
  id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
}

export type StatRow = Timestamps & {
  id: string
  value: number
  suffix: string
  label: string
  count_up: boolean
  sort_order: number
  is_active: boolean
}

export type BrandPillarRow = Timestamps & {
  id: string
  word: string
  title: string
  description: string
  sort_order: number
  is_active: boolean
}

export type RentalUseRow = Timestamps & {
  id: string
  title: string
  description: string
  sort_order: number
  is_active: boolean
}

export type AnalyticsEventRow = {
  id: number
  created_at: string
  type: "pageview" | "whatsapp_click"
  path: string
  referrer_host: string | null
  country: string | null
  device: "mobile" | "tablet" | "desktop"
  visitor_hash: string
}

export type AnalyticsSummary = {
  days: number
  totals: { visitors: number; pageviews: number; whatsapp_clicks: number }
  previous: { visitors: number; pageviews: number; whatsapp_clicks: number }
  daily: { date: string; visitors: number; pageviews: number; whatsapp_clicks: number }[]
  top_pages: { path: string; pageviews: number }[]
  whatsapp_pages: { path: string; clicks: number }[]
  referrers: { source: string; visitors: number }[]
  devices: { device: AnalyticsEventRow["device"]; visitors: number }[]
}

export type TestimonialRow = Timestamps & {
  id: string
  name: string
  context: string | null
  message: string
  photo_url: string | null
  is_published: boolean
}

export type ClassScheduleRow = Timestamps & {
  id: string
  program_id: string
  instructor_id: string | null
  day: Weekday
  time_start: string
  time_end: string
  location: string
  is_active: boolean
}

export type StudioRentalRequestRow = Timestamps & {
  id: string
  reference_code: string
  name: string
  phone: string
  organization: string | null
  event_date: string
  participant_count: number
  message: string | null
  status: RequestStatus
}

/** Columns filled by defaults are optional on insert. */
type InsertOf<Row, Optional extends keyof Row> = Omit<Row, Optional> & Partial<Pick<Row, Optional>>
type AutoCols = "id" | "created_at" | "updated_at"

type Table<Row, Insert> = {
  Row: Row
  Insert: Insert
  Update: Partial<Insert>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, InsertOf<ProfileRow, "name" | "email" | "role" | "created_at">>
      programs: Table<
        ProgramRow,
        InsertOf<
          ProgramRow,
          | AutoCols
          | "summary"
          | "description"
          | "category"
          | "icon"
          | "image_url"
          | "benefits"
          | "audience"
          | "intensity"
          | "sort_order"
          | "is_active"
        >
      >
      instructors: Table<
        InstructorRow,
        InsertOf<
          InstructorRow,
          | AutoCols
          | "role_title"
          | "bio"
          | "photo_url"
          | "specialization"
          | "certifications"
          | "experience_years"
          | "is_founder"
          | "sort_order"
          | "is_active"
        >
      >
      certificates: Table<
        CertificateRow,
        InsertOf<CertificateRow, AutoCols | "instructor_id" | "issuer" | "year" | "image_url" | "sort_order">
      >
      articles: Table<
        ArticleRow,
        InsertOf<ArticleRow, AutoCols | "cover_image_url" | "program_id" | "author_name" | "is_published" | "published_at">
      >
      site_settings: Table<
        SiteSettingsRow,
        InsertOf<
          SiteSettingsRow,
          | "id"
          | "updated_at"
          | "response_time"
          | "credentials"
          | "tiktok_url"
          | "facebook_url"
          | "youtube_url"
          | "google_maps_url"
          | "latitude"
          | "longitude"
          | "opening_hours"
        >
      >
      bio_links: Table<BioLinkRow, InsertOf<BioLinkRow, AutoCols | "subtitle" | "icon" | "is_highlighted" | "sort_order" | "is_active">>
      faqs: Table<FaqRow, InsertOf<FaqRow, AutoCols | "sort_order" | "is_active">>
      stats: Table<StatRow, InsertOf<StatRow, AutoCols | "suffix" | "count_up" | "sort_order" | "is_active">>
      brand_pillars: Table<BrandPillarRow, InsertOf<BrandPillarRow, AutoCols | "sort_order" | "is_active">>
      rental_uses: Table<RentalUseRow, InsertOf<RentalUseRow, AutoCols | "sort_order" | "is_active">>
      analytics_events: Table<
        AnalyticsEventRow,
        InsertOf<AnalyticsEventRow, "id" | "created_at" | "referrer_host" | "country">
      >
      testimonials: Table<
        TestimonialRow,
        InsertOf<TestimonialRow, AutoCols | "context" | "photo_url" | "is_published">
      >
      class_schedule: Table<
        ClassScheduleRow,
        InsertOf<ClassScheduleRow, AutoCols | "instructor_id" | "location" | "is_active">
      >
      studio_rental_requests: Table<
        StudioRentalRequestRow,
        InsertOf<StudioRentalRequestRow, AutoCols | "organization" | "message" | "status">
      >
    }
    Views: Record<never, never>
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      analytics_summary: { Args: { p_days: number }; Returns: AnalyticsSummary }
      get_request_status: {
        Args: { p_reference: string; p_phone: string }
        Returns: {
          status: RequestStatus
          created_at: string
          updated_at: string
        }[]
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type TableName = keyof Database["public"]["Tables"]
