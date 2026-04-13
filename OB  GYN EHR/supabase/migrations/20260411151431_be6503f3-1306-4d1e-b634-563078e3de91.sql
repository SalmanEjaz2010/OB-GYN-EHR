
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_external_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  dob DATE,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  medical_history TEXT DEFAULT '',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.patients FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.patients FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_patients_last_updated
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_last_updated_column();

CREATE INDEX idx_patients_external_id ON public.patients (patient_external_id);
CREATE INDEX idx_patients_full_name ON public.patients USING gin (to_tsvector('english', full_name));
