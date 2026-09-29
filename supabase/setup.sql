-- Sanggar Senam Danie — full database setup (run ONCE in Supabase → SQL Editor).
-- Generated from supabase/migrations/*.sql + supabase/seed.sql. Edit those files, not this one.

-- ================================================================
-- supabase/migrations/0001_init.sql
-- ================================================================
-- Sanggar Senam Danie — initial schema
-- Tables, constraints, RLS, storage buckets and the public status-lookup RPC.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

-- security definer so policies can call it without recursing into profiles RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------
-- Content tables
-- ------------------------------------------------------------------

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null default '' check (char_length(summary) <= 200),
  description text not null default '',
  category text not null default 'studio' check (category in ('studio', 'aqua')),
  icon text not null default 'activity',
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  role_title text not null default 'Instruktur',
  bio text not null default '',
  photo_url text,
  specialization text not null default '',
  certifications text[] not null default '{}',
  experience_years integer not null default 0 check (experience_years between 0 and 80),
  is_founder boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid references public.instructors (id) on delete set null,
  title text not null check (char_length(title) between 2 and 120),
  issuer text,
  year integer check (year between 1980 and 2100),
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  context text, -- e.g. "Peserta Zumba sejak 2022"
  message text not null check (char_length(message) between 10 and 600),
  photo_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.class_schedule (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  instructor_id uuid references public.instructors (id) on delete set null,
  day text not null check (day in ('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu')),
  time_start time not null,
  time_end time not null,
  location text not null default 'Studio Sanggar Senam Danie',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_schedule_time_order check (time_end > time_start)
);

-- ------------------------------------------------------------------
-- Studio rental requests (public insert only)
-- ------------------------------------------------------------------

create table public.studio_rental_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique check (reference_code ~ '^SSD-[A-Z0-9]{6}$'),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^62[0-9]{8,13}$'),
  organization text check (char_length(organization) <= 120),
  event_date date not null,
  participant_count integer not null check (participant_count between 1 and 500),
  message text check (char_length(message) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- Indexes (match the public query patterns)
-- ------------------------------------------------------------------

create index programs_active_order_idx on public.programs (is_active, sort_order);
create index instructors_active_order_idx on public.instructors (is_active, sort_order);
create index certificates_order_idx on public.certificates (sort_order);
create index certificates_instructor_idx on public.certificates (instructor_id);
create index testimonials_published_idx on public.testimonials (is_published, created_at desc);
create index class_schedule_program_idx on public.class_schedule (program_id);
create index class_schedule_instructor_idx on public.class_schedule (instructor_id);
create index rental_requests_status_idx on public.studio_rental_requests (status, created_at desc);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'programs', 'instructors', 'certificates', 'testimonials',
    'class_schedule', 'studio_rental_requests'
  ]
  loop
    execute format(
      'create trigger %I_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.instructors enable row level security;
alter table public.certificates enable row level security;
alter table public.testimonials enable row level security;
alter table public.class_schedule enable row level security;
alter table public.studio_rental_requests enable row level security;

-- profiles
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: admin manage" on public.profiles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- public content: read what is visible, admin manages everything
create policy "programs: public read" on public.programs
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "programs: admin write" on public.programs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "instructors: public read" on public.instructors
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "instructors: admin write" on public.instructors
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "certificates: public read" on public.certificates
  for select to anon, authenticated using (true);
create policy "certificates: admin write" on public.certificates
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "testimonials: public read" on public.testimonials
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "testimonials: admin write" on public.testimonials
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "class_schedule: public read" on public.class_schedule
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "class_schedule: admin write" on public.class_schedule
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- rental requests: anyone may submit a *new* one; only admins can read or change them
create policy "rental_requests: public submit" on public.studio_rental_requests
  for insert to anon, authenticated with check (status = 'new');
create policy "rental_requests: admin manage" on public.studio_rental_requests
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Explicit grants (don't rely on project defaults). RLS above still decides
-- which rows each role can actually touch.
grant select on public.programs, public.instructors, public.certificates,
  public.testimonials, public.class_schedule to anon, authenticated;
grant insert on public.studio_rental_requests to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- ------------------------------------------------------------------
-- Public rental status lookup (needs reference code AND phone).
-- Class sign-ups happen over WhatsApp, so only rentals are tracked here.
-- ------------------------------------------------------------------

create or replace function public.get_request_status(p_reference text, p_phone text)
returns table (status text, created_at timestamptz, updated_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select r.status, r.created_at, r.updated_at
  from public.studio_rental_requests r
  where r.reference_code = upper(p_reference) and r.phone = p_phone
  limit 1;
$$;

revoke all on function public.get_request_status(text, text) from public;
grant execute on function public.get_request_status(text, text) to anon, authenticated;

-- ------------------------------------------------------------------
-- Storage buckets
-- ------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('images', 'images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('certificates', 'certificates', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('founder', 'founder', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "storage: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('images', 'certificates', 'founder') and (select public.is_admin()));
create policy "storage: admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('images', 'certificates', 'founder') and (select public.is_admin()));
create policy "storage: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('images', 'certificates', 'founder') and (select public.is_admin()));

-- ================================================================
-- supabase/migrations/0002_seo_content.sql
-- ================================================================
-- SEO content: richer program pages and an articles section for organic search.

-- ------------------------------------------------------------------
-- Programs: content that answers "is this class for me?"
-- ------------------------------------------------------------------

alter table public.programs
  add column benefits text[] not null default '{}',
  add column audience text not null default '' check (char_length(audience) <= 600),
  add column intensity text not null default 'sedang' check (intensity in ('ringan', 'sedang', 'tinggi'));

-- ------------------------------------------------------------------
-- Articles
-- ------------------------------------------------------------------

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 10 and 110),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) between 50 and 180), -- doubles as meta description
  content text not null, -- Markdown
  cover_image_url text,
  program_id uuid references public.programs (id) on delete set null, -- related class for internal links
  author_name text not null default 'Tim Sanggar Senam Danie',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_published_idx on public.articles (is_published, published_at desc);
create index articles_program_idx on public.articles (program_id);

create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

-- Stamp the publish date the first time an article goes live.
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger articles_published_at before insert or update on public.articles
  for each row execute function public.set_published_at();

alter table public.articles enable row level security;

create policy "articles: public read" on public.articles
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "articles: admin write" on public.articles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.articles to anon, authenticated;
grant select, insert, update, delete on public.articles to authenticated;

-- ================================================================
-- supabase/migrations/0003_cms_everything.sql
-- ================================================================
-- Everything on the public site becomes editable from /admin:
-- site settings (single row), FAQs, stats, brand pillars and studio-rental uses.

-- ------------------------------------------------------------------
-- Site settings — exactly one row (id = 1)
-- ------------------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  whatsapp text not null check (whatsapp ~ '^62[0-9]{8,13}$'),
  instagram_url text,
  response_time text not null default 'dalam 1×24 jam',
  tagline text not null check (char_length(tagline) between 5 and 80),
  description text not null check (char_length(description) between 50 and 200), -- default meta description
  hero_description text not null check (char_length(hero_description) between 20 and 240),
  founded_date date not null,
  credentials text[] not null default '{}',
  address_street text not null,
  address_district text not null,
  address_city text not null,
  address_region text not null,
  address_postal_code text not null,
  maps_query text not null,
  founder_name text not null,
  founder_title text not null,
  founder_experience_years integer not null check (founder_experience_years between 0 and 80),
  organization text,
  organization_long text,
  organization_role text,
  founder_photo_2_url text,
  class_photo_url text,
  studio_photo_url text,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------
-- List content
-- ------------------------------------------------------------------

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 5 and 200),
  answer text not null check (char_length(answer) between 10 and 1000),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stats (
  id uuid primary key default gen_random_uuid(),
  value integer not null check (value >= 0),
  suffix text not null default '' check (char_length(suffix) <= 4),
  label text not null check (char_length(label) between 2 and 40),
  count_up boolean not null default true, -- false for values like a year
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brand_pillars (
  id uuid primary key default gen_random_uuid(),
  word text not null check (char_length(word) between 2 and 20),
  title text not null check (char_length(title) between 3 and 80),
  description text not null check (char_length(description) between 10 and 300),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rental_uses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 60),
  description text not null check (char_length(description) between 5 and 200),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_active_order_idx on public.faqs (is_active, sort_order);
create index stats_active_order_idx on public.stats (is_active, sort_order);
create index brand_pillars_active_order_idx on public.brand_pillars (is_active, sort_order);
create index rental_uses_active_order_idx on public.rental_uses (is_active, sort_order);

do $$
declare t text;
begin
  foreach t in array array['faqs', 'stats', 'brand_pillars', 'rental_uses']
  loop
    execute format(
      'create trigger %I_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ------------------------------------------------------------------
-- RLS: public reads what is visible, admins manage everything
-- ------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.faqs enable row level security;
alter table public.stats enable row level security;
alter table public.brand_pillars enable row level security;
alter table public.rental_uses enable row level security;

create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "site_settings: admin write" on public.site_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "faqs: public read" on public.faqs
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "faqs: admin write" on public.faqs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "stats: public read" on public.stats
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "stats: admin write" on public.stats
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "brand_pillars: public read" on public.brand_pillars
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "brand_pillars: admin write" on public.brand_pillars
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "rental_uses: public read" on public.rental_uses
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "rental_uses: admin write" on public.rental_uses
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.site_settings, public.faqs, public.stats, public.brand_pillars, public.rental_uses
  to anon, authenticated;
grant select, insert, update, delete on public.site_settings, public.faqs, public.stats, public.brand_pillars,
  public.rental_uses to authenticated;

-- ================================================================
-- supabase/seed.sql
-- ================================================================
-- Seed content from facts supplied by the studio.
-- Class schedules and testimonials are intentionally NOT seeded: add the real
-- ones from /admin so the public site never shows invented data.

insert into public.programs (title, slug, summary, description, category, icon, sort_order) values
  ('Aerobic', 'aerobic',
   'Gerakan ritmis intensitas sedang untuk jantung, stamina, dan koordinasi.',
   'Kelas aerobic dengan gerakan ritmis berintensitas sedang yang melatih daya tahan jantung, stamina, dan koordinasi tubuh. Gerakan diajarkan bertahap sehingga nyaman untuk pemula maupun peserta yang sudah rutin berlatih.',
   'studio', 'heart-pulse', 1),
  ('Zumba', 'zumba',
   'Kardio dengan musik Latin yang energik — berkeringat sambil bersenang-senang.',
   'Zumba memadukan gerakan tari dan musik Latin dalam latihan kardio yang menyenangkan. Dipandu instruktur berlisensi ZIN (Zumba Instructor Network), kelas ini cocok bagi Anda yang ingin aktif tanpa merasa sedang "berolahraga berat".',
   'studio', 'music', 2),
  ('Yoga', 'yoga',
   'Latihan napas, kelenturan, dan keseimbangan untuk tubuh yang lebih rileks.',
   'Kelas yoga berfokus pada pernapasan, kelenturan, kekuatan inti, dan keseimbangan. Setiap pose memiliki variasi sehingga dapat disesuaikan dengan kondisi tubuh masing-masing peserta.',
   'studio', 'flower', 3),
  ('Aquarobic', 'aquarobic',
   'Senam aerobik di air — ringan untuk sendi, tetap efektif.',
   'Aquarobic adalah senam aerobik yang dilakukan di dalam air. Daya apung air mengurangi beban pada sendi, sehingga latihan tetap efektif namun lebih aman bagi peserta dengan keluhan lutut atau berat badan berlebih.',
   'aqua', 'waves', 4),
  ('Aquayoga', 'aquayoga',
   'Gerakan yoga di air yang menenangkan dengan beban minimal pada sendi.',
   'Aquayoga membawa gerakan yoga ke dalam air. Air membantu menopang tubuh sehingga peregangan terasa lebih ringan, cocok untuk pemulihan, relaksasi, dan meningkatkan kelenturan.',
   'aqua', 'droplets', 5);

with danie as (
  insert into public.instructors
    (name, slug, role_title, bio, specialization, certifications, experience_years, is_founder, sort_order)
  values
    ('Danie', 'danie', 'Founder & Head Instructor',
     'Danie adalah instruktur senam profesional dengan pengalaman lebih dari 10 tahun di dunia olahraga kebugaran dan senam. Selain memimpin Sanggar Senam Danie, Danie aktif sebagai Sekretaris IOSKI Depok (Ikatan Olahraga Senam Kreasi Indonesia).',
     'Aerobic, Zumba, Yoga, Aquarobic, Aquayoga',
     array['ZIN (Zumba Instructor Network)', 'Aerobic', 'Yoga', 'Aero Boxing', 'Jantung Sehat'],
     10, true, 0)
  returning id
)
insert into public.certificates (instructor_id, title, issuer, sort_order)
select danie.id, c.title, c.issuer, c.sort_order
from danie, (values
  ('ZIN — Zumba Instructor Network', 'Zumba Fitness, LLC', 1),
  ('Sertifikasi Instruktur Aerobic', null, 2),
  ('Sertifikasi Instruktur Yoga', null, 3),
  ('Sertifikasi Aero Boxing', null, 4),
  ('Sertifikasi Senam Jantung Sehat', null, 5)
) as c(title, issuer, sort_order);

-- After creating your admin user in Supabase Auth, promote it:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');

-- SEO content (migration 0002): program details and starter articles.

update public.programs set
  intensity = 'sedang',
  audience = 'Pemula hingga peserta rutin yang ingin meningkatkan stamina dan kebugaran jantung. Gerakan bisa dibuat lebih ringan sesuai kemampuan.',
  benefits = array['Melatih daya tahan jantung dan paru', 'Meningkatkan stamina untuk aktivitas sehari-hari', 'Melatih koordinasi dan keseimbangan', 'Membantu menjaga berat badan bersama pola makan sehat']
where slug = 'aerobic';

update public.programs set
  intensity = 'sedang',
  audience = 'Siapa saja yang ingin berolahraga sambil bersenang-senang — tidak perlu bisa menari. Cocok untuk yang mudah bosan dengan latihan biasa.',
  benefits = array['Membakar kalori lewat gerakan kardio yang menyenangkan', 'Melatih koordinasi dan ritme', 'Membantu memperbaiki suasana hati lewat musik yang energik', 'Melatih daya tahan jantung']
where slug = 'zumba';

update public.programs set
  intensity = 'ringan',
  audience = 'Pemula, pekerja kantoran dengan badan kaku, hingga siapa saja yang ingin lebih rileks. Setiap pose punya variasi yang lebih mudah.',
  benefits = array['Meningkatkan kelenturan tubuh', 'Melatih kekuatan otot inti dan keseimbangan', 'Membantu relaksasi lewat latihan pernapasan', 'Membantu memperbaiki postur tubuh']
where slug = 'yoga';

update public.programs set
  intensity = 'ringan',
  audience = 'Peserta dengan keluhan lutut atau sendi, berat badan berlebih, lansia, atau siapa saja yang ingin olahraga ringan tapi efektif. Konsultasikan dengan dokter bila memiliki kondisi khusus.',
  benefits = array['Beban pada sendi lebih ringan berkat daya apung air', 'Air memberi tahanan alami untuk melatih otot', 'Melatih daya tahan jantung', 'Tubuh terasa sejuk selama berlatih']
where slug = 'aquarobic';

update public.programs set
  intensity = 'ringan',
  audience = 'Siapa saja yang ingin peregangan lembut dan relaksasi, termasuk peserta dalam masa pemulihan atas saran tenaga kesehatan.',
  benefits = array['Peregangan terasa lebih ringan karena air menopang tubuh', 'Meningkatkan kelenturan dan rentang gerak', 'Membantu relaksasi dan mengurangi ketegangan', 'Melatih keseimbangan dengan aman']
where slug = 'aquayoga';

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Zumba untuk Pemula: Panduan Mengikuti Kelas Pertama', 'zumba-untuk-pemula',
  'Baru pertama kali ikut Zumba? Ini yang perlu disiapkan, apa yang terjadi di kelas, dan tips agar tetap nyaman mengikuti gerakan.',
  $md$Zumba sering jadi pilihan pertama orang yang ingin mulai rutin berolahraga. Musiknya ceria, gerakannya berulang, dan suasananya lebih mirip pesta daripada latihan berat. Kalau Anda baru akan mencoba, panduan ini membantu Anda datang dengan tenang.

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

Di Sanggar Senam Danie, kelas Zumba dipandu instruktur berlisensi ZIN dengan suasana yang santai dan bersahabat untuk pemula. Lihat detail [kelas Zumba](/program/zumba) atau tanyakan jadwal terbaru lewat WhatsApp.$md$,
  (select id from public.programs where slug = 'zumba'),
  true;

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Manfaat Senam Aerobic untuk Jantung dan Stamina', 'manfaat-senam-aerobic',
  'Senam aerobic melatih jantung dan paru, membantu menjaga berat badan, dan baik untuk suasana hati. Simak manfaat dan cara memulainya dengan aman.',
  $md$Senam aerobic adalah salah satu olahraga paling mudah dimulai: tidak butuh alat, bisa dilakukan bersama-sama, dan intensitasnya bisa disesuaikan. Berikut manfaat yang bisa Anda rasakan jika melakukannya secara rutin.

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

Kelas aerobic di Sanggar Senam Danie diajarkan bertahap dan setiap gerakan memiliki versi yang lebih ringan. Danie juga bersertifikasi **Senam Jantung Sehat**, sehingga kelas dirancang dengan memperhatikan keamanan jantung peserta. Lihat detail [kelas Aerobic](/program/aerobic).$md$,
  (select id from public.programs where slug = 'aerobic'),
  true;

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Aquarobic dan Aquayoga: Olahraga di Air yang Ramah Sendi', 'aquarobic-aquayoga-olahraga-ramah-sendi',
  'Daya apung air mengurangi beban pada sendi sehingga olahraga terasa lebih ringan. Kenali aquarobic dan aquayoga serta siapa yang cocok mengikutinya.',
  $md$Tidak semua orang nyaman melompat atau berlari di lantai studio. Lutut yang sering nyeri, berat badan berlebih, atau usia bisa membuat olahraga terasa berat. Di sinilah olahraga di air menjadi pilihan menarik.

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

Sanggar Senam Danie membuka kelas [Aquarobic](/program/aquarobic) dan [Aquayoga](/program/aquayoga). Lokasi dan jadwal kelas air bisa Anda tanyakan langsung lewat WhatsApp.$md$,
  (select id from public.programs where slug = 'aquarobic'),
  true;

-- Editable site content (migration 0003). Values match the site defaults.

insert into public.site_settings (id, whatsapp, instagram_url, response_time, tagline, description, hero_description, founded_date, credentials, address_street, address_district, address_city, address_region, address_postal_code, maps_query, founder_name, founder_title, founder_experience_years, organization, organization_long, organization_role, founder_photo_2_url, class_photo_url, studio_photo_url)
values (1, '6288975351853', null, 'dalam 1×24 jam', 'Studio Senam Profesional Depok', 'Studio senam profesional di Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga bersama instruktur bersertifikasi.', 'Studio senam di Tapos, Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga — dipandu instruktur bersertifikasi.', '2017-07-27', array['ZIN Certified', 'Aerobic', 'Yoga', 'Aero Boxing', 'Jantung Sehat']::text[], 'Sukamaju Baru', 'Tapos', 'Depok', 'Jawa Barat', '16455', 'Sukamaju Baru, Tapos, Depok, Jawa Barat 16455', 'Danie', 'Founder Sanggar Senam Danie', 10, 'IOSKI Depok', 'Ikatan Olahraga Senam Kreasi Indonesia', 'Sekretaris', null, null, null)
on conflict (id) do nothing;

insert into public.faqs (question, answer, sort_order) values
  ('Apakah pemula boleh ikut kelas?', 'Boleh. Gerakan diajarkan bertahap dan setiap gerakan punya variasi yang lebih ringan, jadi Anda bisa berlatih sesuai kemampuan.', 1),
  ('Bagaimana cara bergabung?', 'Cukup chat kami di WhatsApp +62 889-7535-1853. Kami bantu pilihkan kelas dan jadwal yang paling cocok untuk Anda.', 2),
  ('Berapa biaya kelas senam di Sanggar Senam Danie?', 'Biaya berbeda untuk setiap program. Silakan tanyakan info biaya terbaru lewat WhatsApp — kami jawab dengan senang hati.', 3),
  ('Di mana lokasi Sanggar Senam Danie?', 'Sanggar Senam Danie berada di Sukamaju Baru, Kecamatan Tapos, Kota Depok, Jawa Barat 16455. Lokasi kelas air (Aquarobic dan Aquayoga) tercantum pada jadwal masing-masing kelas.', 4),
  ('Apa yang perlu dibawa saat kelas pertama?', 'Pakaian olahraga yang nyaman, sepatu olahraga untuk kelas studio, air minum, dan handuk kecil. Untuk kelas air, bawa pakaian renang, handuk, dan sandal.', 5),
  ('Kelas mana yang cocok untuk yang punya keluhan lutut atau sendi?', 'Aquarobic dan Aquayoga biasanya paling nyaman karena air mengurangi beban pada sendi. Beri tahu instruktur tentang kondisi Anda, dan konsultasikan dengan dokter bila perlu.', 6),
  ('Apakah studio bisa disewa?', 'Bisa. Studio dapat disewa untuk kelas privat, gathering komunitas, wellness event, dan sesi latihan melalui halaman Sewa Studio.', 7);

insert into public.stats (value, suffix, label, count_up, sort_order) values
  (2017, '', 'Berdiri Sejak', false, 1),
  (10, '+', 'Tahun Pengalaman', true, 2),
  (500, '+', 'Peserta Terlatih', true, 3),
  (5, '', 'Program Kelas', true, 4);

insert into public.brand_pillars (word, title, description, sort_order) values
  ('Sehat', 'Gerakan aman dan terarah', 'Setiap kelas dipandu instruktur bersertifikat, dengan variasi gerakan untuk pemula hingga peserta rutin.', 1),
  ('Aktif', 'Pilihan kelas yang beragam', 'Aerobic, Zumba, Yoga, hingga kelas di air — tetap semangat bergerak tanpa merasa bosan.', 2),
  ('Bahagia', 'Komunitas yang saling mendukung', 'Berlatih bersama teman-teman satu sanggar, sehingga olahraga menjadi momen yang dinanti.', 3);

insert into public.rental_uses (title, description, sort_order) values
  ('Private class', 'Sesi eksklusif untuk Anda atau kelompok kecil.', 1),
  ('Community gathering', 'Arisan sehat, komunitas, dan acara kantor.', 2),
  ('Wellness event', 'Workshop, seminar kesehatan, dan kelas tamu.', 3),
  ('Training', 'Latihan tim, persiapan lomba, dan pelatihan instruktur.', 4);
