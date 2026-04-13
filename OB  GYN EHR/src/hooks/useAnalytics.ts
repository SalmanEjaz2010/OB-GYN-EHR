import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyCount {
  date: string;
  total: number;
  new_patients: number;
  returning: number;
}

interface QuickStats {
  totalPatients: number;
  todayVisits: number;
  newToday: number;
  returningToday: number;
}

export function useAnalytics() {
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [stats, setStats] = useState<QuickStats>({
    totalPatients: 0, todayVisits: 0, newToday: 0, returningToday: 0,
  });
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);

    // Total patients
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // Visits in range
    const daysBack = period === 'week' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: visitData } = await supabase
      .from('visits')
      .select('visit_date, visit_type')
      .gte('visit_date', startDate.toISOString())
      .order('visit_date', { ascending: true });

    // Today's stats
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayVisits = (visitData || []).filter(v => v.visit_date.slice(0, 10) === todayStr);

    setStats({
      totalPatients: totalPatients || 0,
      todayVisits: todayVisits.length,
      newToday: todayVisits.filter(v => v.visit_type === 'new').length,
      returningToday: todayVisits.filter(v => v.visit_type === 'returning').length,
    });

    // Group by day
    const grouped: Record<string, { total: number; new_patients: number; returning: number }> = {};
    for (let i = 0; i < daysBack; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (daysBack - 1 - i));
      const key = d.toISOString().slice(0, 10);
      grouped[key] = { total: 0, new_patients: 0, returning: 0 };
    }
    (visitData || []).forEach(v => {
      const key = v.visit_date.slice(0, 10);
      if (grouped[key]) {
        grouped[key].total++;
        if (v.visit_type === 'new') grouped[key].new_patients++;
        else grouped[key].returning++;
      }
    });

    setDailyCounts(Object.entries(grouped).map(([date, c]) => ({ date, ...c })));
    setLoading(false);
  }, [period]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return { dailyCounts, stats, loading, period, setPeriod, refresh: fetchAnalytics };
}
