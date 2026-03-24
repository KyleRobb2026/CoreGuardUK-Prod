import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../config/supabase'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only proceed if Supabase is configured
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    session,
    loading,
    supabase,
    isConfigured: isSupabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Supabase is not configured')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    signUp: async (email, password, options = {}) => {
      if (!supabase) throw new Error('Supabase is not configured')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      })
      if (error) throw error
      return data
    },
    signOut: async () => {
      if (!supabase) throw new Error('Supabase is not configured')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    resetPassword: async (email) => {
      if (!supabase) throw new Error('Supabase is not configured')
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return data
    },
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
