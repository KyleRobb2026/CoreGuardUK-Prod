import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Button, Input, Select, Modal, Spinner, EmptyState, StatusBadge } from '../components/shared';
import { Calendar, Plus, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';

export default function RotaPage() {
  const api = useApi();
  const [shifts, setShifts] = useState([]);
  const [sites, setSites] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ site_id: '', personnel_id: '', start_time: '', end_time: '', notes: '' });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => { fetchAll(); }, [currentWeek]);

  const fetchAll = async () => {
    try {
      const [shiftsRes, sitesRes, personnelRes] = await Promise.all([
        api.get('/api/shifts'),
        api.get('/api/sites'),
        api.get('/api/personnel'),
      ]);
      setShifts(shiftsRes.data);
      setSites(sitesRes.data);
      setPersonnel(personnelRes.data);
    } catch { toast.error('Failed to load rota data'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/shifts', form);
      toast.success('Shift created');
      setShowAdd(false);
      setForm({ site_id: '', personnel_id: '', start_time: '', end_time: '', notes: '' });
      fetchAll();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to create shift'); }
  };

  const handleUpdateStatus = async (shiftId, status) => {
    try {
      await api.put(`/api/shifts/${shiftId}`, { status });
      toast.success(`Shift ${status}`);
      fetchAll();
    } catch { toast.error('Failed to update shift'); }
  };

  const handleDelete = async (shiftId) => {
    if (!window.confirm('Delete this shift?')) return;
    try {
      await api.delete(`/api/shifts/${shiftId}`);
      toast.success('Shift deleted');
      fetchAll();
    } catch { toast.error('Failed to delete shift'); }
  };

  const getShiftsForDay = (day) =>
    shifts.filter(s => {
      try { return isSameDay(parseISO(s.start_time), day); } catch { return false; }
    });

  const statusColor = { scheduled: 'bg-[#3B82F6]/20 border-[#3B82F6]/40', active: 'bg-[#22C55E]/20 border-[#22C55E]/40', completed: 'bg-[#525252]/20 border-[#2e2e2e]/40', missed: 'bg-[#EF4444]/20 border-[#EF4444]/40' };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="rota-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))} className="p-1.5 rounded-lg border border-[#2e2e2e] text-[#a1a0a0] hover:text-white hover:bg-[#2d2d2d] transition-all" data-testid="prev-week"><ChevronLeft size={16} /></button>
          <span className="text-sm text-white font-medium px-2">
            {format(weekStart, 'dd MMM')} - {format(addDays(weekStart, 6), 'dd MMM yyyy')}
          </span>
          <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="p-1.5 rounded-lg border border-[#2e2e2e] text-[#a1a0a0] hover:text-white hover:bg-[#2d2d2d] transition-all" data-testid="next-week"><ChevronRight size={16} /></button>
          <button onClick={() => setCurrentWeek(new Date())} className="text-xs text-[#f7b91c] px-2 hover:underline ml-1">Today</button>
        </div>
        <Button onClick={() => setShowAdd(true)} data-testid="add-shift-btn"><Plus size={14} /> Add Shift</Button>
      </div>

      {/* Weekly calendar */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 min-w-[700px]">
          {weekDays.map((day, i) => {
            const dayShifts = getShiftsForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div key={i} className={`rounded-lg border ${isToday ? 'border-[#f7b91c]/50 bg-[#f7b91c]/5' : 'border-[#2e2e2e] bg-[#171717]'}`}>
                <div className={`px-2 py-2 border-b ${isToday ? 'border-[#f7b91c]/30' : 'border-[#2e2e2e]'} text-center`}>
                  <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-[#f7b91c]' : 'text-white'}`}>{format(day, 'd')}</div>
                </div>
                <div className="p-1.5 space-y-1 min-h-[100px]">
                  {dayShifts.map(shift => (
                    <div key={shift.id}
                      className={`text-xs p-1.5 rounded-lg border cursor-pointer transition-all hover:brightness-110 ${statusColor[shift.status] || 'bg-[#2d2d2d]/20 border-[#2e2e2e]/40'}`}
                      data-testid={`shift-block-${shift.id}`}
                    >
                      <div className="font-medium text-white truncate">
                        {shift.personnel?.first_name} {shift.personnel?.last_name?.[0]}.
                      </div>
                      <div className="text-[#a1a0a0] truncate">{shift.site?.name}</div>
                      <div className="font-mono text-[10px] text-[#676767]">
                        {shift.start_time ? format(parseISO(shift.start_time), 'HH:mm') : '--'}-{shift.end_time ? format(parseISO(shift.end_time), 'HH:mm') : '--'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All shifts list */}
      <Card>
        <CardHeader>
          <CardTitle>All Shifts</CardTitle>
          <span className="text-xs text-[#a1a0a0] font-mono">{shifts.length} total</span>
        </CardHeader>
        {shifts.length === 0 ? (
          <EmptyState icon={Calendar} message="No shifts scheduled" action={<Button onClick={() => setShowAdd(true)} size="sm"><Plus size={12} />Add First Shift</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Officer', 'Site', 'Start', 'End', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#a1a0a0] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {shifts.slice(0, 50).map(shift => (
                  <tr key={shift.id} className="hover:bg-[#2d2d2d]/20 transition-colors" data-testid={`shift-list-${shift.id}`}>
                    <td className="px-4 py-3 text-white">{shift.personnel?.first_name} {shift.personnel?.last_name}</td>
                    <td className="px-4 py-3 text-[#a1a0a0]">{shift.site?.name || '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#a1a0a0]">{shift.start_time ? format(parseISO(shift.start_time), 'dd/MM HH:mm') : '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#a1a0a0]">{shift.end_time ? format(parseISO(shift.end_time), 'dd/MM HH:mm') : '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={shift.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {shift.status === 'scheduled' && (
                          <button onClick={() => handleUpdateStatus(shift.id, 'active')} className="text-xs text-[#22C55E] hover:underline">Activate</button>
                        )}
                        {shift.status === 'active' && (
                          <button onClick={() => handleUpdateStatus(shift.id, 'completed')} className="text-xs text-[#f7b91c] hover:underline">Complete</button>
                        )}
                        <button onClick={() => handleDelete(shift.id)} className="text-xs text-[#EF4444] hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Schedule New Shift" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Select label="Officer *" value={form.personnel_id} onChange={e => setForm({ ...form, personnel_id: e.target.value })} required data-testid="shift-personnel-select">
            <option value="">Select Officer</option>
            {personnel.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} - {p.role}</option>)}
          </Select>
          <Select label="Site *" value={form.site_id} onChange={e => setForm({ ...form, site_id: e.target.value })} required data-testid="shift-site-select">
            <option value="">Select Site</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time *" type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required data-testid="shift-start-time" />
            <Input label="End Time *" type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required data-testid="shift-end-time" />
          </div>
          <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional shift notes" />
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-2 text-xs text-[#F59E0B] flex items-center gap-2">
            <AlertTriangle size={12} />
            Double-booking prevention is active. Expired licence holders cannot be assigned.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="submit-shift">Schedule Shift</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
