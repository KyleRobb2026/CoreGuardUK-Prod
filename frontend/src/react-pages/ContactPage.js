import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, XIcon, ChevronDown, ArrowRightIcon,
  ShieldCheck, Users, MapPin, Phone, FileText,
  MailIcon, LinkedinIcon, TwitterIcon, MapPinIcon, Clock,
} from 'lucide-react';

const LOGO_URL = 'https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png';

export default function ContactPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', message: '', interest: 'demo',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you within 24 hours.');
    setFormData({ name: '', email: '', company: '', phone: '', message: '', interest: 'demo' });
  };

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

  const contactInfo = [
    { icon: MailIcon, title: 'Email', value: 'info@coreguard-uk.co.uk', href: 'mailto:info@coreguard-uk.co.uk' },
    { icon: Phone, title: 'Phone', value: '+44 (0) 800 000 0000', href: 'tel:+448000000000' },
    { icon: MapPinIcon, title: 'Location', value: 'United Kingdom', href: null },
    { icon: Clock, title: 'Response Time', value: 'Within 24 hours', href: null },
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
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} className={`transition hover:text-white ${link.href === '/contact' ? 'text-white' : ''}`}>{link.name}</a>
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
          <p className="text-[#f7b91c] text-xs font-medium">Alpha Programme — Join Now</p>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Get in </span>
          <span className="bg-gradient-to-b from-[#f7b91c] to-[#d4a017] bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          Interested in joining our alpha programme or have questions about CoreGuard? We'd love to hear from you.
        </p>
      </section>

      {/* FORM + INFO */}
      <section className="px-6 py-28 md:px-16 lg:px-24 bg-[#1a1a1a]/50 border-y border-[#262626]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8">

          {/* Form — 3 cols */}
          <div className="md:col-span-3 bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition placeholder:text-gray-600"
                    placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition placeholder:text-gray-600"
                    placeholder="john@company.co.uk" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition placeholder:text-gray-600"
                    placeholder="Security Company Ltd" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition placeholder:text-gray-600"
                    placeholder="+44 7700 900000" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">I'm interested in...</label>
                <select name="interest" value={formData.interest} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition">
                  <option value="demo">Product Demo</option>
                  <option value="alpha">Alpha Programme</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="enterprise">Enterprise Solutions</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#262626] rounded-lg text-white text-sm focus:border-[#f7b91c] focus:outline-none transition resize-none placeholder:text-gray-600"
                  placeholder="Tell us about your security operations needs..." />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#f7b91c] to-[#d4a017] text-[#1a1a1a] py-3.5 rounded-full font-semibold hover:opacity-90 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Info — 2 cols */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact cards */}
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#f7b91c]/10 to-[#d4a017]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="size-4 text-[#f7b91c]" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-white text-sm font-medium hover:text-[#f7b91c] transition">{item.value}</a>
                      ) : (
                        <p className="text-white text-sm font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support hours */}
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Support Hours</h3>
              <div className="space-y-3">
                {[
                  { day: 'Monday – Friday', time: '9:00 AM – 5:30 PM GMT' },
                  { day: 'Saturday', time: '10:00 AM – 2:00 PM GMT' },
                  { day: 'Sunday', time: 'Email support only' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between text-[13px]">
                    <span className="text-gray-400">{row.day}</span>
                    <span className="text-white font-medium">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'View Products', href: '/products' },
                  { label: 'See Pricing', href: '/pricing' },
                  { label: 'About CoreGuard', href: '/about' },
                ].map((link, i) => (
                  <a key={i} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                    className="flex items-center justify-between text-[13px] text-gray-400 hover:text-[#f7b91c] transition group">
                    {link.label}
                    <ArrowRightIcon className="size-3.5 opacity-0 group-hover:opacity-100 transition" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-center px-6 py-28 md:px-16 lg:px-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">Prefer a Demo?</h2>
          <p className="mt-4 max-w-md text-center text-gray-400 md:max-w-xl leading-relaxed">Schedule a personalised walkthrough and see how CoreGuard can transform your security operations.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button onClick={() => navigate('/onboarding')} className="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3.5 rounded-full transition">
            Get Started Free <ArrowRightIcon className="size-4" />
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
