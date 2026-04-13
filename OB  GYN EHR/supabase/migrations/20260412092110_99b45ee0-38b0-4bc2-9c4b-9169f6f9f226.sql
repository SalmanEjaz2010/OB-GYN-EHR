
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS ultrasound text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS blood_group text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS haemoglobin text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS hepatitis_b text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS hepatitis_c text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS hiv text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS rbs text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS investigation_others text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS treatment text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS plan text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS next_visit text DEFAULT '';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS outcome text DEFAULT '';
