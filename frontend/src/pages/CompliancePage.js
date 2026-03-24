import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, Spinner, EmptyState, StatusBadge, Badge } from '../components/shared';
import { Shield, AlertTriangle, FileWarning, PhoneCall, CheckCircle, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function CompliancePage() {
  const api = useApi();
  const [alerts, setAlerts] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [alertsRes, riskRes] = await Promise.all([
        api.get('/api/compliance/alerts'),
        api.get('/api/compliance/risk-scores'),
      ]);
      setAlerts(alertsRes.data.alerts || []);
      setRiskScores(riskRes.data || []);
    } catch { toast.error('Failed to load compliance data'); }
    finally { setLoading(false); }
  };

  const critical = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');
  const highRisk = riskScores.filter(r => r.risk_level === 'high');

  const getAlertIcon = (type) => {
    if (type === 'licence_expired' || type === 'licence_expiring') return FileWarning;
    if (type === 'check_call_missed') return PhoneCall;
    if (type === 'no_licence') return AlertTriangle;
    return AlertTriangle;
  };

  const getRiskColor = (level) => {
    if (level === 'high') return 'text-[#EF4444]';
    if (level === 'medium') return 'text-[#F59E0B]';
    return 'text-[#22C55E]';
  };

  const getRiskBarWidth = (score) => `${Math.max(score, 5)}%`;

  if (loading) return <Spinner />;

  const overallScore = riskScores.length > 0
    ? Math.round(riskScores.reduce((acc, r) => acc + r.score, 0) / riskScores.length)
    : 100;

  return (
    <div className="space-y-4" data-testid="compliance-page">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Overall Score</div>
          <div className={`text-3xl font-bold mt-1 ${overallScore >= 80 ? 'text-[#22C55E]' : overallScore >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{overallScore}</div>
          <div className="text-xs text-[#676767]">/100</div>
        </Card>
        <Card className={`p-3 ${critical.length > 0 ? 'border-[#EF4444]/40' : ''}`}>
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Critical</div>
          <div className={`text-2xl font-bold mt-1 ${critical.length > 0 ? 'text-[#EF4444]' : 'text-white'}`}>{critical.length}</div>
        </Card>
        <Card className={`p-3 ${warnings.length > 0 ? 'border-[#F59E0B]/40' : ''}`}>
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">Warnings</div>
          <div className={`text-2xl font-bold mt-1 ${warnings.length > 0 ? 'text-[#F59E0B]' : 'text-white'}`}>{warnings.length}</div>
        </Card>
        <Card className={`p-3 ${highRisk.length > 0 ? 'border-[#EF4444]/40' : ''}`}>
          <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">High Risk</div>
          <div className={`text-2xl font-bold mt-1 ${highRisk.length > 0 ? 'text-[#EF4444]' : 'text-white'}`}>{highRisk.length}</div>
        </Card>
      </div>

      {/* Status banner */}
      {alerts.length === 0 ? (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg p-3 flex items-center gap-3">
          <CheckCircle size={16} className="text-[#22C55E]" />
          <span className="text-sm font-medium text-[#22C55E]">All systems compliant. No outstanding issues.</span>
        </div>
      ) : (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-[#EF4444]" />
          <span className="text-sm font-medium text-[#EF4444]">{alerts.length} compliance issues require attention</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts</CardTitle>
            <span className="text-xs font-mono text-[#a1a0a0]">{alerts.length} total</span>
          </CardHeader>
          {alerts.length === 0 ? (
            <EmptyState icon={Shield} message="No compliance alerts" />
          ) : (
            <div className="divide-y divide-[#2e2e2e]">
              {alerts.map((alert, i) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div key={i} className="px-4 py-3 flex items-start gap-3" data-testid={`compliance-alert-${i}`}>
                    <Icon size={14} className={alert.severity === 'critical' ? 'text-[#EF4444] mt-0.5' : 'text-[#F59E0B] mt-0.5'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-relaxed">{alert.message}</p>
                      {alert.expiry_date && (
                        <p className="text-xs text-[#676767] font-mono mt-0.5">Expires: {alert.expiry_date}</p>
                      )}
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'critical' : 'warning'}>
                      {alert.severity}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Risk scores */}
        <Card>
          <CardHeader>
            <CardTitle>Officer Risk Scores</CardTitle>
            <TrendingDown size={14} className="text-[#a1a0a0]" />
          </CardHeader>
          {riskScores.length === 0 ? (
            <EmptyState icon={Shield} message="No personnel to score" />
          ) : (
            <div className="divide-y divide-[#2e2e2e]">
              {riskScores.sort((a, b) => a.score - b.score).map((r, i) => (
                <div key={i} className="px-4 py-3" data-testid={`risk-score-${i}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${getRiskColor(r.risk_level)}`}>{r.score}</span>
                      <Badge variant={r.risk_level === 'high' ? 'critical' : r.risk_level === 'medium' ? 'warning' : 'success'}>
                        {r.risk_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${r.score >= 80 ? 'bg-[#22C55E]' : r.score >= 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                      style={{ width: getRiskBarWidth(r.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
