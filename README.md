# Revival MMA Hub

The website for [Revival MMA](https://revivalmma.co.uk) — Harrow's largest dedicated
martial arts academy. Rebuilt from the original base44 app as a standalone React
codebase you own outright.

## Running it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. The site works immediately with no configuration —
all the real content (classes, coaches, timetable, FAQs, terms) is bundled in
`src/lib/seedData.ts` as a fallback.

To make the admin panel, contact form, and newsletter signup work, connect a
Supabase project — see [`supabase/README.md`](./supabase/README.md).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## How it fits together

```
src/
  lib/
    seedData.ts     real content, used when Supabase isn't configured
    data.ts         read/write functions — Supabase when configured, seedData otherwise
    adminApi.ts     CRUD used by the admin panel (Supabase required)
    supabase.ts     client, plus isSupabaseConfigured
    auth.tsx        admin session context
    theme.tsx       light/dark mode
    types.ts        row types
  components/
    ui/             shadcn-style primitives built on Radix
    *.tsx           site components (Navbar, Footer, cards, forms, SEO)
  pages/
    *.tsx           public pages
    admin/*.tsx     admin panel, gated behind Supabase Auth
supabase/
  schema.sql        tables + row level security
  seed.sql          the real content, for a fresh project
  functions/
    gymdesk-schedule/  scrapes + caches the live class schedule for booking administration
```

Every page reads through `src/lib/data.ts`. When `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are set it reads from Postgres; otherwise it falls back to
`seedData.ts`. That means the site never renders empty, and content edits made in the
admin panel show up on the public pages straight away.

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero, trust badges, featured classes, Google reviews, CTA |
| `/about` | Story, philosophy, values, documentary video |
| `/classes` | All 10 classes, filterable by age group |
| `/timetable` | Weekly schedule, filterable by day and age group |
| `/book` | Trial request form, phone/email, map |
| `/team` | Coach profiles |
| `/faq` | Accordion of common questions |
| `/contact` | Redirects to `/book` |
| `/newsletter` | Email signup |
| `/terms` | Full terms & conditions |
| `/admin` | Content management (requires login) |

## Deploying

The build output in `dist/` is a static site — Vercel, Netlify, and Cloudflare Pages
all work. Two things to configure:

1. **Environment variables**: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in
   your host's dashboard. They're read at build time, so redeploy after changing them.
2. **SPA rewrites**: routing happens client-side, so every path must serve `index.html`
   or direct links to `/classes` will 404. Netlify and Cloudflare Pages need a
   `_redirects` file containing `/* /index.html 200`; Vercel handles it automatically
   for Vite projects.

## Editing content

Day-to-day content changes happen in the admin panel at `/admin` — classes, coaches,
timetable, FAQs, terms, and the About video, plus contact messages and newsletter
subscribers.

Class, coach, and testimonial photos support uploads and image URLs. In **Admin →
Classes / Team / Testimonials → Edit**, use **Adjust photo** below the image field:

- Drag in the preview, or use the horizontal and vertical sliders (keyboard arrows work).
- Zoom from 100–300% to resize the photo inside its frame; the frame itself keeps the site's layout.
- **Reset framing** restores the default crop; **Save** stores changes; **Cancel**, Close or Escape discards unsaved adjustments.
- A replacement image starts with default framing. Uploaded originals are never modified.

The preview uses the public shape: classes 4:3, coaches 4:5, reviews circular.
Team photos keep their original top alignment unless adjusted; other photos default
to centred. Testimonial photos now appear beside the review, with an initial if
missing or unavailable. The homepage hero remains a separate hardcoded image.

**Database prerequisite:** apply
[`20261104210512_photo_framing.sql`](./supabase/migrations/20261104210512_photo_framing.sql)
to the existing Supabase project before deploying this version. It adds nullable
`image_framing` JSONB columns to the three content tables. `{x, y, zoom}` is saved
with the row; old rows need no backfill. Fresh installations can use `schema.sql`.
Existing RLS and storage permissions are unchanged.

## Photo editor checks

```bash
npm test                  # framing math and backward-compatible defaults; Node 22.18+ / 24+
npx playwright install chromium
npm run test:e2e           # browser interactions against mocked Supabase, no live writes
# Or use an existing Chrome installation:
PLAYWRIGHT_CHROME=1 npm run test:e2e
npm run build             # TypeScript and production bundle
npm run lint
```

Browser tests launch their own local server at `127.0.0.1:5174` with fake test
credentials. They cover all three editors, saved crops on public pages, reload,
reset/cancel, a failed save, keyboard and mouse controls, image replacement, and
mobile layout. Additional integration checks cover one-, two- and three-person
booking checkout, the matching SumUp destination, and manual admin reconciliation.
All payment windows are stubbed; no payment provider is contacted. These tests do
not validate a live Supabase login or production persistence.
