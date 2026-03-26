import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, User, Check, ChevronRight, Mail, Phone, MapPin, Users, CreditCard, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { id: 1, label: 'Company Details', icon: Building2 },
  { id: 2, label: 'Admin Account', icon: User },
  { id: 3, label: 'Subscription', icon: CreditCard },
  { id: 4, label: 'Activate', icon: Check },
];

const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    features: ['Up to 10 officers', 'Basic compliance tracking', 'Email support'],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '£99/mo',
    features: ['Up to 50 officers', 'Advanced compliance', 'Priority support', 'API access'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited officers', 'Custom features', 'Dedicated support', 'SLA guarantee'],
    popular: false
  }
];

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [orgData, setOrgData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '',
    company_number: '',
    industry: '',
    employee_count: ''
  });
  
  const [adminData, setAdminData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    confirm_password: '',
    job_title: '',
    phone: ''
  });

  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'starter',
    billing_email: '',
    payment_method: 'invoice'
  });

  const handleOrgNext = (e) => {
    e.preventDefault();
    if (!orgData.name || !orgData.email) { 
      toast.error('Company name and email are required'); 
      return; 
    }
    setStep(2);
  };

  const handleAdminNext = (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirm_password) { 
      toast.error('Passwords do not match'); 
      return; 
    }
    if (adminData.password.length < 8) { 
      toast.error('Password must be at least 8 characters'); 
      return; 
    }
    setStep(3);
  };

  const handleSubscriptionNext = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(orgData, adminData, subscriptionData);
      toast.success('Organisation activated! Welcome to CoreGuard.');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.detail || 'Registration failed';
      toast.error(errorMessage);
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
            Start Your<br />
            <span style={{ color: '#f7b91c' }}>Security Journey</span><br />
            Today
          </h2>
          <p className="text-[#676767] text-sm leading-relaxed max-w-xs">
            Join hundreds of UK security companies using CoreGuard to streamline operations and ensure compliance.
          </p>
          <div className="flex gap-8 mt-10">
            {[
              { label: 'Companies', value: '500+' },
              { label: 'Officers', value: '10K+' },
              { label: 'Uptime', value: '99.9%' },
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

      {/* Right onboarding panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" style={{width: '180px'}} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-sm text-[#676767] mb-7">Get started with CoreGuard in minutes</p>

          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.id ? 'text-[#1e1e1e]' : 'text-[#676767]'
                    }`} style={{
                      background: step >= s.id ? '#f7b91c' : '#171717',
                      border: '1px solid #2e2e2e'
                    }}>
                      {step > s.id ? <Check size={16} /> : s.id}
                    </div>
                    <span className={`ml-3 text-xs font-medium whitespace-nowrap ${
                      step >= s.id ? 'text-white' : 'text-[#676767]'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 transition-all hidden sm:block ${
                      step > s.id ? 'bg-[#f7b91c]' : 'bg-[#2e2e2e]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 1: Company Details */}
          {step === 1 && (
            <form onSubmit={handleOrgNext} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Company Name *</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="text"
                    value={orgData.name}
                    onChange={e => setOrgData({...orgData, name: e.target.value})}
                    placeholder="CoreGuard Security Ltd"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Company Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="email"
                    value={orgData.email}
                    onChange={e => setOrgData({...orgData, email: e.target.value})}
                    placeholder="info@coreguard.co.uk"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Company Phone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="tel"
                    value={orgData.phone}
                    onChange={e => setOrgData({...orgData, phone: e.target.value})}
                    placeholder="+44 20 7123 4567"
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Company Number</label>
                <input
                  type="text"
                  value={orgData.company_number}
                  onChange={e => setOrgData({...orgData, company_number: e.target.value})}
                  placeholder="12345678"
                  className="w-full rounded-xl h-11 px-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                  onFocus={e => e.target.style.borderColor = '#f7b91c'}
                  onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Industry</label>
                <select
                  value={orgData.industry}
                  onChange={e => setOrgData({...orgData, industry: e.target.value})}
                  className="w-full rounded-xl h-11 px-4 text-sm text-white outline-none transition-all"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                  onFocus={e => e.target.style.borderColor = '#f7b91c'}
                  onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                >
                  <option value="">Select Industry</option>
                  <option value="security">Private Security</option>
                  <option value="events">Event Security</option>
                  <option value="retail">Retail Security</option>
                  <option value="construction">Construction Security</option>
                  <option value="corporate">Corporate Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Employee Count</label>
                <select
                  value={orgData.employee_count}
                  onChange={e => setOrgData({...orgData, employee_count: e.target.value})}
                  className="w-full rounded-xl h-11 px-4 text-sm text-white outline-none transition-all"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                  onFocus={e => e.target.style.borderColor = '#f7b91c'}
                  onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl h-11 text-sm font-bold text-[#1e1e1e] transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#f7b91c' }}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* Step 2: Admin Account */}
          {step === 2 && (
            <form onSubmit={handleAdminNext} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#a1a0a0] font-semibold">First Name *</label>
                  <input
                    type="text"
                    value={adminData.first_name}
                    onChange={e => setAdminData({...adminData, first_name: e.target.value})}
                    placeholder="John"
                    required
                    className="w-full rounded-xl h-11 px-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#a1a0a0] font-semibold">Last Name *</label>
                  <input
                    type="text"
                    value={adminData.last_name}
                    onChange={e => setAdminData({...adminData, last_name: e.target.value})}
                    placeholder="Doe"
                    required
                    className="w-full rounded-xl h-11 px-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Job Title</label>
                <input
                  type="text"
                  value={adminData.job_title}
                  onChange={e => setAdminData({...adminData, job_title: e.target.value})}
                  placeholder="Security Manager"
                  className="w-full rounded-xl h-11 px-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                  onFocus={e => e.target.style.borderColor = '#f7b91c'}
                  onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={e => setAdminData({...adminData, email: e.target.value})}
                    placeholder="john@coreguard.co.uk"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Mobile Phone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="tel"
                    value={adminData.phone}
                    onChange={e => setAdminData({...adminData, phone: e.target.value})}
                    placeholder="+44 7700 900123"
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminData.password}
                    onChange={e => setAdminData({...adminData, password: e.target.value})}
                    placeholder="Create a strong password"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-10 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676767] hover:text-[#a1a0a0]"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Confirm Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={adminData.confirm_password}
                    onChange={e => setAdminData({...adminData, confirm_password: e.target.value})}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-xl h-11 pl-9 pr-10 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676767] hover:text-[#a1a0a0]"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-[#1e1e1e] transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: '#f7b91c' }}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Subscription */}
          {step === 3 && (
            <form onSubmit={handleSubscriptionNext} className="flex flex-col gap-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Choose your plan</h3>
                <p className="text-sm text-[#676767]">Start free and upgrade as you grow</p>
              </div>

              <div className="flex flex-col gap-3">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSubscriptionData({...subscriptionData, plan: plan.id})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      subscriptionData.plan === plan.id
                        ? 'border-[#f7b91c] bg-[#f7b91c]/5'
                        : 'border-[#2e2e2e] bg-[#171717] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{plan.name}</h4>
                        <p className="text-2xl font-bold mt-1" style={{ color: '#f7b91c' }}>{plan.price}</p>
                      </div>
                      {plan.popular && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ background: '#f7b91c', color: '#1e1e1e' }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="text-xs text-[#a1a0a0] flex items-center gap-2">
                          <Check size={12} style={{ color: '#f7b91c' }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#a1a0a0] font-semibold">Billing Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#676767]" />
                  <input
                    type="email"
                    value={subscriptionData.billing_email}
                    onChange={e => setSubscriptionData({...subscriptionData, billing_email: e.target.value})}
                    placeholder="billing@coreguard.co.uk"
                    className="w-full rounded-xl h-11 pl-9 pr-4 text-sm text-white placeholder:text-[#676767] outline-none transition-all"
                    style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                    onFocus={e => e.target.style.borderColor = '#f7b91c'}
                    onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-[#1e1e1e] transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: '#f7b91c' }}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Review & Activate */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f7b91c' }}>
                  <Check size={32} className="text-[#1e1e1e]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to activate</h3>
                <p className="text-sm text-[#676767]">Review your details and create your CoreGuard account</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: '#171717', border: '1px solid #2e2e2e' }}>
                  <h4 className="text-sm font-semibold text-white mb-2">Company Details</h4>
                  <div className="space-y-1 text-xs text-[#a1a0a0]">
                    <p><span className="text-[#676767]">Name:</span> {orgData.name}</p>
                    <p><span className="text-[#676767]">Email:</span> {orgData.email}</p>
                    <p><span className="text-[#676767]">Industry:</span> {orgData.industry || 'Not specified'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#171717', border: '1px solid #2e2e2e' }}>
                  <h4 className="text-sm font-semibold text-white mb-2">Admin Account</h4>
                  <div className="space-y-1 text-xs text-[#a1a0a0]">
                    <p><span className="text-[#676767]">Name:</span> {adminData.first_name} {adminData.last_name}</p>
                    <p><span className="text-[#676767]">Email:</span> {adminData.email}</p>
                    <p><span className="text-[#676767]">Job Title:</span> {adminData.job_title || 'Not specified'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#171717', border: '1px solid #2e2e2e' }}>
                  <h4 className="text-sm font-semibold text-white mb-2">Subscription Plan</h4>
                  <div className="space-y-1 text-xs text-[#a1a0a0]">
                    <p><span className="text-[#676767]">Plan:</span> {SUBSCRIPTION_PLANS.find(p => p.id === subscriptionData.plan)?.name}</p>
                    <p><span className="text-[#676767]">Price:</span> {SUBSCRIPTION_PLANS.find(p => p.id === subscriptionData.plan)?.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#171717', border: '1px solid #2e2e2e' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl h-11 text-sm font-bold text-[#1e1e1e] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: '#f7b91c' }}
                >
                  {loading ? 'Creating Account...' : 'Activate Account'}
                  <Shield size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-[#676767]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:opacity-90 transition-all"
                style={{ color: '#f7b91c' }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
