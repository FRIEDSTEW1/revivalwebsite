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
| `/team` | Coach profiles |
| `/faq` | Accordion of common questions |
| `/contact` | Contact form, phone/email, map |
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

Class, coach, and testimonial photos are URLs, currently pointing at
[postimages](https://postimages.org). Paste any image URL into the admin form to
change one. Worth moving to Supabase Storage eventually so the images live with the
rest of your data rather than on a third-party host.
