import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/AuthContext';
import {
  Card, CardHeader, CardTitle, Button, Input, Select, Textarea,
  StatusBadge, Modal, Spinner, EmptyState, Badge
} from '../components/shared';
import { Users, Plus, Search, Key, Shield, AlertTriangle, ChevronRight, X, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PersonnelPage() {
  const api = useApi();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showLicence, setShowLicence] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', role: 'Security Officer', address: '', employee_id: '' });
  const [licenceForm, setLicenceForm] = useState({ type: 'SIA Door Supervisor', number: '', issuing_authority: 'Security Industry Authority', issue_date: '', expiry_date: '', personnel_id: '' });

  useEffect(() => { fetchPersonnel(); }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await api.get('/api/personnel');
      setPersonnel(res.data);
    } catch (err) {
      toast.error('Failed to load personnel');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/personnel', form);
      toast.success('Personnel added successfully');
      setShowAdd(false);
      setForm({ first_name: '', last_name: '', email: '', phone: '', role: 'Security Officer', address: '', employee_id: '' });
      fetchPersonnel();
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to add personnel');
    }
  };

  const handleAddLicence = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/licences', licenceForm);
      toast.success('Licence added');
      setShowLicence(false);
      fetchPersonnel();
      if (showDetail) {
        const res = await api.get(`/api/personnel/${showDetail.id}`);
        setShowDetail(res.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to add licence');
    }
  };

  const handleGenerateCode = async (personId) => {
    try {
      const res = await api.post(`/api/personnel/${personId}/generate-code`);
      setGeneratedCode(res.data);
      setShowCodeModal(personId);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to generate code');
    }
  };

  const filtered = personnel.filter(p =>
    `${p.first_name} ${p.last_name} ${p.email} ${p.employee_id}`.toLowerCase().includes(search.toLowerCase())
  );

  const getLicenceStatus = (p) => {
    if (!p.latest_licence) return 'no_licence';
    return p.latest_licence.status;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4" data-testid="personnel-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
            <input
              type="text"
              placeholder="Search officers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl h-9 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none w-56 transition-all"
              style={{ background: '#171717', border: '1px solid #2e2e2e' }}
              onFocus={e => e.target.style.borderColor = '#f7b91c'}
              onBlur={e => e.target.style.borderColor = '#2e2e2e'}
              data-testid="personnel-search"
            />
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)} data-testid="add-personnel-btn">
          <Plus size={14} /> Add Officer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Officers', value: personnel.length, color: 'text-white' },
          { label: 'Active', value: personnel.filter(p => p.status === 'active').length, color: 'text-[#22C55E]' },
          { label: 'Expired Licences', value: personnel.filter(p => getLicenceStatus(p) === 'expired').length, color: 'text-[#EF4444]' },
          { label: 'Expiring Soon', value: personnel.filter(p => getLicenceStatus(p) === 'expiring_soon').length, color: 'text-[#F59E0B]' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-3">
            <div className="text-xs text-[#a1a0a0] uppercase tracking-wider">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel Registry</CardTitle>
          <span className="text-xs text-[#a1a0a0] font-mono">{filtered.length} records</span>
        </CardHeader>
        {filtered.length === 0 ? (
          <EmptyState icon={Users} message="No personnel found" action={<Button onClick={() => setShowAdd(true)} size="sm"><Plus size={12} />Add First Officer</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Officer', 'Role', 'Employee ID', 'Licence Status', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#a1a0a0] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#2d2d2d]/20 transition-colors" data-testid={`personnel-row-${p.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-xs font-bold text-[#f7b91c]">
                          {p.first_name?.[0]}{p.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-white">{p.first_name} {p.last_name}</div>
                          <div className="text-xs text-[#a1a0a0]">{p.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#a1a0a0]">{p.role}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#a1a0a0]">{p.employee_id}</td>
                    <td className="px-4 py-3">
                      {p.latest_licence ? (
                        <StatusBadge status={p.latest_licence.status} />
                      ) : (
                        <StatusBadge status="inactive" label="No Licence" />
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => { const res = await api.get(`/api/personnel/${p.id}`); setShowDetail(res.data); }}
                          className="text-xs text-[#f7b91c] hover:underline"
                          data-testid={`view-personnel-${p.id}`}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleGenerateCode(p.id)}
                          className="text-xs text-[#a1a0a0] hover:text-white flex items-center gap-1"
                          title="Generate Login Code"
                          data-testid={`gen-code-${p.id}`}
                        >
                          <Key size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Personnel Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Officer" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required data-testid="new-first-name" />
            <Input label="Last Name *" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required data-testid="new-last-name" />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} data-testid="new-email" />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} data-testid="new-phone" />
          <Select label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} data-testid="new-role">
            {['Security Officer', 'Senior Officer', 'Supervisor', 'Control Room Operator', 'Patrol Officer'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
          <Input label="Employee ID" value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} placeholder="Auto-generated if empty" />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAdd(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" data-testid="submit-add-personnel">Add Officer</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="Officer Profile" size="lg">
        {showDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-xl font-bold text-[#f7b91c]">
                {showDetail.first_name?.[0]}{showDetail.last_name?.[0]}
              </div>
              <div>
                <h3 className="text-lg text-white uppercase">{showDetail.first_name} {showDetail.last_name}</h3>
                <div className="text-sm text-[#a1a0a0]">{showDetail.role}</div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={showDetail.status} />
                  <span className="font-mono text-xs text-[#676767]">{showDetail.employee_id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Email', showDetail.email],
                ['Phone', showDetail.phone],
                ['Address', showDetail.address],
              ].filter(([, v]) => v).map(([k, v]) => (
                <React.Fragment key={k}>
                  <span className="text-[#a1a0a0]">{k}:</span>
                  <span className="text-white">{v}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Licences */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#a1a0a0] font-medium">Licences</span>
                <Button size="sm" onClick={() => { setLicenceForm({ ...licenceForm, personnel_id: showDetail.id }); setShowLicence(true); }}>
                  <Plus size={12} /> Add Licence
                </Button>
              </div>
              {showDetail.licences?.length > 0 ? (
                showDetail.licences.map(lic => (
                  <div key={lic.id} className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-3 mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{lic.type}</div>
                      <div className="text-xs text-[#a1a0a0] font-mono">{lic.number} · Expires: {lic.expiry_date ? format(new Date(lic.expiry_date), 'dd/MM/yyyy') : 'N/A'}</div>
                    </div>
                    <StatusBadge status={lic.status} />
                  </div>
                ))
              ) : (
                <div className="text-sm text-[#a1a0a0] flex items-center gap-2">
                  <AlertTriangle size={14} className="text-[#F59E0B]" /> No licences on record
                </div>
              )}
            </div>

            {showDetail.code_display && (
              <div className="bg-[#f7b91c]/10 border border-[#f7b91c]/30 rounded-lg p-3">
                <div className="text-xs text-[#a1a0a0] mb-1">Login Code</div>
                <div className="font-mono text-lg text-[#f7b91c]">{showDetail.code_display}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Licence Modal */}
      <Modal open={showLicence} onClose={() => setShowLicence(false)} title="Add Licence">
        <form onSubmit={handleAddLicence} className="flex flex-col gap-4">
          <Select label="Licence Type" value={licenceForm.type} onChange={e => setLicenceForm({ ...licenceForm, type: e.target.value })}>
            {['SIA Door Supervisor', 'SIA Security Guard', 'SIA CCTV Operator', 'SIA Vehicle Immobiliser', 'SIA Close Protection', 'First Aid Certificate', 'Driving Licence', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input label="Licence Number *" value={licenceForm.number} onChange={e => setLicenceForm({ ...licenceForm, number: e.target.value })} required />
          <Input label="Issuing Authority" value={licenceForm.issuing_authority} onChange={e => setLicenceForm({ ...licenceForm, issuing_authority: e.target.value })} />
          <Input label="Issue Date" type="date" value={licenceForm.issue_date} onChange={e => setLicenceForm({ ...licenceForm, issue_date: e.target.value })} />
          <Input label="Expiry Date *" type="date" value={licenceForm.expiry_date} onChange={e => setLicenceForm({ ...licenceForm, expiry_date: e.target.value })} required />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowLicence(false)} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Licence</Button>
          </div>
        </form>
      </Modal>

      {/* Generated Code Modal */}
      <Modal open={!!showCodeModal} onClose={() => { setShowCodeModal(null); setGeneratedCode(null); }} title="Officer Login Credentials">
        {generatedCode && (
          <div className="space-y-4">
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-3 text-xs text-[#F59E0B]">
              Share these credentials securely. The PIN will not be shown again.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-4 text-center">
                <div className="text-xs text-[#a1a0a0] mb-2">Officer Code</div>
                <div className="font-mono text-3xl font-bold text-[#f7b91c]">{generatedCode.code}</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-4 text-center">
                <div className="text-xs text-[#a1a0a0] mb-2">PIN</div>
                <div className="font-mono text-3xl font-bold text-[#22C55E]">{generatedCode.pin}</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { setShowCodeModal(null); setGeneratedCode(null); }}>
              Done - Credentials Noted
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
