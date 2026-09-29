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
