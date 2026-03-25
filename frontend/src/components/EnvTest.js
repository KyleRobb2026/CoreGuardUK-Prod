import React from 'react';

export default function EnvTest() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #eeba2b', 
      borderRadius: '8px',
      backgroundColor: '#1e1e1e',
      color: '#eeba2b',
      fontSize: '14px'
    }}>
      <h3>Environment Variables Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Supabase URL:</strong> {supabaseUrl ? '✅ Loaded' : '❌ Missing'}</p>
        <p><strong>Supabase Key:</strong> {supabaseKey ? '✅ Loaded' : '❌ Missing'}</p>
        <p><strong>Backend URL:</strong> {backendUrl ? '✅ Loaded' : '❌ Missing'}</p>
      </div>

      <div style={{ fontSize: '12px', color: '#999' }}>
        <p><strong>Actual Values:</strong></p>
        <p>Supabase URL: {supabaseUrl || 'NOT_FOUND'}</p>
        <p>Supabase Key: {supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT_FOUND'}</p>
        <p>Backend URL: {backendUrl || 'NOT_FOUND'}</p>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px' }}>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Check .env file exists in project root</li>
          <li>Verify NEXT_PUBLIC_ prefix is used</li>
          <li>Restart app after changing .env</li>
          <li>Get valid Supabase credentials from dashboard</li>
        </ol>
      </div>
    </div>
  )
}
