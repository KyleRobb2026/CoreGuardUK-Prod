import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, XIcon, ChevronDown, ArrowRightIcon,
  ShieldCheck, Users, MapPin, ClipboardCheck, Phone, FileText,
  CheckCircle, LinkedinIcon, TwitterIcon, MailIcon,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const links = [
    { name: 'Home', href: '/' },
    {
      name: 'Products',
      subLinks: [
        { name: 'Personnel Management', href: '/products', icon: Users, description: 'Manage your entire workforce' },
        { name: 'Site Management', href: '/products', icon: MapPin, description: 'Control all your locations' },
        { name: 'Compliance Engine', href: '/products', icon: ShieldCheck, description: 'Automated SIA enforcement' },
        { name: 'Check Calls', href: '/products', icon: Phone, description: 'Real-time welfare monitoring' },
        { name: 'Audit & Reporting', href: '/products', icon: FileText, description: 'Full traceability & logs' },
      ],
    },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  const modules = [
    {
      title: 'Personnel Management',
      icon: Users,
      description: 'Complete workforce registry with identity verification, role assignment, and document management.',
      features: ['Officer profiles & documents', 'SIA licence tracking', 'Role-based access control', 'Training record management', 'BS7858 vetting support', 'Emergency contact registry'],
    },
    {
      title: 'Site Management',
      icon: MapPin,
      description: 'Full control over every location — assignments, protocols, client requirements, and operational procedures.',
      features: ['Multi-site dashboard', 'Assignment instructions', 'Client-specific protocols', 'Site risk assessments', 'Asset tracking', 'Geo-fenced check-ins'],
    },
    {
      title: 'Compliance Engine',
      icon: ShieldCheck,
      description: 'Automated licence monitoring that blocks non-compliant deployments before they happen.',
      features: ['Real-time licence validation', 'Expiry alerts & warnings', 'Deployment blocking rules', 'Compliance scoring', 'Regulatory change tracking', 'Automated enforcement'],
    },
    {
      title: 'Check Calls',
      icon: Phone,
      description: 'Real-time welfare monitoring with automated escalation for lone workers and high-risk sites.',
      features: ['Scheduled welfare checks', 'GPS-stamped responses', 'Missed call escalation', 'Lone worker protection', 'Supervisor alerts', 'Full audit trail'],
    },
    {
      title: 'Audit & Reporting',
      icon: FileText,
      description: 'Every action logged, every decision traceable. Generate inspection-ready reports in seconds.',
      features: ['Immutable audit logs', 'Custom report builder', 'Compliance dashboards', 'Export to PDF/CSV', 'SIA inspection packs', 'Trend analytics'],
    },
    {
      title: 'Operations Centre',
      icon: ClipboardCheck,
      description: 'Real-time operational visibility — shift management, incident reporting, and live site status.',
      features: ['Live shift tracker', 'Incident reporting', 'Digital forms & signatures', 'Shift handover notes', 'Real-time notifications', 'Duty roster management'],
    },
  ];

  const techFeatures = [
    { title: 'Infrastructure', items: ['UK/EU hosted infrastructure', 'End-to-end encryption', 'Role-based access controls', 'Regular penetration testing', 'Automated backups', 'GDPR compliant architecture'] },
    { title: 'Integration & API', items: ['RESTful API access', 'Webhook support', 'Payroll system integration', 'HR platform connectors', 'Custom data exports', 'Mobile SDK (coming soon)'] },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-sm antialiased text-gray-300">

      {/* BANNER */}
      <div className="flex w-full flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] py-2 text-center font-medium text-[#1a1a1a]">
        <p className="text-sm">CoreGuard UK — Professional Security Management Platform</p>
        <button onClick={() => navigate('/onboarding')} className="ml-2 flex items-center gap-1 rounded-md bg-[#1a1a1a] px-3 py-1 text-[#f7b91c] text-xs font-semibold transition hover:bg-[#262626] active:scale-95">
          Get Started <ArrowRightIcon className="size-3.5" />
        </button>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#0f0f0f]/80 px-4 py-3.5 backdrop-blur-md border-b border-[#262626] md:px-16 lg:px-24">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <img src={LOGO_URL} alt="CoreGuard UK" className="h-9 w-auto" />
        </a>
        <div className="hidden items-center space-x-7 text-gray-400 md:flex">
          {links.map((link) =>
            link.subLinks ? (
              <div key={link.name} className="group relative" onMouseEnter={() => setOpenDropdown(link.name)} onMouseLeave={() => setOpenDropdown(null)}>
                <div className="flex cursor-pointer items-center gap-1 text-white transition">
                  {link.name} <ChevronDown className={`mt-px size-4 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                </div>
                <div className={`absolute top-8 left-0 z-40 w-[28rem] rounded-lg border border-[#333] bg-[#1a1a1a] p-3 shadow-xl transition-all duration-200 ${openDropdown === link.name ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                  <p className="text-gray-500 text-xs px-2 pb-2">Explore our platform</p>
                  <div className="grid grid-cols-2 gap-1">
                    {link.subLinks.map((sub) => (
                      <a href={sub.href} key={sub.name} onClick={(e) => { e.preventDefault(); navigate(sub.href); }} className="group/link flex items-center gap-2.5 rounded-md p-2.5 transition hover:bg-[#262626]">
                        <div className="flex shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-[#f7b91c] to-[#d4a017] p-2">
                          <sub.icon className="size-4 text-[#1a1a1a]" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs">{sub.name}</p>
                          <p className="text-gray-500 text-[11px]">{sub.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} className="transition hover:text-white">{link.name}</a>
            )
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-white hover:text-[#f7b91c] transition text-sm">Log In</button>
          <button onClick={() => navigate('/onboarding')} className="rounded-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] px-6 py-2 font-medium text-[#1a1a1a] transition hover:opacity-90">Sign Up</button>
        </div>
        <button onClick={() => setMobileOpen(true)} className="transition active:scale-90 md:hidden text-white"><MenuIcon className="size-6" /></button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[#0f0f0f]/95 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {links.map((link) => (
          <div key={link.name} className="text-center">
            {link.subLinks ? (
              <button onClick={() => navigate('/products')} className="text-gray-300 hover:text-white transition">{link.name}</button>
            ) : (
              <a href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); setMobileOpen(false); }} className="text-gray-300 hover:text-white transition">{link.name}</a>
            )}
          </div>
        ))}
        <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="text-white hover:text-[#f7b91c]">Log In</button>
        <button onClick={() => { navigate('/onboarding'); setMobileOpen(false); }} className="rounded-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] px-8 py-2.5 font-medium text-[#1a1a1a]">Sign Up</button>
        <button onClick={() => setMobileOpen(false)} className="mt-4 rounded-md bg-gradient-to-r from-[#f7b91c] to-[#d4a017] p-2 text-[#1a1a1a]"><XIcon className="size-5" /></button>
      </div>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16">
        <div className="flex flex-wrap items-center justify-center rounded-full border border-[#f7b91c]/20 bg-[#f7b91c]/5 p-1.5 px-4 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#f7b91c] animate-pulse mr-2" />
          <p className="text-[#f7b91c] text-xs font-medium">Platform Overview</p>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Everything You Need to Run </span>
          <span className="bg-gradient-to-b from-[#f7b91c] to-[#d4a017] bg-clip-text text-transparent">Security Operations</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          Six integrated modules covering personnel, sites, compliance, check calls, reporting, and live operations — all in one platform.
        </p>
      </section>

      {/* MODULES */}
      <section className="px-6 py-28 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-[#f7b91c]/30 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#f7b91c] to-[#d4a017] flex items-center justify-center mb-5">
                <mod.icon className="size-6 text-[#1a1a1a]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{mod.title}</h3>
              <p className="text-gray-400 text-[14px] leading-relaxed mb-5">{mod.description}</p>
              <ul className="space-y-2">
                {mod.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-400 text-[13px]">
                    <CheckCircle className="size-3.5 text-[#f7b91c] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNICAL */}
      <section className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-14">
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Technical Foundation</h2>
            <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Built with security-first architecture and designed for integration with your existing workflows.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {techFeatures.map((col, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">{col.title}</h3>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-400 text-[14px]">
                      <CheckCircle className="size-4 text-[#f7b91c] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Ready to See It in Action?</h2>
          <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Get started with CoreGuard today and take control of your security operations.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button onClick={() => navigate('/onboarding')} className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition">
            Get Started Free <ArrowRightIcon className="size-4" />
          </button>
          <button onClick={() => navigate('/contact')} className="flex items-center gap-2 border border-[#555] hover:border-[#f7b91c] text-white px-8 py-3.5 rounded-full transition">
            Contact Sales
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-16 lg:px-24 text-[13px] border-t border-[#262626] bg-[#0a0a0a]">
        <div className="flex flex-wrap items-start gap-10 py-16 md:gap-16">
          <div className="max-w-xs">
            <img src={LOGO_URL} alt="CoreGuard UK" className="h-10 w-auto mb-4" />
            <p className="text-gray-500 leading-relaxed">Enterprise security management for UK-regulated private security companies.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Platform</p>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Security'].map((t) => (
                <li key={t}><a href={`/${t.toLowerCase()}`} onClick={(e) => { e.preventDefault(); navigate(`/${t.toLowerCase()}`); }} className="text-gray-500 hover:text-[#f7b91c] transition">{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Company</p>
            <ul className="space-y-2.5">
              {[{ t: 'About Us', h: '/about' }, { t: 'Contact', h: '/contact' }].map((l) => (
                <li key={l.t}><a href={l.h} onClick={(e) => { e.preventDefault(); navigate(l.h); }} className="text-gray-500 hover:text-[#f7b91c] transition">{l.t}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row py-6 border-t border-[#262626] md:justify-between max-md:items-center gap-3 items-end">
          <p className="text-gray-600">&copy; 2026 CoreGuard UK Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><LinkedinIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><TwitterIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" /></a>
            <a href="mailto:info@coreguarduk.com"><MailIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
