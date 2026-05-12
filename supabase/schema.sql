create extension if not exists pgcrypto;

create table if not exists public.gift_machines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  images text[] default '{}',
  short_description text,
  description text,
  sistematica text,
  tecnica text,
  medidas text,
  rendimento text,
  applications text,
  benefits text,
  category text check (category in ('brindes','embalagens','industrial','personalizacao','outro')) default 'industrial',
  featured boolean not null default false,
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text check (category in ('maquinas','aplicacoes','estrutura','projetos')) default 'maquinas',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  image_url text,
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  section text check (section in ('geral','home','sobre','contato','servicos','rodape','seo')) default 'geral',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text not null,
  email text not null,
  city_state text,
  machine_interest text,
  message text,
  status text check (status in ('novo','em_andamento','respondido','fechado')) default 'novo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_tech_support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text not null,
  email text not null,
  equipment text not null,
  problem_description text not null,
  city_state text,
  status text check (status in ('novo','em_andamento','resolvido','fechado')) default 'novo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'gift_machines','gift_hero_slides','gift_gallery_images','gift_services','gift_site_settings','gift_quote_requests','gift_tech_support_requests','gift_contact_messages'
  ]
  LOOP
    EXECUTE format('drop trigger if exists set_updated_at_%1$s on public.%1$s', t);
    EXECUTE format('create trigger set_updated_at_%1$s before update on public.%1$s for each row execute function public.set_updated_at()', t);
  END LOOP;
END $$;

alter table public.gift_machines enable row level security;
alter table public.gift_hero_slides enable row level security;
alter table public.gift_gallery_images enable row level security;
alter table public.gift_services enable row level security;
alter table public.gift_site_settings enable row level security;
alter table public.gift_quote_requests enable row level security;
alter table public.gift_tech_support_requests enable row level security;
alter table public.gift_contact_messages enable row level security;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'gift_machines','gift_hero_slides','gift_gallery_images','gift_services','gift_site_settings','gift_quote_requests','gift_tech_support_requests','gift_contact_messages'
  ]
  LOOP
    EXECUTE format('drop policy if exists "%1$s public read" on public.%1$s', t);
    EXECUTE format('drop policy if exists "%1$s anon insert" on public.%1$s', t);
    EXECUTE format('drop policy if exists "%1$s auth manage" on public.%1$s', t);
  END LOOP;
END $$;

create policy "gift_machines public read" on public.gift_machines for select using (active = true or auth.role() = 'authenticated');
create policy "gift_hero_slides public read" on public.gift_hero_slides for select using (active = true or auth.role() = 'authenticated');
create policy "gift_gallery_images public read" on public.gift_gallery_images for select using (active = true or auth.role() = 'authenticated');
create policy "gift_services public read" on public.gift_services for select using (active = true or auth.role() = 'authenticated');
create policy "gift_site_settings public read" on public.gift_site_settings for select using (true);
create policy "gift_quote_requests public read" on public.gift_quote_requests for select using (auth.role() = 'authenticated');
create policy "gift_tech_support_requests public read" on public.gift_tech_support_requests for select using (auth.role() = 'authenticated');
create policy "gift_contact_messages public read" on public.gift_contact_messages for select using (auth.role() = 'authenticated');

create policy "gift_quote_requests anon insert" on public.gift_quote_requests for insert with check (true);
create policy "gift_tech_support_requests anon insert" on public.gift_tech_support_requests for insert with check (true);
create policy "gift_contact_messages anon insert" on public.gift_contact_messages for insert with check (true);

create policy "gift_machines auth manage" on public.gift_machines for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_hero_slides auth manage" on public.gift_hero_slides for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_gallery_images auth manage" on public.gift_gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_services auth manage" on public.gift_services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_site_settings auth manage" on public.gift_site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_quote_requests auth manage" on public.gift_quote_requests for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_tech_support_requests auth manage" on public.gift_tech_support_requests for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "gift_contact_messages auth manage" on public.gift_contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('gift-excellence-media', 'gift-excellence-media', true)
on conflict (id) do nothing;

drop policy if exists "gift media public read" on storage.objects;
drop policy if exists "gift media auth upload" on storage.objects;
drop policy if exists "gift media auth update" on storage.objects;
drop policy if exists "gift media auth delete" on storage.objects;

create policy "gift media public read"
on storage.objects for select
using (bucket_id = 'gift-excellence-media');

create policy "gift media auth upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'gift-excellence-media');

create policy "gift media auth update"
on storage.objects for update
to authenticated
using (bucket_id = 'gift-excellence-media')
with check (bucket_id = 'gift-excellence-media');

create policy "gift media auth delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'gift-excellence-media');
