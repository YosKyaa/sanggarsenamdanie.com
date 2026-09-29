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
