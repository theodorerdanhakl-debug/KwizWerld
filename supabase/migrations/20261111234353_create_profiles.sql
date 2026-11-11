-- Profiles for KwizWerld accounts.
-- Username and grade are copied once from sign-up metadata.
-- That metadata is not used for authorization.
-- EXP, diamonds, level, and cosmetics are server-owned.

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to postgres, service_role, supabase_auth_admin, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  grade_level text not null,
  exp integer not null default 0,
  diamonds integer not null default 0,
  level integer not null default 1,
  cosmetics jsonb not null default '{}'::jsonb,
  theme text not null default 'system',
  sound_effects boolean not null default true,
  music boolean not null default true,
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  constraint profiles_grade_level_check check (
    grade_level in ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')
  ),
  constraint profiles_exp_nonnegative check (exp >= 0),
  constraint profiles_diamonds_nonnegative check (diamonds >= 0),
  constraint profiles_level_positive check (level >= 1),
  constraint profiles_theme_check check (theme in ('light', 'dark', 'system')),
  constraint profiles_cosmetics_object check (jsonb_typeof(cosmetics) = 'object')
);

create unique index profiles_username_lower_key on public.profiles (lower(username));

revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (
  username,
  grade_level,
  theme,
  sound_effects,
  music,
  reduced_motion
) on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function private.protect_profile_economy()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if new.exp is distinct from old.exp
      or new.diamonds is distinct from old.diamonds
      or new.level is distinct from old.level
      or new.cosmetics is distinct from old.cosmetics
      or new.id is distinct from old.id
      or new.created_at is distinct from old.created_at
    then
      raise exception 'exp, diamonds, level, and cosmetics are server-owned';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function private.protect_profile_economy() from public, anon;
grant execute on function private.protect_profile_economy() to authenticated, service_role;

create trigger protect_profile_economy
  before update on public.profiles
  for each row execute function private.protect_profile_economy();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
  requested_grade text;
begin
  requested_username := coalesce(new.raw_user_meta_data ->> 'username', '');
  requested_grade := coalesce(new.raw_user_meta_data ->> 'grade_level', '');

  if requested_username !~ '^[A-Za-z0-9_]{3,20}$' then
    raise exception 'username must be 3 to 20 letters, numbers, or underscores';
  end if;

  if requested_grade not in ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12') then
    raise exception 'grade level must be K through 12';
  end if;

  insert into public.profiles (id, username, grade_level)
  values (new.id, requested_username, requested_grade);

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin, postgres, service_role;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function private.delete_own_account() from public, anon;
grant execute on function private.delete_own_account() to authenticated;

create or replace function public.delete_own_account()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform private.delete_own_account();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
