'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../lib/auth-client';
import { Shield, Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock implementation for now - replace with actual auth client call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setIsSuccess(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError('An error occurred while sending the reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#262626] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Reset Email Sent!</h2>
            <p className="text-[#676767] mb-4">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>. 
              Please check your email and follow the instructions.
            </p>
            <div className="space-y-2 text-sm text-[#676767]">
              <p>• The link will expire in 1 hour for security</p>
              <p>• If you don't see the email, check your spam folder</p>
              <p>• Make sure the email address is correct</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full mt-6 bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#262626] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7b91c] rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#1e1e1e]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-[#676767]">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
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
                  placeholder="Enter your email address"
                  required
                />
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
              className="w-full bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#1e1e1e] border-t-transparent rounded-full animate-spin mr-2" />
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="flex items-center justify-center w-full text-[#676767] hover:text-[#a0a0a0] text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Need help?</h3>
          <ul className="text-xs text-[#676767] space-y-1">
            <li>• Make sure to use the email address you registered with</li>
            <li>• Check your spam or junk folder if you don't see the email</li>
            <li>• Reset links expire after 1 hour for security</li>
            <li>• Contact support if you continue to have issues</li>
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
