import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon, RefreshCw, Clock, ExternalLink,
  CheckCircle, AlertTriangle, XCircle, Search,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

const INCIDENT_STATUS_CONFIG = {
  investigating: { label: 'Investigating', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  identified: { label: 'Identified', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  monitoring: { label: 'Monitoring', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

export default function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | resolved

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchIncidents(); }, []);

  const filtered = incidents.filter((inc) => {
    if (filter === 'active') return inc.status !== 'resolved';
    if (filter === 'resolved') return inc.status === 'resolved';
    return true;
  });

  // Group incidents by month
  const grouped = filtered.reduce((acc, inc) => {
    const month = new Date(inc.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(inc);
    return acc;
  }, {});

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
            <span className="text-white font-semibold text-sm">Incident History</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchIncidents} className="flex items-center gap-1.5 text-gray-500 hover:text-white transition text-xs" disabled={loading}>
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link to="/status" className="text-gray-400 hover:text-[#f7b91c] transition text-xs font-medium flex items-center gap-1">
              <ArrowLeftIcon className="size-3" /> Status Overview
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* TITLE + FILTER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Incident History</h1>
            <p className="text-gray-500 text-sm mt-1">A log of all past and current incidents affecting CoreGuard services.</p>
          </div>
          <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#262626] rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'resolved', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  filter === tab.key
                    ? 'bg-[#262626] text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* INCIDENTS LIST */}
        {loading && incidents.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="size-5 text-gray-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-12 text-center">
            <CheckCircle className="size-10 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-1">No incidents found</h3>
            <p className="text-gray-500 text-xs">
              {filter === 'active' ? 'There are no active incidents at this time.' : 'No incidents match this filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([month, monthIncidents]) => (
              <div key={month}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">{month}</h2>
                <div className="space-y-4">
                  {monthIncidents.map((inc) => {
                    const incConfig = INCIDENT_STATUS_CONFIG[inc.status] || INCIDENT_STATUS_CONFIG.investigating;
                    return (
                      <div key={inc.id} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${incConfig.bg} ${incConfig.color} border ${incConfig.border}`}>
                                {incConfig.label}
                              </span>
                              <span className="text-gray-600 text-xs">{inc.id}</span>
                            </div>
                            <h3 className="text-white font-semibold">{inc.title}</h3>
                            <p className="text-gray-500 text-xs mt-1">{inc.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-gray-600 text-xs">{formatDate(inc.createdAt)}</p>
                            <p className="text-gray-700 text-xs">{formatTime(inc.createdAt)}</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        {inc.updates && inc.updates.length > 0 && (
                          <div className="border-t border-[#262626] pt-4">
                            <div className="space-y-3">
                              {inc.updates.map((update, i) => {
                                const uConfig = INCIDENT_STATUS_CONFIG[update.status] || INCIDENT_STATUS_CONFIG.investigating;
                                return (
                                  <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-2 h-2 rounded-full mt-1.5 ${uConfig.color === 'text-green-400' ? 'bg-green-500' : uConfig.color === 'text-orange-400' ? 'bg-orange-400' : uConfig.color === 'text-blue-400' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                      {i < inc.updates.length - 1 && <div className="w-px flex-1 bg-[#262626] mt-1" />}
                                    </div>
                                    <div className="pb-3">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold ${uConfig.color}`}>{uConfig.label}</span>
                                        <span className="text-gray-600 text-xs">{formatDate(update.timestamp)} {formatTime(update.timestamp)}</span>
                                      </div>
                                      <p className="text-gray-400 text-xs mt-0.5">{update.message}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#262626] bg-[#0a0a0a] mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-3">
          <p className="text-gray-600 text-xs">&copy; 2026 CoreGuard UK Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-gray-500 hover:text-[#f7b91c] transition flex items-center gap-1">
              CoreGuard UK <ExternalLink className="size-3" />
            </a>
            <a href="mailto:support@coreguard-uk.co.uk" className="text-gray-500 hover:text-[#f7b91c] transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
