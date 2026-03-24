import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: 'demo'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      interest: 'demo'
    });
  };

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
              <a href="/security" className="text-[#eeba2b] hover:text-white transition-colors">Security</a>
              <a href="/contact" className="text-white hover:text-[#eeba2b] transition-colors">Contact</a>
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
            Alpha Development - Join Our Program
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-[#eeba2b] mb-8 max-w-3xl mx-auto">
            Interested in joining our alpha program or have questions about CoreGuard SMS? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#eeba2b] mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[#eeba2b] mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#eeba2b] mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
                      placeholder="Security Company Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-[#eeba2b] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#eeba2b] mb-2">I'm interested in...</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none"
                  >
                    <option value="demo">Product Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#eeba2b] mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#632D3F]/50 rounded-lg text-white focus:border-[#eeba2b] focus:outline-none resize-none"
                    placeholder="Tell us about your security operations needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#eeba2b] text-[#262626] py-3 rounded-lg hover:bg-[#d4a526] transition-colors font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-[#eeba2b]">
                    <svg className="w-6 h-6 mr-4 text-[#eeba2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <div>+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center text-[#eeba2b]">
                    <svg className="w-6 h-6 mr-4 text-[#eeba2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div>info@coreguardsms.com</div>
                    </div>
                  </div>
                  <div className="flex items-start text-[#eeba2b]">
                    <svg className="w-6 h-6 mr-4 text-[#eeba2b] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div>
                      <div className="font-semibold">Headquarters</div>
                      <div>123 Security Boulevard<br />San Francisco, CA 94105<br />United States</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-2xl font-bold text-white mb-6">Office Locations</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#eeba2b] mb-2">North America</h4>
                    <div className="text-[#eeba2b] text-sm space-y-1">
                      <div>• San Francisco, CA (HQ)</div>
                      <div>• New York, NY</div>
                      <div>• Toronto, ON</div>
                      <div>• Los Angeles, CA</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#eeba2b] mb-2">Europe</h4>
                    <div className="text-[#eeba2b] text-sm space-y-1">
                      <div>• London, UK</div>
                      <div>• Berlin, Germany</div>
                      <div>• Paris, France</div>
                      <div>• Amsterdam, Netherlands</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#eeba2b] mb-2">Asia Pacific</h4>
                    <div className="text-[#eeba2b] text-sm space-y-1">
                      <div>• Singapore</div>
                      <div>• Sydney, Australia</div>
                      <div>• Tokyo, Japan</div>
                      <div>• Hong Kong</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
                <h3 className="text-2xl font-bold text-white mb-6">Support Hours</h3>
                <div className="space-y-3 text-[#eeba2b]">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>6:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>8:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Emergency Support Only</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#eeba2b]">
                    <span>24/7 Emergency</span>
                    <span>+1 (555) 911-HELP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Team */}
      <section className="py-16 px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Sales Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "Alexandra Chen",
                title: "Enterprise Sales Director",
                region: "North America",
                email: "alexandra@coreguardsms.com",
                phone: "+1 (555) 234-5678"
              },
              {
                name: "Marcus Johnson",
                title: "SMB Sales Manager",
                region: "North America",
                email: "marcus@coreguardsms.com",
                phone: "+1 (555) 345-6789"
              },
              {
                name: "Sophie Martin",
                title: "European Sales Director",
                region: "Europe",
                email: "sophie@coreguardsms.com",
                phone: "+44 20 1234 5678"
              },
              {
                name: "Raj Patel",
                title: "Asia Pacific Sales Manager",
                region: "Asia Pacific",
                email: "raj@coreguardsms.com",
                phone: "+65 6123 4567"
              }
            ].map((person, index) => (
              <div key={index} className="bg-[#33262B] p-6 rounded-xl border border-[#632D3F]/30 text-center">
                <div className="w-20 h-20 bg-[#eeba2b] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#262626]">{person.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{person.name}</h3>
                <p className="text-[#eeba2b] font-semibold mb-1">{person.title}</p>
                <p className="text-[#eeba2b] text-sm mb-3">{person.region}</p>
                <div className="space-y-2 text-[#eeba2b] text-sm">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {person.email}
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {person.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-12 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Visit Our Headquarters</h2>
          <div className="bg-[#33262B] p-8 rounded-xl border border-[#632D3F]/30">
            <div className="aspect-w-16 aspect-h-9 bg-[#262626] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-[#eeba2b] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p className="text-[#eeba2b] mb-4">Interactive Map</p>
                <p className="text-[#eeba2b] text-sm">123 Security Boulevard, San Francisco, CA 94105</p>
                <button className="mt-4 bg-[#eeba2b] text-[#262626] px-6 py-2 rounded-lg hover:bg-[#d4a526] transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
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
              <a href="/contact" className="text-white hover:text-[#eeba2b] transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-[#eeba2b]/60">
            &copy; 2026 CoreGuard SMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
