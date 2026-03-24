import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, User, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input, Button } from '../components/shared';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { id: 1, label: 'Company Details', icon: Building2 },
  { id: 2, label: 'Admin Account', icon: User },
  { id: 3, label: 'Activate', icon: Check },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [orgData, setOrgData] = useState({ name: '', email: '', phone: '', address: '' });
  const [adminData, setAdminData] = useState({ first_name: '', last_name: '', email: '', password: '', confirm_password: '' });

  const handleOrgNext = (e) => {
    e.preventDefault();
    if (!orgData.name || !orgData.email) { toast.error('Company name and email are required'); return; }
    setStep(2);
  };

  const handleAdminNext = (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirm_password) { toast.error('Passwords do not match'); return; }
    if (adminData.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(orgData, adminData);
      toast.success('Organisation activated! Welcome to CoreGuard.');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.detail || 'Registration failed';
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  const inputStyle = {
    base: 'w-full rounded-xl h-10 px-3 text-sm text-white placeholder:text-[#676767] outline-none transition-all',
    bg: { background: '#1e1e1e', border: '1px solid #2e2e2e' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#1e1e1e' }}>
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" style={{width: '220px'}} />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-7">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 transition-all ${isActive ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold`}
                    style={isActive ? { background: '#f7b91c', borderColor: '#f7b91c', color: '#1e1e1e' }
                      : isDone ? { background: '#22C55E20', borderColor: '#22C55E50', color: '#22C55E' }
                      : { background: '#2d2d2d', borderColor: '#2e2e2e', color: '#676767' }}>
                    {isDone ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <span className="text-xs font-semibold text-[#a1a0a0] hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="mx-2 text-[#2e2e2e]" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[#2e2e2e]" style={{ background: '#171717' }}>
          <div className="px-6 py-4 border-b border-[#2e2e2e]">
            <h2 className="text-base font-bold text-white">
              {step === 1 ? 'Company Details' : step === 2 ? 'Administrator Account' : 'Review & Activate'}
            </h2>
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleOrgNext} className="flex flex-col gap-4">
                <Input label="Company Name *" value={orgData.name} onChange={e => setOrgData({ ...orgData, name: e.target.value })} required placeholder="Apex Security Services Ltd" data-testid="org-name-input" />
                <Input label="Company Email *" type="email" value={orgData.email} onChange={e => setOrgData({ ...orgData, email: e.target.value })} required placeholder="admin@company.com" data-testid="org-email-input" />
                <Input label="Phone" value={orgData.phone} onChange={e => setOrgData({ ...orgData, phone: e.target.value })} placeholder="+44 7700 900000" />
                <Input label="Address" value={orgData.address} onChange={e => setOrgData({ ...orgData, address: e.target.value })} placeholder="123 Business Park, London" />
                <Button type="submit" size="lg" className="w-full mt-1" data-testid="org-next-btn">Continue <ChevronRight size={14} /></Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleAdminNext} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name *" value={adminData.first_name} onChange={e => setAdminData({ ...adminData, first_name: e.target.value })} required data-testid="admin-first-name-input" />
                  <Input label="Last Name *" value={adminData.last_name} onChange={e => setAdminData({ ...adminData, last_name: e.target.value })} required data-testid="admin-last-name-input" />
                </div>
                <Input label="Admin Email *" type="email" value={adminData.email} onChange={e => setAdminData({ ...adminData, email: e.target.value })} required data-testid="admin-email-input" />
                <Input label="Password *" type="password" value={adminData.password} onChange={e => setAdminData({ ...adminData, password: e.target.value })} required placeholder="Min 8 characters" data-testid="admin-password-input" />
                <Input label="Confirm Password *" type="password" value={adminData.confirm_password} onChange={e => setAdminData({ ...adminData, confirm_password: e.target.value })} required data-testid="admin-confirm-password-input" />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1" type="button">Back</Button>
                  <Button type="submit" className="flex-1" data-testid="admin-next-btn">Continue <ChevronRight size={14} /></Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {[
                  { icon: Building2, label: 'Company', items: [['Name', orgData.name], ['Email', orgData.email]] },
                  { icon: User, label: 'Admin', items: [['Name', `${adminData.first_name} ${adminData.last_name}`], ['Email', adminData.email], ['Role', 'Admin']] },
                ].map(({ icon: Icon, label, items }) => (
                  <div key={label} className="rounded-xl p-4 border border-[#2e2e2e]" style={{ background: '#1e1e1e' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} style={{ color: '#f7b91c' }} />
                      <span className="text-xs font-bold text-[#a1a0a0]">{label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-sm">
                      {items.map(([k, v]) => (
                        <React.Fragment key={k}>
                          <span className="text-[#676767]">{k}:</span>
                          <span className="text-white font-semibold">{v}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs text-[#676767]"
                  style={{ background: 'rgba(247,185,28,0.05)', border: '1px solid rgba(247,185,28,0.2)' }}>
                  <Check size={12} className="text-[#22C55E]" />
                  Sample data (sites, personnel, shifts) will be seeded for demo purposes.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1" type="button">Back</Button>
                  <Button onClick={handleSubmit} disabled={loading} className="flex-1" data-testid="activate-btn">
                    {loading ? 'Activating...' : 'Activate CoreGuard'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#676767] mt-4">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: '#f7b91c' }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
