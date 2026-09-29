# Pre-delivery Audit

Run against the production build (`next build && next start`) on 2026-09-28. Screens were checked at 1440px and a real
390px mobile viewport (Chrome DevTools emulation). Lighthouse 12, mobile preset.

| Page            | Performance | Accessibility | Best practices | SEO | LCP   | CLS | TBT    |
|-----------------|-------------|---------------|----------------|-----|-------|-----|--------|
| `/`             | 90          | 100           | 100            | 100 | 3.3 s | 0   | 150 ms |
| `/contact`      | 95          | 100           | 100            | 100 | 2.8 s | 0   | 60 ms  |
| `/program/zumba`| 92          | 100           | 100            | 100 | 3.2 s | 0   | 120 ms |

## 1. UX — Nielsen heuristics

| Heuristic | Implementation | Issue found → fix |
|-----------|----------------|-------------------|
| Visibility of system status | Pending state on every submit button; success panel with reference code + current status; `/cek-status` stepper (Diterima → Sudah dihubungi → Selesai); active nav item (`aria-current`) | — |
| Match with the real world | Indonesian copy; accepts `0812…`, `+62 812…`, `812…`; Indonesian time (07.30) and dates | — |
| User control & freedom | Cancel on admin forms; WhatsApp as an alternative to every form | Deletes were one click → confirmation dialog |
| Consistency | One token set, one Button/Card/Input system, same card anatomy across programs/instructors/certificates | — |
| Error prevention | Server validation (zod), phone normalisation, date ≥ today, honeypot, admin checkboxes default off for "published"/"founder" | New admin records defaulted every checkbox to on → per-field `defaultChecked` |
| Recognition over recall | Program names in the select; "Cara bergabung" 3 steps next to forms; program detail pages carry their own pre-filled form | — |
| Flexibility | Quick 2-field form in the hero, full form on /contact and each program page, WhatsApp float | Navbar CTA hidden on phones → compact "Daftar Trial" added |
| Minimalist design | No stock photos, no fake numbers; empty schedule/testimonials show a helpful state or hide | — |
| Error recovery | Field-level messages, values kept after a failed submit, focus moves to the error summary | — |
| Help | Hints under fields (e.g. why we need WhatsApp) | — |

## 2. Conversion — AIDA

| Stage | Landing sections | Check |
|-------|------------------|-------|
| Attention (1 s) | Hero: eyebrow "Studio Senam Profesional Depok", H1, 2 CTAs, Danie portrait | Brand + offer + location readable above the fold on 390px |
| Trust (10 s) | Credentials line under CTAs, trust cards (10+ years, 5 certifications, IOSKI role) | Visible in the first two screens on mobile |
| Interest (30 s) | About Danie, stats, 5 program cards | All programs reachable by 3rd screen |
| Desire | Certificate carousel, instructor profile, studio rental, testimonials | Testimonials only when real ones exist |
| Action (60 s) | Quick trial form in hero, location + directions, final CTA, persistent WhatsApp button | 4 conversion points, none more than one scroll away |

Honesty fixes made during review: removed "gratis" (trial price unknown), removed a claim that aqua classes use a
partner pool, replaced "100% Commitment" with a verifiable "5 Sertifikasi", made the "1×24 jam" reply promise a
single config value to confirm.

## 3. Accessibility — WCAG 2.2 AA

Semantic landmarks, skip link, `lang="id"`, one H1 per page, labelled forms with `aria-invalid`/`aria-describedby`,
keyboard-operable menu/dialog/carousel/tabs (Base UI), visible focus, reduced-motion respected (CSS reveal and Framer).

Fixed:
- White on `#8B5CF6` is 4.2:1 → interactive fills use `#6D28D9` (7.1:1); "500+" badge moved to `#7C3AED`.
- Placeholder label text 3.46:1 → solid brand-700.
- Quick-form fields 4.33:1 → darker field fill.
- Purple focus outline invisible on purple surfaces → `.on-dark` scope switches it to white.
- Logo link `aria-label` didn't contain its visible text → removed; visible text is the name.
- `<dl>` stats had `dd` before `dt` → DOM order fixed, visual order via CSS.
- Scroll-reveal hid content until JS ran (sections rendered blank on a slow run) → CSS scroll-driven animation that
  never hides content where unsupported; Framer Motion limited to transform-only hero entrance.

## 4. SEO

Metadata API with per-page title/description/canonical, Open Graph + Twitter, generated OG image, `sitemap.xml`
(incl. program pages), `robots.txt` (admin and status page excluded), JSON-LD `LocalBusiness` + `SportsActivityLocation`
with founder/IOSKI and offer catalogue, `BreadcrumbList` on inner pages, `Service` on each program.
Program pages target "zumba depok", "yoga depok", "aerobic depok", etc. in title/H1.

Open items (need real data): `NEXT_PUBLIC_SITE_URL`, telephone (from the WhatsApp number), geo coordinates and
opening hours in JSON-LD, Google Business Profile link in `sameAs`.

## 5. Code quality

Fixed:
- zod leaked into the client bundle via shared helpers → split `lib/forms` (client-safe) / `lib/validation` (server-only); home first load 311 kB → 204 kB.
- Framer Motion features loaded eagerly → `LazyMotion` with async features.
- `/admin` prerendered as static → forced dynamic (session-dependent).
- Rental page forced dynamic just for a date `min` → computed on the client; page is static again.
- Unused dependencies removed (react-hook-form, sonner, next-themes); unused props removed.

Known limits:
- Public form endpoints have a honeypot but no rate limit — add one (e.g. Upstash, or a Postgres function) if spam appears.
- LCP on mobile is dominated by the webfont swap on the H1; `display: "optional"` would trade brand font on first
  visit for ~0.5 s.
- Database types are hand-written; regenerate with `supabase gen types` after linking a project.

## Update — branding & motion (2026-09-28)

Branding: equal-weight "Sanggar Senam Danie" logotype, H1 lockup "… Bersama Sanggar Senam Danie", slogan
"Sehat · Aktif · Bahagia" as brand promise (logo, pillars, footer, OG image), brand figure as watermark,
founding date 27 Juli 2017 (hero chip, stats, footer, JSON-LD `foundingDate`).

Motion, and how each piece stays cheap and accessible:

| Effect | Implementation | Main-thread JS | Reduced motion |
|--------|----------------|----------------|----------------|
| Reading progress bar | CSS `animation-timeline: scroll()` | none | static (hidden where unsupported) |
| Parallax (hero panel, portraits, collage) | CSS `view()` timeline | none | off |
| "Pressed" pillar card stack | sticky + CSS named view timeline | none | cards simply stack |
| Section reveals | CSS `view()` timeline, transform/opacity | none | off |
| Hero entrance | CSS keyframes, transform only (never hides LCP text) | none | off |
| Floating chips, blobs, rotating ring | CSS keyframes behind `motion-safe:` | none | off |
| Cursor spotlight on cards | one delegated `pointermove` listener + CSS vars | tiny | n/a (hover only) |
| Stat count-up | IntersectionObserver + rAF; SSR shows final value | tiny | off |
| Scroll-velocity marquee | Framer Motion, lazy-loaded on idle; static SSR fallback; pause button (WCAG 2.2.2) | deferred | off, no button |
| Glass (navbar, hero chips, trust card) | `backdrop-filter` with solid fallback; ≥ 85 % white where text sits over purple (AA) | none | n/a |

Issues found and fixed during this round:
- Framer scroll hooks put ~72 KB of JS on the critical path and delayed first paint → moved to CSS scroll timelines;
  Framer now only ships in the lazy marquee chunk. Home first load 228 kB → 188 kB (lower than before the motion work).
- Scale-reveal started at 40 % opacity → contrast failure mid-animation; now transform-only.
- Spotlight glow painted over text → isolated stacking context, glow at `z-index: -1`.

Lighthouse (mobile) after the update, two runs on a machine with other dev servers running:
Performance 86–91 · Accessibility 100 · Best practices 100 · SEO 100 · CLS 0.
Browsers without scroll-driven animations (Firefox today) get the same page without scroll effects.

## Update — WhatsApp-first conversion (2026-09-28)

Per the studio's request, class sign-up no longer uses a form: every join CTA (navbar, hero, trust card, program cards,
program pages, About, final CTA, floating button) opens WhatsApp +62 889-7535-1853 with a prefilled message
(program-specific on program pages). The trial booking form, its server action, the admin trial inbox and the
`booking_requests` table were removed; the studio-rental form and `/cek-status` remain for rentals only.
Conversion trade-off noted: WhatsApp removes form friction (one tap) but leads are no longer logged in the admin.

## Update — SEO audit for organic growth (2026-09-28)

Method: crawled every URL in the sitemap of the production build and checked status, title/description length,
H1 count, canonical, `og:image` reachability, `<img>` alt and JSON-LD validity; Lighthouse on home and an article.

| # | Finding | Fix |
|---|---------|-----|
| 1 | Canonicals, sitemap and OG point to `localhost` when `NEXT_PUBLIC_SITE_URL` is unset | Loud warning on every production build; **must be set before launch** |
| 2 | Home H1 read "Bahagia**Bersama**" (no space between spans) | Space added |
| 3 | Home title 71 chars; program descriptions 190–199 chars | Title 55 chars; `clampDescription()` keeps all descriptions ≤ 155 |
| 4 | Program pages ~199 words — too thin to rank for "zumba depok" etc. | "Cocok untuk siapa", "Manfaat", intensity, related articles; CMS fields `audience`, `benefits`, `intensity` (~240–316 words) |
| 5 | No content engine for organic traffic | Articles (CMS table `articles`, admin editor in Markdown, `/artikel`, RSS, `Article` schema), 3 starter articles (~470–500 words) targeting real queries |
| 6 | Pre-contact questions unanswered on the page | FAQ (7 Q&A, native `<details>`) on home and contact + `FAQPage` schema |
| 7 | Structured data gaps | `WebSite`, `Person` (Danie, credentials, IOSKI), `hasMap`, `telephone`, `logo`, `slogan`; `Article`; stable `@id` links |
| 8 | Inner pages had no `og:image` (page openGraph doesn't inherit the root image) — bare WhatsApp previews | Default share image on every page; per-program and per-article OG images |
| 9 | Sitemap `lastmod` = build time for every URL; obsolete `Host` in robots | Real dates; `Host` removed; articles in sitemap |
| 10 | No web manifest / touch icon | `manifest.webmanifest`, `apple-icon` |

Result: 0 crawl issues across 16 URLs · one H1 per page · all titles ≤ 60 and descriptions 119–155 chars ·
Lighthouse SEO 100 / Accessibility 100 on home and articles (Performance 93 home, 95 article).

### Off-site work the code can't do (biggest levers for local search)
1. **Google Business Profile** — create/verify "Sanggar Senam Danie", category *Fitness center* / *Aerobics instructor*,
   same name, address and WhatsApp number as the site (NAP consistency), photos, and the website link.
2. **Reviews** — ask happy participants for Google reviews; reply to each one.
3. **Google Search Console** — verify the domain and submit `/sitemap.xml`.
4. **Publish 1–2 articles a month** from `/admin/articles` answering real participant questions; link each to its program.
5. **Local citations/links** — IOSKI Depok, community pages, and local directories linking to the site.
6. Add `NEXT_PUBLIC_INSTAGRAM_URL` (feeds `sameAs`) and real photos (image search and richer previews).
