# Supabase setup

The site runs without Supabase — it serves the content bundled in `src/lib/seedData.ts`.
Connect Supabase when you want the admin panel, contact form, and newsletter signup to work.

## 1. Create a project

Sign up at [supabase.com](https://supabase.com) and create a new project (the free tier is enough).
Pick a region close to your users — London for a Harrow gym.

## 2. Create the tables

In your project, open **SQL Editor** → **New query**, paste the contents of
[`schema.sql`](./schema.sql), and run it. This creates all eight tables and their
Row Level Security policies:

| Table | Public access | Admin access |
| --- | --- | --- |
| `classes`, `team_members`, `testimonials`, `timetable_entries`, `faq_items`, `page_content` | read only | full |
| `contact_submissions`, `newsletter_subscribers` | insert only | read + delete |

## 3. Load your content

In a new query, paste [`seed.sql`](./seed.sql) and run it. This inserts the real content
carried over from base44: 10 classes, 4 coaches, 6 testimonials, 39 timetable slots,
9 FAQs, the Terms & Conditions, and the About page video URL.

It uses `on conflict (id) do nothing`, so running it twice won't duplicate anything.

## 4. Create your admin login

Go to **Authentication** → **Users** → **Add user** → **Create new user**.
Use your email and pick a strong password. Anyone who can sign in has full admin
rights, so only create accounts for people who should edit the site.

## 5. Point the site at your project

Go to **Project Settings** → **API** and copy the **Project URL** and the **anon public** key.
Then, in the project root:

```bash
cp .env.example .env.local
```

Fill in both values in `.env.local`, then restart the dev server. `.env.local` is
gitignored — never commit it.

> The **anon public** key is safe in the browser; RLS is what protects your data.
> Never put the **service_role** key in this file or anywhere in frontend code.

## 6. Check it worked

Run `npm run dev`, go to `/admin/login`, and sign in with the user you created.
Edit a class, then reload `/classes` — your change should be live. Submit the contact
form on `/contact` and confirm the message appears under **Messages** in the admin panel.
