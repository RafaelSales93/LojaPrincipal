create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_last_name text not null,
  address text not null,
  observation text,
  total numeric(12,2) not null check (total >= 0),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_name text not null unique,
  category text,
  view_count integer not null default 1,
  last_seen timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.product_views enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "Admins can read orders"
on public.orders
for select
using (public.is_admin());

create policy "Admins can read product views"
on public.product_views
for select
using (public.is_admin());

create policy "Public can insert orders"
on public.orders
for insert
with check (true);

create policy "Public can insert product views"
on public.product_views
for insert
with check (true);

create policy "User can read profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "User can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "User can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Admins can manage profiles"
on public.profiles
for update
using (public.is_admin());
