# Supabase setup

The site runs without Supabase — it serves the content bundled in `src/lib/seedData.ts`.
Connect Supabase when you want the admin panel, contact form, and newsletter signup to work.

## 1. Create a project

Sign up at [supabase.com](https://supabase.com) and create a new project (the free tier is enough).
Pick a region close to your users — London for a Harrow gym.

## 2. Create the tables

In your project, open **SQL Editor** → **New query**, paste the contents of
[`schema.sql`](./schema.sql), and run it. This creates all eight tables, their
Row Level Security policies, and a `media` storage bucket for admin-uploaded
images (classes, team, testimonials):

| Table | Public access | Admin access |
| --- | --- | --- |
| `classes`, `team_members`, `testimonials`, `timetable_entries`, `faq_items`, `page_content` | read only | full |
| `contact_submissions`, `newsletter_subscribers` | insert only | read + update + delete |

Already ran an earlier version of this file? It's safe to run again — every
statement either checks `if not exists` or drops-then-recreates, so re-running
`schema.sql` on an existing project picks up new columns (drag-to-reorder,
message read/archive state) and the storage bucket without touching your data.

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

## What's in the admin panel

- **Dashboard** (`/admin`) — live counts, unread message count, and recent newsletter
  signups.
- **Classes, Team, FAQ** — drag the handle on the left of each card to reorder; it
  saves as soon as you drop.
- **Testimonials** — add, edit, and remove the reviews shown on the homepage.
- Every **image** field has an upload button (goes to the `media` bucket above) and
  a text field underneath for pasting a URL directly — useful if you'd rather keep
  photos hosted elsewhere.
- **Messages** — unread/all/archived tabs, a reply button that opens your email
  client with the sender's address pre-filled, and archive instead of only delete.
- **Newsletter Subscribers** — an "Export CSV" button for pulling the list into
  Mailchimp, Google Sheets, or similar.
