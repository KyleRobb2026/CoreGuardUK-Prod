import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#262626] text-white">
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
              <a href="/about" className="text-white hover:text-[#eeba2b] transition-colors">About</a>
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
      <section className="pt-24 pb-16 px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About CoreGuard SMS</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            Leading the future of security operations management with innovative technology and unwavering commitment to excellence.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">About CoreGuard SMS UK</h2>
              <p className="text-[#eeba2b] mb-4">
                Founded in 2026, CoreGuard SMS UK is an enterprise-grade Security Management System designed for regulated private security organisations. We serve as a single source of truth for operational control, workforce legitimacy, compliance enforcement, and audit-ready reporting.
              </p>
              <p className="text-[#eeba2b] mb-4">
                Currently in alpha phase, we are actively developing and refining the platform from the ground up. Our system is built with full awareness of regulatory and industry standards, with architecture designed to support future certifications.
              </p>
              <p className="text-[#eeba2b]">
                While we don't currently hold formal certifications, we're engineering the platform to meet and exceed ISO 27001, ISO 9001, and UK security framework requirements from the ground up.
              </p>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">2026</div>
                  <div className="text-[#eeba2b]">Founded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">Alpha</div>
                  <div className="text-[#eeba2b]">Stage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">UK</div>
                  <div className="text-[#eeba2b]">Based</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">Aligned</div>
                  <div className="text-[#eeba2b]">Certification Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Core Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Our Mission</h3>
              <p className="text-[#eeba2b]">
                To become the standard operating system for regulated security organisations, delivering automated compliance, real-time operational control, and full accountability and audit readiness within a single, secure, scalable system.
              </p>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Our Vision</h3>
              <p className="text-[#eeba2b]">
                To redefine how regulated security organisations manage workforce legitimacy, operational deployment, and compliance enforcement through next-generation security management technology.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Four Foundational Principles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Identity-First Architecture",
                "Compliance by Default",
                "Operational Control",
                "Audit-Ready at All Times"
              ].map((principle, index) => (
                <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center">
                  <div className="w-12 h-12 bg-[#eeba2b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-[#262626]">{index + 1}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#eeba2b]">{principle}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#eeba2b] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#262626]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Security First</h3>
              <p className="text-[#eeba2b]">Security is not just what we do—it's who we are. Every decision we make prioritizes the safety and protection of our clients and their assets.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#eeba2b] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#262626]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Customer Success</h3>
              <p className="text-[#eeba2b]">Our success is measured by our clients' success. We're dedicated to providing exceptional support and continuously improving based on customer feedback.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#eeba2b] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#262626]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-[#eeba2b]">We constantly push boundaries and challenge the status quo to deliver cutting-edge solutions that address real-world security challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Founding Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Mitchell",
                role: "Founder & CEO",
                bio: "Security industry veteran with 15+ years in regulated security operations and enterprise software development."
              },
              {
                name: "David Chen",
                role: "CTO & Co-Founder",
                bio: "Full-stack developer specializing in secure systems architecture and compliance-driven design."
              },
              {
                name: "Maria Rodriguez",
                role: "Head of Operations",
                bio: "Former security operations manager with deep expertise in UK security regulations and compliance frameworks."
              }
            ].map((member, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center">
                <div className="w-20 h-20 bg-[#eeba2b] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#262626]">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                <p className="text-[#eeba2b] font-semibold mb-3">{member.role}</p>
                <p className="text-[#eeba2b] text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Ready to transform your security operations? Let's discuss how CoreGuard SMS can help your organization achieve excellence.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Contact Us
              <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              Learn More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#170A0F] text-white">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="https://i.ibb.co/wZ2KpQtK/Core-Guard-SMS-Official-Logo-white-2-1.png" alt="CoreGuard SMS Official Logo" className="mb-3" style={{width: 'calc(100% - 100px)', maxWidth: '300px'}} />
              <div className="text-[#eeba2b]">Enterprise Security Management Platform</div>
            </div>
            <div className="flex gap-8">
              <a href="/" className="text-[#eeba2b] hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-white hover:text-[#eeba2b] transition-colors">About</a>
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
  );
}
