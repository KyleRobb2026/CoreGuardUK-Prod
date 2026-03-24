import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
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
              <a href="/products" className="text-white hover:text-[#eeba2b] transition-colors">Products</a>
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
          <h1 className="text-5xl font-bold text-white mb-6">CoreGuard SMS Platform</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            Comprehensive security operations management platform designed for modern security companies and enterprises.
          </p>
        </div>
      </section>

      {/* Main Features Overview */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Platform Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Officer Management",
                description: "Complete personnel management with secure access codes, training records, and compliance tracking.",
                icon: "👥",
                features: ["Secure access codes", "Training management", "Performance tracking", "License monitoring"]
              },
              {
                title: "Site Operations",
                description: "Multi-site management with dedicated operations, incident reporting, and site-specific protocols.",
                icon: "🏢",
                features: ["Multi-site support", "Site-specific protocols", "Incident reporting", "Asset tracking"]
              },
              {
                title: "Smart Scheduling",
                description: "AI-powered roster management with automated scheduling, conflict detection, and compliance validation.",
                icon: "📅",
                features: ["AI scheduling", "Conflict detection", "Compliance validation", "Shift reminders"]
              },
              {
                title: "Lone Worker Safety",
                description: "Advanced lone worker protection with automated check-ins, GPS tracking, and emergency escalation.",
                icon: "🛡️",
                features: ["Automated check-ins", "GPS tracking", "Emergency escalation", "Risk assessment"]
              },
              {
                title: "Digital Forms",
                description: "Customizable digital forms with mobile capture, digital signatures, and automated workflows.",
                icon: "📝",
                features: ["Custom forms", "Mobile capture", "Digital signatures", "Workflow automation"]
              },
              {
                title: "Compliance Engine",
                description: "Automated compliance management with regulatory tracking, audit trails, and reporting.",
                icon: "✅",
                features: ["Regulatory tracking", "Audit trails", "Automated reporting", "License management"]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#eeba2b] mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-[#eeba2b] text-sm">
                      <svg className="w-4 h-4 mr-2 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Technical Features */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Technical Excellence</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Infrastructure & Security</h3>
              <div className="space-y-4">
                {[
                  "99.9% uptime SLA guarantee",
                  "24/7 monitoring and support",
                  "End-to-end encryption",
                  "SOC 2 Type II certified",
                  "GDPR and CCPA compliant",
                  "Regular security audits",
                  "Disaster recovery protocols",
                  "Multi-region data centers"
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
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Integration & API</h3>
              <div className="space-y-4">
                {[
                  "RESTful API with comprehensive documentation",
                  "Webhook support for real-time integrations",
                  "Biometric device integration",
                  "GPS and IoT device support",
                  "Third-party HR system integration",
                  "Custom reporting and analytics",
                  "Mobile SDK for native applications",
                  "White-label solutions available"
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

      {/* Industry Solutions */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Industry Solutions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                industry: "Corporate Security",
                description: "Enterprise-grade security management for corporate campuses, office buildings, and facilities.",
                clients: "Fortune 500 companies, multinational corporations",
                features: ["Access control", "Visitor management", "Incident response", "Compliance reporting"]
              },
              {
                industry: "Healthcare Security",
                description: "Specialized solutions for hospitals, clinics, and healthcare facilities with patient privacy focus.",
                clients: "Major hospital systems, healthcare networks",
                features: ["HIPAA compliance", "Patient safety", "Emergency response", "Staff protection"]
              },
              {
                industry: "Educational Institutions",
                description: "Comprehensive security management for schools, universities, and educational campuses.",
                clients: "School districts, universities, educational institutions",
                features: ["Campus security", "Student safety", "Emergency protocols", "Staff management"]
              },
              {
                industry: "Retail Security",
                description: "Loss prevention and asset protection solutions for retail chains and shopping centers.",
                clients: "Major retailers, shopping malls, security contractors",
                features: ["Loss prevention", "Asset protection", "Foot traffic monitoring", "Incident reporting"]
              },
              {
                industry: "Government & Public",
                description: "Secure solutions for government buildings, public facilities, and critical infrastructure.",
                clients: "Government agencies, public facilities, municipalities",
                features: ["High-security protocols", "Audit compliance", "Emergency management", "Staff vetting"]
              },
              {
                industry: "Event Security",
                description: "Temporary and permanent security solutions for venues, events, and crowd management.",
                clients: "Event venues, stadiums, security contractors",
                features: ["Crowd management", "Event coordination", "Staff deployment", "Incident tracking"]
              }
            ].map((solution, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-xl font-bold text-[#eeba2b] mb-3">{solution.industry}</h3>
                <p className="text-[#eeba2b] mb-4">{solution.description}</p>
                <div className="mb-4">
                  <span className="text-sm text-[#eeba2b]/80">Trusted by:</span>
                  <p className="text-sm text-[#eeba2b]">{solution.clients}</p>
                </div>
                <div className="space-y-2">
                  {solution.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-[#eeba2b] text-sm">
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Mobile Excellence</h2>
              <p className="text-[#eeba2b] mb-6">
                Our native mobile applications provide field personnel with instant access to critical information and real-time communication capabilities.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-bold text-[#eeba2b] mb-3">iOS App</h4>
                  <ul className="space-y-2 text-[#eeba2b] text-sm">
                    <li>• Native iOS experience</li>
                    <li>• Face ID & Touch ID support</li>
                    <li>• Offline mode capability</li>
                    <li>• Push notifications</li>
                    <li>• GPS tracking integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#eeba2b] mb-3">Android App</h4>
                  <ul className="space-y-2 text-[#eeba2b] text-sm">
                    <li>• Native Android experience</li>
                    <li>• Biometric authentication</li>
                    <li>• Offline mode capability</li>
                    <li>• Push notifications</li>
                    <li>• GPS tracking integration</li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h14c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-14c-.83 0-1.5-.67-1.5-1.5zm8.5-15.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">4.8★</div>
                  <div className="text-[#eeba2b] text-sm">App Store Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">4.7★</div>
                  <div className="text-[#eeba2b] text-sm">Google Play Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">50K+</div>
                  <div className="text-[#eeba2b] text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#eeba2b] mb-2">99.9%</div>
                  <div className="text-[#eeba2b] text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Schedule a personalized demo to see how CoreGuard SMS can revolutionize your security operations.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Schedule Demo
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              View Pricing
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
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
              <a href="/products" className="text-white hover:text-[#eeba2b] transition-colors">Products</a>
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
