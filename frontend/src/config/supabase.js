import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate URL format
const isValidUrl = (url) => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Only create Supabase client if environment variables are available and valid
export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Export a boolean to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
