import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Visit {
  id: string;
  patient_id: string;
  visit_date: string;
  visit_type: string;
  notes: string;
  diagnosis: string;
  treatment: string;
  created_at: string;
}

export function useVisits(patientId?: string) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisits = useCallback(async (pid: string) => {
    if (!pid) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', pid)
      .order('visit_date', { ascending: false });
    setLoading(false);
    if (data) setVisits(data as Visit[]);
    if (error) console.error('Failed to load visits', error);
  }, []);

  const addVisit = useCallback(async (pid: string, visit: Partial<Visit>) => {
    const { error } = await supabase.from('visits').insert({
      patient_id: pid,
      visit_type: visit.visit_type || 'returning',
      notes: visit.notes || '',
      diagnosis: visit.diagnosis || '',
      treatment: visit.treatment || '',
    });
    if (error) {
      toast.error('Failed to add visit');
    } else {
      toast.success('Visit recorded');
      fetchVisits(pid);
    }
  }, [fetchVisits]);

  return { visits, loading, fetchVisits, addVisit };
}
