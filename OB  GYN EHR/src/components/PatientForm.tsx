import { useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, FilePlus, Lock, Unlock, Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Patient } from '@/hooks/usePatients';

// Ordered list of field IDs — Enter moves focus to the next one
const FIELD_ORDER = [
  'patientId', 'fullName', 'age', 'phone', 'email',
  'parity',
  'obstetrical_history', 'presenting_complaint', 'past_history',
  'blood_pressure', 'pulse', 'temperature', 'weight', 'height', 'odema',
  'abdominal_examination', 'pelvic_examination',
  'ultrasound',
  'blood_group', 'haemoglobin', 'hepatitis_b', 'hepatitis_c', 'hiv', 'rbs', 'investigation_others',
  'treatment', 'plan',
  'next_visit',
  'outcome',
];

interface Props {
  patient: Patient;
  onChange: (p: Patient) => void;
  onIdChange: (id: string) => void;
  onSave: () => void;
  onClear: () => void;
  onDelete: () => void;
  isExisting: boolean;
  loading: boolean;
  editMode: boolean;
  onToggleEdit: (val: boolean) => void;
}

export function PatientForm({
  patient, onChange, onIdChange, onSave, onClear, onDelete,
  isExisting, loading, editMode, onToggleEdit,
}: Props) {
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!patient.patient_external_id && idRef.current) {
      idRef.current.focus();
    }
  }, [patient.patient_external_id]);

  const update = (field: keyof Patient, value: string) => {
    onChange({ ...patient, [field]: value });
    if (field === 'patient_external_id') onIdChange(value);
  };

  // Helpers to parse the combined next_visit field "YYYY-MM-DD|type"
  const nextVisitDate = patient.next_visit ? patient.next_visit.split('|')[0] : '';
  const nextVisitType = patient.next_visit?.includes('|section') ? 'section' : 'simple';

  const updateNextVisit = (date: string, type: string) => {
    const combined = date ? (type === 'section' ? `${date}|section` : date) : '';
    onChange({ ...patient, next_visit: combined });
  };

  // Tab advances to the next field in FIELD_ORDER
  // Backspace/Delete on an empty field moves focus to the previous field
  const handleEnter = useCallback((e: React.KeyboardEvent, currentId: string) => {
    const idx = FIELD_ORDER.indexOf(currentId);
    if (idx === -1) return;

    if (e.key === 'Tab' && !e.shiftKey) {
      for (let i = idx + 1; i < FIELD_ORDER.length; i++) {
        const el = document.getElementById(FIELD_ORDER[i]) as HTMLElement | null;
        if (el && !el.hasAttribute('disabled')) {
          e.preventDefault();
          el.focus();
          return;
        }
      }
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      if (target.value === '') {
        e.preventDefault();
        for (let i = idx - 1; i >= 0; i--) {
          const el = document.getElementById(FIELD_ORDER[i]) as HTMLElement | null;
          if (el && !el.hasAttribute('disabled')) {
            el.focus();
            return;
          }
        }
      }
    }
  }, []);

  const fieldsDisabled = isExisting && !editMode;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onClear} variant="outline" size="sm">
            <FilePlus className="h-4 w-4 mr-1" /> New Patient
          </Button>
          {isExisting && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete Patient
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Patient Record?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{patient.full_name || patient.patient_external_id}</strong> and all their visit history. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isExisting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {editMode ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              <span>Edit</span>
              <Switch checked={editMode} onCheckedChange={onToggleEdit} />
            </div>
          )}
          <Button onClick={onSave} disabled={loading || fieldsDisabled} size="sm">
            {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save Record & Visit
          </Button>
        </div>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="patientId">Patient ID *</Label>
            <Input id="patientId" ref={idRef} value={patient.patient_external_id}
              onChange={(e) => update('patient_external_id', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'patientId')}
              placeholder="e.g. PT-2024-001" disabled={isExisting} className={isExisting ? 'bg-muted' : ''} />
            {loading && <p className="text-xs text-primary animate-pulse">Searching...</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" value={patient.full_name}
              onChange={(e) => update('full_name', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'fullName')}
              placeholder="John Doe" disabled={fieldsDisabled} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input id="age" value={patient.age}
              onChange={(e) => update('age', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'age')}
              placeholder="e.g. 32" disabled={fieldsDisabled} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={patient.phone}
              onChange={(e) => update('phone', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'phone')}
              placeholder="+1 (555) 123-4567" disabled={fieldsDisabled} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={patient.email}
              onChange={(e) => update('email', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'email')}
              placeholder="patient@email.com" disabled={fieldsDisabled} />
          </div>
        </CardContent>
      </Card>

      {/* Parity */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Parity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="parity">Parity Details</Label>
            <Input id="parity" value={patient.parity}
              onChange={(e) => update('parity', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'parity')}
              placeholder="e.g. G3P2A1" disabled={fieldsDisabled} />
          </div>
        </CardContent>
      </Card>

      {/* Medical Notes */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Medical Notes</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="obstetrical_history" className="font-semibold">1. Obstetrical History</Label>
            <Textarea id="obstetrical_history" value={patient.obstetrical_history}
              onChange={(e) => update('obstetrical_history', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'obstetrical_history')}
              placeholder="Enter obstetrical history..." rows={4} disabled={fieldsDisabled} className="resize-y" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="presenting_complaint" className="font-semibold">2. Presenting Complaint</Label>
            <Textarea id="presenting_complaint" value={patient.presenting_complaint}
              onChange={(e) => update('presenting_complaint', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'presenting_complaint')}
              placeholder="Enter presenting complaint..." rows={3} disabled={fieldsDisabled} className="resize-y" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="past_history" className="font-semibold">3. Past History</Label>
            <Textarea id="past_history" value={patient.past_history}
              onChange={(e) => update('past_history', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'past_history')}
              placeholder="Enter past history..." rows={3} disabled={fieldsDisabled} className="resize-y" />
          </div>
        </CardContent>
      </Card>

      {/* Examination */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Examination</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['blood_pressure', '1. Blood Pressure', 'Enter blood pressure readings...'],
              ['pulse', '2. Pulse', 'Enter pulse details...'],
              ['temperature', '3. Temperature', 'Enter temperature readings...'],
              ['weight', '4. Weight', 'Enter weight...'],
              ['height', '5. Height', 'Enter height...'],
              ['odema', '6. Odema', 'Enter odema findings...'],
            ] as [keyof Patient, string, string][]).map(([field, label, placeholder]) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={field} className="font-semibold">{label}</Label>
                <Textarea id={field} value={patient[field] as string}
                  onChange={(e) => update(field, e.target.value)}
                  onKeyDown={(e) => handleEnter(e, field)}
                  placeholder={placeholder} rows={2} disabled={fieldsDisabled} className="resize-y" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="abdominal_examination" className="font-semibold">7. Abdominal Examination</Label>
            <Textarea id="abdominal_examination" value={patient.abdominal_examination}
              onChange={(e) => update('abdominal_examination', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'abdominal_examination')}
              placeholder="Enter abdominal examination findings..." rows={3} disabled={fieldsDisabled} className="resize-y" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pelvic_examination" className="font-semibold">8. Pelvic Examination</Label>
            <Textarea id="pelvic_examination" value={patient.pelvic_examination}
              onChange={(e) => update('pelvic_examination', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'pelvic_examination')}
              placeholder="Enter pelvic examination findings..." rows={3} disabled={fieldsDisabled} className="resize-y" />
          </div>
        </CardContent>
      </Card>

      {/* Ultrasound */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Ultrasound</CardTitle></CardHeader>
        <CardContent>
          <Textarea id="ultrasound" value={patient.ultrasound}
            onChange={(e) => update('ultrasound', e.target.value)}
            onKeyDown={(e) => handleEnter(e, 'ultrasound')}
            placeholder="Enter ultrasound findings..." rows={4} disabled={fieldsDisabled} className="resize-y" />
        </CardContent>
      </Card>

      {/* Investigation */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Investigation</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['blood_group', '1. Blood Group', 'Enter blood group...'],
              ['haemoglobin', '2. Haemoglobin', 'Enter haemoglobin level...'],
              ['hepatitis_b', '3. Hepatitis B', 'Enter Hepatitis B status...'],
              ['hepatitis_c', '4. Hepatitis C', 'Enter Hepatitis C status...'],
              ['hiv', '5. HIV 1+2', 'Enter HIV 1+2 status...'],
              ['rbs', '6. RBS', 'Enter RBS value...'],
            ] as [keyof Patient, string, string][]).map(([field, label, placeholder]) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={field} className="font-semibold">{label}</Label>
                <Textarea id={field} value={patient[field] as string}
                  onChange={(e) => update(field, e.target.value)}
                  onKeyDown={(e) => handleEnter(e, field)}
                  placeholder={placeholder} rows={2} disabled={fieldsDisabled} className="resize-y" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="investigation_others" className="font-semibold">7. Others</Label>
            <Textarea id="investigation_others" value={patient.investigation_others}
              onChange={(e) => update('investigation_others', e.target.value)}
              onKeyDown={(e) => handleEnter(e, 'investigation_others')}
              placeholder="Enter other investigation details..." rows={3} disabled={fieldsDisabled} className="resize-y" />
          </div>
        </CardContent>
      </Card>

      {/* Treatment */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Treatment</CardTitle></CardHeader>
        <CardContent>
          <Textarea id="treatment" value={patient.treatment}
            onChange={(e) => update('treatment', e.target.value)}
            onKeyDown={(e) => handleEnter(e, 'treatment')}
            placeholder="Enter treatment details..." rows={4} disabled={fieldsDisabled} className="resize-y" />
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Plan</CardTitle></CardHeader>
        <CardContent>
          <Textarea id="plan" value={patient.plan}
            onChange={(e) => update('plan', e.target.value)}
            onKeyDown={(e) => handleEnter(e, 'plan')}
            placeholder="Enter plan..." rows={4} disabled={fieldsDisabled} className="resize-y" />
        </CardContent>
      </Card>

      {/* Next Visit */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Next Visit</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="next_visit">Appointment Date</Label>
              <Input id="next_visit" type="date"
                value={nextVisitDate}
                onChange={(e) => updateNextVisit(e.target.value, nextVisitType)}
                onKeyDown={(e) => handleEnter(e, 'next_visit')}
                disabled={fieldsDisabled} className="w-48" />
              {nextVisitDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(nextVisitDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
            {/* Visit type selector */}
            <div className="flex items-center gap-3 pb-0.5">
              <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md border text-sm font-medium transition-colors
                ${nextVisitType === 'simple'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent'}
                ${fieldsDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="radio" name="next_visit_type" value="simple"
                  checked={nextVisitType === 'simple'}
                  onChange={() => updateNextVisit(nextVisitDate, 'simple')}
                  disabled={fieldsDisabled} className="sr-only" />
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center
                  ${nextVisitType === 'simple' ? 'border-primary' : 'border-muted-foreground'}`}>
                  {nextVisitType === 'simple' && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </span>
                Simple Visit
              </label>
              <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md border text-sm font-medium transition-colors
                ${nextVisitType === 'section'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-600'
                  : 'border-border text-muted-foreground hover:bg-accent'}
                ${fieldsDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="radio" name="next_visit_type" value="section"
                  checked={nextVisitType === 'section'}
                  onChange={() => updateNextVisit(nextVisitDate, 'section')}
                  disabled={fieldsDisabled} className="sr-only" />
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center
                  ${nextVisitType === 'section' ? 'border-orange-500' : 'border-muted-foreground'}`}>
                  {nextVisitType === 'section' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </span>
                Section
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outcome */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Outcome</CardTitle></CardHeader>
        <CardContent>
          <Textarea id="outcome" value={patient.outcome}
            onChange={(e) => update('outcome', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab' && !e.shiftKey && !fieldsDisabled) {
                e.preventDefault();
                onSave();
              }
            }}
            placeholder="Enter outcome..." rows={4} disabled={fieldsDisabled} className="resize-y" />
        </CardContent>
      </Card>

      {isExisting && patient.last_updated && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(patient.last_updated).toLocaleString()}
        </p>
      )}
    </div>
  );
}
