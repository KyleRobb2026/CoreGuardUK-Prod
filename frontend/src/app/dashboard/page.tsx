'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error' | 'not_configured'>('loading');
  const [apiData, setApiData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [personnel, setPersonnel] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl || apiUrl === 'undefined') {
      setApiStatus('not_configured');
      return;
    }
    
    testApiConnection(apiUrl);
    fetchDashboardData(apiUrl);
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

  const fetchDashboardData = async (apiUrl: string) => {
    try {
      const [statsResponse, personnelResponse] = await Promise.all([
        fetch(`${apiUrl}/api/dashboard/stats`),
        fetch(`${apiUrl}/api/personnel`)
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (personnelResponse.ok) {
        const personnelData = await personnelResponse.json();
        setPersonnel(personnelData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
          <Link href="/landing" style={{
            color: '#f7b91c',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            CoreGuard UK
          </Link>
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link href="/dashboard" style={{ color: '#f7b91c', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link href="/personnel" style={{ color: '#a1a0a0', textDecoration: 'none' }}>
              Personnel
            </Link>
            <Link href="/sites" style={{ color: '#a1a0a0', textDecoration: 'none' }}>
              Sites
            </Link>
            <button onClick={() => router.push('/landing')} style={{
              background: 'transparent',
              color: '#f7b91c',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '1px solid #f7b91c',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: '#f7b91c'
          }}>
            Dashboard
          </h1>
          <p style={{ color: '#a1a0a0', margin: 0 }}>
            Welcome to the CoreGuard UK Security Management System
          </p>
        </div>

        {/* API Status */}
        <div style={{
          background: '#2e2e2e',
          padding: '1.5rem',
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
              fontSize: '0.9rem'
            }}>
              <strong>Configuration Required:</strong> Backend API URL not configured in environment variables.
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: '#2e2e2e',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ color: '#f7b91c', marginBottom: '0.5rem' }}>Personnel</h3>
              <p style={{ fontSize: '2rem', margin: '0', color: '#ffffff' }}>
                {stats.stats?.personnel || 0}
              </p>
              <p style={{ color: '#a1a0a0', margin: 0, fontSize: '0.9rem' }}>
                Active officers
              </p>
            </div>

            <div style={{
              background: '#2e2e2e',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ color: '#f7b91c', marginBottom: '0.5rem' }}>Sites</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
                {stats.stats?.sites || 0}
              </p>
              <p style={{ color: '#a1a0a0', margin: 0, fontSize: '0.9rem' }}>
                Active locations
              </p>
            </div>

            <div style={{
              background: '#2e2e2e',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ color: '#f7b91c', marginBottom: '0.5rem' }}>Active Shifts</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
                {stats.stats?.activeShifts || 0}
              </p>
              <p style={{ color: '#a1a0a0', margin: 0, fontSize: '0.9rem' }}>
                Currently on duty
              </p>
            </div>

            <div style={{
              background: '#2e2e2e',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ color: '#f7b91c', marginBottom: '0.5rem' }}>Check Calls</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
                {stats.stats?.todayCheckCalls || 0}
              </p>
              <p style={{ color: '#a1a0a0', margin: 0, fontSize: '0.9rem' }}>
                Today's check-ins
              </p>
            </div>
          </div>
        )}

        {/* Recent Personnel */}
        {personnel && (
          <div style={{
            background: '#2e2e2e',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }}>
            <h3 style={{ color: '#f7b91c', marginBottom: '1rem' }}>Recent Personnel</h3>
            <div style={{
              overflow: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #3a3a3a' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#a1a0a0' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#a1a0a0' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#a1a0a0' }}>Officer Code</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#a1a0a0' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.personnel?.slice(0, 5).map((person: any) => (
                    <tr key={person.id} style={{ borderBottom: '1px solid #3a3a3a' }}>
                      <td style={{ padding: '0.75rem' }}>
                        {person.first_name} {person.last_name}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#a1a0a0' }}>
                        {person.email}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#a1a0a0' }}>
                        {person.officer_code}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          background: person.is_active ? '#22C55E20' : '#EF444420',
                          color: person.is_active ? '#22C55E' : '#EF4444',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {person.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!stats && !personnel && apiStatus === 'connected' && (
          <div style={{
            background: '#2e2e2e',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #3a3a3a'
          }}>
            <h3 style={{ color: '#f7b91c', marginBottom: '1rem' }}>Loading Dashboard Data</h3>
            <p style={{ color: '#a1a0a0' }}>
              Fetching statistics and personnel information...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
