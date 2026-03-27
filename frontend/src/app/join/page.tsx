import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Building2, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinOrganisationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organisationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [organisation, setOrganisation] = useState(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Pre-fill from URL params if coming from invitation
  useEffect(() => {
    const email = searchParams.get('email');
    const code = searchParams.get('code');
    
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (code) {
      setFormData(prev => ({ ...prev, organisationCode: code }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    setError('');
    setValidationError('');
  };

  const validateOrganisation = async () => {
    if (!formData.organisationCode) {
      setValidationError('Organisation code is required');
      return false;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const response = await fetch(`/api/onboarding/organisation/${formData.organisationCode}`);
      const data = await response.json();

      if (!response.ok) {
        setValidationError(data.message || 'Invalid organisation code');
        return false;
      }

      setOrganisation(data.data);
      return true;
    } catch (error) {
      setValidationError('Failed to validate organisation code');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const validateSignup = async () => {
    if (!formData.email || !formData.organisationCode) {
      setValidationError('Email and organisation code are required');
      return false;
    }

    try {
      const response = await fetch('/api/onboarding/validate-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          organisationCode: formData.organisationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationError(data.message || 'Validation failed');
        return false;
      }

      setOrganisation(data.data.organisation);
      return true;
    } catch (error) {
      setValidationError('Failed to validate signup information');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate signup first
    const isValid = await validateSignup();
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding/secure-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          organisationCode: formData.organisationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('organisation', JSON.stringify(data.data.organisation));
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262626] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7b91c] rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#1e1e1e]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join Organisation</h1>
          <p className="text-[#676767]">
            Enter your details to join your organisation
          </p>
        </div>

        {/* Organisation Info */}
        {organisation && (
          <div className="mb-6 p-4 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#f7b91c]" />
              <span className="text-sm font-medium text-white">Joining:</span>
            </div>
            <p className="text-white font-medium">{organisation.name}</p>
          </div>
        )}

        {/* Signup Form */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Organisation Code */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Organisation Code *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type="text"
                  name="organisationCode"
                  value={formData.organisationCode}
                  onChange={handleChange}
                  onBlur={validateOrganisation}
                  className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c] uppercase"
                  placeholder="ABC12345"
                  required
                  maxLength={8}
                />
              </div>
              <p className="text-xs text-[#676767] mt-1">
                8-character code provided by your organisation
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
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

            {/* Confirm Password */}
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

            {/* Validation Error */}
            {validationError && (
              <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <p className="text-sm text-orange-400">{validationError}</p>
                </div>
              </div>
            )}

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
              disabled={isLoading || isValidating}
              className="w-full bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : isValidating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Validating...
                </div>
              ) : (
                'Join Organisation'
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
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Need help?</h3>
          <ul className="text-xs text-[#676767] space-y-1">
            <li>• Contact your administrator for the organisation code</li>
            <li>• Use the email address your administrator invited</li>
            <li>• Make sure your organisation code is exactly 8 characters</li>
            <li>• Check your spam folder for verification email</li>
          </ul>
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
