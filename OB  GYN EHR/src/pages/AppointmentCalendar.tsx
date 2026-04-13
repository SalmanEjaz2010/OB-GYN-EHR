import { useState, useEffect, useCallback } from 'react';
import { Activity, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarEvent {
  date: string;
  patientName: string;
  patientId: string;
  type: 'visit' | 'next_visit';
  visitSubtype?: 'simple' | 'section';
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AppointmentCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    // Fetch all visits with patient info
    const { data: visits } = await supabase
      .from('visits')
      .select('visit_date, patient_id, patients(full_name, patient_external_id)');

    // Fetch all patients with a next_visit date
    const { data: patients } = await supabase
      .from('patients')
      .select('id, full_name, patient_external_id, next_visit')
      .not('next_visit', 'is', null)
      .neq('next_visit', '');

    const evts: CalendarEvent[] = [];

    (visits || []).forEach((v: any) => {
      const dateStr = v.visit_date?.slice(0, 10);
      if (!dateStr) return;
      evts.push({
        date: dateStr,
        patientName: v.patients?.full_name || v.patients?.patient_external_id || 'Unknown',
        patientId: v.patients?.patient_external_id || v.patient_id,
        type: 'visit',
      });
    });

    (patients || []).forEach((p: any) => {
      const raw: string = p.next_visit || '';
      const dateStr = raw.split('|')[0].slice(0, 10);
      if (!dateStr) return;
      evts.push({
        date: dateStr,
        patientName: p.full_name || p.patient_external_id,
        patientId: p.patient_external_id,
        type: 'next_visit',
        visitSubtype: raw.includes('|section') ? 'section' : 'simple',
      });
    });

    setEvents(evts);
  }, []);

  // Initial fetch
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Realtime subscription — re-fetch whenever patients table changes
  useEffect(() => {
    const channel = supabase
      .channel('calendar-patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  const prevMonth = () => {
    setSelectedDate(null);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    setSelectedDate(null);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = today.toISOString().slice(0, 10);

  const eventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);
  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Appointment Calendar</h1>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">Records</NavLink>
          <NavLink to="/dashboard" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">Dashboard</NavLink>
          <NavLink to="/calendar" className="px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors" activeClassName="bg-accent font-medium">Calendar</NavLink>
        </nav>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--success))] inline-block" /> Past Visit</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Simple Visit</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" /> Section</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-accent transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-semibold">{MONTH_NAMES[month]} {year}</span>
                  <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-accent transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="min-h-[64px]" />;

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = eventsForDate(dateStr);
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`min-h-[64px] rounded-md p-1 text-left flex flex-col gap-0.5 transition-colors border
                          ${isSelected ? 'border-primary bg-primary/5' : isToday ? 'border-primary/40 bg-accent' : 'border-transparent hover:bg-accent/50'}
                        `}
                      >
                        <span className={`text-xs font-medium px-0.5 ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                        {/* Show patient names directly on the cell */}
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <span
                            key={i}
                            className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate w-full font-medium
                              ${e.type === 'visit'
                                ? 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]'
                                : e.visitSubtype === 'section'
                                  ? 'bg-orange-500/15 text-orange-600'
                                  : 'bg-primary/15 text-primary'
                              }`}
                          >
                            {e.patientName}
                          </span>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail panel */}
          <div>
            <Card>
              <CardContent className="p-4">
                {selectedDate ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold border-b border-border pb-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {selectedEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events on this day.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedEvents.map((e, i) => (
                          <div key={i} className={`rounded-md px-3 py-2 border ${
                            e.type === 'visit'
                              ? 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20'
                              : e.visitSubtype === 'section'
                                ? 'bg-orange-500/10 border-orange-500/20'
                                : 'bg-primary/10 border-primary/20'
                          }`}>
                            <p className={`font-semibold text-sm ${
                              e.type === 'visit'
                                ? 'text-[hsl(var(--success))]'
                                : e.visitSubtype === 'section'
                                  ? 'text-orange-600'
                                  : 'text-primary'
                            }`}>
                              {e.patientName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {e.type === 'visit'
                                ? 'Past Visit'
                                : e.visitSubtype === 'section'
                                  ? 'Upcoming — Section'
                                  : 'Upcoming — Simple Visit'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                    <CalendarDays className="h-8 w-8 opacity-30" />
                    <p>Click a date to see details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
