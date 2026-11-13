-- Personal bests for arcade runs. The signed-in user is auth.uid().
-- Rewards stay in award_rewards. This function only stores the best and the play count.

create table public.game_stats (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id text not null,
  best_score integer not null,
  plays integer not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id),
  constraint game_stats_game_check check (
    game_id in ('sum-sprint', 'word-trail', 'map-hop', 'lab-notes', 'time-post')
  ),
  constraint game_stats_best_check check (best_score >= 0 and best_score <= 100),
  constraint game_stats_plays_check check (plays > 0)
);

revoke all on public.game_stats from public, anon, authenticated;
grant select on public.game_stats to authenticated;

alter table public.game_stats enable row level security;

create policy "read own game stats"
  on public.game_stats
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.record_game_run(game_id text, score integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  game_text text := game_id;
  score_value integer := score;
  previous_best integer;
  next_best integer;
  next_plays integer;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if game_text is null
    or game_text not in ('sum-sprint', 'word-trail', 'map-hop', 'lab-notes', 'time-post') then
    raise exception 'game is required';
  end if;

  if score_value is null or score_value < 0 or score_value > 100 then
    raise exception 'score is required';
  end if;

  perform 1 from public.profiles where id = uid;
  if not found then
    raise exception 'profile is missing';
  end if;

  select gs.best_score, gs.plays
  into previous_best, next_plays
  from public.game_stats gs
  where gs.user_id = uid and gs.game_id = game_text
  for update;

  if not found then
    begin
      insert into public.game_stats (user_id, game_id, best_score, plays)
      values (uid, game_text, score_value, 1);
      previous_best := null;
      next_best := score_value;
      next_plays := 1;
    exception
      when unique_violation then
        select gs.best_score, gs.plays
        into previous_best, next_plays
        from public.game_stats gs
        where gs.user_id = uid and gs.game_id = game_text
        for update;
        next_best := greatest(previous_best, score_value);
        next_plays := next_plays + 1;
        update public.game_stats gs
        set best_score = next_best,
            plays = next_plays,
            updated_at = now()
        where gs.user_id = uid and gs.game_id = game_text;
    end;
  else
    next_best := greatest(previous_best, score_value);
    next_plays := next_plays + 1;
    update public.game_stats gs
    set best_score = next_best,
        plays = next_plays,
        updated_at = now()
    where gs.user_id = uid and gs.game_id = game_text;
  end if;

  return jsonb_build_object(
    'gameId', game_text,
    'score', score_value,
    'previousBest', previous_best,
    'best', next_best,
    'plays', next_plays,
    'isNewBest', previous_best is null or score_value > previous_best
  );
end;
$$;

revoke all on function public.record_game_run(text, integer) from public, anon;
grant execute on function public.record_game_run(text, integer) to authenticated;
