# Supabase Setup Guide for CoreGuard SMS

## 🔧 Current Issue
The Supabase connection is failing with "Invalid API key" error. This means you need to:

1. **Get valid Supabase credentials** from your Supabase dashboard
2. **Update the .env file** with correct values
3. **Verify the project exists** and is active

## 📋 Step-by-Step Solution

### 1. Access Your Supabase Dashboard
Go to: https://supabase.com/dashboard

### 2. Select Your Project
- Look for project: `jchexyswrjefkteqfcco` 
- If it doesn't exist, create a new project

### 3. Get API Credentials
In your Supabase project:
1. Go to **Settings** → **API**
2. Copy the **Project URL** 
3. Copy the **anon public** API key

### 4. Update Your .env File
Replace the current values with your actual credentials:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY
REACT_APP_SUPABASE_URL_DIRECT=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
```

### 5. Restart Your App
```bash
npm start
```

## 🔍 What to Check

### ✅ Verify Project Exists
- Go to https://supabase.com/dashboard
- Confirm project `jchexyswrjefkteqfcco` exists
- If not, create a new project

### ✅ Check API Key Format
Valid anon key format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

### ✅ Test Connection
After updating .env, the SupabaseTest component should show:
- Connection Status: connected
- Result: ✅ Connected to Supabase successfully!

## 🚨 If Project Doesn't Exist

### Create New Project:
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization
4. Set project name: `coreguard-sms`
5. Set database password: **save this password**
6. Wait for project to be created (2-3 minutes)

### Update .env with New Project:
```env
REACT_APP_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
REACT_APP_SUPABASE_URL_DIRECT=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_NEW_PROJECT_ID.supabase.co:5432/postgres
```

## 🎯 Quick Fix Options

### Option 1: Use Existing Project (if available)
- Log into Supabase dashboard
- Find your existing project
- Copy the correct API credentials
- Update .env file

### Option 2: Create New Project (recommended)
- Create fresh Supabase project
- Get new API credentials  
- Update .env file
- Run the database schema

### Option 3: Use Demo Mode (temporary)
Comment out Supabase usage temporarily:
```javascript
// In src/config/supabase.js
export const supabase = null; // Temporary demo mode
```

## 📞 Need Help?
- Supabase docs: https://supabase.com/docs
- React integration: https://supabase.com/docs/guides/getting-started/quickstarts/react

---

**Next Steps**: After fixing the API key, run the database schema to create tables!
