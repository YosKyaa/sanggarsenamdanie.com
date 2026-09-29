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
