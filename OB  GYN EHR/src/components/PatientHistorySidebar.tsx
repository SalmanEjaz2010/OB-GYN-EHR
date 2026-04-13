import { Clock, User } from 'lucide-react';

interface RecentPatient {
  id?: string;
  patient_external_id: string;
  full_name: string;
}

interface Props {
  recentPatients: RecentPatient[];
  onSelect: (externalId: string) => void;
  activeId?: string;
}

export function PatientHistorySidebar({ recentPatients, onSelect, activeId }: Props) {
  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Recent Patients
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {recentPatients.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No recent patients</p>
        )}
        {recentPatients.map((p) => (
          <button
            key={p.patient_external_id}
            onClick={() => onSelect(p.patient_external_id)}
            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm group ${
              activeId === p.patient_external_id
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{p.full_name || 'Unnamed'}</p>
                <p className="text-xs text-muted-foreground">ID: {p.patient_external_id}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
