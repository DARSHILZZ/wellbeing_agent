-- =============================================================================
-- Migration: Auto-create public profile on auth.users signup
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to re-run (uses CREATE OR REPLACE + DROP IF EXISTS)
-- =============================================================================

-- Ensure role enum exists
do $$ begin
    create type public.user_role as enum ('student', 'teacher');
exception
    when duplicate_object then null;
end $$;

-- Ensure profiles (Users) table exists
create table if not exists public.profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    role        public.user_role not null default 'student',
    full_name   text not null,
    email       text not null,
    avatar_url  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    constraint profiles_email_unique unique (email)
);

-- Trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    _full_name text;
begin
    _full_name := coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        split_part(new.email, '@', 1)
    );

    insert into public.profiles (id, role, full_name, email)
    values (new.id, 'student', _full_name, new.email)
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- Backfill: create profiles for any existing auth.users missing one
insert into public.profiles (id, role, full_name, email)
select
    u.id,
    'student',
    coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
    u.email
from auth.users u
where not exists (
    select 1 from public.profiles p where p.id = u.id
);
