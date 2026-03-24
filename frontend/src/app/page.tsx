'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/landing');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f7b91c',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <h1 style={{ color: '#f7b91c', margin: 0 }}>CoreGuard UK</h1>
        <p style={{ color: '#a1a0a0' }}>Loading...</p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
