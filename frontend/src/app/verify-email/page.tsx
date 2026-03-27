'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '../../lib/auth-client';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    setIsVerifying(true);
    setError('');

    try {
      // Mock implementation for now - replace with actual auth client call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify email');
      }

      setIsVerified(true);
      toast.success('Email verified successfully! You can now sign in.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Failed to verify email. The link may have expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#f7b91c]/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#f7b91c] animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
          <p className="text-[#676767]">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-[#676767] mb-6">Your email has been successfully verified. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#f7b91c] text-[#1e1e1e] font-medium py-3 rounded-lg hover:bg-[#e6a719] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#f7b91c]/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#f7b91c]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Invalid Verification Link</h2>
        <p className="text-[#676767] mb-6">This verification link is invalid or has expired.</p>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-[#f7b91c] text-[#1e1e1e] font-medium py-3 rounded-lg hover:bg-[#e6a719] transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 text-center">
          <Loader2 className="w-8 h-8 text-[#f7b91c] animate-spin mx-auto" />
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
