-- ============================================================
-- KlipDash — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (in order)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type appointment_status as enum (
  'pending',
  'confirmed',
  'checked_in',
  'cancelled',
  'no_show'
);

-- ============================================================
-- TABLES
-- ============================================================

-- shops (one per owner — this IS the tenant boundary)
create table public.shops (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  settings    jsonb not null default '{
    "timezone": "America/New_York",
    "open_time": "09:00",
    "close_time": "18:00",
    "slot_duration_minutes": 15,
    "days_open": [1,2,3,4,5,6]
  }'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- barbers
create table public.barbers (
  id            uuid primary key default uuid_generate_v4(),
  shop_id       uuid not null references public.shops(id) on delete cascade,
  name          text not null,
  bio           text,
  avatar_url    text,
  active        boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- services
create table public.services (
  id               uuid primary key default uuid_generate_v4(),
  shop_id          uuid not null references public.shops(id) on delete cascade,
  name             text not null,
  duration_minutes int not null check (duration_minutes > 0),
  price            numeric(8,2) not null check (price >= 0),
  active           boolean not null default true,
  display_order    int not null default 0,
  created_at       timestamptz not null default now()
);

-- appointments
create table public.appointments (
  id               uuid primary key default uuid_generate_v4(),
  shop_id          uuid not null references public.shops(id) on delete cascade,
  barber_id        uuid not null references public.barbers(id) on delete restrict,
  service_id       uuid not null references public.services(id) on delete restrict,
  customer_name    text not null,
  customer_phone   text not null,
  start_time       timestamptz not null,
  end_time         timestamptz not null,  -- computed by app: start_time + service.duration_minutes
  status           appointment_status not null default 'pending',
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_shops_owner_id         on public.shops(owner_id);
create index idx_shops_slug             on public.shops(slug);
create index idx_barbers_shop_id        on public.barbers(shop_id);
create index idx_services_shop_id       on public.services(shop_id);
create index idx_appointments_shop_id   on public.appointments(shop_id);
create index idx_appointments_barber_id on public.appointments(barber_id);
create index idx_appointments_start_time on public.appointments(start_time);
create index idx_appointments_barber_day on public.appointments(barber_id, start_time);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_shops_updated
  before update on public.shops
  for each row execute procedure public.handle_updated_at();

create trigger on_appointments_updated
  before update on public.appointments
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- FUNCTION: get_available_slots
-- Returns available time slots for a barber+service on a given date.
-- Called via supabase.rpc() from the booking Server Action.
-- ============================================================
create or replace function public.get_available_slots(
  p_barber_id   uuid,
  p_service_id  uuid,
  p_date        date
)
returns table (slot_start timestamptz, slot_end timestamptz)
language plpgsql security definer as $$
declare
  v_shop_id        uuid;
  v_duration       int;
  v_open_time      time;
  v_close_time     time;
  v_slot_duration  int;
  v_tz             text;
  v_current        timestamptz;
  v_slot_end       timestamptz;
  v_day_open       timestamptz;
  v_day_close      timestamptz;
begin
  -- Fetch service duration and shop_id
  select s.shop_id, s.duration_minutes
  into v_shop_id, v_duration
  from public.services s
  where s.id = p_service_id;

  if not found then
    raise exception 'Service % not found', p_service_id;
  end if;

  -- Fetch shop settings
  select
    coalesce(sh.settings->>'timezone', 'America/New_York'),
    coalesce((sh.settings->>'open_time'), '09:00')::time,
    coalesce((sh.settings->>'close_time'), '18:00')::time,
    coalesce((sh.settings->>'slot_duration_minutes')::int, 15)
  into v_tz, v_open_time, v_close_time, v_slot_duration
  from public.shops sh
  where sh.id = v_shop_id;

  -- Build day boundaries in the shop's timezone
  v_day_open  := (p_date::text || ' ' || v_open_time::text)::timestamp at time zone v_tz;
  v_day_close := (p_date::text || ' ' || v_close_time::text)::timestamp at time zone v_tz;

  v_current := v_day_open;

  -- Walk through slots, skip any that overlap an existing appointment
  while v_current + (v_duration * interval '1 minute') <= v_day_close loop
    v_slot_end := v_current + (v_duration * interval '1 minute');

    if not exists (
      select 1 from public.appointments a
      where a.barber_id = p_barber_id
        and a.status not in ('cancelled', 'no_show')
        and a.start_time < v_slot_end
        and a.end_time   > v_current
    ) then
      return query select v_current, v_slot_end;
    end if;

    v_current := v_current + (v_slot_duration * interval '1 minute');
  end loop;
end;
$$;

-- ============================================================
-- PROFILES
-- One row per auth.users row. Auto-created by trigger on signup.
-- Use this table to track customers and add billing fields later.
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- Trigger function: runs as superuser so it can write to profiles
-- even before the user's JWT is available in the session.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.shops        enable row level security;
alter table public.barbers      enable row level security;
alter table public.services     enable row level security;
alter table public.appointments enable row level security;

-- ── PROFILES ───────────────────────────────────────────────
-- Each user can only read their own profile row.
-- Inserts are handled by the trigger (security definer) — no INSERT policy needed.
create policy "profiles: owner read"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

-- ── SHOPS ──────────────────────────────────────────────────
-- Owner can do full CRUD on their shop
create policy "shops: owner full access"
  on public.shops for all
  to authenticated
  using ( (select auth.uid()) = owner_id )
  with check ( (select auth.uid()) = owner_id );

-- Anyone can read any shop (needed for /[slug] public booking page)
create policy "shops: public read"
  on public.shops for select
  to anon, authenticated
  using ( true );

-- ── BARBERS ────────────────────────────────────────────────
-- Owner of the shop can manage barbers
create policy "barbers: owner full access"
  on public.barbers for all
  to authenticated
  using (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  )
  with check (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  );

-- Public can read active barbers (for booking page)
create policy "barbers: public read active"
  on public.barbers for select
  to anon, authenticated
  using ( active = true );

-- ── SERVICES ───────────────────────────────────────────────
create policy "services: owner full access"
  on public.services for all
  to authenticated
  using (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  )
  with check (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  );

create policy "services: public read active"
  on public.services for select
  to anon, authenticated
  using ( active = true );

-- ── APPOINTMENTS ───────────────────────────────────────────
-- Shop owner can read all appointments for their shop
create policy "appointments: owner read"
  on public.appointments for select
  to authenticated
  using (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  );

-- Shop owner can update status (check-in, cancel, no-show)
create policy "appointments: owner update"
  on public.appointments for update
  to authenticated
  using (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  )
  with check (
    shop_id in (
      select id from public.shops
      where owner_id = (select auth.uid())
    )
  );

-- Anyone (anonymous customer) can INSERT an appointment
create policy "appointments: public insert"
  on public.appointments for insert
  to anon, authenticated
  with check ( true );

-- ============================================================
-- STORAGE BUCKETS
-- Run these separately or via Supabase Dashboard > Storage
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('logos',   'logos',   true);

-- Storage policies (run after creating buckets):
-- create policy "avatars: authenticated upload"
--   on storage.objects for insert to authenticated
--   with check (bucket_id = 'avatars');
-- create policy "avatars: public read"
--   on storage.objects for select to anon, authenticated
--   using (bucket_id = 'avatars');
-- create policy "logos: authenticated upload"
--   on storage.objects for insert to authenticated
--   with check (bucket_id = 'logos');
-- create policy "logos: public read"
--   on storage.objects for select to anon, authenticated
--   using (bucket_id = 'logos');
