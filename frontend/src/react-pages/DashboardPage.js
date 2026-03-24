import React, { useState, useEffect } from 'react';
import { useAuth, useApi } from '../contexts/AuthContext';
import { StatCard, Card, CardHeader, CardTitle, StatusBadge, Spinner, EmptyState } from '../components/shared';
import {
  Users, MapPin, Calendar, AlertTriangle, PhoneCall,
  FileWarning, Sun, CloudRain, Zap, Shield, TrendingUp, Activity
} from 'lucide-react';
import { format } from 'date-fns';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function DashboardPage() {
  const { user } = useAuth();
  const api = useApi();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/compliance/alerts'),
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data.alerts || []);
      try {
        const weatherRes = await api.get('/api/weather?city=London');
        setWeather(weatherRes.data);
      } catch {}
    } catch {}
    finally { setLoading(false); }
  };

  if (loading) return <Spinner />;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  const WeatherIcon = weather?.severity === 'severe' ? Zap : weather?.severity === 'caution' ? CloudRain : Sun;
  const weatherColor = weather?.severity === 'severe' ? '#EF4444' : weather?.severity === 'caution' ? '#F59E0B' : '#22C55E';

  return (
    <div className="space-y-5 animate-fade-in" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#676767]">{format(new Date(), "EEEE, dd MMMM yyyy · HH:mm")}</p>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Welcome back, <span style={{ color: '#f7b91c' }}>{user?.first_name || 'Administrator'}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2e2e2e]"
          style={{ background: '#171717' }}>
          <span className="w-2 h-2 rounded-full bg-[#22C55E] status-dot-live" />
          <span className="text-xs text-[#676767] font-semibold">System Operational</span>
        </div>
      </div>

      {/* Critical alerts banner */}
      {criticalAlerts.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}
          data-testid="critical-alerts-banner">
          <AlertTriangle size={15} className="text-[#EF4444] flex-shrink-0" />
          <span className="text-sm font-semibold text-[#EF4444]">{criticalAlerts.length} Critical: </span>
          <span className="text-sm text-[#676767]">{criticalAlerts[0]?.message}</span>
        </div>
      )}

      {/* Stats grid - row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="stats-grid">
        <StatCard label="Active Officers" value={stats?.active_officers || 0} icon={Users} color="success" />
        <StatCard label="Active Sites" value={stats?.total_sites || 0} icon={MapPin} color="info" />
        <StatCard label="Live Shifts" value={(stats?.active_shifts || 0) + (stats?.scheduled_shifts || 0)} icon={Calendar} color="yellow"
          trend={`${stats?.active_shifts || 0} active · ${stats?.scheduled_shifts || 0} scheduled`} />
        <StatCard label="Incidents Today" value={stats?.incidents_today || 0} icon={AlertTriangle}
          color={stats?.incidents_today > 0 ? 'critical' : 'default'} />
      </div>

      {/* Stats grid - row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Check Calls Active" value={stats?.active_check_calls || 0} icon={PhoneCall} color="success" />
        <StatCard label="Missed Check Calls" value={stats?.missed_check_calls || 0} icon={PhoneCall}
          color={stats?.missed_check_calls > 0 ? 'critical' : 'default'} />
        <StatCard label="Expired Licences" value={stats?.expired_licences || 0} icon={FileWarning}
          color={stats?.expired_licences > 0 ? 'critical' : 'default'} />
        <StatCard label="Expiring Soon" value={stats?.expiring_licences || 0} icon={FileWarning}
          color={stats?.expiring_licences > 0 ? 'warning' : 'default'} />
      </div>

      {/* Bottom bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent shifts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Shifts</CardTitle>
              <span className="text-xs text-[#676767] font-mono">{format(new Date(), 'dd/MM/yyyy')}</span>
            </CardHeader>
            <div className="divide-y divide-[#2e2e2e]">
              {stats?.recent_shifts?.length > 0 ? stats.recent_shifts.map(shift => (
                <div key={shift.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors" data-testid={`shift-row-${shift.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f7b91c] flex items-center justify-center text-xs font-bold text-[#1e1e1e]">
                      {shift.personnel?.first_name?.[0]}{shift.personnel?.last_name?.[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{shift.personnel?.first_name} {shift.personnel?.last_name}</div>
                      <div className="text-xs text-[#676767]">
                        {shift.site?.name} · {shift.start_time ? format(new Date(shift.start_time), 'HH:mm') : '--'}-{shift.end_time ? format(new Date(shift.end_time), 'HH:mm') : '--'}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={shift.status} />
                </div>
              )) : (
                <EmptyState icon={Calendar} message="No shifts scheduled" />
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Weather */}
          {weather && (
            <Card data-testid="weather-widget">
              <CardHeader>
                <CardTitle>Weather · {weather.city}</CardTitle>
                <WeatherIcon size={16} style={{ color: weatherColor }} />
              </CardHeader>
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-white">{weather.temperature}°C</span>
                  <span className="text-sm text-[#676767] capitalize">{weather.description}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    ['Feels like', `${weather.feels_like}°C`],
                    ['Wind', `${weather.wind_speed} m/s`],
                    ['Humidity', `${weather.humidity}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[#676767]">{k}</span>
                      <span className="text-white font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#2e2e2e]">
                  <span className="text-xs font-bold" style={{ color: weatherColor }}>
                    {weather.severity === 'severe' ? 'Severe Conditions' : weather.severity === 'caution' ? 'Caution Advised' : 'Normal Conditions'}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Compliance alerts */}
          <Card data-testid="compliance-alerts-widget">
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
              <span className={`text-xs font-bold font-mono ${alerts.length > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                {alerts.length} issues
              </span>
            </CardHeader>
            <div className="divide-y divide-[#2e2e2e]">
              {alerts.slice(0, 4).map((alert, i) => (
                <div key={i} className="px-5 py-2.5 flex items-start gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === 'critical' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`} />
                  <span className="text-xs text-[#676767] leading-relaxed">{alert.message}</span>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="px-5 py-3 flex items-center gap-2">
                  <Shield size={14} className="text-[#22C55E]" />
                  <span className="text-xs text-[#22C55E] font-semibold">All systems compliant</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
