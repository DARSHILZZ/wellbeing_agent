-- =============================================================================
-- Migration 002: Enable Row Level Security (RLS) & Define Access Control Policies
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================================================

-- 1. Enable RLS on every public table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weakness_flags ENABLE ROW LEVEL SECURITY;

-- 2. Helper Functions (SECURITY DEFINER to avoid recursive RLS policy lookups)
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'teacher'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'student'
    );
$$;

-- ── 3. SCORES POLICIES ───────────────────────────────────────────────────────
-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Select scores policy" ON public.scores;
DROP POLICY IF EXISTS "Students insert own scores" ON public.scores;
DROP POLICY IF EXISTS "Students update own scores" ON public.scores;
DROP POLICY IF EXISTS "Students delete own scores" ON public.scores;

-- Requirement: SELECT allowed if auth.uid() = student_id OR user role is 'teacher'
CREATE POLICY "Select scores policy"
    ON public.scores FOR SELECT
    TO authenticated
    USING (
        auth.uid() = student_id
        OR public.is_teacher()
    );

CREATE POLICY "Students insert own scores"
    ON public.scores FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students update own scores"
    ON public.scores FOR UPDATE
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students delete own scores"
    ON public.scores FOR DELETE
    TO authenticated
    USING (auth.uid() = student_id);


-- ── 4. PROFILES POLICIES ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users or teachers can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users or teachers can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = auth.uid()
        OR public.is_teacher()
    );

CREATE POLICY "Users update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid()
        -- Security check: users cannot alter their role directly via client API
        AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    );


-- ── 5. QUIZZES POLICIES ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Select quizzes policy" ON public.quizzes;
DROP POLICY IF EXISTS "Students manage own quizzes" ON public.quizzes;

CREATE POLICY "Select quizzes policy"
    ON public.quizzes FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR public.is_teacher()
    );

CREATE POLICY "Students manage own quizzes"
    ON public.quizzes FOR ALL
    TO authenticated
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());


-- ── 6. QUIZ QUESTIONS POLICIES ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Select quiz questions policy" ON public.quiz_questions;
DROP POLICY IF EXISTS "Students manage quiz questions" ON public.quiz_questions;

CREATE POLICY "Select quiz questions policy"
    ON public.quiz_questions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            WHERE q.id = quiz_id
              AND (q.student_id = auth.uid() OR public.is_teacher())
        )
    );

CREATE POLICY "Students manage quiz questions"
    ON public.quiz_questions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            WHERE q.id = quiz_id AND q.student_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            WHERE q.id = quiz_id AND q.student_id = auth.uid()
        )
    );


-- ── 7. CLASSES & ENROLLMENTS POLICIES ───────────────────────────────────────
DROP POLICY IF EXISTS "Teachers manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Students view enrolled classes" ON public.classes;

CREATE POLICY "Teachers manage own classes"
    ON public.classes FOR ALL
    TO authenticated
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Students view enrolled classes"
    ON public.classes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments ce
            WHERE ce.class_id = id AND ce.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Teachers manage enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Students view enrollments" ON public.class_enrollments;

CREATE POLICY "Teachers manage enrollments"
    ON public.class_enrollments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = class_id AND c.teacher_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = class_id AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students view enrollments"
    ON public.class_enrollments FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());


-- ── 8. CHAT SESSIONS & MESSAGES POLICIES ─────────────────────────────────────
DROP POLICY IF EXISTS "Students manage chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Students manage chat messages" ON public.chat_messages;

CREATE POLICY "Students manage chat sessions"
    ON public.chat_sessions FOR ALL
    TO authenticated
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students manage chat messages"
    ON public.chat_messages FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs
            WHERE cs.id = session_id AND cs.student_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs
            WHERE cs.id = session_id AND cs.student_id = auth.uid()
        )
    );


-- ── 9. WEAKNESS FLAGS POLICIES ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Students view own weakness flags" ON public.weakness_flags;
DROP POLICY IF EXISTS "Teachers manage weakness flags" ON public.weakness_flags;

CREATE POLICY "Students view own weakness flags"
    ON public.weakness_flags FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Teachers manage weakness flags"
    ON public.weakness_flags FOR ALL
    TO authenticated
    USING (public.is_teacher())
    WITH CHECK (public.is_teacher());
