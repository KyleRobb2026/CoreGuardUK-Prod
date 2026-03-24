'use client';

import { useEffect, useState } from 'react';

// Force dynamic rendering for all dynamic routes
export const dynamic = 'force-dynamic';

export default function DynamicPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f7b91c',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>CoreGuard UK</h1>
          <p style={{ color: '#a1a0a0' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // This will be handled by the main page.tsx React Router
  return null;
}
