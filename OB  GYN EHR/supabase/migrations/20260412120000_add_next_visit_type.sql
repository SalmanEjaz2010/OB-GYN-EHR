ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS next_visit_type text DEFAULT 'simple';
