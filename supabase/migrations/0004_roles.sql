-- Role management: admin (everything), editor (content + requests), member (no access).
-- Editors can manage content and rental requests; only admins manage users and site settings.

-- ------------------------------------------------------------------
-- Roles and profile email (shown in the user list)
-- ------------------------------------------------------------------

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'editor', 'member'));

alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email), new.email);
  return new;
end;
$$;

-- Keep the stored email in sync when a user changes it.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.sync_profile_email();

-- ------------------------------------------------------------------
-- Staff = admin or editor
-- ------------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  );
$$;

-- ------------------------------------------------------------------
-- Content tables: staff can write, staff can see hidden rows.
-- Existing policies are dropped whatever their names (projects set up
-- by hand may have used different names), then recreated below.
-- ------------------------------------------------------------------

do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('programs', 'instructors', 'certificates', 'testimonials', 'class_schedule', 'articles',
                        'faqs', 'stats', 'brand_pillars', 'rental_uses', 'studio_rental_requests')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;

  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname like 'storage:%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

create policy "programs: public read" on public.programs
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "programs: staff write" on public.programs
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "instructors: public read" on public.instructors
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "instructors: staff write" on public.instructors
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "certificates: public read" on public.certificates
  for select to anon, authenticated using (true);
create policy "certificates: staff write" on public.certificates
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "testimonials: public read" on public.testimonials
  for select to anon, authenticated using (is_published or (select public.is_staff()));
create policy "testimonials: staff write" on public.testimonials
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "class_schedule: public read" on public.class_schedule
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "class_schedule: staff write" on public.class_schedule
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "articles: public read" on public.articles
  for select to anon, authenticated using (is_published or (select public.is_staff()));
create policy "articles: staff write" on public.articles
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "faqs: public read" on public.faqs
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "faqs: staff write" on public.faqs
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "stats: public read" on public.stats
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "stats: staff write" on public.stats
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "brand_pillars: public read" on public.brand_pillars
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "brand_pillars: staff write" on public.brand_pillars
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "rental_uses: public read" on public.rental_uses
  for select to anon, authenticated using (is_active or (select public.is_staff()));
create policy "rental_uses: staff write" on public.rental_uses
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "rental_requests: public submit" on public.studio_rental_requests
  for insert to anon, authenticated with check (status = 'new');
create policy "rental_requests: staff manage" on public.studio_rental_requests
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

-- Uploads (program photos, certificates, founder photos)
create policy "storage: staff insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('images', 'certificates', 'founder') and (select public.is_staff()));
create policy "storage: staff update" on storage.objects
  for update to authenticated
  using (bucket_id in ('images', 'certificates', 'founder') and (select public.is_staff()));
create policy "storage: staff delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('images', 'certificates', 'founder') and (select public.is_staff()));

-- site_settings and profiles keep their admin-only write policies from earlier migrations.
