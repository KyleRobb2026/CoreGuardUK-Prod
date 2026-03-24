import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

export default function SupabaseConfigWarning() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: '#2a2a2a',
        padding: '3rem',
        borderRadius: '12px',
        border: '1px solid #3a3a3a'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#f59e0b',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}>
          <AlertTriangle size={32} color="#ffffff" />
        </div>
        
        <h1 style={{
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Supabase Configuration Required
        </h1>
        
        <p style={{
          color: '#a1a0a0',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          The Supabase environment variables are not configured. 
          Please add the following environment variables to your 
          <code style={{ background: '#3a3a3a', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
            .env.local
          </code>
          {' '}file:
        </p>
        
        <div style={{
          background: '#1e1e1e',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'left',
          marginBottom: '2rem',
          border: '1px solid #3a3a3a'
        }}>
          <pre style={{
            color: '#e5e5e5',
            fontSize: '0.875rem',
            margin: 0,
            fontFamily: 'monospace'
          }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here`}
          </pre>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#007AFF',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Settings size={16} />
            Reload After Configuration
          </button>
          
          <a
            href="https://supabase.com/docs/guides/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#3a3a3a',
              color: '#e5e5e5',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Supabase Documentation
          </a>
        </div>
        
        <p style={{
          color: '#6b7280',
          fontSize: '0.75rem',
          marginTop: '2rem'
        }}>
          You can get these values from your Supabase project dashboard under Settings → API
        </p>
      </div>
    </div>
  );
}
