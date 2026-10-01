-- Local SEO + Instagram bio page:
-- social profiles, Google Business Profile link, coordinates and opening hours
-- on site settings, and an editable list of links for /bio.

alter table public.site_settings
  add column if not exists tiktok_url text,
  add column if not exists facebook_url text,
  add column if not exists youtube_url text,
  add column if not exists google_maps_url text,
  add column if not exists latitude numeric(9, 6) check (latitude between -90 and 90),
  add column if not exists longitude numeric(9, 6) check (longitude between -180 and 180),
  -- schema.org openingHours format, one entry per line, e.g. "Mo-Fr 06:00-20:00".
  add column if not exists opening_hours text[] not null default '{}';

-- ------------------------------------------------------------------
-- Links shown on /bio (Instagram "link in bio")
-- ------------------------------------------------------------------

create table public.bio_links (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 60),
  subtitle text check (char_length(subtitle) <= 80),
  -- Absolute URL, or a site path starting with "/".
  url text not null check (url ~ '^(https?://|/)'),
  icon text not null default 'link',
  is_highlighted boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bio_links_active_order_idx on public.bio_links (is_active, sort_order);

create trigger bio_links_updated_at before update on public.bio_links
  for each row execute function public.set_updated_at();

alter table public.bio_links enable row level security;

create policy "bio_links: public read" on public.bio_links
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "bio_links: staff write" on public.bio_links
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.bio_links to anon, authenticated;
grant select, insert, update, delete on public.bio_links to authenticated;

insert into public.bio_links (title, subtitle, url, icon, is_highlighted, sort_order) values
  ('Program & Jadwal Kelas', 'Aerobic, Zumba, Yoga, Aquarobic, Aquayoga', '/program', 'calendar', true, 1),
  ('Lokasi Sanggar', 'Sukamaju Baru, Tapos, Depok', '/contact#location-title', 'map-pin', false, 2),
  ('Sewa Studio', 'Kelas privat, komunitas, dan acara', '/rental', 'building', false, 3),
  ('Tips Sehat & Artikel', 'Panduan senam untuk pemula', '/artikel', 'book', false, 4),
  ('Kenali Danie', 'Pendiri & instruktur bersertifikat', '/about', 'user', false, 5),
  ('Website Lengkap', 'sanggarsenamdanie.com', '/', 'globe', false, 6);
