import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseContext';
import axios from 'axios';
import { createApiService } from '../services/api';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { supabase, session, signIn: supabaseSignIn, signUp: supabaseSignUp, signOut: supabaseSignOut } = useSupabase();

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('cg_token');
    const userData = localStorage.getItem('cg_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('cg_token');
        localStorage.removeItem('cg_user');
      }
    }
    
    // Check for Supabase session
    if (session && !user) {
      // Convert Supabase user to our user format
      const coreGuardUser = {
        id: session.user.id,
        email: session.user.email,
        first_name: session.user.user_metadata?.first_name || '',
        last_name: session.user.user_metadata?.last_name || '',
        actor_type: session.user.user_metadata?.actor_type || 'admin',
        organisation_id: session.user.user_metadata?.organisation_id || null,
        supabase_id: session.user.id,
        auth_provider: 'supabase'
      };
      setUser(coreGuardUser);
      localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
    }
    
    setLoading(false);
  }, [session, user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Try Supabase auth first
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error) {
        // Fallback to local auth if Supabase fails
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        const { user: userData, token } = res.data;
        
        // Store token and user data
        localStorage.setItem('cg_token', token);
        localStorage.setItem('cg_user', JSON.stringify(userData));
        setUser(userData);
        
        return userData;
      } else {
        // Supabase auth successful
        const coreGuardUser = {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || '',
          last_name: data.user.user_metadata?.last_name || '',
          actor_type: data.user.user_metadata?.actor_type || 'admin',
          organisation_id: data.user.user_metadata?.organisation_id || null,
          supabase_id: data.user.id,
          auth_provider: 'supabase'
        };
        
        localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
        setUser(coreGuardUser);
        
        return coreGuardUser;
      }
    } catch (error) {
      localStorage.removeItem('cg_token');
      localStorage.removeItem('cg_user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const officerLogin = async (code, pin) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/officer-login`, { code, pin });
      const { user: userData, token } = res.data;
      
      // Store token and user data
      localStorage.setItem('cg_token', token);
      localStorage.setItem('cg_user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      localStorage.removeItem('cg_token');
      localStorage.removeItem('cg_user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase if authenticated via Supabase
      if (user?.auth_provider === 'supabase') {
        await supabaseSignOut();
      }
      
      // Clear local storage
      localStorage.removeItem('cg_token');
      localStorage.removeItem('cg_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if Supabase logout fails
      localStorage.removeItem('cg_token');
      localStorage.removeItem('cg_user');
      setUser(null);
    }
  };

  const register = async (orgData, adminData) => {
    try {
      setLoading(true);
      
      // Try Supabase registration first
      const { data, error } = await supabaseSignUp(adminData.email, adminData.password, {
        data: {
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          actor_type: 'admin',
          organisation_id: null // Will be set after org creation
        }
      });
      
      if (error) {
        // Fallback to local registration if Supabase fails
        const res = await axios.post(`${API_BASE}/api/auth/register`, { orgData, adminData });
        const { user: userData, token } = res.data;
        
        // Store token and user data
        localStorage.setItem('cg_token', token);
        localStorage.setItem('cg_user', JSON.stringify(userData));
        setUser(userData);
        
        return userData;
      } else {
        // Supabase registration successful, now create organisation
        const orgRes = await axios.post(`${API_BASE}/api/organisations`, orgData);
        const organisation = orgRes.data;
        
        // Update user metadata with organisation_id
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            organisation_id: organisation.id
          }
        });
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
        
        const coreGuardUser = {
          id: data.user.id,
          email: data.user.email,
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          actor_type: 'admin',
          organisation_id: organisation.id,
          supabase_id: data.user.id,
          auth_provider: 'supabase'
        };
        
        localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
        setUser(coreGuardUser);
        
        return coreGuardUser;
      }
    } catch (error) {
      localStorage.removeItem('cg_token');
      localStorage.removeItem('cg_user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    officerLogin,
    logout,
    register,
    // Supabase methods
    supabaseSignIn,
    supabaseSignUp,
    supabaseSignOut,
    // Helper to check if user is authenticated via Supabase
    isSupabaseAuthenticated: !!session,
    // Combined authentication check
    isAuthenticated: !!user,
    // User type helpers
    isAdmin: user?.actor_type === 'admin',
    isOfficer: user?.actor_type === 'officer',
    // Auth provider
    authProvider: user?.auth_provider || 'local',
    // Organisation ID for WebSocket connections
    orgId: user?.organisation_id || null,
    // API helper for backend calls
    useApi: createApiService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useApi() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an AuthProvider');
  }
  return context.useApi();
}
