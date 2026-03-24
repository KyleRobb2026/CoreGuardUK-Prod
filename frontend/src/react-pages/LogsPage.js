import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Input, Select, Textarea, Modal, Spinner, EmptyState, StatusBadge } from '../components/shared';
import { BookOpen, Plus, Search, AlertTriangle, Compass, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TYPE_ICONS = {
  incident: AlertTriangle,
  patrol: Compass,
  note: FileText,
};

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function LogsPage() {
  const api = useApi();
  const [logs, setLogs] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ site_id: '', type: 'patrol', title: '', description: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [logsRes, sitesRes] = await Promise.all([
        api.get('/api/logs'),
        api.get('/api/sites'),
      ]);
      setLogs(logsRes.data);
      setSites(sitesRes.data);
    } catch { toast.error('Failed to load logs'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/logs', form);
      toast.success('Log entry created');
      setShowAdd(false);
      setForm({ site_id: '', type: 'patrol', title: '', description: '' });
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to create log'); }
  };

  const filtered = filterType ? logs.filter(l => l.type === filterType) : logs;

  const typeColor = { incident: 'text-[#EF4444] bg-[#EF4444]/10', patrol: 'text-[#22C55E] bg-[#22C55E]/10', note: 'text-[#3B82F6] bg-[#3B82F6]/10' };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="logs-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['', 'incident', 'patrol', 'note'].map(t => (
            <button key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${filterType === t ? 'bg-[#f7b91c] border-[#f7b91c] text-white' : 'border-[#2e2e2e] text-[#a1a0a0] hover:bg-[#2d2d2d]'}`}
              data-testid={`filter-${t || 'all'}`}
            >
              {t || 'All'}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAdd(true)} data-testid="add-log-btn"><Plus size={14} /> New Entry</Button>
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={BookOpen} message="No log entries" action={<Button onClick={() => setShowAdd(true)} size="sm"><Plus size={12} />Add Entry</Button>} /></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(log => {
            const Icon = TYPE_ICONS[log.type] || FileText;
            return (
              <Card key={log.id} className="hover:border-[#737373] transition-colors" data-testid={`log-entry-${log.id}`}>
                <div className="p-4 flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor[log.type] || 'text-[#a1a0a0] bg-[#2d2d2d]'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-medium text-white text-sm">{log.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={log.type} />
                        <span className="text-xs text-[#676767] font-mono">
                          {log.created_at ? format(new Date(log.created_at), 'dd/MM HH:mm') : ''}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#a1a0a0] line-clamp-2">{log.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#676767]">
                      {log.site && <span>{log.site.name}</span>}
                      {log.personnel && <span>· {log.personnel.first_name} {log.personnel.last_name}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Log Entry" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Select label="Entry Type *" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required data-testid="log-type-select">
            <option value="patrol">Patrol</option>
            <option value="incident">Incident</option>
            <option value="note">Note</option>
          </Select>
          <Select label="Site *" value={form.site_id} onChange={e => setForm({ ...form, site_id: e.target.value })} required data-testid="log-site-select">
            <option value="">Select Site</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Brief description of the entry" data-testid="log-title-input" />
          <Textarea label="Details *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} placeholder="Full details of the occurrence..." data-testid="log-description-input" />
          <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-2 text-xs text-[#a1a0a0]">
            This entry will be immutably logged with your identity and timestamp.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="submit-log">Save Entry</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
