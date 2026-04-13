import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, ChevronDown, ChevronUp, FileText, Clock } from 'lucide-react';
import type { Visit } from '@/hooks/useVisits';

interface Props {
  visits: Visit[];
  onAddVisit: (visit: Partial<Visit>) => void;
  loading: boolean;
  patientId?: string;
  nextVisit?: string;
}

export function VisitHistoryPanel({ visits, onAddVisit, loading, patientId, nextVisit }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newVisit, setNewVisit] = useState({ notes: '', diagnosis: '', treatment: '' });

  const handleAdd = () => {
    onAddVisit({ ...newVisit, visit_type: 'returning' });
    setNewVisit({ notes: '', diagnosis: '', treatment: '' });
    setShowForm(false);
  };

  if (!patientId) return null;

  const isReturning = visits.length > 0;

  return (
    <div className="space-y-4">
      {/* Previous visit dates summary for returning patients */}
      {isReturning && (
        <Card className="border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--success))]">
              <Clock className="h-4 w-4" />
              Returning Patient — Previous Visit Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {visits.map((v) => (
                <span
                  key={v.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20"
                >
                  <Calendar className="h-3 w-3" />
                  {new Date(v.visit_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  <span className="text-[hsl(var(--success))]/60">
                    ({v.visit_type === 'new' ? 'New' : 'Return'})
                  </span>
                </span>
              ))}
            </div>
            {nextVisit && (
              <div className="mt-3 pt-3 border-t border-[hsl(var(--success))]/20 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Next scheduled visit:</span>
                <span className="font-semibold text-primary">
                  {new Date(nextVisit.split('|')[0] + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {nextVisit.includes('|section') && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 font-medium">Section</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full visit history */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Visit History ({visits.length})
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Visit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showForm && (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-accent/30">
              <div className="space-y-1.5">
                <Label className="text-xs">Notes</Label>
                <Textarea rows={2} value={newVisit.notes} onChange={e => setNewVisit(p => ({ ...p, notes: e.target.value }))} placeholder="Visit notes..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Diagnosis</Label>
                  <Input value={newVisit.diagnosis} onChange={e => setNewVisit(p => ({ ...p, diagnosis: e.target.value }))} placeholder="Diagnosis..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Treatment</Label>
                  <Input value={newVisit.treatment} onChange={e => setNewVisit(p => ({ ...p, treatment: e.target.value }))} placeholder="Treatment..." />
                </div>
              </div>
              <Button size="sm" onClick={handleAdd} disabled={loading}>Save Visit</Button>
            </div>
          )}

          {visits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No previous visits recorded</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {visits.map(v => (
                <div key={v.id} className="border border-border rounded-md overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent/50 transition-colors"
                    onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(v.visit_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        v.visit_type === 'new'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]'
                      }`}>
                        {v.visit_type === 'new' ? 'New' : 'Returning'}
                      </span>
                    </div>
                    {expandedId === v.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {expandedId === v.id && (
                    <div className="px-3 pb-3 space-y-1 text-sm border-t border-border pt-2">
                      {v.notes && <p><span className="font-medium text-muted-foreground">Notes:</span> {v.notes}</p>}
                      {v.diagnosis && <p><span className="font-medium text-muted-foreground">Diagnosis:</span> {v.diagnosis}</p>}
                      {v.treatment && <p><span className="font-medium text-muted-foreground">Treatment:</span> {v.treatment}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
