import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResourcesPage() {
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
              <a href="/partners" className="text-[#eeba2b] hover:text-white transition-colors">Partners</a>
              <a href="/resources" className="text-white hover:text-[#eeba2b] transition-colors">Resources</a>
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
            Alpha Phase - Development Resources
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Resources & Insights</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            Follow our development journey and explore insights about security management for regulated environments.
          </p>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Featured Content</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "The Future of Security Operations",
                category: "Industry Trends",
                excerpt: "Explore how AI and automation are transforming security operations management.",
                image: "🤖",
                date: "November 15, 2024",
                readTime: "5 min read"
              },
              {
                title: "Compliance Checklist 2024",
                category: "Compliance",
                excerpt: "Essential compliance requirements for security companies in 2024.",
                image: "📋",
                date: "November 10, 2024",
                readTime: "8 min read"
              },
              {
                title: "ROI of Security Management Software",
                category: "Business Value",
                excerpt: "Calculate the return on investment for implementing a security management system.",
                image: "💰",
                date: "November 5, 2024",
                readTime: "6 min read"
              }
            ].map((article, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <div className="text-4xl mb-4">{article.image}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#eeba2b] text-sm font-semibold">{article.category}</span>
                  <span className="text-[#eeba2b]/80 text-xs">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                <p className="text-[#eeba2b] mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#eeba2b]/80 text-sm">{article.date}</span>
                  <button className="text-[#eeba2b] hover:text-white transition-colors font-semibold">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Success Stories</h2>
          <div className="space-y-8">
            {[
              {
                company: "Global Security Services Inc.",
                industry: "Corporate Security",
                challenge: "Managing 500+ officers across 50 sites with manual processes",
                solution: "Implemented CoreGuard SMS with AI scheduling and mobile access",
                results: [
                  "40% reduction in administrative overhead",
                  "25% improvement in compliance rates",
                  "60% faster incident response times",
                  "99% officer adoption rate"
                ],
                quote: "CoreGuard SMS transformed our operations. We've seen measurable improvements in efficiency and compliance across all our sites."
              },
              {
                company: "MetroGuard Protection",
                industry: "Healthcare Security",
                challenge: "Ensuring compliance with healthcare regulations and patient safety",
                solution: "Deployed CoreGuard SMS with healthcare-specific compliance modules",
                results: [
                  "100% HIPAA compliance achieved",
                  "35% reduction in security incidents",
                  "Improved patient satisfaction scores",
                  "Streamlined audit processes"
                ],
                quote: "The healthcare-specific features in CoreGuard SMS have been invaluable. We can now demonstrate compliance effortlessly."
              }
            ].map((study, index) => (
              <div key={index} className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[#eeba2b] mb-2">{study.company}</h3>
                    <p className="text-[#eeba2b]/80 mb-4">{study.industry}</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Challenge</h4>
                        <p className="text-[#eeba2b]">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Solution</h4>
                        <p className="text-[#eeba2b]">{study.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Results</h4>
                        <ul className="space-y-1">
                          {study.results.map((result, i) => (
                            <li key={i} className="flex items-center text-[#eeba2b]">
                              <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <blockquote className="text-[#eeba2b] italic text-lg border-l-4 border-[#eeba2b] pl-6">
                      "{study.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Whitepapers */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Whitepapers & Reports</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Security Operations Management: A Complete Guide",
                description: "Comprehensive guide to implementing and optimizing security operations management systems.",
                pages: 45,
                format: "PDF",
                download: "Download Free"
              },
              {
                title: "ROI Analysis: Security Management Software",
                description: "Detailed analysis of return on investment for security management platforms.",
                pages: 32,
                format: "PDF",
                download: "Download Free"
              },
              {
                title: "Compliance Framework for Security Companies",
                description: "Complete compliance framework covering all major regulations and standards.",
                pages: 58,
                format: "PDF",
                download: "Download Free"
              },
              {
                title: "AI in Security Operations: Future Trends",
                description: "Exploration of artificial intelligence applications in security operations.",
                pages: 28,
                format: "PDF",
                download: "Download Free"
              }
            ].map((paper, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#eeba2b] mb-2">{paper.title}</h3>
                    <p className="text-[#eeba2b] text-sm mb-4">{paper.description}</p>
                    <div className="flex items-center space-x-4 text-[#eeba2b]/80 text-sm">
                      <span>📄 {paper.pages} pages</span>
                      <span>📁 {paper.format}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="bg-[#eeba2b] text-[#262626] px-4 py-2 rounded hover:bg-[#d4a526] transition-colors font-semibold">
                      {paper.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Upcoming Webinars</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Scheduling Best Practices",
                date: "December 1, 2024",
                time: "2:00 PM EST",
                duration: "45 minutes",
                speaker: "Sarah Mitchell, CEO",
                description: "Learn how AI can optimize your security scheduling and reduce costs."
              },
              {
                title: "Compliance Management in 2025",
                date: "December 8, 2024",
                time: "1:00 PM EST",
                duration: "60 minutes",
                speaker: "David Chen, CTO",
                description: "Stay ahead of regulatory changes and compliance requirements."
              },
              {
                title: "Mobile Security Operations",
                date: "December 15, 2024",
                time: "3:00 PM EST",
                duration: "30 minutes",
                speaker: "Maria Rodriguez, COO",
                description: "Best practices for mobile-first security operations management."
              }
            ].map((webinar, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 hover:border-[#eeba2b]/50 transition-colors">
                <h3 className="text-lg font-bold text-[#eeba2b] mb-3">{webinar.title}</h3>
                <div className="space-y-2 text-[#eeba2b] text-sm mb-4">
                  <div>📅 {webinar.date}</div>
                  <div>⏰ {webinar.time}</div>
                  <div>⏱️ {webinar.duration}</div>
                  <div>👤 {webinar.speaker}</div>
                </div>
                <p className="text-[#eeba2b] text-sm mb-4">{webinar.description}</p>
                <button className="w-full bg-[#eeba2b] text-[#262626] py-2 rounded hover:bg-[#d4a526] transition-colors font-semibold">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Categories */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                category: "Industry Trends",
                count: 24,
                icon: "📈"
              },
              {
                category: "Compliance",
                count: 18,
                icon: "✅"
              },
              {
                category: "Technology",
                count: 32,
                icon: "💻"
              },
              {
                category: "Best Practices",
                count: 28,
                icon: "🎯"
              },
              {
                category: "Case Studies",
                count: 15,
                icon: "📊"
              },
              {
                category: "Security Tips",
                count: 21,
                icon: "🔒"
              },
              {
                category: "Product Updates",
                count: 12,
                icon: "🚀"
              },
              {
                category: "Leadership",
                count: 9,
                icon: "👔"
              }
            ].map((category, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center hover:border-[#eeba2b]/50 transition-colors cursor-pointer">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-bold text-[#eeba2b] mb-1">{category.category}</h3>
                <p className="text-[#eeba2b]/80 text-sm">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-[#eeba2b] mb-8">
              Get the latest insights, case studies, and industry trends delivered to your inbox.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
              />
              <button className="bg-[#eeba2b] text-[#262626] px-6 py-3 rounded-lg hover:bg-[#d4a526] transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Need More Information?</h2>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-2xl mx-auto">
            Our team is here to help you find the resources you need to succeed.
          </p>
          <div className="space-x-0 md:space-x-4">
            <button 
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-[#262626] bg-[#eeba2b] rounded-2xl hover:bg-[#d4a526] transition-colors"
            >
              Contact Us
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg bg-[#33262B] text-white rounded-2xl hover:bg-[#634B53] transition-colors"
            >
              Browse Products
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 4h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m0 0l-3-3m3 3l3-3m-3 3V4"/>
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
              <a href="/partners" className="text-[#eeba2b] hover:text-white transition-colors">Partners</a>
              <a href="/resources" className="text-white hover:text-[#eeba2b] transition-colors">Resources</a>
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
