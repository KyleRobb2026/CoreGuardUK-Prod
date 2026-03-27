import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    setIsVerifying(true);
    setError('');

    try {
      const { data, error } = await authClient.verifyEmail({
        token,
      });

      if (error) {
        setError(error.message || 'Failed to verify email');
        return;
      }

      setIsVerified(true);
      toast.success('Email verified successfully! You can now sign in.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsVerifying(false);
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
          <h1 className="text-2xl font-bold text-white mb-2">Email Verification</h1>
          <p className="text-[#676767]">
            {isVerifying ? 'Verifying your email...' : isVerified ? 'Email verified!' : 'Verify your email address'}
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          {isVerifying ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-[#f7b91c] animate-spin mx-auto mb-4" />
              <p className="text-white">Please wait while we verify your email...</p>
            </div>
          ) : isVerified ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-[#676767] mb-4">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <p className="text-sm text-[#676767]">
                Redirecting to login page in a few seconds...
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-[#EF4444] mb-4">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-[#2e2e2e] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#2e2e2e] focus:ring-offset-2 focus:ring-offset-[#171717] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        {!isVerified && !isVerifying && (
          <div className="mt-6 p-4 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">Need help?</h3>
            <ul className="text-xs text-[#676767] space-y-1">
              <li>• Check if the verification link has expired (24-hour limit)</li>
              <li>• Ensure you clicked the correct link from your email</li>
              <li>• Request a new verification email from the login page</li>
            </ul>
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
