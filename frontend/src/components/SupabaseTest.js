import React, { useEffect, useState } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useAuth } from '../contexts/AuthContext'

export default function SupabaseTest() {
  const { supabase, session } = useSupabase()
  const { user, authProvider, isSupabaseAuthenticated } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('checking')
      
      // Test basic Supabase connection by checking auth session
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        throw new Error(`Auth error: ${authError.message}`)
      }
      
      // Test database connection by trying to access organisations table
      const { data, error } = await supabase
        .from('organisations')
        .select('count')
        .limit(1)

      if (error) {
        // If table doesn't exist, that's expected - the schema hasn't been run yet
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          setConnectionStatus('connected')
          setTestResult('✅ Connected to Supabase! Database tables need to be created. Run the DATABASE_SCHEMA.sql file in Supabase SQL Editor.')
        } else if (error.status === 401) {
          setConnectionStatus('connected')
          setTestResult('✅ Connected to Supabase! Authentication working. Database tables need to be created.')
        } else {
          throw error
        }
      } else {
        setConnectionStatus('connected')
        setTestResult('✅ Connected to Supabase successfully! Database is ready.')
      }
    } catch (error) {
      setConnectionStatus('error')
      setTestResult(`❌ Connection error: ${error.message}`)
    }
  }

  const testAuth = async () => {
    try {
      if (session) {
        setTestResult(`✅ Authenticated as ${session.user.email} via ${authProvider}`)
      } else {
        setTestResult('⚠️ Not authenticated. Please sign in to test auth.')
      }
    } catch (error) {
      setTestResult(`❌ Auth error: ${error.message}`)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #eeba2b', 
      borderRadius: '8px',
      backgroundColor: '#1e1e1e',
      color: '#eeba2b'
    }}>
      <h3>Supabase Connection & Auth Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Connection Status:</strong> {connectionStatus}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>User:</strong> {user ? `${user.email} (${authProvider})` : 'Not logged in'}</p>
        <p><strong>Result:</strong> {testResult}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#eeba2b',
            color: '#262626',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={testAuth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#B04F6F',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Auth
        </button>
      </div>
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
        <p><strong>Current Auth Provider:</strong> {authProvider}</p>
        <p><strong>Supabase Auth:</strong> {isSupabaseAuthenticated ? '✅ Active' : '❌ Inactive'}</p>
      </div>
    </div>
  )
}
