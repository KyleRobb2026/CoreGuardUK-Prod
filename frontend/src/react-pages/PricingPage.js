import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, XIcon, ChevronDown, ArrowRightIcon,
  ShieldCheck, Users, MapPin, Phone, FileText,
  CheckCircle, LinkedinIcon, TwitterIcon, MailIcon,
  MinusIcon, PlusIcon,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

export default function PricingPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

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

  const plans = [
    {
      name: 'Starter',
      price: 'TBC',
      period: '/month',
      description: 'For small security teams getting started.',
      features: ['Up to 10 officers', 'Up to 3 sites', 'Basic scheduling', 'Mobile app access', 'Email support', 'Monthly reports', 'Basic compliance tracking'],
      cta: 'Join Waitlist',
      highlight: false,
    },
    {
      name: 'Professional',
      price: 'TBC',
      period: '/month',
      description: 'For growing security companies.',
      features: ['Up to 50 officers', 'Up to 10 sites', 'Advanced scheduling', 'Priority mobile features', 'Phone & email support', 'Weekly reports & analytics', 'Full compliance engine', 'API access', 'Custom digital forms', 'Lone worker safety'],
      cta: 'Join Waitlist',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale national operations.',
      features: ['Unlimited officers', 'Unlimited sites', 'Enterprise scheduling', 'White-label options', '24/7 dedicated support', 'Real-time analytics', 'Full compliance suite', 'Advanced API & integrations', 'Custom workflow automation', 'Dedicated account manager'],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  const faqs = [
    { question: 'When will pricing be finalised?', answer: 'We\'re currently in alpha development. Pricing will be announced as we approach beta release. Join our waitlist to be the first to know and receive early-adopter discounts.' },
    { question: 'Can I change my plan later?', answer: 'Yes. You\'ll be able to upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.' },
    { question: 'Is there a long-term contract?', answer: 'We\'ll offer both monthly and annual billing. Annual plans will come with a discount and additional benefits.' },
    { question: 'What payment methods will you accept?', answer: 'We\'ll accept all major credit/debit cards, direct debit, and bank transfers. Purchase orders available for enterprise customers.' },
    { question: 'Can I import my existing data?', answer: 'Yes. We\'ll provide data migration support for all plans, with dedicated migration assistance for Professional and Enterprise customers.' },
    { question: 'Is my data secure?', answer: 'Absolutely. CoreGuard uses enterprise-grade encryption, role-based access controls, and is hosted on secure UK/EU infrastructure. Your data never leaves compliant environments.' },
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
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} className={`transition hover:text-white ${link.href === '/pricing' ? 'text-white' : ''}`}>{link.name}</a>
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
        <div className="flex flex-wrap items-center justify-center rounded-full border border-[#f7b91c]/20 bg-[#f7b91c]/5 p-1.5 px-4 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#f7b91c] animate-pulse mr-2" />
          <p className="text-[#f7b91c] text-xs font-medium">Alpha Phase — Pricing Coming Soon</p>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Simple, Transparent </span>
          <span className="bg-gradient-to-b from-[#f7b91c] to-[#d4a017] bg-clip-text text-transparent">Pricing</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          We're currently in alpha. Pricing will be finalised as we approach beta. Join our waitlist to shape our plans and get early-adopter rates.
        </p>
      </section>

      {/* PLANS */}
      <section className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-[#1a1a1a] rounded-xl p-6 transition duration-300 ${plan.highlight ? 'border-2 border-[#f7b91c] shadow-lg shadow-[#f7b91c]/5' : 'border border-[#262626] hover:border-[#f7b91c]/30'}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#f7b91c] to-[#d4a017] text-[#1a1a1a] px-4 py-1 rounded-full text-xs font-bold">Recommended</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-[13px] mb-5">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-[#f7b91c]">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-400 text-[13px]">
                    <CheckCircle className="size-3.5 text-[#f7b91c] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/contact')}
                className={`w-full py-3 rounded-full font-semibold transition text-sm ${plan.highlight
                  ? 'bg-gradient-to-r from-[#f7b91c] to-[#d4a017] text-[#1a1a1a] hover:opacity-90'
                  : 'border border-[#555] text-white hover:border-[#f7b91c]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ALPHA NOTICE */}
      <section className="px-6 py-28 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto bg-[#1a1a1a] border border-[#262626] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Alpha Development Phase</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            CoreGuard is currently in alpha development. We're building the platform from the ground up with input from early security industry partners. Join our programme to help shape features, pricing, and get exclusive early-adopter benefits.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Early Access', desc: 'Shape the platform' },
              { title: 'Partner Input', desc: 'Influence features & pricing' },
              { title: 'Founder Rates', desc: 'Locked-in discounts' },
            ].map((item, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-[#f7b91c]/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#f7b91c] font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/contact')} className="bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition">
            Join Alpha Programme
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Pricing FAQ</h2>
          <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Common questions about CoreGuard pricing and plans.</p>
        </div>
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

      {/* CTA */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Ready to Get Started?</h2>
          <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Join our alpha programme and be among the first to use CoreGuard.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button onClick={() => navigate('/onboarding')} className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition">
            Get Started Free <ArrowRightIcon className="size-4" />
          </button>
          <button onClick={() => navigate('/contact')} className="flex items-center gap-2 border border-[#555] hover:border-[#f7b91c] text-white px-8 py-3.5 rounded-full transition">
            Talk to Sales
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
            <a href="mailto:info@coreguarduk.com"><MailIcon className="size-5 text-gray-600 hover:text-[#f7b91c] transition" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
