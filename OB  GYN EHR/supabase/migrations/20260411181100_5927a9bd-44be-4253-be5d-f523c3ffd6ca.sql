
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS blood_pressure text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS pulse text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS temperature text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS weight text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS height text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS odema text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS abdominal_examination text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS pelvic_examination text DEFAULT '';
