-- Sanggar Senam Danie — photo gallery of studio activities (/galeri).
-- Photos are uploaded to the existing public "images" bucket (gallery/…),
-- resized in the browser first, so width/height are known for layout.

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text check (char_length(caption) <= 140),
  category text not null default 'kelas' check (category in ('kelas', 'event', 'komunitas', 'studio')),
  taken_at date,
  width integer check (width > 0),
  height integer check (height > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_photos_active_recent_idx on public.gallery_photos (is_active, taken_at desc nulls last, created_at desc);

create trigger gallery_photos_updated_at before update on public.gallery_photos
  for each row execute function public.set_updated_at();

alter table public.gallery_photos enable row level security;

create policy "gallery_photos: public read" on public.gallery_photos
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "gallery_photos: staff write" on public.gallery_photos
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.gallery_photos to anon, authenticated;
grant select, insert, update, delete on public.gallery_photos to authenticated;
