-- Reward ledger. The signed-in user is auth.uid(), never a payload field.
-- EXP and diamonds are computed here. Client amounts are ignored.
-- Leaving a level costs 20 + 12*level + 2*level*level, matching src/utils/level.ts.

create or replace function private.exp_to_leave_level(level integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select 20 + 12 * level + 2 * level * level;
$$;

create or replace function private.level_for_exp(total integer)
returns integer
language plpgsql
immutable
set search_path = ''
as $$
declare
  remaining integer := greatest(total, 0);
  current_level integer := 1;
  cost integer;
begin
  while current_level < 80 loop
    cost := private.exp_to_leave_level(current_level);
    exit when remaining < cost;
    remaining := remaining - cost;
    current_level := current_level + 1;
  end loop;
  return current_level;
end;
$$;

revoke all on function private.exp_to_leave_level(integer) from public, anon, authenticated;
revoke all on function private.level_for_exp(integer) from public, anon, authenticated;

create table public.reward_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null,
  exp integer not null,
  diamonds integer not null,
  created_at timestamptz not null default now(),
  idempotency_key uuid not null,
  constraint reward_events_source_check check (
    source ~ '^(learn|practice|study|game:[a-z0-9-]{1,40})$'
  ),
  constraint reward_events_exp_nonnegative check (exp >= 0),
  constraint reward_events_diamonds_nonnegative check (diamonds >= 0),
  constraint reward_events_user_key unique (user_id, idempotency_key)
);

create index reward_events_user_recent_idx
  on public.reward_events (user_id, created_at desc);

create index reward_events_user_source_recent_idx
  on public.reward_events (user_id, source, created_at desc);

revoke all on public.reward_events from public, anon, authenticated;
grant select on public.reward_events to authenticated;

alter table public.reward_events enable row level security;

create policy "read own rewards"
  on public.reward_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.award_rewards(source text, metadata jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid;
  key uuid;
  key_text text;
  topic_id text;
  game_id text;
  kind text;
  score numeric;
  raw_exp integer;
  raw_diamonds integer;
  grant_exp integer;
  grant_diamonds integer;
  prev_exp integer;
  prev_diamonds integer;
  prev_level integer;
  new_exp integer;
  new_diamonds integer;
  new_level integer;
  used_count integer;
  used_exp integer;
  used_diamonds integer;
  global_exp integer;
  global_diamonds integer;
  cap_count integer;
  cap_exp integer;
  cap_diamonds integer;
  room_exp integer;
  room_diamonds integer;
  existing_exp integer;
  existing_diamonds integer;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if source is null or source !~ '^(learn|practice|study|game:[a-z0-9-]{1,40})$' then
    raise exception 'source is not a reward';
  end if;

  if metadata is null or jsonb_typeof(metadata) <> 'object' or length(metadata::text) > 400 then
    raise exception 'metadata is required';
  end if;

  key_text := metadata ->> 'idempotencyKey';
  if key_text is null or key_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    raise exception 'idempotency key is required';
  end if;
  key := key_text::uuid;

  if metadata -> 'score' is null or jsonb_typeof(metadata -> 'score') <> 'number' then
    raise exception 'score is required';
  end if;
  score := (metadata ->> 'score')::numeric;
  if score <> score then
    raise exception 'score is required';
  end if;

  if source in ('learn', 'practice', 'study') then
    kind := source;
    if score < 0 or score > 1 then
      raise exception 'score is required';
    end if;
    topic_id := metadata ->> 'topicId';
    if topic_id is null or topic_id !~ '^(math|english|geography|science|history)-(k|1[0-2]|[1-9])-[a-z0-9-]{1,48}$' then
      raise exception 'topic is required';
    end if;
  else
    kind := 'game';
    game_id := split_part(source, ':', 2);
    if game_id not in ('sum-sprint', 'word-trail', 'map-hop', 'lab-notes', 'time-post') then
      raise exception 'source is not a reward';
    end if;
    if score < 0 or score > 100 then
      raise exception 'score is required';
    end if;
  end if;

  if kind = 'learn' then
    raw_exp := 28 + round(score * 32)::integer;
    raw_diamonds := case when score >= 1 then 2 else 1 end;
    cap_count := 6;
    cap_exp := 300;
    cap_diamonds := 10;
  elsif kind = 'study' then
    raw_exp := 8 + round(score * 10)::integer;
    raw_diamonds := case when score >= 0.8 then 1 else 0 end;
    cap_count := 8;
    cap_exp := 120;
    cap_diamonds := 4;
  elsif kind = 'practice' then
    raw_exp := 24 + round(score * 96)::integer;
    raw_diamonds := 1
      + case when score >= 0.6 then 1 else 0 end
      + case when score >= 0.9 then 1 else 0 end;
    cap_count := 6;
    cap_exp := 500;
    cap_diamonds := 14;
  else
    raw_exp := 16 + round(score * 0.84)::integer;
    raw_diamonds := case when score >= 50 then 1 else 0 end + case when score >= 85 then 1 else 0 end;
    cap_count := 5;
    cap_exp := 300;
    cap_diamonds := 6;
  end if;

  select p.exp, p.diamonds, p.level
  into prev_exp, prev_diamonds, prev_level
  from public.profiles p
  where p.id = uid
  for update;

  if prev_exp is null then
    raise exception 'profile is missing';
  end if;

  select r.exp, r.diamonds
  into existing_exp, existing_diamonds
  from public.reward_events r
  where r.user_id = uid and r.idempotency_key = key;

  if existing_exp is not null then
    return jsonb_build_object(
      'exp', existing_exp,
      'diamonds', existing_diamonds,
      'totalExp', prev_exp,
      'totalDiamonds', prev_diamonds,
      'level', prev_level,
      'previousLevel', prev_level,
      'leveledUp', false,
      'capped', false,
      'replayed', true
    );
  end if;

  select count(*)::integer, coalesce(sum(r.exp), 0)::integer, coalesce(sum(r.diamonds), 0)::integer
  into used_count, used_exp, used_diamonds
  from public.reward_events r
  where r.user_id = uid
    and r.source = source
    and r.created_at >= now() - interval '1 hour';

  select coalesce(sum(r.exp), 0)::integer, coalesce(sum(r.diamonds), 0)::integer
  into global_exp, global_diamonds
  from public.reward_events r
  where r.user_id = uid
    and r.created_at >= now() - interval '1 hour';

  if used_count >= cap_count or prev_exp > 2000000000 then
    room_exp := 0;
    room_diamonds := 0;
  else
    room_exp := least(cap_exp - used_exp, 800 - global_exp);
    room_diamonds := least(cap_diamonds - used_diamonds, 24 - global_diamonds);
  end if;

  grant_exp := least(raw_exp, greatest(room_exp, 0));
  grant_diamonds := least(raw_diamonds, greatest(room_diamonds, 0));

  if grant_exp = 0 and grant_diamonds = 0 then
    return jsonb_build_object(
      'exp', 0,
      'diamonds', 0,
      'totalExp', prev_exp,
      'totalDiamonds', prev_diamonds,
      'level', prev_level,
      'previousLevel', prev_level,
      'leveledUp', false,
      'capped', true,
      'replayed', false
    );
  end if;

  insert into public.reward_events (user_id, source, exp, diamonds, idempotency_key)
  values (uid, source, grant_exp, grant_diamonds, key);

  update public.profiles
  set
    exp = prev_exp + grant_exp,
    diamonds = prev_diamonds + grant_diamonds,
    level = private.level_for_exp(prev_exp + grant_exp)
  where id = uid
  returning exp, diamonds, level into new_exp, new_diamonds, new_level;

  return jsonb_build_object(
    'exp', grant_exp,
    'diamonds', grant_diamonds,
    'totalExp', new_exp,
    'totalDiamonds', new_diamonds,
    'level', new_level,
    'previousLevel', prev_level,
    'leveledUp', new_level > prev_level,
    'capped', grant_exp < raw_exp or grant_diamonds < raw_diamonds,
    'replayed', false
  );
end;
$$;

revoke all on function public.award_rewards(text, jsonb) from public, anon;
grant execute on function public.award_rewards(text, jsonb) to authenticated;
