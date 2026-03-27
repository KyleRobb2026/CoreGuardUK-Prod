import React, { useState } from 'react';
import { useAuth } from '../contexts/BetterAuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BetterAuthLoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Welcome back! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        await signUp(email, password, name);
        toast.success('Account created! Please check your email to verify your account.');
        // Switch to signin mode after successful signup
        setMode('signin');
        setPassword('');
        setName('');
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
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
          <h1 className="text-2xl font-bold text-white mb-2">CoreGuard Security</h1>
          <p className="text-[#676767]">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                    placeholder="John Doe"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg text-white placeholder-[#676767] focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#676767] hover:text-[#a0a0a0]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#1e1e1e] border-t-transparent rounded-full animate-spin mr-2" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Mode toggle */}
          <div className="mt-6 text-center">
            <p className="text-[#676767]">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setPassword('');
                }}
                className="text-[#f7b91c] hover:text-[#e6a719] font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Forgot password link - only show in signin mode */}
          {mode === 'signin' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => window.location.href = '/forgot-password'}
                className="text-[#676767] hover:text-[#f7b91c] text-sm"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Email verification notice for signup */}
        {mode === 'signup' && (
          <div className="mt-4 p-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#f7b91c] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#676767]">
                After signing up, you'll receive a verification email. Please verify your email before signing in.
              </p>
            </div>
          </div>
        )}

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
