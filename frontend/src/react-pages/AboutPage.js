import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, XIcon, ChevronDown, ArrowRightIcon,
  ShieldCheck, Users, MapPin, Phone, FileText,
  Target, Eye, Fingerprint, Scale, Shield, Cpu,
  LinkedinIcon, TwitterIcon, MailIcon,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

export default function AboutPage() {
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
    { name: 'Status', href: 'https://coreguard-support-production.up.railway.app/status', external: true },
    { name: 'Documentation', href: 'https://coreguard-support-production.up.railway.app/docs', external: true },
  ];

  const principles = [
    { title: 'Identity-First Architecture', description: 'Every officer verified, every licence validated, every deployment authorised.', icon: Fingerprint },
    { title: 'Compliance by Default', description: 'Non-compliant actions are blocked automatically — not flagged after the fact.', icon: Scale },
    { title: 'Operational Control', description: 'Real-time visibility across every site, shift, and officer in your operation.', icon: Shield },
    { title: 'Audit-Ready at All Times', description: 'Every action logged with immutable trails. Ready for SIA inspection at any moment.', icon: Cpu },
  ];

  const values = [
    { title: 'Security First', description: 'Security is not just what we build — it\'s how we build. Every decision prioritises the safety of your data and operations.' },
    { title: 'Built for the Industry', description: 'We understand UK security regulations because we built CoreGuard alongside security professionals who live them daily.' },
    { title: 'Relentless Improvement', description: 'We ship fast, listen closely, and iterate constantly. CoreGuard gets better every single week.' },
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
                <div className="flex cursor-pointer items-center gap-1 hover:text-white transition">
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
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} className={`transition hover:text-white ${link.href === '/about' ? 'text-white' : ''}`}>{link.name}</a>
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
              <button onClick={() => { navigate('/products'); setMobileOpen(false); }} className="text-gray-300 hover:text-white transition">{link.name}</button>
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">About </span>
          <span className="bg-gradient-to-b from-[#f7b91c] to-[#d4a017] bg-clip-text text-transparent">CoreGuard UK</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          An enterprise-grade security management system designed for UK-regulated private security organisations. Built from the ground up to enforce compliance and deliver operational control.
        </p>
      </section>

      {/* COMPANY STORY */}
      <section className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="max-w-lg">
            <h2 className="text-2xl uppercase font-bold text-white tracking-wide mb-6">Our Story</h2>
            <p className="text-gray-400 leading-relaxed text-[15px]">
              Founded in 2026, CoreGuard UK is an enterprise-grade Security Management System designed for regulated private security organisations. We serve as a single source of truth for operational control, workforce legitimacy, compliance enforcement, and audit-ready reporting.
            </p>
            <p className="mt-4 text-gray-400 leading-relaxed text-[15px]">
              Currently in alpha phase, we are actively developing and refining the platform from the ground up. Our system is built with full awareness of regulatory and industry standards, with architecture designed to support future certifications.
            </p>
            <p className="mt-4 text-gray-400 leading-relaxed text-[15px]">
              While we don't currently hold formal certifications, we're engineering the platform to meet and exceed ISO 27001, ISO 9001, and UK security framework requirements from the ground up.
            </p>
          </div>
          {/* Stats card */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 w-full max-w-sm">
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '2026', label: 'Founded' },
                { value: 'Alpha', label: 'Current Stage' },
                { value: 'UK', label: 'Headquarters' },
                { value: 'Aligned', label: 'Certification Ready' },
              ].map((stat, i) => (
                <div key={i} className="text-center bg-[#0f0f0f] rounded-lg p-4 border border-[#262626]">
                  <div className="text-xl font-bold text-[#f7b91c]">{stat.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="px-6 py-28 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-14">
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Core Philosophy</h2>
            <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">What drives every decision we make at CoreGuard.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#f7b91c] to-[#d4a017] flex items-center justify-center">
                  <Target className="size-5 text-[#1a1a1a]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-[14px]">
                To become the standard operating system for regulated security organisations, delivering automated compliance, real-time operational control, and full accountability within a single, secure, scalable system.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#f7b91c] to-[#d4a017] flex items-center justify-center">
                  <Eye className="size-5 text-[#1a1a1a]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Our Vision</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-[14px]">
                To redefine how regulated security organisations manage workforce legitimacy, operational deployment, and compliance enforcement through next-generation security management technology.
              </p>
            </div>
          </div>

          {/* Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {principles.map((p, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 text-center hover:border-[#f7b91c]/30 transition duration-300">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-[#f7b91c] to-[#d4a017] flex items-center justify-center mx-auto mb-4">
                  <p.icon className="size-5 text-[#1a1a1a]" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-2">{p.title}</h4>
                <p className="text-gray-500 text-[13px] leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-14">
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Our Values</h2>
            <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">The principles that guide how we build, ship, and support CoreGuard.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f7b91c]/20 to-[#d4a017]/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-[#f7b91c] font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Join Our Mission</h2>
          <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Ready to transform your security operations? Let's discuss how CoreGuard can help your organisation achieve excellence.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button onClick={() => navigate('/contact')} className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition">
            Contact Us <ArrowRightIcon className="size-4" />
          </button>
          <button onClick={() => navigate('/products')} className="flex items-center gap-2 border border-[#555] hover:border-[#f7b91c] text-white px-8 py-3.5 rounded-full transition">
            View Products
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
              {[{ t: 'Features', h: '/products' }, { t: 'Pricing', h: '/pricing' }, { t: 'Security', h: '/security' }].map((l) => (
                <li key={l.t}><a href={l.h} onClick={(e) => { e.preventDefault(); navigate(l.h); }} className="text-gray-500 hover:text-[#f7b91c] transition">{l.t}</a></li>
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
            <a href="mailto:info@coreguard-uk.co.uk"><MailIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
