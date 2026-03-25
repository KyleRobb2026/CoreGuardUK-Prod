import React from 'react';
import { useNavigate } from 'react-router-dom';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function SecurityPage() {
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
              <a href="/about" className="text-[#eeba2b] hover:text-white transition-colors">About</a>
              <a href="/products" className="text-[#eeba2b] hover:text-white transition-colors">Products</a>
              <a href="/pricing" className="text-[#eeba2b] hover:text-white transition-colors">Pricing</a>
              <a href="/security" className="text-white hover:text-[#eeba2b] transition-colors">Security</a>
              <a href="/contact" className="text-[#eeba2b] hover:text-white transition-colors">Contact</a>
              <a href="https://coreguard-support-production.up.railway.app/status" target="_blank" rel="noreferrer" className="text-[#eeba2b] hover:text-white transition-colors">Status</a>
              <a href="https://coreguard-support-production.up.railway.app/docs" target="_blank" rel="noreferrer" className="text-[#eeba2b] hover:text-white transition-colors">Documentation</a>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eeba2b]/10 border border-[#eeba2b]/30 text-[#eeba2b] text-sm font-semibold mb-8">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Alpha Phase - Security-First Development
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Security & Compliance</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            Security-first architecture and comprehensive compliance management built into every aspect of CoreGuard SMS from day one.
          </p>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Security First Architecture</h2>
              <p className="text-[#eeba2b] mb-6">
                Security is not an afterthought—it's embedded in our DNA. From encryption at rest and in transit to comprehensive access controls, every aspect of CoreGuard SMS is designed with security as the primary consideration.
              </p>
              <div className="space-y-4">
                {[
                  "End-to-end encryption for all data",
                  "Multi-factor authentication (MFA)",
                  "Role-based access control (RBAC)",
                  "Regular security audits and penetration testing",
                  "24/7 security monitoring and incident response",
                  "Zero-trust security model implementation"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Security Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">99.9%</div>
                  <div className="text-[#eeba2b] text-sm">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">0</div>
                  <div className="text-[#eeba2b] text-sm">Security Breaches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">24/7</div>
                  <div className="text-[#eeba2b] text-sm">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">256-bit</div>
                  <div className="text-[#eeba2b] text-sm">Encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Industry Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "SOC 2 Type II",
                description: "Comprehensive audit of security controls, availability, processing integrity, confidentiality, and privacy.",
                icon: "🔒",
                valid: "Valid through 2026"
              },
              {
                name: "ISO 27001",
                description: "International standard for information security management systems and best practices.",
                icon: "🛡️",
                valid: "Valid through 2025"
              },
              {
                name: "GDPR Compliant",
                description: "Full compliance with EU General Data Protection Regulation for data privacy and protection.",
                icon: "🇪🇺",
                valid: "Continuously maintained"
              },
              {
                name: "HIPAA Compliant",
                description: "Health Insurance Portability and Accountability Act compliance for healthcare security.",
                icon: "🏥",
                valid: "Valid through 2026"
              },
              {
                name: "CCPA Compliant",
                description: "California Consumer Privacy Act compliance for consumer data protection rights.",
                icon: "🌴",
                valid: "Continuously maintained"
              },
              {
                name: "FedRAMP Authorized",
                description: "Federal Risk and Authorization Management Program for government cloud services.",
                icon: "🏛️",
                valid: "In Process"
              }
            ].map((cert, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 text-center hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold text-[#eeba2b] mb-3">{cert.name}</h3>
                <p className="text-[#eeba2b] text-sm mb-4">{cert.description}</p>
                <div className="text-[#eeba2b]/80 text-xs">{cert.valid}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Framework */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Compliance Management</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Automated Compliance Tracking</h3>
              <div className="space-y-4">
                {[
                  "Real-time compliance monitoring",
                  "Automated audit trail generation",
                  "Regulatory requirement mapping",
                  "Compliance gap analysis",
                  "Automated reporting for auditors",
                  "Change management tracking",
                  "Risk assessment tools",
                  "Policy violation detection"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Industry Standards Support</h3>
              <div className="space-y-4">
                {[
                  "BSIA (British Security Industry Association)",
                  "ASIS International Standards",
                  "SIA (Security Industry Authority)",
                  "Private Security Industry Regulations",
                  "OSHA Safety Standards",
                  "NFPA Fire Safety Codes",
                  "ISO 9001 Quality Management",
                  "CMMI Process Improvement"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Data Protection & Privacy</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Encryption",
                description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
                icon: "🔐"
              },
              {
                title: "Access Control",
                description: "Granular permissions with multi-factor authentication and SSO support",
                icon: "🔑"
              },
              {
                title: "Data Residency",
                description: "Choice of data center locations with regional compliance options",
                icon: "🌍"
              },
              {
                title: "Backup & Recovery",
                description: "Automated backups with point-in-time recovery and disaster recovery",
                icon: "💾"
              },
              {
                title: "Audit Logging",
                description: "Comprehensive logging of all system activities with tamper-proof records",
                icon: "📋"
              },
              {
                title: "Privacy Controls",
                description: "Data anonymization, pseudonymization, and privacy by design principles",
                icon: "🛡️"
              },
              {
                title: "Vulnerability Management",
                description: "Regular security patches, vulnerability scanning, and threat monitoring",
                icon: "🔍"
              },
              {
                title: "Incident Response",
                description: "24/7 security team with automated incident detection and response",
                icon: "🚨"
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#eeba2b] mb-2">{item.title}</h3>
                <p className="text-[#eeba2b] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Reports */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Security Transparency</h2>
          <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Recent Security Reports</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "2024 Security Audit Report",
                      date: "October 2024",
                      status: "Passed with no critical findings"
                    },
                    {
                      title: "Penetration Testing Results",
                      date: "September 2024",
                      status: "No high-risk vulnerabilities identified"
                    },
                    {
                      title: "SOC 2 Type II Audit",
                      date: "August 2024",
                      status: "Full compliance achieved"
                    },
                    {
                      title: "Vulnerability Assessment",
                      date: "July 2024",
                      status: "All critical patches applied"
                    }
                  ].map((report, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-[#262626] rounded-lg">
                      <div>
                        <h4 className="text-[#eeba2b] font-semibold">{report.title}</h4>
                        <p className="text-[#eeba2b] text-sm">{report.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 text-sm">✓ {report.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Security Best Practices</h3>
                <div className="space-y-4">
                  {[
                    "Regular security awareness training for all staff",
                    "Third-party security assessments and code reviews",
                    "Bug bounty program for responsible disclosure",
                    "Regular security architecture reviews",
                    "Continuous monitoring and threat intelligence",
                    "Incident response drills and tabletop exercises",
                    "Secure software development lifecycle (SSDLC)",
                    "Regular compliance training and certification"
                  ].map((practice, index) => (
                    <div key={index} className="flex items-center text-[#eeba2b]">
                      <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {practice}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Security is Our Priority</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Have questions about our security practices or compliance certifications? Our security team is here to help.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Contact Security Team
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              Download Security Whitepaper
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
              <a href="/about" className="text-[#eeba2b] hover:text-white transition-colors">About</a>
              <a href="/products" className="text-[#eeba2b] hover:text-white transition-colors">Products</a>
              <a href="/pricing" className="text-[#eeba2b] hover:text-white transition-colors">Pricing</a>
              <a href="/security" className="text-white hover:text-[#eeba2b] transition-colors">Security</a>
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
