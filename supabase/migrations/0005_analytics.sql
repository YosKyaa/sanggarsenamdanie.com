-- First-party, privacy-friendly visitor analytics.
-- No cookies, no IPs: each event carries a visitor hash that rotates daily
-- (HMAC of day + IP + user agent, computed on the server), so a visitor is
-- counted once per day and cannot be tracked across days.

create table public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null check (type in ('pageview', 'whatsapp_click')),
  path text not null check (char_length(path) between 1 and 300),
  -- Set on a visit's first pageview only: external host, or 'direct'. Null = internal navigation.
  referrer_host text check (char_length(referrer_host) <= 200),
  country text check (char_length(country) <= 2),
  device text not null check (device in ('mobile', 'tablet', 'desktop')),
  visitor_hash text not null check (char_length(visitor_hash) = 64)
);

create index analytics_events_created_idx on public.analytics_events (created_at);
create index analytics_events_type_created_idx on public.analytics_events (type, created_at);

-- Written only by the server (service role) through /api/track; nobody reads rows directly.
alter table public.analytics_events enable row level security;

-- ------------------------------------------------------------------
-- Dashboard summary: one call returns everything the dashboard shows
-- ------------------------------------------------------------------

create or replace function public.analytics_summary(p_days integer)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  tz constant text := 'Asia/Jakarta';
  v_today date := (now() at time zone tz)::date;
  v_start timestamptz;
  v_prev_start timestamptz;
  v_result jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_days not between 1 and 365 then
    raise exception 'invalid range';
  end if;

  v_start := ((v_today - (p_days - 1))::timestamp) at time zone tz;
  v_prev_start := v_start - make_interval(days => p_days);

  with cur as (
    select *, (created_at at time zone tz)::date as day
    from public.analytics_events
    where created_at >= v_start
  ),
  prev as (
    select *, (created_at at time zone tz)::date as day
    from public.analytics_events
    where created_at >= v_prev_start and created_at < v_start
  ),
  days as (
    select d::date as day from generate_series(v_today - (p_days - 1), v_today, interval '1 day') d
  ),
  daily as (
    select
      days.day,
      count(distinct (cur.day, cur.visitor_hash)) filter (where cur.type = 'pageview') as visitors,
      count(*) filter (where cur.type = 'pageview') as pageviews,
      count(*) filter (where cur.type = 'whatsapp_click') as whatsapp_clicks
    from days
    left join cur on cur.day = days.day
    group by days.day
  )
  select jsonb_build_object(
    'days', p_days,
    'totals', jsonb_build_object(
      'visitors', (select count(distinct (day, visitor_hash)) from cur where type = 'pageview'),
      'pageviews', (select count(*) from cur where type = 'pageview'),
      'whatsapp_clicks', (select count(*) from cur where type = 'whatsapp_click')
    ),
    'previous', jsonb_build_object(
      'visitors', (select count(distinct (day, visitor_hash)) from prev where type = 'pageview'),
      'pageviews', (select count(*) from prev where type = 'pageview'),
      'whatsapp_clicks', (select count(*) from prev where type = 'whatsapp_click')
    ),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', day, 'visitors', visitors, 'pageviews', pageviews, 'whatsapp_clicks', whatsapp_clicks
      ) order by day)
      from daily
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(x order by x.pageviews desc)
      from (
        select path, count(*) as pageviews
        from cur where type = 'pageview'
        group by path order by count(*) desc limit 8
      ) x
    ), '[]'::jsonb),
    'whatsapp_pages', coalesce((
      select jsonb_agg(x order by x.clicks desc)
      from (
        select path, count(*) as clicks
        from cur where type = 'whatsapp_click'
        group by path order by count(*) desc limit 6
      ) x
    ), '[]'::jsonb),
    'referrers', coalesce((
      select jsonb_agg(x order by x.visitors desc)
      from (
        select referrer_host as source, count(distinct (day, visitor_hash)) as visitors
        from cur where type = 'pageview' and referrer_host is not null
        group by referrer_host order by 2 desc limit 6
      ) x
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(x order by x.visitors desc)
      from (
        select device, count(distinct (day, visitor_hash)) as visitors
        from cur where type = 'pageview'
        group by device
      ) x
    ), '[]'::jsonb)
  )
  into v_result;

  return v_result;
end;
$$;

revoke all on function public.analytics_summary(integer) from public, anon;
grant execute on function public.analytics_summary(integer) to authenticated;
