
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visit_type TEXT NOT NULL DEFAULT 'new' CHECK (visit_type IN ('new', 'returning')),
  notes TEXT DEFAULT '',
  diagnosis TEXT DEFAULT '',
  treatment TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_visits_patient_id ON public.visits(patient_id);
CREATE INDEX idx_visits_visit_date ON public.visits(visit_date);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on visits" ON public.visits FOR SELECT USING (true);
CREATE POLICY "Allow all insert on visits" ON public.visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on visits" ON public.visits FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on visits" ON public.visits FOR DELETE USING (true);
