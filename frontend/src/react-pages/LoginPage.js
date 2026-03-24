import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, Hash } from 'lucide-react';
import { toast } from 'sonner';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function LoginPage() {
  const [mode, setMode] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, officerLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.detail || 'Login failed';
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await officerLogin(code, pin);
      navigate('/officer/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#1e1e1e', fontFamily: 'Nunito, sans-serif' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-10 relative overflow-hidden border-r border-[#2e2e2e]"
        style={{
          background: 'linear-gradient(135deg, #171717 0%, #1e1e1e 50%, #252525 100%)',
        }}>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#f7b91c 1px, transparent 1px), linear-gradient(90deg, #f7b91c 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        <div className="relative z-10 flex items-center gap-3">
          <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" style={{width: '200px'}} />
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Compliance-First<br />
            <span style={{ color: '#f7b91c' }}>Operations</span><br />
            Control
          </h2>
          <p className="text-[#676767] text-sm leading-relaxed max-w-xs">
            Enterprise security management for regulated private security companies. Every action verified, logged, and enforced.
          </p>
          <div className="flex gap-8 mt-10">
            {[
              { label: 'Officers', value: '100+' },
              { label: 'Compliance', value: '100%' },
              { label: 'Real-Time', value: '24/7' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-2xl font-bold" style={{ color: '#f7b91c' }}>{value}</div>
                <div className="text-xs text-[#676767]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#2e2e2e] font-mono">
          © 2025 CoreGuard SMS · Enterprise Edition
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" style={{width: '180px'}} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-[#676767] mb-7">Sign in to your operational control centre</p>

          {/* Mode toggle */}
          <div className="flex mb-6 p-1 rounded-xl gap-1" style={{ background: '#171717', border: '1px solid #2e2e2e' }}>
            <button
              onClick={() => setMode('admin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${mode === 'admin' ? 'text-[#1e1e1e]' : 'text-[#676767] hover:text-[#a1a0a0]'}`}
              style={mode === 'admin' ? { background: '#f7b91c' } : {}}
              data-testid="tab-admin-login"
            >
              Admin / Staff
            </button>
            <button
              onClick={() => setMode('officer')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${mode === 'officer' ? 'text-[#1e1e1e]' : 'text-[#676767] hover:text-[#a1a0a0]'}`}
              style={mode === 'officer' ? { background: '#f7b91c' } : {}}
              data-testid="tab-officer-login"
            >
              Field Officer
            </button>
          </div>

          {mode === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4" data-testid="admin-login-form">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                    data-testid="admin-email-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-10 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                    data-testid="admin-password-input"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676767] hover:text-[#a1a0a0]">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-[#1e1e1e] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 mt-1"
                style={{ background: '#f7b91c' }}
                onMouseEnter={e => e.target.style.background = '#e0a518'}
                onMouseLeave={e => e.target.style.background = '#f7b91c'}
                data-testid="admin-login-submit"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-[#676767] mt-1">
                New organisation?{' '}
                <button type="button" onClick={() => navigate('/onboarding')}
                  className="font-semibold transition-colors"
                  style={{ color: '#f7b91c' }}
                  data-testid="go-to-onboarding">
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOfficerLogin} className="flex flex-col gap-4" data-testid="officer-login-form">
              <div className="flex items-start gap-2 p-3 rounded-xl text-xs text-[#676767]"
                style={{ background: '#171717', border: '1px solid #2e2e2e' }}>
                <Shield size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#f7b91c' }} />
                Enter your unique Officer Code and PIN provided by your administrator.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Officer Code</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. 4521987"
                    required
                    maxLength={8}
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none font-mono tracking-widest transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                    data-testid="officer-code-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">PIN</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="••••"
                    required
                    maxLength={6}
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                    data-testid="officer-pin-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-[#1e1e1e] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 mt-1"
                style={{ background: '#f7b91c' }}
                onMouseEnter={e => e.target.style.background = '#e0a518'}
                onMouseLeave={e => e.target.style.background = '#f7b91c'}
                data-testid="officer-login-submit"
              >
                {loading ? 'Authenticating...' : 'Field Login'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#2e2e2e]">
            <p className="text-xs text-[#2e2e2e] text-center font-mono">
              COREGUARD SMS · ENTERPRISE · ENCRYPTED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
