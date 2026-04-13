import { Activity } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { QuickStats } from '@/components/QuickStats';
import { PatientAnalyticsChart } from '@/components/PatientAnalyticsChart';
import { NavLink } from '@/components/NavLink';

const Dashboard = () => {
  const { dailyCounts, stats, period, setPeriod } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Dashboard</h1>
        </div>
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
      </header>
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <QuickStats {...stats} />
        <PatientAnalyticsChart data={dailyCounts} period={period} onPeriodChange={setPeriod} />
      </main>
    </div>
  );
};

export default Dashboard;
