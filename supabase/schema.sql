-- ============================================================
-- Palava Society Marketplace — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Custom types
create type listing_status as enum ('pending', 'approved', 'rejected');
create type listing_category as enum (
  'electronics',
  'furniture',
  'vehicles',
  'books',
  'appliances',
  'kids',
  'clothing',
  'services',
  'other',
  -- Service sub-categories (added after initial launch — see
  -- SERVICE_CATEGORIES in src/types/index.ts). 'services' remains the
  -- general/catch-all service bucket so pre-existing rows stay valid.
  'tutoring',
  'home_repair',
  'fitness_wellness',
  'beauty_grooming',
  'cleaning',
  'food_tiffin'
);

-- If this schema was already applied before service sub-categories existed,
-- run these instead of recreating the enum (each must run as its own
-- statement, not inside an explicit transaction block):
--   alter type listing_category add value 'tutoring';
--   alter type listing_category add value 'home_repair';
--   alter type listing_category add value 'fitness_wellness';
--   alter type listing_category add value 'beauty_grooming';
--   alter type listing_category add value 'cleaning';
--   alter type listing_category add value 'food_tiffin';

-- Listings table
create table listings (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  price         numeric(10, 2),        -- null = negotiable / free
  is_free       boolean not null default false,
  category      listing_category not null,
  contact_name  text not null,
  contact_number text not null,
  images        text[] not null default '{}', -- up to 3 Supabase Storage URLs
  status        listing_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_updated_at
  before update on listings
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table listings enable row level security;

-- Public: read approved listings only
create policy "public_read_approved" on listings
  for select using (status = 'approved');

-- Public: submit new listing (always pending)
create policy "public_insert_pending" on listings
  for insert with check (status = 'pending');

-- Admin: full access (authenticated user)
create policy "admin_all" on listings
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for listing images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict do nothing;

-- Public can view images
create policy "public_view_images" on storage.objects
  for select using (bucket_id = 'listing-images');

-- Anyone can upload images (tied to a listing submission)
create policy "public_upload_images" on storage.objects
  for insert with check (bucket_id = 'listing-images');

-- Admin can delete images
create policy "admin_delete_images" on storage.objects
  for delete using (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

-- ============================================================
-- Inquiries — "I'm Interested" leads (buyer contact never exposes
-- the seller's number publicly; admin relays interest manually)
-- ============================================================
create type inquiry_status as enum ('new', 'contacted', 'closed');

create table inquiries (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  buyer_name   text not null,
  buyer_phone  text not null,
  message      text,
  status       inquiry_status not null default 'new',
  created_at   timestamptz not null default now()
);

alter table inquiries enable row level security;

-- Public: can submit interest (insert only — no read access)
create policy "public_insert_inquiry" on inquiries
  for insert with check (true);

-- Admin: full access (authenticated user)
create policy "admin_all_inquiries" on inquiries
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Banners — admin-curated homepage promo carousel. Independent of
-- the Services/Buy & Sell split: each slide links to a specific
-- listing, with its own image + headline so admin controls exactly
-- what's featured (not tied to category or listing status churn).
-- ============================================================
create table banners (
  id             uuid primary key default gen_random_uuid(),
  listing_id     uuid not null references listings(id) on delete cascade,
  image_url      text not null,
  title          text not null,
  subtitle       text,
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

alter table banners enable row level security;

-- Public: read active banners only
create policy "public_read_active_banners" on banners
  for select using (is_active = true);

-- Admin: full access
create policy "admin_all_banners" on banners
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Base table grants — required alongside RLS policies above.
-- PostgREST checks table-level GRANTs *and* RLS; policies alone
-- are not sufficient for anon/authenticated roles to read/write.
-- ============================================================
grant usage on schema public to anon, authenticated;

grant select, insert on listings to anon;
grant select, insert, update, delete on listings to authenticated;

grant select, insert on inquiries to anon;
grant select, insert, update, delete on inquiries to authenticated;

grant select on banners to anon;
grant select, insert, update, delete on banners to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;
