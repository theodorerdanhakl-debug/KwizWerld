-- Lesson, flashcard, and practice results. The signed-in user is auth.uid().
-- Subject and grade are taken from the topic id. Client dates are ignored.

create table public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  topic_id text not null,
  grade text not null,
  mode text not null,
  score numeric not null,
  duration_seconds integer not null,
  created_at timestamptz not null default now(),
  idempotency_key uuid not null,
  constraint activity_attempts_subject_check check (
    subject in ('math', 'english', 'geography', 'science', 'history')
  ),
  constraint activity_attempts_grade_check check (
    grade in ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')
  ),
  constraint activity_attempts_mode_check check (mode in ('learn', 'study', 'practice')),
  constraint activity_attempts_score_check check (score >= 0 and score <= 1),
  constraint activity_attempts_duration_check check (
    duration_seconds >= 0 and duration_seconds <= 7200
  ),
  constraint activity_attempts_user_key unique (user_id, idempotency_key)
);

create index activity_attempts_user_recent_idx
  on public.activity_attempts (user_id, created_at desc);

revoke all on public.activity_attempts from public, anon, authenticated;
grant select on public.activity_attempts to authenticated;

alter table public.activity_attempts enable row level security;

create policy "read own attempts"
  on public.activity_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function private.attempt_json(attempt public.activity_attempts, replayed boolean)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'id', attempt.id,
    'topicId', attempt.topic_id,
    'subjectId', attempt.subject,
    'grade', attempt.grade,
    'mode', attempt.mode,
    'score', attempt.score,
    'durationSeconds', attempt.duration_seconds,
    'createdAt', attempt.created_at,
    'replayed', replayed
  );
$$;

revoke all on function private.attempt_json(public.activity_attempts, boolean) from public, anon, authenticated;

create or replace function public.record_attempt(
  topic_id text,
  mode text,
  score numeric,
  duration_seconds integer,
  idempotency_key uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  topic_text text := topic_id;
  mode_text text := mode;
  score_value numeric := score;
  duration_value integer := duration_seconds;
  key uuid := idempotency_key;
  subject_id text;
  grade_token text;
  grade_id text;
  existing public.activity_attempts;
  inserted public.activity_attempts;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if key is null then
    raise exception 'key is required';
  end if;

  if topic_text is null
    or topic_text !~ '^(math|english|geography|science|history)-(k|1[0-2]|[1-9])-[a-z0-9-]{1,48}$' then
    raise exception 'topic is required';
  end if;

  if mode_text is null or mode_text not in ('learn', 'study', 'practice') then
    raise exception 'mode is required';
  end if;

  if score_value is null or score_value < 0 or score_value > 1 then
    raise exception 'score is required';
  end if;

  if duration_value is null or duration_value < 0 or duration_value > 7200 then
    raise exception 'duration is required';
  end if;

  perform 1 from public.profiles where id = uid;
  if not found then
    raise exception 'profile is missing';
  end if;

  select * into existing
  from public.activity_attempts
  where user_id = uid and activity_attempts.idempotency_key = key;

  if found then
    return private.attempt_json(existing, true);
  end if;

  subject_id := split_part(topic_text, '-', 1);
  grade_token := split_part(topic_text, '-', 2);
  grade_id := case when grade_token = 'k' then 'K' else grade_token end;

  begin
    insert into public.activity_attempts (
      user_id,
      subject,
      topic_id,
      grade,
      mode,
      score,
      duration_seconds,
      idempotency_key
    )
    values (
      uid,
      subject_id,
      topic_text,
      grade_id,
      mode_text,
      round(score_value, 4),
      duration_value,
      key
    )
    returning * into inserted;
  exception
    when unique_violation then
      select * into existing
      from public.activity_attempts
      where user_id = uid and activity_attempts.idempotency_key = key;
      return private.attempt_json(existing, true);
  end;

  return private.attempt_json(inserted, false);
end;
$$;

revoke all on function public.record_attempt(text, text, numeric, integer, uuid) from public, anon;
grant execute on function public.record_attempt(text, text, numeric, integer, uuid) to authenticated;
