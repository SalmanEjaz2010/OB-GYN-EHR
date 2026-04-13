import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useVisits } from '@/hooks/useVisits';
import { PatientHistorySidebar } from '@/components/PatientHistorySidebar';
import { GlobalSearchBar } from '@/components/GlobalSearchBar';
import { PatientForm } from '@/components/PatientForm';
import { VisitHistoryPanel } from '@/components/VisitHistoryPanel';
import { NavLink } from '@/components/NavLink';

const Index = () => {
  const {
    patient, setPatient, isExisting, loading,
    recentPatients, debouncedLookup, searchPatients,
    savePatient, deletePatient, clearForm, loadPatient,
  } = usePatients();

  const { visits, fetchVisits, addVisit, loading: visitsLoading } = useVisits();
  const [editMode, setEditMode] = useState(false);

  // Fetch visits when patient changes
  useEffect(() => {
    if (patient.id) fetchVisits(patient.id);
  }, [patient.id, fetchVisits]);

  const handleSelect = (externalId: string) => {
    setEditMode(false);
    loadPatient(externalId);
  };

  const handleSave = async () => {
    await savePatient(async (pid: string) => {
      await addVisit(pid, { visit_type: isExisting ? 'returning' : 'new' });
      fetchVisits(pid);
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <PatientHistorySidebar
        recentPatients={recentPatients}
        onSelect={handleSelect}
        activeId={patient.patient_external_id}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-foreground">Patient Records</h1>
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearchBar onSearch={searchPatients} onSelect={handleSelect} />
            <nav className="flex gap-1">
              <NavLink to="/" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">
                Records
              </NavLink>
              <NavLink to="/dashboard" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">
                Dashboard
              </NavLink>
              <NavLink to="/calendar" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">
                Calendar
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overscroll-contain p-6 pb-12">
          {/* Patient status badge */}
          {patient.patient_external_id && (
            <div className="max-w-3xl mx-auto mb-4">
              {isExisting ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                  <span className="text-sm font-medium text-[hsl(var(--success))]">Returning Patient</span>
                  <span className="text-xs text-muted-foreground ml-1">— {visits.length} previous visit{visits.length !== 1 ? 's' : ''}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-primary">New Patient</span>
                  <span className="text-xs text-muted-foreground ml-1">— No existing record found</span>
                </div>
              )}
            </div>
          )}

          <PatientForm
            patient={patient}
            onChange={setPatient}
            onIdChange={debouncedLookup}
            onSave={handleSave}
            onDelete={() => { deletePatient(); setEditMode(false); }}
            onClear={() => { clearForm(); setEditMode(false); }}
            isExisting={isExisting}
            loading={loading}
            editMode={editMode}
            onToggleEdit={setEditMode}
          />

          {/* Visit History below form for existing patients */}
          {isExisting && patient.id && (
            <div className="max-w-3xl mx-auto mt-6">
              <VisitHistoryPanel
                visits={visits}
                onAddVisit={(visit) => { if (patient.id) addVisit(patient.id, visit); }}
                loading={visitsLoading}
                patientId={patient.id}
                nextVisit={patient.next_visit || undefined}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
