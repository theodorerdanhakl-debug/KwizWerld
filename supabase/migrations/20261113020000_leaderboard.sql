-- Leaderboard totals.
-- Daily and weekly EXP are the sum of reward_events in the current UTC day or ISO week (Monday start).
-- Those sums live in leaderboard_scores, updated when a reward is inserted, so a board read does not scan the ledger.
-- All-time rank uses profiles.exp. Closed windows are deleted the next time the board is read.

create or replace function private.leaderboard_day_start(moment timestamptz)
returns timestamptz
language sql
immutable
set search_path = ''
as $$
  select date_trunc('day', moment at time zone 'utc') at time zone 'utc';
$$;

create or replace function private.leaderboard_week_start(moment timestamptz)
returns timestamptz
language sql
immutable
set search_path = ''
as $$
  select date_trunc('week', moment at time zone 'utc') at time zone 'utc';
$$;

revoke all on function private.leaderboard_day_start(timestamptz) from public, anon, authenticated;
revoke all on function private.leaderboard_week_start(timestamptz) from public, anon, authenticated;

create table public.leaderboard_scores (
  user_id uuid not null references public.profiles (id) on delete cascade,
  window_kind text not null,
  window_start timestamptz not null,
  exp integer not null,
  primary key (window_kind, window_start, user_id),
  constraint leaderboard_scores_kind_check check (window_kind in ('day', 'week')),
  constraint leaderboard_scores_exp_positive check (exp > 0)
);

create index leaderboard_scores_rank_idx
  on public.leaderboard_scores (window_kind, window_start, exp desc, user_id);

create index profiles_exp_rank_idx
  on public.profiles (exp desc, id);

revoke all on public.leaderboard_scores from public, anon, authenticated;

alter table public.leaderboard_scores enable row level security;

create table private.leaderboard_maintenance (
  singleton boolean primary key default true check (singleton),
  day_start timestamptz not null,
  week_start timestamptz not null
);

revoke all on private.leaderboard_maintenance from public, anon, authenticated;

create or replace function private.public_cosmetics(value jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case
    when value is null or jsonb_typeof(value) <> 'object' then '{}'::jsonb
    else jsonb_strip_nulls(jsonb_build_object(
      'avatar', case when (value->>'avatar') ~ '^[a-z0-9-]{1,40}$' then value->>'avatar' else null end,
      'decoration', case when (value->>'decoration') ~ '^[a-z0-9-]{1,40}$' then value->>'decoration' else null end,
      'nameColor', case when (value->>'nameColor') ~ '^[a-z0-9-]{1,40}$' then value->>'nameColor' else null end,
      'nameFont', case when (value->>'nameFont') ~ '^[a-z0-9-]{1,40}$' then value->>'nameFont' else null end,
      'nameplate', case when (value->>'nameplate') ~ '^[a-z0-9-]{1,40}$' then value->>'nameplate' else null end,
      'badges', (
        select jsonb_agg(picked.item)
        from (
          select badge.item #>> '{}' as item
          from jsonb_array_elements(
            case
              when jsonb_typeof(value->'badges') = 'array' then value->'badges'
              else '[]'::jsonb
            end
          ) as badge(item)
          where jsonb_typeof(badge.item) = 'string'
            and (badge.item #>> '{}') ~ '^[a-z0-9-]{1,40}$'
          limit 6
        ) as picked
      )
    ))
  end;
$$;

revoke all on function private.public_cosmetics(jsonb) from public, anon, authenticated;

create or replace function private.track_leaderboard_score()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  day_start timestamptz;
  week_start timestamptz;
begin
  if new.exp is null or new.exp <= 0 then
    return new;
  end if;

  day_start := private.leaderboard_day_start(new.created_at);
  week_start := private.leaderboard_week_start(new.created_at);

  insert into public.leaderboard_scores (user_id, window_kind, window_start, exp)
  values (new.user_id, 'day', day_start, new.exp)
  on conflict (window_kind, window_start, user_id)
  do update set exp = public.leaderboard_scores.exp + excluded.exp;

  insert into public.leaderboard_scores (user_id, window_kind, window_start, exp)
  values (new.user_id, 'week', week_start, new.exp)
  on conflict (window_kind, window_start, user_id)
  do update set exp = public.leaderboard_scores.exp + excluded.exp;

  return new;
end;
$$;

revoke all on function private.track_leaderboard_score() from public, anon, authenticated;

create trigger track_leaderboard_score
  after insert on public.reward_events
  for each row
  execute function private.track_leaderboard_score();

insert into public.leaderboard_scores (user_id, window_kind, window_start, exp)
select
  events.user_id,
  'day',
  private.leaderboard_day_start(events.created_at),
  sum(events.exp)::integer
from public.reward_events as events
where events.exp > 0
  and private.leaderboard_day_start(events.created_at) = private.leaderboard_day_start(now())
group by events.user_id, private.leaderboard_day_start(events.created_at);

insert into public.leaderboard_scores (user_id, window_kind, window_start, exp)
select
  events.user_id,
  'week',
  private.leaderboard_week_start(events.created_at),
  sum(events.exp)::integer
from public.reward_events as events
where events.exp > 0
  and private.leaderboard_week_start(events.created_at) = private.leaderboard_week_start(now())
group by events.user_id, private.leaderboard_week_start(events.created_at);

insert into private.leaderboard_maintenance (singleton, day_start, week_start)
values (true, private.leaderboard_day_start(now()), private.leaderboard_week_start(now()));

create or replace function public.leaderboard(board text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  board_text text := board;
  current_day timestamptz := private.leaderboard_day_start(now());
  current_week timestamptz := private.leaderboard_week_start(now());
  current_window timestamptz;
  entries jsonb := '[]'::jsonb;
  viewer jsonb;
  viewer_name text;
  viewer_exp integer;
  viewer_rank integer;
  viewer_cosmetics jsonb;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if board_text is null or board_text not in ('day', 'week', 'all') then
    raise exception 'board is required';
  end if;

  with rolled as (
    update private.leaderboard_maintenance as maintenance
    set day_start = current_day, week_start = current_week
    where maintenance.singleton
      and (
        maintenance.day_start is distinct from current_day
        or maintenance.week_start is distinct from current_week
      )
    returning maintenance.singleton
  )
  delete from public.leaderboard_scores as scores
  where exists (select 1 from rolled)
    and (
      (scores.window_kind = 'day' and scores.window_start is distinct from current_day)
      or (scores.window_kind = 'week' and scores.window_start is distinct from current_week)
    );

  if board_text = 'all' then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'rank', ranked.place,
        'userId', ranked.id,
        'username', ranked.username,
        'exp', ranked.exp,
        'cosmetics', ranked.cosmetics
      )
      order by ranked.exp desc, ranked.id
    ), '[]'::jsonb)
    into entries
    from (
      select
        profiles.id,
        profiles.username,
        profiles.exp,
        private.public_cosmetics(profiles.cosmetics) as cosmetics,
        rank() over (order by profiles.exp desc)::integer as place
      from public.profiles as profiles
      order by profiles.exp desc, profiles.id
      limit 100
    ) as ranked;

    select profiles.username, profiles.exp, private.public_cosmetics(profiles.cosmetics)
    into viewer_name, viewer_exp, viewer_cosmetics
    from public.profiles as profiles
    where profiles.id = uid;

    if viewer_name is not null then
      select (1 + count(*))::integer
      into viewer_rank
      from public.profiles as profiles
      where profiles.exp > viewer_exp;
    end if;
  else
    current_window := case when board_text = 'day' then current_day else current_week end;

    select coalesce(jsonb_agg(
      jsonb_build_object(
        'rank', ranked.place,
        'userId', ranked.user_id,
        'username', ranked.username,
        'exp', ranked.exp,
        'cosmetics', ranked.cosmetics
      )
      order by ranked.exp desc, ranked.user_id
    ), '[]'::jsonb)
    into entries
    from (
      select
        scores.user_id,
        scores.exp,
        profiles.username,
        private.public_cosmetics(profiles.cosmetics) as cosmetics,
        rank() over (order by scores.exp desc)::integer as place
      from public.leaderboard_scores as scores
      join public.profiles as profiles on profiles.id = scores.user_id
      where scores.window_kind = board_text
        and scores.window_start = current_window
      order by scores.exp desc, scores.user_id
      limit 100
    ) as ranked;

    select profiles.username, private.public_cosmetics(profiles.cosmetics)
    into viewer_name, viewer_cosmetics
    from public.profiles as profiles
    where profiles.id = uid;

    if viewer_name is not null then
      select scores.exp
      into viewer_exp
      from public.leaderboard_scores as scores
      where scores.user_id = uid
        and scores.window_kind = board_text
        and scores.window_start = current_window;

      if viewer_exp is null then
        viewer_exp := 0;
      end if;

      select (1 + count(*))::integer
      into viewer_rank
      from public.leaderboard_scores as scores
      where scores.window_kind = board_text
        and scores.window_start = current_window
        and scores.exp > viewer_exp;
    end if;
  end if;

  if viewer_name is null then
    viewer := null;
  else
    viewer := jsonb_build_object(
      'rank', viewer_rank,
      'userId', uid,
      'username', viewer_name,
      'exp', viewer_exp,
      'cosmetics', coalesce(viewer_cosmetics, '{}'::jsonb),
      'pinned', not exists (
        select 1
        from jsonb_array_elements(entries) as entry
        where entry->>'userId' = uid::text
      )
    );
  end if;

  return jsonb_build_object(
    'board', board_text,
    'resetsAt', case
      when board_text = 'day' then current_day + interval '1 day'
      when board_text = 'week' then current_week + interval '7 days'
      else null
    end,
    'entries', entries,
    'viewer', viewer
  );
end;
$$;

revoke all on function public.leaderboard(text) from public, anon;
grant execute on function public.leaderboard(text) to authenticated;
