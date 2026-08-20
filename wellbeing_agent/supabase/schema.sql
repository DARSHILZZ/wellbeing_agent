-- =============================================================================
-- AI-Powered Adaptive Learning Platform — Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Enums ─────────────────────────────────────────────────────────────────────
create type public.user_role as enum ('student', 'teacher');
create type public.quiz_status as enum ('draft', 'published', 'archived');
create type public.weakness_level as enum ('low', 'medium', 'high', 'critical');

-- ── Profiles / Users (extends auth.users) ─────────────────────────────────────
-- Supabase Auth owns identity in auth.users.
-- This public table is your app-level "Users" table (role, name, metadata).
-- Every auth signup auto-creates a row here via handle_new_user() trigger.
create table public.profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    role        public.user_role not null default 'student',
    full_name   text not null,
    email       text not null,
    avatar_url  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),

    constraint profiles_email_unique unique (email)
);

comment on table public.profiles is
    'App-level Users table. One row per auth.users signup. Default role: student.';

create index idx_profiles_role on public.profiles (role);

-- ── Trigger: auto-create profile on signup ────────────────────────────────────
-- Fires AFTER INSERT on auth.users (Supabase Auth signup).
-- Defaults every new user to role = 'student'.
-- Role can later be promoted to 'teacher' via FastAPI (service_role key).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    _full_name text;
    _role      public.user_role;
begin
    _full_name := coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        split_part(new.email, '@', 1)
    );

    -- Always default to 'student'. Never trust client-sent role on signup.
    -- Teacher promotion happens later via backend admin (service_role).
    _role := 'student';

    insert into public.profiles (id, role, full_name, email)
    values (new.id, _role, _full_name, new.email)
    on conflict (id) do nothing;

    return new;
end;
$$;

-- Drop if re-running migration
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ── Classes (Teacher ↔ Student roster) ────────────────────────────────────────
create table public.classes (
    id          uuid primary key default gen_random_uuid(),
    teacher_id  uuid not null references public.profiles (id) on delete cascade,
    name        text not null,
    subject     text not null default 'General',
    grade_level text,
    created_at  timestamptz not null default now(),

    constraint classes_teacher_must_be_teacher
        check (exists (
            select 1 from public.profiles p
            where p.id = teacher_id and p.role = 'teacher'
        ))
);

create table public.class_enrollments (
    id          uuid primary key default gen_random_uuid(),
    class_id    uuid not null references public.classes (id) on delete cascade,
    student_id  uuid not null references public.profiles (id) on delete cascade,
    enrolled_at timestamptz not null default now(),

    constraint class_enrollments_unique unique (class_id, student_id),
    constraint enrollments_student_must_be_student
        check (exists (
            select 1 from public.profiles p
            where p.id = student_id and p.role = 'student'
        ))
);

create index idx_enrollments_class on public.class_enrollments (class_id);
create index idx_enrollments_student on public.class_enrollments (student_id);

-- ── Quizzes (Grok-generated) ──────────────────────────────────────────────────
create table public.quizzes (
    id              uuid primary key default gen_random_uuid(),
    student_id      uuid not null references public.profiles (id) on delete cascade,
    class_id        uuid references public.classes (id) on delete set null,
    topic           text not null,
    subject         text not null default 'General',
    difficulty      text not null default 'medium'
                    check (difficulty in ('easy', 'medium', 'hard')),
    question_count  int not null default 0,
    status          public.quiz_status not null default 'published',
    generated_by    text not null default 'grok',
    created_at      timestamptz not null default now()
);

create index idx_quizzes_student on public.quizzes (student_id);
create index idx_quizzes_topic on public.quizzes (topic);
create index idx_quizzes_class on public.quizzes (class_id);

-- ── Quiz Questions ────────────────────────────────────────────────────────────
create table public.quiz_questions (
    id              uuid primary key default gen_random_uuid(),
    quiz_id         uuid not null references public.quizzes (id) on delete cascade,
    position        int not null,
    question_text   text not null,
    options         jsonb not null,          -- ["A", "B", "C", "D"]
    correct_answer  text not null,
    explanation     text,
    created_at      timestamptz not null default now(),

    constraint quiz_questions_position_unique unique (quiz_id, position)
);

create index idx_quiz_questions_quiz on public.quiz_questions (quiz_id);

-- ── Scores / Quiz Attempts ────────────────────────────────────────────────────
create table public.scores (
    id              uuid primary key default gen_random_uuid(),
    quiz_id         uuid not null references public.quizzes (id) on delete cascade,
    student_id      uuid not null references public.profiles (id) on delete cascade,
    score           numeric(5, 2) not null check (score >= 0 and score <= 100),
    correct_count   int not null default 0,
    total_count     int not null default 0,
    accuracy_rate   numeric(5, 2) generated always as (
        case when total_count > 0
            then round((correct_count::numeric / total_count) * 100, 2)
            else 0
        end
    ) stored,
    time_taken_sec  int,
    answers         jsonb not null default '[]',
    -- answers shape: [{ "question_id": "uuid", "selected": "B", "is_correct": true }]
    completed_at    timestamptz not null default now(),

    constraint scores_one_attempt_per_quiz unique (quiz_id, student_id)
);

create index idx_scores_student on public.scores (student_id);
create index idx_scores_quiz on public.scores (quiz_id);
create index idx_scores_completed on public.scores (completed_at desc);

-- ── Chat Sessions (Gemini doubt-solver context) ───────────────────────────────
create table public.chat_sessions (
    id          uuid primary key default gen_random_uuid(),
    student_id  uuid not null references public.profiles (id) on delete cascade,
    topic       text,
    subject     text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table public.chat_messages (
    id          uuid primary key default gen_random_uuid(),
    session_id  uuid not null references public.chat_sessions (id) on delete cascade,
    role        text not null check (role in ('user', 'assistant')),
    content     text not null,
    metadata    jsonb default '{}',   -- citations, sentiment, etc.
    created_at  timestamptz not null default now()
);

create index idx_chat_sessions_student on public.chat_sessions (student_id);
create index idx_chat_messages_session on public.chat_messages (session_id);

-- ── Weakness Flags (Teacher auto-categorization) ─────────────────────────────
create table public.weakness_flags (
    id          uuid primary key default gen_random_uuid(),
    student_id  uuid not null references public.profiles (id) on delete cascade,
    class_id    uuid references public.classes (id) on delete set null,
    topic       text not null,
    level       public.weakness_level not null default 'medium',
    reason      text not null,
    avg_score   numeric(5, 2),
    flagged_at  timestamptz not null default now(),
    resolved    boolean not null default false,

    constraint weakness_flags_unique unique (student_id, topic, class_id)
);

create index idx_weakness_student on public.weakness_flags (student_id);
create index idx_weakness_class on public.weakness_flags (class_id);
create index idx_weakness_unresolved on public.weakness_flags (resolved) where resolved = false;

-- ── Helper: updated_at trigger ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();

create trigger chat_sessions_updated_at
    before update on public.chat_sessions
    for each row execute function public.set_updated_at();

-- ── Helper: RLS role-check functions (security definer avoids recursion) ───────
create or replace function public.get_my_role()
returns public.user_role
language sql stable security definer
set search_path = public
as $$
    select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_teacher()
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'teacher'
    );
$$;

create or replace function public.is_student()
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'student'
    );
$$;

-- Teacher can see a student if they share a class
create or replace function public.teacher_can_view_student(target_student_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.classes c
        join public.class_enrollments ce on ce.class_id = c.id
        where c.teacher_id = auth.uid()
          and ce.student_id = target_student_id
    );
$$;

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.scores enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.weakness_flags enable row level security;

-- PROFILES
create policy "Users can view own profile"
    on public.profiles for select
    using (id = auth.uid());

create policy "Teachers can view students in their classes"
    on public.profiles for select
    using (
        public.is_teacher()
        and role = 'student'
        and public.teacher_can_view_student(id)
    );

create policy "Users can update own profile (not role)"
    on public.profiles for update
    using (id = auth.uid())
    with check (
        id = auth.uid()
        -- Prevent self-promotion: role cannot change via client JWT
        and role = (select p.role from public.profiles p where p.id = auth.uid())
    );

-- Backend (service_role) bypasses RLS to promote users:
--   UPDATE profiles SET role = 'teacher' WHERE id = '<uuid>';

-- CLASSES
create policy "Teachers manage own classes"
    on public.classes for all
    using (teacher_id = auth.uid())
    with check (teacher_id = auth.uid());

create policy "Students can view enrolled classes"
    on public.classes for select
    using (
        exists (
            select 1 from public.class_enrollments ce
            where ce.class_id = id and ce.student_id = auth.uid()
        )
    );

-- CLASS ENROLLMENTS
create policy "Teachers manage enrollments in own classes"
    on public.class_enrollments for all
    using (
        exists (
            select 1 from public.classes c
            where c.id = class_id and c.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.classes c
            where c.id = class_id and c.teacher_id = auth.uid()
        )
    );

create policy "Students can view own enrollments"
    on public.class_enrollments for select
    using (student_id = auth.uid());

-- QUIZZES
create policy "Students manage own quizzes"
    on public.quizzes for all
    using (student_id = auth.uid())
    with check (student_id = auth.uid());

create policy "Teachers can view class quizzes"
    on public.quizzes for select
    using (public.teacher_can_view_student(student_id));

-- QUIZ QUESTIONS (inherit quiz access)
create policy "Access quiz questions via quiz ownership"
    on public.quiz_questions for select
    using (
        exists (
            select 1 from public.quizzes q
            where q.id = quiz_id
              and (q.student_id = auth.uid() or public.teacher_can_view_student(q.student_id))
        )
    );

create policy "Students insert questions into own quizzes"
    on public.quiz_questions for insert
    with check (
        exists (
            select 1 from public.quizzes q
            where q.id = quiz_id and q.student_id = auth.uid()
        )
    );

-- SCORES
create policy "Students manage own scores"
    on public.scores for all
    using (student_id = auth.uid())
    with check (student_id = auth.uid());

create policy "Teachers can view class scores"
    on public.scores for select
    using (public.teacher_can_view_student(student_id));

-- CHAT SESSIONS
create policy "Students manage own chat sessions"
    on public.chat_sessions for all
    using (student_id = auth.uid())
    with check (student_id = auth.uid());

-- CHAT MESSAGES
create policy "Students manage own chat messages"
    on public.chat_messages for all
    using (
        exists (
            select 1 from public.chat_sessions cs
            where cs.id = session_id and cs.student_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.chat_sessions cs
            where cs.id = session_id and cs.student_id = auth.uid()
        )
    );

-- WEAKNESS FLAGS
create policy "Students can view own weakness flags"
    on public.weakness_flags for select
    using (student_id = auth.uid());

create policy "Teachers can view and manage class weakness flags"
    on public.weakness_flags for all
    using (
        public.is_teacher()
        and (class_id is null or exists (
            select 1 from public.classes c
            where c.id = class_id and c.teacher_id = auth.uid()
        ))
    )
    with check (
        public.is_teacher()
        and (class_id is null or exists (
            select 1 from public.classes c
            where c.id = class_id and c.teacher_id = auth.uid()
        ))
    );

-- ── Analytics Views (used by FastAPI / Teacher dashboard) ─────────────────────
create or replace view public.teacher_class_overview as
select
    c.id            as class_id,
    c.name          as class_name,
    c.teacher_id,
    p.id            as student_id,
    p.full_name     as student_name,
    count(distinct s.id)                as quizzes_taken,
    round(avg(s.accuracy_rate), 2)      as avg_accuracy,
    max(s.completed_at)                 as last_quiz_at
from public.classes c
join public.class_enrollments ce on ce.class_id = c.id
join public.profiles p on p.id = ce.student_id
left join public.scores s on s.student_id = p.id
group by c.id, c.name, c.teacher_id, p.id, p.full_name;

create or replace view public.student_performance as
select
    s.student_id,
    count(*)                            as total_quizzes,
    round(avg(s.accuracy_rate), 2)      as overall_accuracy,
    round(avg(s.score), 2)              as avg_score,
    max(s.completed_at)                 as last_activity
from public.scores s
group by s.student_id;
