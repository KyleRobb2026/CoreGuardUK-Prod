import React, { useState, useEffect } from 'react';
import { useApi, useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Spinner, EmptyState, StatusBadge, Button } from '../components/shared';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function OfficerDashboardPage() {
  const { user } = useAuth();
  const api = useApi();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/shifts').then(res => setShifts(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const today = shifts.filter(s => {
    try { return format(parseISO(s.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'); } catch { return false; }
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="officer-dashboard">
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-lg p-4">
        <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Logged in as</div>
        <div className="text-xl font-bold text-white uppercase mt-1">{user?.first_name} {user?.last_name}</div>
        <div className="text-sm text-[#a1a0a0]">{user?.role || 'Security Officer'}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Shifts Today</CardTitle>
          <span className="text-xs text-[#a1a0a0] font-mono">{format(new Date(), 'dd/MM/yyyy')}</span>
        </CardHeader>
        {today.length === 0 ? (
          <EmptyState icon={Calendar} message="No shifts scheduled today" />
        ) : (
          <div className="divide-y divide-[#2e2e2e]">
            {today.map(shift => (
              <div key={shift.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-sm">{shift.site?.name}</div>
                  <div className="text-xs text-[#a1a0a0] flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {shift.site?.address}
                  </div>
                  <div className="text-xs text-[#676767] font-mono mt-0.5">
                    {shift.start_time ? format(parseISO(shift.start_time), 'HH:mm') : '--'} - {shift.end_time ? format(parseISO(shift.end_time), 'HH:mm') : '--'}
                  </div>
                </div>
                <StatusBadge status={shift.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Assigned', value: shifts.length },
          { label: 'Completed', value: shifts.filter(s => s.status === 'completed').length },
        ].map(({ label, value }) => (
          <Card key={label} className="p-4 text-center">
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-xs text-[#a1a0a0] mt-1">{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
