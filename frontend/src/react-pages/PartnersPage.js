import React from 'react';
import { useNavigate } from 'react-router-dom';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function PartnersPage() {
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
              <a href="/" className="text-[#eeba2b] hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-[#eeba2b] hover:text-white transition-colors">About</a>
              <a href="/products" className="text-[#eeba2b] hover:text-white transition-colors">Products</a>
              <a href="/pricing" className="text-[#eeba2b] hover:text-white transition-colors">Pricing</a>
              <a href="/security" className="text-[#eeba2b] hover:text-white transition-colors">Security</a>
              <a href="/partners" className="text-white hover:text-[#eeba2b] transition-colors">Partners</a>
              <a href="/resources" className="text-[#eeba2b] hover:text-white transition-colors">Resources</a>
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
            Alpha Phase - Partnership Opportunities
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Partners & Integrations</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            We're building our partner ecosystem from the ground up. Join us early to help shape the future of security management integrations.
          </p>
        </div>
      </section>

      {/* Partner Categories */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Partner Ecosystem</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                category: "Technology Partners",
                description: "Leading technology companies that integrate with CoreGuard SMS",
                icon: "🔧",
                count: "50+ Partners"
              },
              {
                category: "Security Hardware",
                description: "Biometric devices, GPS trackers, and security equipment providers",
                icon: "📱",
                count: "30+ Devices"
              },
              {
                category: "Reseller Partners",
                description: "Authorized resellers and implementation partners worldwide",
                icon: "🤝",
                count: "100+ Resellers"
              },
              {
                category: "Integration Partners",
                description: "HR systems, payroll, and enterprise software integrations",
                icon: "🔗",
                count: "40+ Integrations"
              }
            ].map((category, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-bold text-[#eeba2b] mb-2">{category.category}</h3>
                <p className="text-[#eeba2b] text-sm mb-3">{category.description}</p>
                <div className="text-[#eeba2b]/80 text-xs">{category.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Technology Partners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Microsoft Azure",
                logo: "☁️",
                description: "Cloud infrastructure and enterprise services integration",
                benefits: ["Scalable cloud hosting", "Enterprise security", "Global CDN", "Azure AD integration"]
              },
              {
                name: "Amazon Web Services",
                logo: "🌐",
                description: "AWS cloud services and infrastructure integration",
                benefits: ["AWS Lambda functions", "S3 storage", "RDS databases", "CloudFront CDN"]
              },
              {
                name: "Google Cloud Platform",
                logo: "🔷",
                description: "Google Cloud services and machine learning integration",
                benefits: ["Google Cloud Storage", "BigQuery analytics", "ML services", "Global infrastructure"]
              },
              {
                name: "Salesforce",
                logo: "☁️",
                description: "CRM and customer management integration",
                benefits: ["Contact synchronization", "Lead management", "Sales automation", "Customer data"]
              },
              {
                name: "Workday",
                logo: "💼",
                description: "HR and workforce management integration",
                benefits: ["Employee data sync", "Payroll integration", "Time tracking", "Compliance reporting"]
              },
              {
                name: "Slack",
                logo: "💬",
                description: "Team communication and collaboration integration",
                benefits: ["Real-time notifications", "Channel updates", "Alert management", "Team coordination"]
              }
            ].map((partner, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-xl font-bold text-[#eeba2b] mb-3">{partner.name}</h3>
                <p className="text-[#eeba2b] mb-4">{partner.description}</p>
                <div className="space-y-2">
                  {partner.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-[#eeba2b] text-sm">
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Integrations */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Security Hardware Partners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Biometric Readers",
                devices: "Fingerprint, Face, Iris scanners",
                brands: "Suprema, ZKTeco, HID Global"
              },
              {
                name: "GPS Trackers",
                devices: "Personal, Vehicle, Asset trackers",
                brands: "Garmin, TomTom, Teltonika"
              },
              {
                name: "Access Control",
                devices: "Door locks, Turnstiles, Barriers",
                brands: "ASSA ABLOY, dormakaba, Salto"
              },
              {
                name: "CCTV Systems",
                devices: "IP cameras, NVR, Analytics",
                brands: "Hikvision, Axis, Dahua"
              },
              {
                name: "Alarm Systems",
                devices: "Intrusion, Fire, Emergency alerts",
                brands: "Honeywell, ADT, Bosch"
              },
              {
                name: "Radio Systems",
                devices: "Two-way radios, Push-to-talk",
                brands: "Motorola, Hytera, Kenwood"
              },
              {
                name: "Vehicle Telematics",
                devices: "Fleet management, Driver behavior",
                brands: "Verizon, Geotab, Teletrac"
              },
              {
                name: "Wearable Devices",
                devices: "Smart watches, Panic buttons",
                brands: "Apple, Samsung, Garmin"
              }
            ].map((hardware, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-lg font-bold text-[#eeba2b] mb-3">{hardware.name}</h3>
                <p className="text-[#eeba2b] text-sm mb-2">{hardware.devices}</p>
                <p className="text-[#eeba2b]/80 text-xs">{hardware.brands}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Integrations */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Developer-Friendly API</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">API Features</h3>
              <div className="space-y-4">
                {[
                  "RESTful API with comprehensive documentation",
                  "GraphQL support for complex queries",
                  "Webhook integration for real-time events",
                  "SDKs for popular programming languages",
                  "Sandbox environment for testing",
                  "Rate limiting and throttling controls",
                  "OAuth 2.0 authentication",
                  "API key management"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h3 className="text-2xl font-bold text-[#eeba2b] mb-6">Popular Integrations</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "HRIS Systems",
                    examples: "Workday, BambooHR, ADP"
                  },
                  {
                    name: "Payroll Systems",
                    examples: "QuickBooks, Paychex, Gusto"
                  },
                  {
                    name: "Communication Tools",
                    examples: "Slack, Microsoft Teams, Zoom"
                  },
                  {
                    name: "Analytics Platforms",
                    examples: "Tableau, Power BI, Google Analytics"
                  },
                  {
                    name: "Project Management",
                    examples: "Jira, Asana, Monday.com"
                  },
                  {
                    name: "Document Management",
                    examples: "SharePoint, Google Drive, Dropbox"
                  }
                ].map((integration, index) => (
                  <div key={index} className="border-b border-[#632D3F]/20 pb-3">
                    <h4 className="text-[#eeba2b] font-semibold">{integration.name}</h4>
                    <p className="text-[#eeba2b] text-sm">{integration.examples}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Program */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Partner With Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: "Reseller Partner",
                description: "Sell CoreGuard SMS to your customers and earn recurring revenue",
                benefits: [
                  "Competitive commission rates",
                  "Sales training and support",
                  "Marketing materials",
                  "Lead generation",
                  "Technical support"
                ],
                cta: "Become a Reseller"
              },
              {
                type: "Technology Partner",
                description: "Integrate your technology with CoreGuard SMS and expand your reach",
                benefits: [
                  "API access and support",
                  "Joint marketing opportunities",
                  "Co-selling programs",
                  "Technical documentation",
                  "Partner portal access"
                ],
                cta: "Integrate Your Tech"
              },
              {
                type: "Referral Partner",
                description: "Refer customers to CoreGuard SMS and earn referral fees",
                benefits: [
                  "Generous referral fees",
                  "Easy referral process",
                  "Tracking dashboard",
                  "Marketing support",
                  "No technical requirements"
                ],
                cta: "Start Referring"
              }
            ].map((program, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <h3 className="text-xl font-bold text-[#eeba2b] mb-3">{program.type}</h3>
                <p className="text-[#eeba2b] mb-4">{program.description}</p>
                <div className="space-y-2 mb-6">
                  {program.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-[#eeba2b] text-sm">
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-[#eeba2b] text-[#262626] py-2 rounded hover:bg-[#d4a526] transition-colors font-semibold"
                >
                  {program.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Partner Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                partner: "SecureTech Solutions",
                type: "Reseller Partner",
                story: "Increased revenue by 40% in the first year by offering CoreGuard SMS to their existing security clients.",
                quote: "CoreGuard SMS has transformed our business. The platform is so comprehensive that our clients love it, and the support from the CoreGuard team has been exceptional."
              },
              {
                partner: "BioMetrics Pro",
                type: "Technology Partner",
                story: "Integrated their biometric authentication system with CoreGuard SMS, expanding their market reach by 60%.",
                quote: "The API documentation was clear and the integration process was smooth. We now have a seamless solution that our customers love."
              }
            ].map((story, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-xl font-bold text-[#eeba2b] mb-2">{story.partner}</h3>
                <p className="text-[#eeba2b]/80 text-sm mb-4">{story.type}</p>
                <p className="text-[#eeba2b] mb-4">{story.story}</p>
                <blockquote className="text-[#eeba2b] italic border-l-4 border-[#eeba2b] pl-4">
                  "{story.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Join our growing ecosystem of partners and help us deliver exceptional security management solutions.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Become a Partner
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              View API Docs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
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
              <a href="/security" className="text-[#eeba2b] hover:text-white transition-colors">Security</a>
              <a href="/partners" className="text-white hover:text-[#eeba2b] transition-colors">Partners</a>
              <a href="/resources" className="text-[#eeba2b] hover:text-white transition-colors">Resources</a>
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
