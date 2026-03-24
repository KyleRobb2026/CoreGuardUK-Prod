import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseTest from '../components/SupabaseTest';
import EnvTest from '../components/EnvTest';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#262626] text-white">
      <div className="relative z-10">
      <style>
        {`
          :root {
            scroll-behavior: smooth;
          }
          .brand__icon {
            background: -webkit-repeating-radial-gradient(
              circle,
              #0EAC00,
              #0EAC00 2px,
              #632D3F 2px,
              #632D3F 8px
            );
            background: repeating-radial-gradient(
              circle,
              #0EAC00,
              #0EAC00 2px,
              #632D3F 2px,
              #632D3F 8px
            );
          }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="fixed w-full bg-[#262626] border-b border-[#632D3F]/30 backdrop-blur-md z-50">
        <div className="px-12 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" style={{width: 'calc(100% - 100px)', maxWidth: '300px'}} />
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-white hover:text-[#eeba2b] transition-colors">Home</a>
              <a href="#features" className="text-[#eeba2b] hover:text-white transition-colors">Features</a>
              <a href="/about" className="text-[#eeba2b] hover:text-white transition-colors">About</a>
              <a href="/products" className="text-[#eeba2b] hover:text-white transition-colors">Products</a>
              <a href="/pricing" className="text-[#eeba2b] hover:text-white transition-colors">Pricing</a>
              <a href="/security" className="text-[#eeba2b] hover:text-white transition-colors">Security</a>
              <a href="/contact" className="text-[#eeba2b] hover:text-white transition-colors">Contact</a>
            </nav>
            
            {/* CTA Button */}
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#eeba2b] hover:bg-[#d4a526] text-[#262626] px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Access Platform
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="pt-32 pb-20 bg-[#262626] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#262626] via-[#262626] to-[#33262B] opacity-50"></div>
        <div className="px-12 mx-auto max-w-7xl relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eeba2b]/10 border border-[#eeba2b]/30 text-[#eeba2b] text-sm font-semibold mb-8">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Alpha Phase - Early Development
            </div>
            <h1 className="mb-6 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
              <span className="block">Security Management</span>
              <span className="block w-full py-2 text-transparent bg-clip-text bg-gradient-to-r from-[#eeba2b] to-[#B04F6F]">for Regulated Environments</span>
              <span className="block text-4xl md:text-6xl mt-2">in the UK</span>
            </h1>
            <p className="mb-10 text-xl md:text-2xl text-[#eeba2b] leading-relaxed max-w-4xl mx-auto">
              Enterprise-grade Security Management System designed for regulated private security organisations. Single source of truth for operational control, workforce legitimacy, and audit-ready reporting.
            </p>
            <div className="mb-10 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center w-full px-8 py-4 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl sm:w-auto hover:bg-[#d4a526] transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                Request Alpha Access
                <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center justify-center w-full px-8 py-4 text-lg bg-[#33262B] text-white rounded-2xl sm:w-auto hover:bg-[#634B53] transition-all transform hover:scale-105 border border-[#632D3F]/30"
              >
                Learn More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0 text-[#eeba2b] justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#eeba2b]/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Founded 2026</div>
                  <div className="text-sm opacity-80">UK-Based Company</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#eeba2b]/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Certification-Aligned</div>
                  <div className="text-sm opacity-80">ISO 27001 & 9001 Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1e1e1e]">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-xl text-[#eeba2b]">Built on four foundational principles for regulated security organisations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identity-First Architecture",
                desc: "Structured onboarding with Role-Based Access Control and secure authentication.",
                icon: "👤",
                features: ["Personnel registry", "RBAC permissions", "Secure authentication", "Session control"]
              },
              {
                title: "Workforce & Licensing Control",
                desc: "Personnel registry with licence tracking, expiry monitoring, and eligibility enforcement.",
                icon: "🛡️",
                features: ["Licence tracking", "Expiry monitoring", "Eligibility enforcement", "PIN-based verification"]
              },
              {
                title: "Operational Management",
                desc: "Site deployment management with shift tracking, incident reporting, and patrol tracking.",
                icon: "🏢",
                features: ["Site management", "Shift tracking", "Incident reporting", "Patrol tracking"]
              },
              {
                title: "Compliance Engine",
                desc: "Automated licence monitoring with real-time compliance alerts and risk scoring.",
                icon: "✅",
                features: ["Automated monitoring", "Real-time alerts", "Risk scoring", "Enforcement actions"]
              },
              {
                title: "Audit & Reporting",
                desc: "Immutable audit logs with full traceability and regulator-ready reporting.",
                icon: "📋",
                features: ["Immutable logs", "Full traceability", "Regulator reporting", "Audit trails"]
              },
              {
                title: "Secure Document Storage",
                desc: "Controlled access to sensitive documents with compliance evidence management.",
                icon: "🔒",
                features: ["Controlled access", "Evidence management", "Auditable file handling", "Secure storage"]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-[#632D3F]/30">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-[#eeba2b] mb-4">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-[#eeba2b] text-sm">
                      <svg className="w-3 h-3 mr-2 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supabase Connection Test */}
      <section className="py-20 bg-[#262626]">
        <div className="px-12 mx-auto max-w-7xl">
          <SupabaseTest />
        </div>
      </section>

      {/* Environment Variables Test */}
      <section className="py-20 bg-[#262626]">
        <div className="px-12 mx-auto max-w-7xl">
          <EnvTest />
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-[#262626]">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#eeba2b] mb-2">2026</div>
              <div className="text-[#eeba2b]">Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#eeba2b] mb-2">Alpha</div>
              <div className="text-[#eeba2b]">Development Stage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#eeba2b] mb-2">UK</div>
              <div className="text-[#eeba2b]">Based</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1e1e1e]">
        <div className="px-12 mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join the Alpha Program</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Be part of the next generation security management platform. Help shape the future of regulated security operations from the ground up.
          </p>
          <div className="space-x-0 md:space-x-2">
            <button className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors">
              Request Alpha Access
              <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              Learn More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-[#170A0F] text-white">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" className="mb-3" style={{width: 'calc(100% - 100px)', maxWidth: '300px'}} />
              <div className="text-[#eeba2b]">Enterprise Security Management Platform</div>
            </div>
            <div className="flex gap-8">
              <a href="/" className="text-[#eeba2b] hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-[#eeba2b] hover:text-white transition-colors">About</a>
              <a href="/products" className="text-[#eeba2b] hover:text-white transition-colors">Products</a>
              <a href="/pricing" className="text-[#eeba2b] hover:text-white transition-colors">Pricing</a>
              <a href="/security" className="text-[#eeba2b] hover:text-white transition-colors">Security</a>
              <a href="/contact" className="text-[#eeba2b] hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-[#eeba2b]/60">
            © 2026 CoreGuard SMS. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
