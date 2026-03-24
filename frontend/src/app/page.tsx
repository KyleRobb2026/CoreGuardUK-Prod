'use client';

import React, { useEffect, useState } from 'react';

export default function HomePage() {
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
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#f7b91c'
        }}>
          CoreGuard UK
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          color: '#a1a0a0'
        }}>
          Enterprise Security Management System
        </p>

        <div style={{
          background: '#2e2e2e',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Environment Configuration</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>API URL:</strong> {isConfigured ? apiUrl : 'Not configured'}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>App Name:</strong> {process.env.NEXT_PUBLIC_APP_NAME || 'CoreGuard UK'}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>App Version:</strong> {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
          </div>
        </div>

        <div style={{
          background: '#2e2e2e',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Backend Connection Status</h2>
          
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
              Status: {apiStatus === 'connected' ? 'Connected' : 
                      apiStatus === 'error' ? 'Connection Failed' : 
                      apiStatus === 'not_configured' ? 'API URL Not Configured' : 'Testing...'}
            </span>
          </div>

          {apiStatus === 'not_configured' && (
            <div style={{
              background: '#f59e0b20',
              border: '1px solid #f59e0b',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <strong>Configuration Required:</strong> Please set NEXT_PUBLIC_API_URL in Railway environment variables.
            </div>
          )}

          {apiData && (
            <div style={{
              background: '#1e1e1e',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}>
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div style={{
          background: '#2e2e2e',
          padding: '2rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Available Endpoints</h2>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ GET /health - Health check</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ POST /api/auth/login - Authentication</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ GET /api/dashboard/stats - Dashboard data</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ GET /api/personnel - Personnel list</li>
          </ul>
        </div>

        {apiStatus === 'error' && (
          <div style={{
            background: '#ef444420',
            border: '1px solid #ef4444',
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <strong>Connection Error:</strong> Unable to connect to backend API. 
            Please check that NEXT_PUBLIC_API_URL is correctly configured in Railway.
          </div>
        )}
      </div>
    </div>
  );
}
