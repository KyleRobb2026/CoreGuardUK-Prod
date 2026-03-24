import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Spinner, EmptyState, Input } from '../components/shared';
import { ClipboardList, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ACTION_COLORS = {
  LOGIN_SUCCESS: 'text-[#22C55E]',
  LOGIN_FAILED: 'text-[#EF4444]',
  OFFICER_LOGIN_SUCCESS: 'text-[#22C55E]',
  OFFICER_LOGIN_FAILED: 'text-[#EF4444]',
  LOGIN_DENIED_LICENCE_EXPIRED: 'text-[#EF4444]',
  PERSONNEL_CREATED: 'text-[#3B82F6]',
  SITE_CREATED: 'text-[#3B82F6]',
  SHIFT_CREATED: 'text-[#3B82F6]',
  LOG_CREATED: 'text-[#a1a0a0]',
  FORM_SUBMITTED: 'text-[#f7b91c]',
  CHECK_IN: 'text-[#22C55E]',
  CHECK_CALL_MISSED: 'text-[#EF4444]',
  COMPLIANCE_ALERT: 'text-[#F59E0B]',
};

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function AuditLogPage() {
  const api = useApi();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/api/audit-logs?limit=200');
      setLogs(res.data);
    } catch { toast.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  const filtered = search
    ? logs.filter(l => `${l.action} ${l.actor_id} ${l.actor_type} ${JSON.stringify(l.metadata)}`.toLowerCase().includes(search.toLowerCase()))
    : logs;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="audit-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22C55E] rounded-full status-dot-live" />
          <span className="text-xs text-[#a1a0a0] uppercase tracking-wider">Immutable audit trail</span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
          <input type="text" placeholder="Filter events..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-[#171717] border border-[#2e2e2e] rounded-lg h-9 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none focus:border-[#f7b91c] w-56" />
        </div>
      </div>

      <Card data-testid="audit-log-table">
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <span className="text-xs text-[#a1a0a0] font-mono">{filtered.length} entries</span>
        </CardHeader>
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} message="No audit entries" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Timestamp', 'Action', 'Actor Type', 'Actor ID', 'Details'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#a1a0a0] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#2d2d2d]/20 transition-colors" data-testid={`audit-row-${log.id}`}>
                    <td className="px-4 py-3 font-mono text-xs text-[#676767] whitespace-nowrap">
                      {log.created_at ? format(new Date(log.created_at), 'dd/MM/yy HH:mm:ss') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs font-medium ${ACTION_COLORS[log.action] || 'text-[#a1a0a0]'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#a1a0a0] capitalize">{log.actor_type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#676767]">
                      {log.actor_id?.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-xs text-[#676767]">
                      {log.metadata && Object.keys(log.metadata).length > 0
                        ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
