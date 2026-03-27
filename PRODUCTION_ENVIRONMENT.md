
# ========================================
# CoreGuard UK - Production Environment Variables
# ========================================
# This file contains all environment variables needed for production deployment
# Copy these to your Railway (backend) and Vercel (frontend) deployment settings

# ========================================
# BACKEND ENVIRONMENT VARIABLES (Railway)
# ========================================

# Database
DATABASE_URL=postgresql://postgres:password@db.jchexyswrjefkteqfcco.supabase.co:5432/postgres

# Better Auth Configuration
BETTER_AUTH_URL=https://coreguard-uk-backend-production.up.railway.app
APP_URL=https://www.coreguard-uk.co.uk

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars

# CORS Configuration
CORS_ORIGIN=https://www.coreguard-uk.co.uk
FRONTEND_URL=https://www.coreguard-uk.co.uk

# Server Configuration
PORT=8000
NODE_ENV=production

# ========================================
# FRONTEND ENVIRONMENT VARIABLES (Vercel)
# ========================================

# API Configuration
NEXT_PUBLIC_API_URL=https://coreguard-uk-backend-production.up.railway.app

# App Configuration
NEXT_PUBLIC_APP_NAME=CoreGuard Security
NEXT_PUBLIC_APP_VERSION=1.0.0

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jchexyswrjefkteqfcco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaGV4eXN3cmplZmR0ZXFmY2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0Mjk2MDAsImV4cCI6MjAyOTk4NTYwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false

# ========================================
# PRODUCTION DEPLOYMENT CHECKLIST
# ========================================

# ✅ Backend (Railway)
# - [ ] Set DATABASE_URL to your Supabase PostgreSQL connection string
# - [ ] Set BETTER_AUTH_URL to your Railway backend URL
# - [ ] Set APP_URL to your Vercel frontend URL
# - [ ] Set RESEND_API_KEY to your Resend API key
# - [ ] Generate and set JWT_SECRET (minimum 32 characters)
# - [ ] Set CORS_ORIGIN and FRONTEND_URL to your frontend domain
# - [ ] Set NODE_ENV=production
# - [ ] Verify all environment variables are present

# ✅ Frontend (Vercel)
# - [ ] Set NEXT_PUBLIC_API_URL to your Railway backend URL
# - [ ] Set NEXT_PUBLIC_SUPABASE_URL to your Supabase project URL
# - [ ] Set NEXT_PUBLIC_SUPABASE_ANON_KEY to your Supabase anon key
# - [ ] Set NEXT_PUBLIC_APP_NAME and NEXT_PUBLIC_APP_VERSION
# - [ ] Set feature flags as needed
# - [ ] Verify all environment variables are present

# ✅ Security Checks
# - [ ] Ensure all URLs use HTTPS in production
# - [ ] Verify no localhost URLs are hardcoded
# - [ ] Check that JWT_SECRET is strong and unique
# - [ ] Confirm CORS origins are correctly set
# - [ ] Test email functionality with Resend
# - [ ] Verify database connectivity
# - [ ] Test authentication flow end-to-end

# ✅ Database Setup
# - [ ] Run DATABASE_SCHEMA.sql in Supabase SQL Editor
# - [ ] Verify all tables are created
# - [ ] Check RLS policies are enabled
# - [ ] Test database connectivity from backend
# - [ ] Verify user can be created and authenticated

# ========================================
# PRODUCTION TESTING COMMANDS
# ========================================

# Test Backend Health
curl https://coreguard-uk-backend-production.up.railway.app/health

# Test Better Auth Endpoints
curl -X POST https://coreguard-uk-backend-production.up.railway.app/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'

# Test Frontend
curl https://www.coreguard-uk.co.uk

# ========================================
# MONITORING & LOGGING
# ========================================

# Railway Logs: https://railway.app/project/coreguard-uk-backend/logs
# Vercel Logs: https://vercel.com/dashboard/coreguard-uk/logs
# Supabase Logs: https://supabase.com/dashboard/project/jchexyswrjefkteqfcco/logs

# Key Events to Monitor:
# - User signups and email verifications
# - Password reset requests
# - Failed authentication attempts
# - Database connection errors
# - Email sending failures
# - High error rates or timeouts
