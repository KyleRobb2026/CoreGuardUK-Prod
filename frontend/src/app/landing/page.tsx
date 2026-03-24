'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error' | 'not_configured'>('loading');
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl || apiUrl === 'undefined') {
      setApiStatus('not_configured');
      return;
    }
    
    testApiConnection(apiUrl);
  }, []);

  const testApiConnection = async (apiUrl: string) => {
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.error('API connection failed:', error);
      setApiStatus('error');
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isConfigured = apiUrl && apiUrl !== 'undefined';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        background: '#2e2e2e',
        padding: '1rem 2rem',
        borderBottom: '1px solid #3a3a3a'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            color: '#f7b91c',
            margin: 0
          }}>
            CoreGuard UK
          </h1>
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link href="#features" style={{ color: '#a1a0a0', textDecoration: 'none' }}>
              Features
            </Link>
            <Link href="#about" style={{ color: '#a1a0a0', textDecoration: 'none' }}>
              About
            </Link>
            <Link href="#contact" style={{ color: '#a1a0a0', textDecoration: 'none' }}>
              Contact
            </Link>
            <Link href="/dashboard" style={{
              background: '#f7b91c',
              color: '#1e1e1e',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#f7b91c',
          lineHeight: '1.2'
        }}>
          Enterprise Security Management
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: '#a1a0a0',
          lineHeight: '1.6'
        }}>
          Comprehensive security management system for regulated private security companies. 
          Real-time monitoring, compliance tracking, and personnel management in one platform.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/dashboard" style={{
            background: '#f7b91c',
            color: '#1e1e1e',
            padding: '1rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            Get Started
          </Link>
          <Link href="#features" style={{
            background: 'transparent',
            color: '#f7b91c',
            padding: '1rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: '2px solid #f7b91c'
          }}>
            Learn More
          </Link>
        </div>
      </section>

      {/* Status Section */}
      <section style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#2e2e2e',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#f7b91c' }}>System Status</h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: apiStatus === 'connected' ? '#22C55E' : 
                               apiStatus === 'error' ? '#EF4444' : 
                               apiStatus === 'not_configured' ? '#F59E0B' : '#F59E0B'
            }} />
            <span>
              Backend API: {apiStatus === 'connected' ? 'Connected' : 
                          apiStatus === 'error' ? 'Connection Failed' : 
                          apiStatus === 'not_configured' ? 'Not Configured' : 'Testing...'}
            </span>
          </div>

          {apiStatus === 'not_configured' && (
            <div style={{
              background: '#f59e0b20',
              border: '1px solid #f59e0b',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              <strong>Configuration Required:</strong> Backend API URL not configured.
            </div>
          )}

          {apiData && (
            <div style={{
              background: '#1e1e1e',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              overflow: 'auto'
            }}>
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#f7b91c'
        }}>
          Features
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: '#2e2e2e',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }}>
            <h3 style={{ color: '#f7b91c', marginBottom: '1rem' }}>Real-time Monitoring</h3>
            <p style={{ color: '#a1a0a0', lineHeight: '1.6' }}>
              Live tracking of security personnel, sites, and incidents with real-time updates and alerts.
            </p>
          </div>
          <div style={{
            background: '#2e2e2e',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }}>
            <h3 style={{ color: '#f7b91c', marginBottom: '1rem' }}>Compliance Management</h3>
            <p style={{ color: '#a1a0a0', lineHeight: '1.6' }}>
              Automated compliance tracking, reporting, and audit trails for regulatory requirements.
            </p>
          </div>
          <div style={{
            background: '#2e2e2e',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }}>
            <h3 style={{ color: '#f7b91c', marginBottom: '1rem' }}>Personnel Management</h3>
            <p style={{ color: '#a1a0a0', lineHeight: '1.6' }}>
              Complete personnel database with scheduling, training records, and performance tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2e2e2e',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid #3a3a3a'
      }}>
        <p style={{ color: '#a1a0a0', margin: 0 }}>
          © 2024 CoreGuard UK. Enterprise Security Management System.
        </p>
      </footer>
    </div>
  );
}
