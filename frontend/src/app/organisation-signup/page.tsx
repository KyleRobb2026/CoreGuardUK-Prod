import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, User, Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganisationSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organisationName: '',
    organisationEmail: '',
    adminName: '',
    adminPassword: '',
    confirmPassword: '',
    phone: '',
    address: '',
    companyNumber: '',
    vatNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.adminPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding/organisation-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.organisationName,
          email: formData.organisationEmail,
          password: formData.adminPassword,
          adminName: formData.adminName,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          companyNumber: formData.companyNumber || undefined,
          vatNumber: formData.vatNumber || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create organisation');
      }

      toast.success('Organisation created successfully! Please check your email to verify your account.');
      
      // Store organisation info for onboarding
      localStorage.setItem('organisation', JSON.stringify(data.data.organisation));
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to create organisation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262626] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7b91c] rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#1e1e1e]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Organisation</h1>
          <p className="text-[#676767]">
            Set up your CoreGuard security management system
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organisation Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#f7b91c]" />
                Organisation Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Organisation Name *
                </label>
                <input
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="Enter your organisation name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Organisation Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type="email"
                    name="organisationEmail"
                    value={formData.organisationEmail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="organisation@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                    Company Number
                  </label>
                  <input
                    type="text"
                    name="companyNumber"
                    value={formData.companyNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="Enter your organisation address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="GB123456789"
                />
              </div>
            </div>

            {/* Admin Account */}
            <div className="space-y-4 pt-6 border-t border-[#2e2e2e]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#f7b91c]" />
                Admin Account
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="Create a strong password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#676767] hover:text-[#a0a0a0]"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-xs text-[#676767] mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#676767] hover:text-[#a0a0a0]"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f7b91c] text-[#1e1e1e] font-semibold py-3 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Organisation...
                </div>
              ) : (
                'Create Organisation'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-[#676767] hover:text-[#a0a0a0] text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#676767]">
            © 2024 CoreGuard UK. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
