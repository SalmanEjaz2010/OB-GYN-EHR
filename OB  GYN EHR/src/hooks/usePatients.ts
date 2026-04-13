import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Patient {
  id?: string;
  patient_external_id: string;
  full_name: string;
  age: string;
  phone: string;
  email: string;
  parity: string;
  obstetrical_history: string;
  presenting_complaint: string;
  past_history: string;
  examination: string;
  blood_pressure: string;
  pulse: string;
  temperature: string;
  weight: string;
  height: string;
  odema: string;
  abdominal_examination: string;
  pelvic_examination: string;
  ultrasound: string;
  blood_group: string;
  haemoglobin: string;
  hepatitis_b: string;
  hepatitis_c: string;
  hiv: string;
  rbs: string;
  investigation_others: string;
  treatment: string;
  plan: string;
  next_visit: string; // format: "YYYY-MM-DD" or "YYYY-MM-DD|section"
  outcome: string;
  last_updated?: string;
}

const emptyPatient: Patient = {
  patient_external_id: '',
  full_name: '',
  age: '',
  phone: '',
  email: '',
  parity: '',
  obstetrical_history: '',
  presenting_complaint: '',
  past_history: '',
  examination: '',
  blood_pressure: '',
  pulse: '',
  temperature: '',
  weight: '',
  height: '',
  odema: '',
  abdominal_examination: '',
  pelvic_examination: '',
  ultrasound: '',
  blood_group: '',
  haemoglobin: '',
  hepatitis_b: '',
  hepatitis_c: '',
  hiv: '',
  rbs: '',
  investigation_others: '',
  treatment: '',
  plan: '',
  next_visit: '',
  outcome: '',
};

export function usePatients() {
  const [patient, setPatient] = useState<Patient>({ ...emptyPatient });
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentPatients, setRecentPatients] = useState<Pick<Patient, 'patient_external_id' | 'full_name' | 'id'>[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchRecent = useCallback(async () => {
    const { data } = await supabase
      .from('patients')
      .select('id, patient_external_id, full_name')
      .order('last_updated', { ascending: false })
      .limit(5);
    if (data) setRecentPatients(data);
  }, []);

  useEffect(() => { fetchRecent(); }, [fetchRecent]);

  const lookupById = useCallback(async (externalId: string) => {
    if (!externalId.trim()) {
      setIsExisting(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_external_id', externalId.trim())
      .maybeSingle();
    setLoading(false);
    if (data) {
      setPatient({
        id: data.id,
        patient_external_id: data.patient_external_id,
        full_name: data.full_name || '',
        age: (data as any).age || '',
        phone: data.phone || '',
        email: data.email || '',
        parity: (data as any).parity || '',
        obstetrical_history: (data as any).obstetrical_history || '',
        presenting_complaint: (data as any).presenting_complaint || '',
        past_history: (data as any).past_history || '',
        examination: (data as any).examination || '',
        blood_pressure: (data as any).blood_pressure || '',
        pulse: (data as any).pulse || '',
        temperature: (data as any).temperature || '',
        weight: (data as any).weight || '',
        height: (data as any).height || '',
        odema: (data as any).odema || '',
        abdominal_examination: (data as any).abdominal_examination || '',
        pelvic_examination: (data as any).pelvic_examination || '',
        ultrasound: (data as any).ultrasound || '',
        blood_group: (data as any).blood_group || '',
        haemoglobin: (data as any).haemoglobin || '',
        hepatitis_b: (data as any).hepatitis_b || '',
        hepatitis_c: (data as any).hepatitis_c || '',
        hiv: (data as any).hiv || '',
        rbs: (data as any).rbs || '',
        investigation_others: (data as any).investigation_others || '',
        treatment: (data as any).treatment || '',
        plan: (data as any).plan || '',
        next_visit: (data as any).next_visit || '',
        outcome: (data as any).outcome || '',
        last_updated: data.last_updated,
      });
      setIsExisting(true);
      toast.success('Patient Data Found', { description: `Loaded record for ${data.full_name || externalId}` });
    } else {
      setIsExisting(false);
    }
  }, []);

  const debouncedLookup = useCallback((externalId: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => lookupById(externalId), 400);
  }, [lookupById]);

  const searchPatients = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    const { data } = await supabase
      .from('patients')
      .select('id, patient_external_id, full_name')
      .or(`patient_external_id.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);
    return data || [];
  }, []);

  const savePatient = useCallback(async (addVisitFn?: (pid: string) => Promise<void>) => {
    if (!patient.patient_external_id.trim()) {
      toast.error('Patient ID is required');
      return;
    }
    if (!patient.full_name.trim()) {
      toast.error('Full Name is required');
      return;
    }
    if (patient.phone && !/^\+?[\d\s\-().]{7,20}$/.test(patient.phone)) {
      toast.error('Invalid phone number format');
      return;
    }

    setLoading(true);
    const { data: upserted, error } = await supabase
      .from('patients')
      .upsert({
        patient_external_id: patient.patient_external_id.trim(),
        full_name: patient.full_name.trim(),
        age: patient.age,
        phone: patient.phone,
        email: patient.email,
        parity: patient.parity,
        obstetrical_history: patient.obstetrical_history,
        presenting_complaint: patient.presenting_complaint,
        past_history: patient.past_history,
        examination: patient.examination,
        blood_pressure: patient.blood_pressure,
        pulse: patient.pulse,
        temperature: patient.temperature,
        weight: patient.weight,
        height: patient.height,
        odema: patient.odema,
        abdominal_examination: patient.abdominal_examination,
        pelvic_examination: patient.pelvic_examination,
        ultrasound: patient.ultrasound,
        blood_group: patient.blood_group,
        haemoglobin: patient.haemoglobin,
        hepatitis_b: patient.hepatitis_b,
        hepatitis_c: patient.hepatitis_c,
        hiv: patient.hiv,
        rbs: patient.rbs,
        investigation_others: patient.investigation_others,
        treatment: patient.treatment,
        plan: patient.plan,
        next_visit: patient.next_visit,
        outcome: patient.outcome,
      }, { onConflict: 'patient_external_id' })
      .select('id')
      .single();
    setLoading(false);

    if (error) {
      toast.error('Failed to save', { description: error.message });
    } else {
      const patientDbId = upserted?.id || patient.id;
      // Auto-record a visit
      if (patientDbId && addVisitFn) {
        await addVisitFn(patientDbId);
      } else if (patientDbId) {
        await supabase.from('visits').insert({
          patient_id: patientDbId,
          visit_type: isExisting ? 'returning' : 'new',
          notes: '',
          diagnosis: '',
          treatment: '',
        });
      }
      toast.success(isExisting ? 'Record & Visit Updated' : 'New Patient & Visit Created');
      setIsExisting(true);
      if (patientDbId && !patient.id) {
        setPatient(p => ({ ...p, id: patientDbId }));
      }
      fetchRecent();
    }
  }, [patient, isExisting, fetchRecent]);

  const deletePatient = useCallback(async () => {
    if (!patient.id) return;
    setLoading(true);
    // Delete visits first (cascade safety)
    await supabase.from('visits').delete().eq('patient_id', patient.id);
    const { error } = await supabase.from('patients').delete().eq('id', patient.id);
    setLoading(false);
    if (error) {
      toast.error('Failed to delete patient', { description: error.message });
    } else {
      toast.success('Patient deleted');
      setPatient({ ...emptyPatient });
      setIsExisting(false);
      fetchRecent();
    }
  }, [patient.id, fetchRecent]);

  const clearForm = useCallback(() => {
    setPatient({ ...emptyPatient });
    setIsExisting(false);
  }, []);

  const loadPatient = useCallback(async (externalId: string) => {
    await lookupById(externalId);
  }, [lookupById]);

  return {
    patient,
    setPatient,
    isExisting,
    loading,
    recentPatients,
    debouncedLookup,
    searchPatients,
    savePatient,
    deletePatient,
    clearForm,
    loadPatient,
  };
}
