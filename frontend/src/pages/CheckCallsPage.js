import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Select, Modal, Spinner, EmptyState, StatusBadge } from '../components/shared';
import { PhoneCall, Plus, Clock, AlertTriangle, CheckCircle, XCircle, Play, Square } from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export default function CheckCallsPage() {
  const api = useApi();
  const [checkCalls, setCheckCalls] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ shift_id: '', personnel_id: '', site_id: '', interval_minutes: 30 });
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchAll(); }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [ccRes, shiftsRes, personnelRes, sitesRes] = await Promise.all([
        api.get('/api/check-calls'),
        api.get('/api/shifts'),
        api.get('/api/personnel'),
        api.get('/api/sites'),
      ]);
      setCheckCalls(ccRes.data);
      setShifts(shiftsRes.data.filter(s => s.status === 'active' || s.status === 'scheduled'));
      setPersonnel(personnelRes.data);
      setSites(sitesRes.data);
    } catch { toast.error('Failed to load check calls'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/check-calls', { ...form, interval_minutes: parseInt(form.interval_minutes) });
      toast.success('Check call monitoring started');
      setShowCreate(false);
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to start check call'); }
  };

  const handleCheckIn = async (ccId) => {
    try {
      await api.put(`/api/check-calls/${ccId}/check-in`);
      toast.success('Check-in recorded');
      fetchAll();
    } catch { toast.error('Check-in failed'); }
  };

  const handleComplete = async (ccId) => {
    try {
      await api.put(`/api/check-calls/${ccId}/complete`);
      toast.success('Check call completed');
      fetchAll();
    } catch { toast.error('Failed to complete'); }
  };

  const getTimeStatus = (cc) => {
    if (!cc.next_due_at || cc.status !== 'active') return null;
    try {
      const due = new Date(cc.next_due_at);
      const diffMs = due - now;
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      if (diffMs < 0) return { label: `OVERDUE ${Math.abs(diffMins)}m`, color: 'text-[#EF4444]', urgent: true };
      if (diffMins < 5) return { label: `${diffMins}m ${Math.abs(diffSecs)}s`, color: 'text-[#F59E0B]', urgent: true };
      return { label: `${diffMins}m`, color: 'text-[#22C55E]', urgent: false };
    } catch { return null; }
  };

  const active = checkCalls.filter(cc => cc.status === 'active');
  const missed = checkCalls.filter(cc => cc.status === 'missed');
  const completed = checkCalls.filter(cc => cc.status === 'completed');

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="check-calls-page">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Active</div>
          <div className="text-2xl font-bold text-[#22C55E] mt-1">{active.length}</div>
        </Card>
        <Card className={`p-3 ${missed.length > 0 ? 'border-[#EF4444]/40' : ''}`}>
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Missed</div>
          <div className={`text-2xl font-bold mt-1 ${missed.length > 0 ? 'text-[#EF4444]' : 'text-white'}`}>{missed.length}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Completed Today</div>
          <div className="text-2xl font-bold text-white mt-1">{completed.length}</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white uppercase">Live Monitoring</h3>
        <Button onClick={() => setShowCreate(true)} data-testid="start-check-call-btn">
          <Play size={14} /> Start Check Call
        </Button>
      </div>

      {/* Active check calls - live timers */}
      {active.length === 0 && missed.length === 0 ? (
        <Card><EmptyState icon={PhoneCall} message="No active check calls" action={<Button onClick={() => setShowCreate(true)} size="sm"><Plus size={12} />Start First</Button>} /></Card>
      ) : (
        <div className="space-y-3">
          {[...missed, ...active].map(cc => {
            const timeStatus = getTimeStatus(cc);
            return (
              <Card key={cc.id} className={`${cc.status === 'missed' ? 'border-[#EF4444]/40 bg-[#EF4444]/5' : timeStatus?.urgent ? 'border-[#F59E0B]/40' : ''}`} data-testid={`check-call-${cc.id}`}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cc.status === 'missed' ? 'bg-[#EF4444]/20' : 'bg-[#22C55E]/20'}`}>
                      {cc.status === 'missed' ? (
                        <XCircle size={20} className="text-[#EF4444]" />
                      ) : (
                        <PhoneCall size={20} className="text-[#22C55E]" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {cc.personnel?.first_name} {cc.personnel?.last_name}
                      </div>
                      <div className="text-xs text-[#a1a0a0]">
                        {cc.site?.name} · Every {cc.interval_minutes}min · {cc.check_in_count || 0} check-ins
                      </div>
                      <div className="text-xs text-[#676767] font-mono">
                        Last: {cc.last_check_in ? format(new Date(cc.last_check_in), 'HH:mm:ss') : 'Never'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {timeStatus && (
                      <div className="text-right">
                        <div className="text-xs text-[#a1a0a0] mb-0.5">Next due</div>
                        <div className={`font-mono text-sm font-bold ${timeStatus.color}`}>
                          {timeStatus.label}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {cc.status === 'active' && (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleCheckIn(cc.id)} data-testid={`check-in-btn-${cc.id}`}>
                            <CheckCircle size={12} /> Check In
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleComplete(cc.id)} data-testid={`complete-cc-${cc.id}`}>
                            <Square size={12} /> End
                          </Button>
                        </>
                      )}
                      {cc.status === 'missed' && (
                        <StatusBadge status="missed" label="MISSED" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Check Calls</CardTitle>
            <span className="text-xs text-[#a1a0a0] font-mono">{completed.length} records</span>
          </CardHeader>
          <div className="divide-y divide-[#2e2e2e]">
            {completed.slice(0, 10).map(cc => (
              <div key={cc.id} className="px-4 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-white">{cc.personnel?.first_name} {cc.personnel?.last_name}</span>
                  <span className="text-[#676767] mx-2">·</span>
                  <span className="text-[#a1a0a0]">{cc.site?.name}</span>
                  <span className="text-[#676767] mx-2">·</span>
                  <span className="text-xs text-[#676767] font-mono">{cc.check_in_count} check-ins</span>
                </div>
                <StatusBadge status="completed" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Start Check Call Monitoring">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Select label="Officer *" value={form.personnel_id} onChange={e => setForm({ ...form, personnel_id: e.target.value })} required data-testid="cc-personnel-select">
            <option value="">Select Officer</option>
            {personnel.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </Select>
          <Select label="Site *" value={form.site_id} onChange={e => setForm({ ...form, site_id: e.target.value })} required data-testid="cc-site-select">
            <option value="">Select Site</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Select label="Active Shift" value={form.shift_id} onChange={e => setForm({ ...form, shift_id: e.target.value })} data-testid="cc-shift-select">
            <option value="">No shift linked</option>
            {shifts.map(s => <option key={s.id} value={s.id}>{s.personnel?.first_name} at {s.site?.name}</option>)}
          </Select>
          <Select label="Check-in Interval" value={form.interval_minutes} onChange={e => setForm({ ...form, interval_minutes: e.target.value })} data-testid="cc-interval-select">
            {[15, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>Every {m} minutes</option>)}
          </Select>
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-3 text-xs text-[#F59E0B]">
            If the officer misses a check-in, an alert will be raised and the event logged.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCreate(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="start-monitoring-btn"><Play size={14} /> Start Monitoring</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
