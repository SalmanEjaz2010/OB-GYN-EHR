
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS age text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS parity text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS obstetrical_history text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS presenting_complaint text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS past_history text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS examination text DEFAULT '';
