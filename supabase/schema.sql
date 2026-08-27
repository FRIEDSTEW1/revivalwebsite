-- Revival MMA Hub — database schema
-- Run this once against a new Supabase project (SQL Editor -> paste -> Run),
-- then run seed.sql to load the real recovered content.

create extension if not exists pgcrypto;

create table if not exists classes (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  category text not null check (category in ('kids', 'teens', 'adults')),
  type text not null,
  description text not null,
  "ageRange" text not null,
  benefits text[] not null default '{}',
  image text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text not null,
  specialties text[] not null default '{}',
  experience text,
  bio text,
  image text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text,
  content text not null,
  rating int not null default 5,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists timetable_entries (
  id text primary key default gen_random_uuid()::text,
  day text not null check (day in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  time text not null,
  "className" text not null,
  "ageGroup" text not null check ("ageGroup" in ('kids', 'teens', 'adults')),
  created_at timestamptz not null default now()
);

create table if not exists faq_items (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null,
  category text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists page_content (
  id text primary key default gen_random_uuid()::text,
  page text not null unique,
  content text not null,
  "lastUpdated" timestamptz default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Migrations for projects that ran an earlier version of this file ---
-- (safe to re-run: every statement below is a no-op if already applied)

alter table classes add column if not exists "order" int not null default 0;
alter table team_members add column if not exists "order" int not null default 0;
alter table contact_submissions add column if not exists read boolean not null default false;
alter table contact_submissions add column if not exists archived boolean not null default false;

-- Storage bucket for admin-uploaded images (classes, team, testimonials) --

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "admin write media" on storage.objects;
create policy "admin write media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Row Level Security --------------------------------------------------

alter table classes enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table timetable_entries enable row level security;
alter table faq_items enable row level security;
alter table page_content enable row level security;
alter table contact_submissions enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public content: anyone can read, only signed-in admins can write.
-- (each policy is dropped first so this whole file can be re-run safely)
drop policy if exists "public read classes" on classes;
create policy "public read classes" on classes for select using (true);
drop policy if exists "admin write classes" on classes;
create policy "admin write classes" on classes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read team_members" on team_members;
create policy "public read team_members" on team_members for select using (true);
drop policy if exists "admin write team_members" on team_members;
create policy "admin write team_members" on team_members for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read testimonials" on testimonials;
create policy "public read testimonials" on testimonials for select using (true);
drop policy if exists "admin write testimonials" on testimonials;
create policy "admin write testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read timetable_entries" on timetable_entries;
create policy "public read timetable_entries" on timetable_entries for select using (true);
drop policy if exists "admin write timetable_entries" on timetable_entries;
create policy "admin write timetable_entries" on timetable_entries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read faq_items" on faq_items;
create policy "public read faq_items" on faq_items for select using (true);
drop policy if exists "admin write faq_items" on faq_items;
create policy "admin write faq_items" on faq_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read page_content" on page_content;
create policy "public read page_content" on page_content for select using (true);
drop policy if exists "admin write page_content" on page_content;
create policy "admin write page_content" on page_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Forms: anyone can submit, only signed-in admins can read/manage.
drop policy if exists "public insert contact_submissions" on contact_submissions;
create policy "public insert contact_submissions" on contact_submissions for insert with check (true);
drop policy if exists "admin manage contact_submissions" on contact_submissions;
create policy "admin manage contact_submissions" on contact_submissions for select using (auth.role() = 'authenticated');
drop policy if exists "admin update contact_submissions" on contact_submissions;
create policy "admin update contact_submissions" on contact_submissions for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete contact_submissions" on contact_submissions;
create policy "admin delete contact_submissions" on contact_submissions for delete using (auth.role() = 'authenticated');

drop policy if exists "public insert newsletter_subscribers" on newsletter_subscribers;
create policy "public insert newsletter_subscribers" on newsletter_subscribers for insert with check (true);
drop policy if exists "admin manage newsletter_subscribers" on newsletter_subscribers;
create policy "admin manage newsletter_subscribers" on newsletter_subscribers for select using (auth.role() = 'authenticated');
drop policy if exists "admin delete newsletter_subscribers" on newsletter_subscribers;
create policy "admin delete newsletter_subscribers" on newsletter_subscribers for delete using (auth.role() = 'authenticated');
