import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, XIcon, ChevronDown, ArrowRightIcon, MinusIcon, PlusIcon,
  ShieldCheck, Users, MapPin, ClipboardCheck, Phone, FileText,
  LinkedinIcon, TwitterIcon, MailIcon,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

/* ─── Smooth-scroll helper (replaces Lenis for React Router context) ─── */
function useSmoothScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const href = e.target.closest('a')?.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

/* ─── Reusable section title ─── */
function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  useSmoothScroll();

  /* ── Nav links ── */
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
    { name: 'Status', href: 'https://coreguard-support-production.up.railway.app/status', external: true },
    { name: 'Documentation', href: 'https://coreguard-support-production.up.railway.app/docs', external: true },
  ];

  /* ── What-we-do bullets ── */
  const whatWeDo = [
    'CoreGuard is an all-in-one security management platform built for UK private security companies.',
    'We handle workforce management, SIA licence compliance, site deployments, real-time check calls, and audit-ready reporting — so you can focus on delivering safe, professional services.',
    'From single-site operators to national firms, CoreGuard scales with your operation and keeps you inspection-ready at all times.',
  ];

  /* ── Feature cards ── */
  const features = [
    {
      title: 'Workforce Command',
      description: 'Centralised personnel registry with SIA licence tracking, identity verification, and role-based access control.',
      icon: Users,
    },
    {
      title: 'Compliance Engine',
      description: 'Automated licence monitoring, expiry enforcement, and deployment blocking for non-compliant officers.',
      icon: ShieldCheck,
    },
    {
      title: 'Operations Centre',
      description: 'Real-time site visibility, shift management, check-call monitoring, and instant incident reporting.',
      icon: ClipboardCheck,
    },
  ];

  /* ── FAQ ── */
  const faqs = [
    { question: 'What is CoreGuard and who is it for?', answer: 'CoreGuard is a security management platform designed for UK private security companies. It helps you manage personnel, enforce SIA licence compliance, schedule deployments, and generate audit-ready reports.' },
    { question: 'Do I need technical expertise to use CoreGuard?', answer: 'Not at all. CoreGuard is designed for security professionals, not developers. The interface is intuitive and our onboarding team will get you set up quickly.' },
    { question: 'How does CoreGuard handle SIA licence compliance?', answer: 'CoreGuard automatically monitors all officer licences, sends expiry warnings, and can block non-compliant officers from being deployed to sites — ensuring you stay inspection-ready.' },
    { question: 'Can CoreGuard integrate with my existing systems?', answer: 'Yes. CoreGuard offers API access and can integrate with payroll, HR, and scheduling tools. Contact our team for specific integration requirements.' },
    { question: 'Is my data secure?', answer: 'Absolutely. CoreGuard uses enterprise-grade encryption, role-based access controls, and is hosted on secure UK/EU infrastructure. Your data never leaves compliant environments.' },
    { question: 'How do I get started?', answer: 'Click "Get Started" to create your organisation account. You can onboard your team, import officers, and be fully operational within a day.' },
  ];

  /* ── Footer data ── */
  const footerCols = [
    {
      title: 'Platform',
      links: [
        { title: 'Features', href: '#features' },
        { title: 'Pricing', href: '/pricing' },
        { title: 'Security', href: '/security' },
        { title: 'Compliance', href: '#compliance' },
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/about' },
        { title: 'Contact', href: '/contact' },
        { title: 'Careers', href: '/contact' },
        { title: 'Partners', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { title: 'Privacy Policy', href: '/contact' },
        { title: 'Terms of Service', href: '/contact' },
        { title: 'Cookie Policy', href: '/contact' },
        { title: 'GDPR', href: '/contact' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-sm antialiased text-gray-300">

      {/* ═══ BANNER ═══ */}
      <div className="flex w-full flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] py-2 text-center font-medium text-[#1a1a1a]">
        <p className="text-sm">CoreGuard UK — Professional Security Management Platform</p>
        <button
          onClick={() => navigate('/onboarding')}
          className="ml-2 flex items-center gap-1 rounded-md bg-[#1a1a1a] px-3 py-1 text-[#f7b91c] text-xs font-semibold transition hover:bg-[#262626] active:scale-95"
        >
          Get Started
          <ArrowRightIcon className="size-3.5" />
        </button>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#0f0f0f]/80 px-4 py-3.5 backdrop-blur-md border-b border-[#262626] md:px-16 lg:px-24">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <img src={LOGO_URL} alt="CoreGuard UK" className="h-9 w-auto" />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center space-x-7 text-gray-400 md:flex">
          {links.map((link) =>
            link.subLinks ? (
              <div key={link.name} className="group relative" onMouseEnter={() => setOpenDropdown(link.name)} onMouseLeave={() => setOpenDropdown(null)}>
                <div className="flex cursor-pointer items-center gap-1 hover:text-white transition">
                  {link.name}
                  <ChevronDown className={`mt-px size-4 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                </div>
                <div className={`absolute top-8 left-0 z-40 w-[28rem] rounded-lg border border-[#333] bg-[#1a1a1a] p-3 shadow-xl transition-all duration-200 ease-in-out ${openDropdown === link.name ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                  <p className="text-gray-500 text-xs px-2 pb-2">Explore our platform</p>
                  <div className="grid grid-cols-2 gap-1">
                    {link.subLinks.map((sub) => (
                      <a
                        href={sub.href}
                        key={sub.name}
                        onClick={(e) => { e.preventDefault(); navigate(sub.href); }}
                        className="group/link flex items-center gap-2.5 rounded-md p-2.5 transition hover:bg-[#262626]"
                      >
                        <div className="flex shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-[#f7b91c] to-[#d4a017] p-2">
                          <sub.icon className="size-4 text-[#1a1a1a] transition duration-300 group-hover/link:scale-110" />
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
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                className="transition hover:text-white"
              >
                {link.name}
              </a>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-white hover:text-[#f7b91c] transition text-sm">
            Log In
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="rounded-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] px-6 py-2 font-medium text-[#1a1a1a] transition hover:opacity-90"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(true)} className="transition active:scale-90 md:hidden text-white">
          <MenuIcon className="size-6" />
        </button>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[#0f0f0f]/95 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {links.map((link) => (
          <div key={link.name} className="text-center">
            {link.subLinks ? (
              <>
                <button onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)} className="flex items-center justify-center gap-1 text-gray-300">
                  {link.name}
                  <ChevronDown className={`size-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === link.name && (
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    {link.subLinks.map((sub) => (
                      <a key={sub.name} href={sub.href} onClick={(e) => { e.preventDefault(); navigate(sub.href); setMobileOpen(false); }} className="text-gray-500 hover:text-white transition">
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); setMobileOpen(false); }} className="text-gray-300 hover:text-white transition">
                {link.name}
              </a>
            )}
          </div>
        ))}
        <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="text-white hover:text-[#f7b91c]">Log In</button>
        <button onClick={() => { navigate('/onboarding'); setMobileOpen(false); }} className="rounded-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] px-8 py-2.5 font-medium text-[#1a1a1a] transition hover:opacity-90">
          Sign Up
        </button>
        <button onClick={() => setMobileOpen(false)} className="mt-4 rounded-md bg-gradient-to-r from-[#f7b91c] to-[#d4a017] p-2 text-[#1a1a1a]">
          <XIcon className="size-5" />
        </button>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="flex flex-col items-center justify-center relative min-h-[90vh] overflow-hidden px-6 py-24 md:px-16">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://i.postimg.cc/1zccLMZj/The-Future-of-Security-Management-Starts-Here-(Website).png')`
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-[#0f0f0f]/80" />
        </div>
        
        {/* Background glow for additional depth */}
        <svg className="absolute inset-0 -z-10 w-full h-full mix-blend-screen" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g filter="url(#glow1)">
            <ellipse cx="300" cy="200" rx="300" ry="200" fill="#f7b91c" fillOpacity="0.06" />
          </g>
          <g filter="url(#glow2)">
            <ellipse cx="1100" cy="500" rx="400" ry="280" fill="#f7b91c" fillOpacity="0.04" />
          </g>
          <defs>
            <filter id="glow1" x="-200" y="-200" width="1000" height="800" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="150" /></filter>
            <filter id="glow2" x="500" y="20" width="1200" height="960" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="150" /></filter>
          </defs>
        </svg>

        <div className="flex flex-wrap items-center justify-center rounded-full border border-[#f7b91c]/20 bg-[#f7b91c]/5 p-1.5 px-4 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#f7b91c] animate-pulse mr-2" />
          <p className="text-[#f7b91c] text-xs font-medium">Now in Alpha — Early access available</p>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Command Your Security Operations with </span>
          <span className="bg-gradient-to-b from-[#f7b91c] to-[#d4a017] bg-clip-text text-transparent">CoreGuard</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          The all-in-one platform for UK security companies. Manage workforce, enforce SIA compliance, and run operations — from a single command centre.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3 rounded-full transition"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 border border-[#555] hover:border-[#f7b91c] text-white px-8 py-3 rounded-full transition"
          >
            Log In
          </button>
        </div>

      </section>

      {/* ═══ WHAT WE DO ═══ */}
      <section id="about" className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 py-28 md:px-16 lg:px-24">
        {/* Mock dashboard card */}
        <div className="relative shrink-0 rounded-2xl overflow-hidden border border-[#333] bg-[#1a1a1a] p-5 shadow-2xl shadow-[#f7b91c]/5 max-w-sm w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-auto text-[10px] text-gray-600 font-mono">coreguard.app/dashboard</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Officers', value: '127', color: 'text-white' },
              { label: 'Compliance', value: '94%', color: 'text-[#f7b91c]' },
              { label: 'Alerts', value: '3', color: 'text-orange-400' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0f0f0f] rounded-lg p-3 border border-[#262626]">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#0f0f0f] rounded-lg border border-[#262626]">
            {[
              { action: 'Licence verified', officer: 'J. Thompson', dot: 'bg-green-500', time: '2m' },
              { action: 'Shift started', officer: 'M. Patel', dot: 'bg-green-500', time: '5m' },
              { action: 'Licence expiring', officer: 'R. Davis', dot: 'bg-orange-400', time: '12m' },
            ].map((r, i) => (
              <div key={i} className="px-3 py-2 flex items-center justify-between border-b border-[#262626]/50 last:border-0 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                  <span className="text-gray-300">{r.action}</span>
                </div>
                <span className="text-gray-600">{r.time}</span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f7b91c]/5 rounded-full blur-3xl" />
        </div>

        {/* Text */}
        <div className="max-w-md">
          <h3 className="text-2xl uppercase font-bold text-white tracking-wide">What We Do</h3>
          <div className="w-20 h-[3px] rounded-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] mt-[7px]" />
          {whatWeDo.map((p, i) => (
            <p key={i} className="mt-[19px] text-gray-400 leading-relaxed text-[15px]">{p}</p>
          ))}
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-2 mt-8 hover:opacity-90 transition bg-gradient-to-r from-[#f7b91c] to-[#d4a017] py-3 px-8 rounded-full text-[#1a1a1a] font-semibold"
          >
            Learn More
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </section>

      {/* ═══ FEATURES (replaces "Our Latest Creations") ═══ */}
      <section id="features" className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <SectionTitle
          title="Built for Security Operations"
          subtitle="Three core modules designed to give you complete control over your workforce, compliance, and day-to-day operations."
        />
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-14">
          {features.map((item, index) => (
            <div key={index} className="max-w-xs w-full bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:-translate-y-1 hover:border-[#f7b91c]/30 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#f7b91c] to-[#d4a017] flex items-center justify-center mb-5">
                <item.icon className="size-6 text-[#1a1a1a]" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-gray-400 mt-3 leading-relaxed text-[14px]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPLIANCE SECTION ═══ */}
      <section id="compliance" className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            title="Compliance, Enforced Automatically"
            subtitle="CoreGuard actively prevents non-compliant deployments. Every licence tracked, every expiry monitored, every action logged."
          />
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              { name: 'James Thompson', licence: 'SIA DS-12847365', expiry: '14 Nov 2026', status: 'Compliant', color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5', dot: 'bg-green-500' },
              { name: 'Sarah Mitchell', licence: 'SIA DS-99281744', expiry: '02 Apr 2026', status: 'Expiring Soon', color: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/5', dot: 'bg-orange-400' },
              { name: 'Ryan Cooper', licence: 'SIA DS-44710283', expiry: '18 Jan 2025', status: 'Non-Compliant', color: 'text-red-400', border: 'border-red-400/20', bg: 'bg-red-400/5', dot: 'bg-red-400' },
            ].map((officer, i) => (
              <div key={i} className={`rounded-xl border ${officer.border} ${officer.bg} p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-xs font-bold text-white">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{officer.name}</p>
                    <p className="text-gray-500 text-xs font-mono">{officer.licence}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Expiry: {officer.expiry}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${officer.dot}`} />
                    <span className={`text-xs font-medium ${officer.color}`}>{officer.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about CoreGuard and how it can help your security operation."
        />
        <div className="mx-auto mt-14 w-full max-w-2xl">
          {faqs.map((item, index) => (
            <div key={index} className="flex flex-col border-b border-[#262626]">
              <h3
                className="flex cursor-pointer items-start justify-between gap-4 py-5 font-medium text-white hover:text-[#f7b91c] transition text-[15px]"
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
              >
                {item.question}
                {faqOpen === index
                  ? <MinusIcon className="size-5 text-[#f7b91c] shrink-0" />
                  : <PlusIcon className="size-5 text-gray-500 shrink-0" />
                }
              </h3>
              <p className={`pb-4 text-sm leading-relaxed text-gray-400 ${faqOpen === index ? 'block' : 'hidden'}`}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ NEWSLETTER / CTA ═══ */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <SectionTitle
          title="Ready to Take Control?"
          subtitle="Join security companies across the UK who trust CoreGuard to manage their operations and stay compliant."
        />
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 border border-[#555] hover:border-[#f7b91c] text-white px-8 py-3.5 rounded-full transition"
          >
            Contact Sales
          </button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 md:px-16 lg:px-24 text-[13px] border-t border-[#262626] bg-[#0a0a0a]">
        <div className="flex flex-wrap items-start gap-10 py-16 md:gap-16">
          <div className="max-w-xs">
            <img src={LOGO_URL} alt="CoreGuard UK" className="h-10 w-auto mb-4" />
            <p className="text-gray-500 leading-relaxed">
              Enterprise security management for UK-regulated private security companies. Operational control, compliance enforcement, audit-ready reporting.
            </p>
          </div>
          {footerCols.map((col, index) => (
            <div key={index}>
              <p className="font-semibold text-white mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (!link.href.startsWith('#')) { e.preventDefault(); navigate(link.href); }
                      }}
                      className="text-gray-500 hover:text-[#f7b91c] transition"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="max-w-xs md:ml-auto">
            <p className="font-semibold text-white mb-4">Stay Updated</p>
            <p className="text-gray-500 mb-4">Get the latest news and product updates from CoreGuard.</p>
            <div className="flex items-center border border-[#333] rounded-lg overflow-hidden">
              <input type="email" className="bg-transparent w-full text-white h-10 px-3 outline-none placeholder:text-gray-600 text-sm" placeholder="your@email.com" />
              <button className="flex shrink-0 items-center justify-center bg-gradient-to-r from-[#f7b91c] to-[#d4a017] text-[#1a1a1a] font-semibold h-10 px-5 text-xs">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row py-6 border-t border-[#262626] md:justify-between max-md:items-center gap-3 items-end">
          <p className="text-gray-600">&copy; 2026 CoreGuard UK Ltd. All rights reserved. Registered in England and Wales.</p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <LinkedinIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <TwitterIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" />
            </a>
            <a href="mailto:info@coreguard-uk.co.uk">
              <MailIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
