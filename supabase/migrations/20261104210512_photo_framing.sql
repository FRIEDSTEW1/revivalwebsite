-- Non-destructive crop settings; NULL preserves legacy positioning.
alter table public.classes add column if not exists image_framing jsonb;
alter table public.team_members add column if not exists image_framing jsonb;
alter table public.testimonials add column if not exists image_framing jsonb;
