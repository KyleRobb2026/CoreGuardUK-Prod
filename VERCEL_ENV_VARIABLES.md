# Vercel Environment Variables for CoreGuard UK

## Frontend Environment Variables (Vercel)

### Required Variables
```
# Backend API URL (Required)
NEXT_PUBLIC_API_URL=https://coreguarduk-prod-production.up.railway.app

# Supabase Configuration (Required for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://jchexyswrjefkteqfcco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaGV4eXN3cmplZmt0ZXFmY2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTg3NjIsImV4cCI6MjA4OTc5NDc2Mn0.HmvDoljVL99LVVe-hzL-WVr28r6oao9Dv7JoFr_ttqQ
```

### Optional Variables
```
# Application Configuration
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=production

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## Backend Environment Variables (Railway - Already Configured)

For reference, these are the backend variables that should be configured on Railway:

### Required Backend Variables
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=coreguard
JWT_SECRET=your_jwt_secret_key_here
```

### Optional Backend Variables
```
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24
WEATHER_API_KEY=your_weather_api_key
```

## Setup Instructions for Vercel

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables:**

### Step-by-Step:

1. **NEXT_PUBLIC_API_URL**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://coreguarduk-prod-production.up.railway.app`
   - Environments: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_URL**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://jchexyswrjefkteqfcco.supabase.co`
   - Environments: Production, Preview, Development

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaGV4eXN3cmplZmt0ZXFmY2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTg3NjIsImV4cCI6MjA4OTc5NDc2Mn0.HmvDoljVL99LVVe-hzL-WVr28r6oao9Dv7JoFr_ttqQ`
   - Environments: Production, Preview, Development

4. **NODE_ENV**
   - Name: `NODE_ENV`
   - Value: `production`
   - Environments: Production

5. **NEXT_PUBLIC_APP_NAME**
   - Name: `NEXT_PUBLIC_APP_NAME`
   - Value: `CoreGuard UK`
   - Environments: All

6. **NEXT_PUBLIC_APP_VERSION**
   - Name: `NEXT_PUBLIC_APP_VERSION`
   - Value: `1.0.0`
   - Environments: All

7. **NEXT_PUBLIC_ENABLE_ANALYTICS**
   - Name: `NEXT_PUBLIC_ENABLE_ANALYTICS`
   - Value: `false`
   - Environments: All

8. **NEXT_PUBLIC_ENABLE_DEBUG**
   - Name: `NEXT_PUBLIC_ENABLE_DEBUG`
   - Value: `false`
   - Environments: Production
   - Value: `true`
   - Environments: Development, Preview

## Important Notes

1. **NEXT_PUBLIC_ Prefix**: All frontend-facing variables must start with `NEXT_PUBLIC_`
2. **API URL**: Make sure your Railway backend is deployed and accessible
3. **Supabase Keys**: These are the actual keys from your current setup
4. **Environment-Specific**: Set different values for Production vs Development as needed

## Verification

After setting up the variables:

1. **Redeploy your Vercel application**
2. **Check the browser console** for Supabase configuration messages
3. **Test the onboarding flow** to ensure API calls work
4. **Verify CORS** is working between Vercel and Railway

## Troubleshooting

If you encounter issues:

1. **CORS Errors**: Ensure the Railway backend has the Vercel domain in CORS settings
2. **API Connection**: Verify the Railway backend is running and accessible
3. **Supabase Connection**: Check that Supabase URL and keys are correct
4. **Environment Variables**: Ensure all required variables are set for the correct environment
