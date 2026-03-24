import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Select, Input, Textarea, Modal, Spinner, EmptyState, StatusBadge } from '../components/shared';
import { PhoneCall, Plus, CheckCircle, XCircle, Square, Play } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function OfficerCheckCallPage() {
  const api = useApi();
  const [checkCalls, setCheckCalls] = useState([]);
  const [sites, setSites] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ shift_id: '', site_id: '', interval_minutes: 30 });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [ccRes, sitesRes, shiftsRes] = await Promise.all([
        api.get('/api/check-calls'),
        api.get('/api/sites'),
        api.get('/api/shifts'),
      ]);
      setCheckCalls(ccRes.data);
      setSites(sitesRes.data);
      setShifts(shiftsRes.data);
    } catch {} finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/api/auth/me');
      await api.post('/api/check-calls', {
        ...form,
        personnel_id: res.data.id,
        interval_minutes: parseInt(form.interval_minutes),
      });
      toast.success('Check call monitoring started');
      setShowCreate(false);
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed'); }
  };

  const handleCheckIn = async (ccId) => {
    try {
      await api.put(`/api/check-calls/${ccId}/check-in`);
      toast.success('Check-in recorded successfully!');
      fetchAll();
    } catch { toast.error('Check-in failed'); }
  };

  const handleComplete = async (ccId) => {
    try {
      await api.put(`/api/check-calls/${ccId}/complete`);
      toast.success('Shift ended');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const getTimeStatus = (cc) => {
    if (!cc.next_due_at || cc.status !== 'active') return null;
    try {
      const due = new Date(cc.next_due_at);
      const diffMs = due - now;
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor(Math.abs(diffMs % 60000) / 1000);
      if (diffMs < 0) return { label: `OVERDUE ${Math.abs(diffMins)}m ${diffSecs}s`, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10 border-[#EF4444]/40', urgent: true };
      if (diffMins < 5) return { label: `${diffMins}m ${diffSecs}s`, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/40', urgent: true };
      return { label: `${diffMins}m ${diffSecs}s`, color: 'text-[#22C55E]', bg: '', urgent: false };
    } catch { return null; }
  };

  const myActive = checkCalls.filter(cc => cc.status === 'active');

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="officer-check-calls">
      <div className="flex justify-between items-center">
        <div className="text-sm text-[#a1a0a0]">Lone Worker Protection</div>
        <Button onClick={() => setShowCreate(true)} data-testid="officer-start-cc-btn">
          <Play size={14} /> Start Check Call
        </Button>
      </div>

      {myActive.length > 0 && myActive.map(cc => {
        const timeStatus = getTimeStatus(cc);
        return (
          <Card key={cc.id} className={`border-2 ${timeStatus?.bg || 'border-[#2e2e2e]'}`} data-testid={`officer-cc-${cc.id}`}>
            <div className="p-5">
              <div className="text-center mb-4">
                <div className="text-xs text-[#a1a0a0] mb-1">Next Check-In Due</div>
                <div className={`text-5xl font-bold ${timeStatus?.color || 'text-white'}`}>
                  {timeStatus?.label || '--'}
                </div>
              </div>
              <div className="text-center text-sm text-[#a1a0a0] mb-4">
                {cc.check_in_count || 0} check-ins completed · Every {cc.interval_minutes} minutes
              </div>
              <Button
                className="w-full"
                size="lg"
                variant="success"
                onClick={() => handleCheckIn(cc.id)}
                data-testid={`officer-check-in-${cc.id}`}
              >
                <CheckCircle size={20} /> CHECK IN NOW
              </Button>
              <Button
                className="w-full mt-2"
                size="md"
                variant="outline"
                onClick={() => handleComplete(cc.id)}
                data-testid={`officer-end-cc-${cc.id}`}
              >
                <Square size={14} /> End Shift Monitoring
              </Button>
            </div>
          </Card>
        );
      })}

      {myActive.length === 0 && (
        <Card><EmptyState icon={PhoneCall} message="No active check call monitoring" action={<Button onClick={() => setShowCreate(true)}><Plus size={14} />Start</Button>} /></Card>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Start Lone Worker Check Call">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Select label="Site *" value={form.site_id} onChange={e => setForm({ ...form, site_id: e.target.value })} required data-testid="officer-cc-site">
            <option value="">Select your current site</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Select label="Check-in Interval" value={form.interval_minutes} onChange={e => setForm({ ...form, interval_minutes: e.target.value })}>
            {[15, 30, 45, 60].map(m => <option key={m} value={m}>Every {m} minutes</option>)}
          </Select>
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-3 text-xs text-[#F59E0B]">
            Your supervisor will be alerted if you miss a check-in.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCreate(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1"><Play size={14} />Start</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
