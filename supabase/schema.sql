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


-- Segurança do site GIFT Excellence — 2026
create schema if not exists gift_private;
revoke all on schema gift_private from public;

create table if not exists public.gift_site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.gift_site_admins enable row level security;

drop policy if exists "gift_site_admins_select_self" on public.gift_site_admins;
create policy "gift_site_admins_select_self" on public.gift_site_admins
for select to authenticated using (user_id = (select auth.uid()));

revoke all on table public.gift_site_admins from anon;
grant select on table public.gift_site_admins to authenticated;

insert into public.gift_site_admins(user_id)
select id from auth.users
where email in ('giftexcellence.03@gmail.com','gabrielaegabriel1999@gmail.com')
on conflict (user_id) do nothing;

create table if not exists gift_private.gift_submission_rate_limits (
  id bigint generated by default as identity primary key,
  kind text not null,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists gift_submission_rate_limits_lookup
  on gift_private.gift_submission_rate_limits(kind, ip, created_at desc);

create or replace function gift_private.gift_submission_allowed(
  p_kind text, p_max_attempts integer default 8, p_window_seconds integer default 600
)
returns boolean language plpgsql volatile security definer
set search_path = gift_private, pg_temp
as $$
declare
  v_headers jsonb := coalesce(current_setting('request.headers', true), '{}')::jsonb;
  v_ip text := split_part(coalesce(v_headers->>'x-forwarded-for','unknown'), ',', 1);
  v_count integer;
begin
  delete from gift_private.gift_submission_rate_limits where created_at < now() - interval '1 day';
  select count(*) into v_count from gift_private.gift_submission_rate_limits
  where kind=p_kind and ip=v_ip and created_at >= now()-make_interval(secs=>p_window_seconds);
  if v_count >= p_max_attempts then return false; end if;
  insert into gift_private.gift_submission_rate_limits(kind,ip) values(p_kind,v_ip);
  return true;
end;
$$;
grant usage on schema gift_private to anon, authenticated;
revoke all on function gift_private.gift_submission_allowed(text,integer,integer) from public;
grant execute on function gift_private.gift_submission_allowed(text,integer,integer) to anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['gift_machines','gift_hero_slides','gift_gallery_images','gift_services','gift_site_settings','gift_quote_requests','gift_tech_support_requests','gift_contact_messages']
  loop
    execute format('drop policy if exists "%1$s public read" on public.%1$s',t);
    execute format('drop policy if exists "%1$s anon insert" on public.%1$s',t);
    execute format('drop policy if exists "%1$s auth manage" on public.%1$s',t);
    execute format('drop policy if exists "%1$s_admin_manage" on public.%1$s',t);
  end loop;
end $$;

create policy "gift_machines_public_read" on public.gift_machines for select to anon,authenticated
using(active=true or exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_hero_slides_public_read" on public.gift_hero_slides for select to anon,authenticated
using(active=true or exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_gallery_images_public_read" on public.gift_gallery_images for select to anon,authenticated
using(active=true or exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_services_public_read" on public.gift_services for select to anon,authenticated
using(active=true or exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_site_settings_public_read" on public.gift_site_settings for select to anon,authenticated using(true);

create policy "gift_quote_requests_public_insert" on public.gift_quote_requests for insert to anon,authenticated
with check(gift_private.gift_submission_allowed('quote',8,600) and length(trim(name)) between 1 and 150 and length(phone) between 5 and 60 and length(email) between 3 and 320 and length(coalesce(company,''))<=180 and length(coalesce(city_state,''))<=180 and length(coalesce(machine_interest,''))<=220 and length(coalesce(message,''))<=5000 and status='novo');
create policy "gift_tech_support_requests_public_insert" on public.gift_tech_support_requests for insert to anon,authenticated
with check(gift_private.gift_submission_allowed('tech_support',8,600) and length(trim(name)) between 1 and 150 and length(phone) between 5 and 60 and length(email) between 3 and 320 and length(equipment) between 1 and 220 and length(problem_description) between 1 and 5000 and length(coalesce(company,''))<=180 and length(coalesce(city_state,''))<=180 and status='novo');
create policy "gift_contact_messages_public_insert" on public.gift_contact_messages for insert to anon,authenticated
with check(gift_private.gift_submission_allowed('contact',8,600) and length(trim(name)) between 1 and 150 and length(email) between 3 and 320 and length(coalesce(phone,''))<=60 and length(coalesce(subject,''))<=220 and length(message) between 1 and 5000);

create policy "gift_quote_requests_admin_read" on public.gift_quote_requests for select to authenticated
using(exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_tech_support_requests_admin_read" on public.gift_tech_support_requests for select to authenticated
using(exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_contact_messages_admin_read" on public.gift_contact_messages for select to authenticated
using(exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));

do $$
declare t text;
begin
  foreach t in array array['gift_machines','gift_hero_slides','gift_gallery_images','gift_services','gift_site_settings','gift_quote_requests','gift_tech_support_requests','gift_contact_messages']
  loop
    execute format('create policy "%1$s_admin_manage" on public.%1$s for all to authenticated using (exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())))',t);
  end loop;
end $$;

revoke all on table public.gift_machines,public.gift_hero_slides,public.gift_gallery_images,public.gift_services,public.gift_site_settings,public.gift_quote_requests,public.gift_tech_support_requests,public.gift_contact_messages from anon,authenticated;
grant select on table public.gift_machines,public.gift_hero_slides,public.gift_gallery_images,public.gift_services,public.gift_site_settings to anon;
grant select,insert,update,delete on table public.gift_machines,public.gift_hero_slides,public.gift_gallery_images,public.gift_services,public.gift_site_settings to authenticated;
grant insert on table public.gift_quote_requests,public.gift_tech_support_requests,public.gift_contact_messages to anon;
grant select,insert,update,delete on table public.gift_quote_requests,public.gift_tech_support_requests,public.gift_contact_messages to authenticated;

drop policy if exists "gift media auth upload" on storage.objects;
drop policy if exists "gift media auth update" on storage.objects;
drop policy if exists "gift media auth delete" on storage.objects;
drop policy if exists "gift_media_admin_upload" on storage.objects;
drop policy if exists "gift_media_admin_update" on storage.objects;
drop policy if exists "gift_media_admin_delete" on storage.objects;
create policy "gift_media_admin_upload" on storage.objects for insert to authenticated
with check(bucket_id='gift-excellence-media' and exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_media_admin_update" on storage.objects for update to authenticated
using(bucket_id='gift-excellence-media' and exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())))
with check(bucket_id='gift-excellence-media' and exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));
create policy "gift_media_admin_delete" on storage.objects for delete to authenticated
using(bucket_id='gift-excellence-media' and exists(select 1 from public.gift_site_admins a where a.user_id=(select auth.uid())));


-- Menor privilégio para a lista de admins
revoke all on table public.gift_site_admins from authenticated;
grant select on table public.gift_site_admins to authenticated;
