import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseContext';
import { createApiService } from '../services/api';

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
      
      // Authenticate via Supabase — signIn returns { user, session } directly, throws on error
      const authData = await supabaseSignIn(email, password);
      const authUser = authData?.user;

      if (!authUser) {
        throw new Error('Invalid email or password');
      }

      // Fetch user record from users table to get organisation_id
      const { data: userRecord } = await supabase
        .from('users')
        .select('organisation_id, first_name, last_name, actor_type')
        .eq('id', authUser.id)
        .single();

      const coreGuardUser = {
        id: authUser.id,
        email: authUser.email,
        first_name: userRecord?.first_name || authUser.user_metadata?.first_name || '',
        last_name: userRecord?.last_name || authUser.user_metadata?.last_name || '',
        actor_type: userRecord?.actor_type || authUser.user_metadata?.actor_type || 'admin',
        organisation_id: userRecord?.organisation_id || authUser.user_metadata?.organisation_id || null,
        supabase_id: authUser.id,
        auth_provider: 'supabase'
      };
      
      localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
      setUser(coreGuardUser);
      
      return coreGuardUser;
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

      // Look up officer by code in personnel table
      const { data: officer, error: lookupError } = await supabase
        .from('personnel')
        .select('id, first_name, last_name, email, organisation_id, officer_code, pin_hash, is_active')
        .eq('officer_code', code)
        .eq('is_active', true)
        .single();

      if (lookupError || !officer) {
        throw new Error('Invalid officer code');
      }

      // Verify PIN (simple comparison — production should use hashed comparison)
      if (officer.pin_hash !== pin) {
        throw new Error('Invalid PIN');
      }

      const coreGuardUser = {
        id: officer.id,
        email: officer.email || '',
        first_name: officer.first_name,
        last_name: officer.last_name,
        actor_type: 'officer',
        organisation_id: officer.organisation_id,
        officer_code: officer.officer_code,
        auth_provider: 'supabase'
      };

      localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
      setUser(coreGuardUser);

      return coreGuardUser;
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
      
      // 1. Sign up via Supabase Auth — signUp returns { user, session } directly, throws on error
      const signUpData = await supabaseSignUp(adminData.email, adminData.password, {
        data: {
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          actor_type: 'admin',
          organisation_id: null
        }
      });
      const authUser = signUpData?.user;

      if (!authUser) {
        throw new Error('Registration failed — no user returned');
      }

      // 2. Create organisation directly in Supabase
      const { data: organisation, error: orgError } = await supabase
        .from('organisations')
        .insert({
          name: orgData.name,
          email: orgData.email,
          phone: orgData.phone || null,
          address: orgData.address || null,
          status: 'active'
        })
        .select()
        .single();
      
      if (orgError) {
        console.error('Error creating organisation:', orgError);
        throw new Error(orgError.message || 'Failed to create organisation');
      }

      // 3. Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          organisation_id: organisation.id,
          email: adminData.email,
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          actor_type: 'admin',
          is_active: true
        });
      
      if (userError) {
        console.error('Error creating user record:', userError);
      }

      // 4. Update Supabase auth metadata with organisation_id
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          organisation_id: organisation.id
        }
      });
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
      }
      
      const coreGuardUser = {
        id: authUser.id,
        email: authUser.email,
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        actor_type: 'admin',
        organisation_id: organisation.id,
        supabase_id: authUser.id,
        auth_provider: 'supabase'
      };
      
      localStorage.setItem('cg_user', JSON.stringify(coreGuardUser));
      setUser(coreGuardUser);
      
      return coreGuardUser;
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
