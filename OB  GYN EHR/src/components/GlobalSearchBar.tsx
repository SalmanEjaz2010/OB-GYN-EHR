import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchResult {
  id?: string;
  patient_external_id: string;
  full_name: string;
}

interface Props {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (externalId: string) => void;
}

export function GlobalSearchBar({ onSearch, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      const r = await onSearch(val);
      setResults(r);
      setOpen(r.length > 0);
    }, 300);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or ID..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 bg-card"
      />
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg overflow-hidden">
          {results.map((r) => (
            <button
              key={r.patient_external_id}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => { onSelect(r.patient_external_id); setQuery(''); setOpen(false); }}
            >
              <span className="font-medium">{r.full_name || 'Unnamed'}</span>
              <span className="text-muted-foreground ml-2">({r.patient_external_id})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
