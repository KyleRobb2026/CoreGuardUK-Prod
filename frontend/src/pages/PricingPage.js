import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PricingPage() {
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
              <a href="/pricing" className="text-white hover:text-[#eeba2b] transition-colors">Pricing</a>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eeba2b]/10 border border-[#eeba2b]/30 text-[#eeba2b] text-sm font-semibold mb-8">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Alpha Phase - Pricing Coming Soon
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Pricing Plans</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            We're currently in alpha development phase. Pricing will be announced as we approach beta release. Join our alpha program to help shape our pricing structure.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-[#eeba2b] mb-4">Perfect for small teams</p>
                <div className="text-4xl font-bold text-[#eeba2b] mb-2">$149</div>
                <div className="text-[#eeba2b]">/month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Up to 10 officers",
                  "Up to 3 sites",
                  "Basic scheduling",
                  "Mobile app access",
                  "Email support",
                  "Monthly reports",
                  "Basic compliance tracking",
                  "1GB storage"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full bg-[#33262B] text-white py-3 rounded-lg hover:bg-[#634B53] transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-[#33262B] p-8 rounded-xl border-2 border-[#eeba2b] relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#eeba2b] text-[#262626] px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-[#eeba2b] mb-4">Ideal for growing companies</p>
                <div className="text-4xl font-bold text-[#eeba2b] mb-2">$499</div>
                <div className="text-[#eeba2b]">/month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Up to 50 officers",
                  "Up to 10 sites",
                  "Advanced scheduling with AI",
                  "Priority mobile app features",
                  "Phone & email support",
                  "Weekly reports & analytics",
                  "Advanced compliance tools",
                  "10GB storage",
                  "API access",
                  "Custom forms",
                  "Lone worker safety features"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full bg-[#eeba2b] text-[#262626] py-3 rounded-lg hover:bg-[#d4a526] transition-colors font-semibold"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-[#eeba2b] mb-4">For large organizations</p>
                <div className="text-4xl font-bold text-[#eeba2b] mb-2">Custom</div>
                <div className="text-[#eeba2b]">Contact us</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited officers",
                  "Unlimited sites",
                  "Enterprise AI scheduling",
                  "White-label mobile app",
                  "24/7 dedicated support",
                  "Real-time analytics dashboard",
                  "Full compliance suite",
                  "Unlimited storage",
                  "Advanced API & integrations",
                  "Custom workflow automation",
                  "Advanced safety features",
                  "Dedicated account manager",
                  "On-premise deployment option",
                  "Custom training & onboarding"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-[#eeba2b]">
                    <svg className="w-5 h-5 mr-3 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full bg-[#33262B] text-white py-3 rounded-lg hover:bg-[#634B53] transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[#eeba2b]">
                <thead>
                  <tr className="border-b border-[#632D3F]/30">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Starter</th>
                    <th className="text-center py-3 px-4">Professional</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Maximum Officers", starter: "10", professional: "50", enterprise: "Unlimited" },
                    { feature: "Maximum Sites", starter: "3", professional: "10", enterprise: "Unlimited" },
                    { feature: "AI Scheduling", starter: "❌", professional: "✅", enterprise: "✅" },
                    { feature: "API Access", starter: "❌", professional: "✅", enterprise: "✅" },
                    { feature: "Custom Forms", starter: "❌", professional: "✅", enterprise: "✅" },
                    { feature: "Lone Worker Safety", starter: "❌", professional: "✅", enterprise: "✅" },
                    { feature: "24/7 Support", starter: "❌", professional: "❌", enterprise: "✅" },
                    { feature: "White-label App", starter: "❌", professional: "❌", enterprise: "✅" },
                    { feature: "On-premise Deploy", starter: "❌", professional: "❌", enterprise: "✅" }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-[#632D3F]/20">
                      <td className="py-3 px-4">{row.feature}</td>
                      <td className="text-center py-3 px-4">{row.starter}</td>
                      <td className="text-center py-3 px-4">{row.professional}</td>
                      <td className="text-center py-3 px-4">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Alpha Development Notice */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
            <h2 className="text-3xl font-bold text-[#eeba2b] mb-6">Alpha Development Phase</h2>
            <p className="text-[#eeba2b] mb-6">
              CoreGuard SMS is currently in alpha development. We're building the platform from the ground up with input from early security industry partners.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#eeba2b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
                <p className="text-[#eeba2b] text-sm">Join alpha program to shape the platform</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#eeba2b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Partner Input</h3>
                <p className="text-[#eeba2b] text-sm">Help design features and pricing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#eeba2b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#eeba2b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Future Pricing</h3>
                <p className="text-[#eeba2b] text-sm">Competitive rates announced later</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              Join Alpha Program
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Add-on Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Advanced Analytics",
                price: "$99/mo",
                description: "Deep insights, predictive analytics, and custom reporting dashboards.",
                features: ["Custom dashboards", "Predictive analytics", "Advanced reporting", "Data export"]
              },
              {
                name: "Training & Onboarding",
                price: "$1,999/setup",
                description: "Comprehensive training program for your team with ongoing support.",
                features: ["On-site training", "Custom documentation", "Video tutorials", "Ongoing support"]
              },
              {
                name: "Integration Services",
                price: "Custom",
                description: "Custom integrations with your existing systems and third-party services.",
                features: ["API development", "System integration", "Data migration", "Custom workflows"]
              },
              {
                name: "Compliance Consulting",
                price: "$299/mo",
                description: "Expert guidance on security compliance and regulatory requirements.",
                features: ["Compliance audits", "Regulatory guidance", "Documentation help", "Certification support"]
              }
            ].map((addon, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-lg font-bold text-[#eeba2b] mb-2">{addon.name}</h3>
                <div className="text-2xl font-bold text-white mb-3">{addon.price}</div>
                <p className="text-[#eeba2b] text-sm mb-4">{addon.description}</p>
                <ul className="space-y-2 mb-4">
                  {addon.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-[#eeba2b] text-xs">
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-[#eeba2b] text-[#262626] py-2 rounded hover:bg-[#d4a526] transition-colors text-sm font-semibold"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan later?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
              },
              {
                question: "Is there a long-term contract?",
                answer: "We offer both monthly and annual billing. Annual plans come with a 20% discount and additional benefits."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, bank transfers, and purchase orders for enterprise customers."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use industry-standard encryption, are SOC 2 Type II certified, and comply with GDPR and CCPA."
              },
              {
                question: "Can I import my existing data?",
                answer: "Yes! We provide free data migration services for Professional and Enterprise plans, and offer paid migration for Starter plans."
              },
              {
                question: "What kind of support do you provide?",
                answer: "Starter plans get email support, Professional plans get phone and email support, and Enterprise plans get 24/7 dedicated support."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-lg font-bold text-[#eeba2b] mb-3">{faq.question}</h3>
                <p className="text-[#eeba2b]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Join hundreds of security companies that trust CoreGuard SMS for their operations.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Start Free Trial
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              Talk to Sales
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
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
              <a href="/pricing" className="text-white hover:text-[#eeba2b] transition-colors">Pricing</a>
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
