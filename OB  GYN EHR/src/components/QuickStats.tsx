import { Users, UserPlus, UserCheck, Activity } from 'lucide-react';

interface Props {
  totalPatients: number;
  todayVisits: number;
  newToday: number;
  returningToday: number;
}

export function QuickStats({ totalPatients, todayVisits, newToday, returningToday }: Props) {
  const cards = [
    { label: 'Total Patients', value: totalPatients, icon: Users, color: 'text-primary' },
    { label: 'Today\'s Visits', value: todayVisits, icon: Activity, color: 'text-[hsl(var(--warning))]' },
    { label: 'New Today', value: newToday, icon: UserPlus, color: 'text-primary' },
    { label: 'Returning Today', value: returningToday, icon: UserCheck, color: 'text-[hsl(var(--success))]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <c.icon className={`h-4 w-4 ${c.color}`} />
            <span className="text-xs text-muted-foreground">{c.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
