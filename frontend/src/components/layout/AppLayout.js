import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts';
import { AlertTriangle, X, PhoneCall } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Command Centre',
  '/personnel': 'Personnel & Licences',
  '/sites': 'Sites & Operations',
  '/rota': 'Rota Builder',
  '/logs': 'Daily Occurrence Log',
  '/forms': 'Forms System',
  '/check-calls': 'Check Call System',
  '/compliance': 'Compliance Engine',
  '/audit': 'Audit Log',
  '/settings': 'Settings',
  '/officer/dashboard': 'My Shifts',
  '/officer/logs': 'Log Entry',
  '/officer/check-calls': 'Check Call',
  '/officer/forms': 'Forms',
};

function RealtimeAlertToast({ alert, onDismiss }) {
  return (
    <div className="animate-slide-in-right flex items-start gap-3 p-3 rounded-xl border shadow-2xl max-w-sm w-full"
      style={{
        background: alert.severity === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(247,185,28,0.12)',
        borderColor: alert.severity === 'critical' ? 'rgba(239,68,68,0.4)' : 'rgba(247,185,28,0.4)',
      }}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.severity === 'critical' ? 'bg-[#EF4444]/20' : 'bg-[#f7b91c]/20'}`}>
        {alert.type === 'check_call_missed'
          ? <PhoneCall size={14} className={alert.severity === 'critical' ? 'text-[#EF4444]' : 'text-[#f7b91c]'} />
          : <AlertTriangle size={14} className={alert.severity === 'critical' ? 'text-[#EF4444]' : 'text-[#f7b91c]'} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold uppercase tracking-wider ${alert.severity === 'critical' ? 'text-[#EF4444]' : 'text-[#f7b91c]'}`}>
          {alert.type === 'check_call_missed' ? 'Missed Check-In' : 'Alert'}
        </div>
        <p className="text-xs text-[#a1a0a0] mt-0.5 leading-relaxed">{alert.message}</p>
      </div>
      <button onClick={() => onDismiss(alert.id)} className="text-[#676767] hover:text-white flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { orgId } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'CoreGuard SMS';
  const { alerts, connected, dismissAlert } = useRealtimeAlerts(orgId);

  return (
    <div className="flex min-h-screen" style={{ background: '#1e1e1e' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} alerts={alerts.length} />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Real-time alerts stack - bottom right */}
      {alerts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
          {alerts.slice(0, 3).map(alert => (
            <RealtimeAlertToast key={alert.id} alert={alert} onDismiss={dismissAlert} />
          ))}
          {alerts.length > 3 && (
            <div className="text-xs text-[#676767] text-center py-1">
              +{alerts.length - 3} more alerts
            </div>
          )}
        </div>
      )}

      {/* WS connection indicator */}
      {connected && (
        <div className="fixed bottom-4 left-4 flex items-center gap-1.5 text-[10px] text-[#676767] z-10 transition-all">
          <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full status-dot-live" />
          <span>Live</span>
        </div>
      )}
    </div>
  );
}
