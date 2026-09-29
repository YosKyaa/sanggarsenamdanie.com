# Sanggar Senam Danie

Website + CMS for Sanggar Senam Danie, a fitness studio in Tapos, Depok.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Framer Motion · Supabase.

Architecture, ERD and design tokens: [docs/PLAN.md](docs/PLAN.md) · Audit results: [docs/AUDIT.md](docs/AUDIT.md)

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional for a preview
npm run dev                  # http://localhost:3000
```

Without Supabase credentials the public site runs on bundled content ([src/lib/content/fallback.ts](src/lib/content/fallback.ts)),
and the studio-rental form shows a "contact us on WhatsApp" message instead of saving.

Joining a class has no form: every "Gabung" button opens WhatsApp (+62 889-7535-1853) with a prefilled message
([src/lib/utils/whatsapp.ts](src/lib/utils/whatsapp.ts)).

## Connect Supabase

1. Create a Supabase project and copy the URL and anon key into `.env.local`.
2. Run the migrations in [supabase/migrations/](supabase/migrations/) in order, then [supabase/seed.sql](supabase/seed.sql)
   (SQL Editor, or `supabase db push` + `supabase db seed` with the CLI).
3. Create the admin user in **Authentication → Users**, then promote it:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'admin@example.com');
   ```
4. Sign in at `/admin/login`.

## Before going live

| What | Where |
|------|-------|
| **Production domain** (canonical URLs, sitemap, OG — the build warns until set) | `NEXT_PUBLIC_SITE_URL` |
| Google Business Profile, Search Console, reviews | see "Off-site work" in [docs/AUDIT.md](docs/AUDIT.md) |
| Danie's photo | `/admin/instructors` → Danie → Foto |
| Collage, class and studio photos, WhatsApp, address, founder profile | `/admin/settings` (Pengaturan Situs) |
| Weekly schedule | `/admin/schedules` — the site shows "ask via WhatsApp" until entries exist |
| Testimonials (with participants' permission) | `/admin/testimonials` — section is hidden until one is published |
| Certificate scans, issuers, years | `/admin/certificates` |
| Stats (500+ peserta), FAQ, brand pillars, studio uses | `/admin/stats`, `/admin/faqs`, `/admin/pillars`, `/admin/rentalUses` |

## Admin

Everything visible on the public site is editable at `/admin`; each save refreshes the affected pages immediately.

| Menu | Manages |
|------|---------|
| Dashboard, Sewa Studio | Rental requests: status, edit, delete, add phone/WhatsApp requests by hand |
| Program, Jadwal, Instruktur, Sertifikat, Testimoni, Artikel | Class content (Markdown articles, image uploads) |
| FAQ, Statistik, Janji Brand, Kegunaan Studio | Home-page sections |
| Pengaturan Situs | WhatsApp number, address & map, founding date, founder profile, tagline, SEO description, photos |
| Pengguna | Promote accounts to admin (create the account first in Supabase → Authentication) |

Rental requesters can follow their request at `/cek-status` with the reference code they receive.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`
