import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, AlertTriangle, XCircle, RefreshCw,
  ArrowRightIcon, ExternalLink, Clock,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

const STATUS_CONFIG = {
  operational: { label: 'Operational', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-500', icon: CheckCircle },
  degraded: { label: 'Degraded Performance', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', dot: 'bg-orange-400', icon: AlertTriangle },
  outage: { label: 'Major Outage', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', icon: XCircle },
};

const INCIDENT_STATUS_CONFIG = {
  investigating: { label: 'Investigating', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  identified: { label: 'Identified', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  monitoring: { label: 'Monitoring', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function StatusPage() {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, incidentsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/incidents'),
      ]);
      const status = await statusRes.json();
      const inc = await incidentsRes.json();
      setStatusData(status);
      setIncidents(inc);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const overallConfig = statusData ? STATUS_CONFIG[statusData.overall] || STATUS_CONFIG.operational : STATUS_CONFIG.operational;
  const OverallIcon = overallConfig.icon;
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const recentResolved = incidents.filter(i => i.status === 'resolved').slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-sm antialiased text-gray-300">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img src={LOGO_URL} alt="CoreGuard UK" className="h-8 w-auto" />
            </a>
            <div className="w-px h-6 bg-[#333]" />
            <span className="text-white font-semibold text-sm">System Status</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-gray-500 hover:text-white transition text-xs"
              disabled={loading}
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/status/incidents"
              className="text-gray-400 hover:text-[#f7b91c] transition text-xs font-medium"
            >
              Incident History
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* OVERALL STATUS BANNER */}
        <div className={`rounded-xl border ${overallConfig.border} ${overallConfig.bg} p-6 mb-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OverallIcon className={`size-6 ${overallConfig.color}`} />
              <div>
                <h1 className={`text-xl font-bold ${overallConfig.color}`}>{overallConfig.label}</h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  {statusData?.overall === 'operational'
                    ? 'All systems are running normally.'
                    : statusData?.overall === 'degraded'
                    ? 'Some services are experiencing issues.'
                    : 'We are experiencing a major outage.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Clock className="size-3" />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE INCIDENTS */}
        {activeIncidents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">Active Incidents</h2>
            <div className="space-y-3">
              {activeIncidents.map((inc) => {
                const incConfig = INCIDENT_STATUS_CONFIG[inc.status] || INCIDENT_STATUS_CONFIG.investigating;
                return (
                  <div key={inc.id} className={`rounded-xl border ${incConfig.border} ${incConfig.bg} p-5`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${incConfig.bg} ${incConfig.color} border ${incConfig.border}`}>
                            {incConfig.label}
                          </span>
                          <span className="text-gray-600 text-xs">{timeAgo(inc.updatedAt)}</span>
                        </div>
                        <h3 className="text-white font-semibold text-sm">{inc.title}</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{inc.description}</p>
                      </div>
                    </div>
                    {inc.updates && inc.updates.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        {inc.updates.slice(-3).reverse().map((update, i) => {
                          const uConfig = INCIDENT_STATUS_CONFIG[update.status] || INCIDENT_STATUS_CONFIG.investigating;
                          return (
                            <div key={i} className="flex gap-3 text-xs">
                              <span className={`${uConfig.color} font-medium w-24 shrink-0`}>{uConfig.label}</span>
                              <span className="text-gray-400">{update.message}</span>
                              <span className="text-gray-600 ml-auto shrink-0">{timeAgo(update.timestamp)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SERVICE STATUS LIST */}
        <h2 className="text-lg font-bold text-white mb-4">Service Status</h2>
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden mb-10">
          {statusData && Object.entries(statusData.services).map(([key, service], index, arr) => {
            const config = STATUS_CONFIG[service.status] || STATUS_CONFIG.operational;
            const Icon = config.icon;
            return (
              <div key={key} className={`flex items-center justify-between px-5 py-4 ${index < arr.length - 1 ? 'border-b border-[#262626]' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                  <span className="text-white font-medium text-sm">{service.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  <Icon className={`size-4 ${config.color}`} />
                </div>
              </div>
            );
          })}
          {loading && !statusData && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="size-5 text-gray-600 animate-spin" />
            </div>
          )}
        </div>

        {/* RECENT RESOLVED INCIDENTS */}
        {recentResolved.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Incidents</h2>
              <Link to="/status/incidents" className="text-[#f7b91c] hover:underline text-xs font-medium flex items-center gap-1">
                View all <ArrowRightIcon className="size-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentResolved.map((inc) => (
                <div key={inc.id} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          Resolved
                        </span>
                        <span className="text-gray-600 text-xs">{new Date(inc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm">{inc.title}</h3>
                      <p className="text-gray-500 text-xs mt-1">{inc.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFO */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 text-center">
          <p className="text-gray-500 text-xs leading-relaxed">
            This page shows the real-time status of CoreGuard UK services. Status is updated automatically every 60 seconds.
            <br />
            For urgent issues, contact <a href="mailto:support@coreguarduk.com" className="text-[#f7b91c] hover:underline">support@coreguarduk.com</a>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#262626] bg-[#0a0a0a] mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-3">
          <p className="text-gray-600 text-xs">&copy; 2026 CoreGuard UK Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-gray-500 hover:text-[#f7b91c] transition flex items-center gap-1">
              CoreGuard UK <ExternalLink className="size-3" />
            </a>
            <a href="mailto:support@coreguarduk.com" className="text-gray-500 hover:text-[#f7b91c] transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
