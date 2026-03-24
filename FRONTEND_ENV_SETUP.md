# CoreGuard UK Frontend - Railway Environment Setup

## 🚀 **Required Environment Variables for Railway**

### **1. Backend API URL (Required)**
```
NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
```

**How to get this value:**
1. Deploy your backend service to Railway first
2. Get the production URL from Railway dashboard
3. Replace `your-backend-production.railway.app` with your actual backend URL

### **2. Application Configuration (Optional)**
```
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **3. Environment (Optional)**
```
NODE_ENV=production
```
*Note: Railway sets this automatically*

---

## 📋 **Railway Frontend Setup Steps**

### **Step 1: Deploy Backend First**
1. Deploy your backend service to Railway
2. Note the production URL (e.g., `https://coreguard-backend.railway.app`)

### **Step 2: Configure Frontend Environment Variables**
In Railway dashboard for your frontend service:

1. Go to your frontend service in Railway
2. Click "Variables" tab
3. Add these environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Deploy Frontend**
1. Push changes to GitHub
2. Railway will auto-deploy with the environment variables
3. Frontend will connect to backend using the API URL

---

## 🔧 **Environment Variable Reference**

### **Required Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://backend.railway.app` |

### **Optional Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `CoreGuard UK` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |
| `NODE_ENV` | Environment | `production` (auto-set) |

---

## 🌍 **Environment-Specific Configurations**

### **Development (Local)**
File: `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### **Production (Railway)**
Set in Railway dashboard:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NODE_ENV=production
```

### **Staging (Optional)**
Set in Railway staging environment:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-staging.railway.app
NODE_ENV=production
```

---

## 🚨 **Important Notes**

### **NEXT_PUBLIC_ Prefix**
- Only variables with `NEXT_PUBLIC_` prefix are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_` variables
- Backend secrets should stay in backend environment variables

### **Security**
- ✅ **Safe**: API URLs, app names, version numbers
- ❌ **Unsafe**: API keys, secrets, database URLs

### **Railway Environment Variables**
1. Go to your Railway project
2. Select frontend service
3. Click "Variables" tab
4. Add your environment variables
5. Redeploy the service

---

## 📱 **Testing the Configuration**

### **1. Health Check**
After deployment, test:
```bash
curl https://your-frontend.railway.app
```

### **2. API Connection Test**
Check browser console for API calls:
1. Open browser dev tools
2. Go to your frontend URL
3. Check Network tab for API requests
4. Verify requests go to correct backend URL

### **3. Environment Variable Test**
The frontend should display the correct app name and connect to backend.

---

## 🔄 **Updating Environment Variables**

### **Change Backend URL**
1. Update `NEXT_PUBLIC_API_URL` in Railway dashboard
2. Redeploy frontend service
3. New connections will use new URL

### **Change App Name**
1. Update `NEXT_PUBLIC_APP_NAME` in Railway dashboard
2. Redeploy frontend service
3. App name will update throughout UI

---

## 🎯 **Quick Setup Checklist**

### **Before Deployment**
- [ ] Backend deployed to Railway
- [ ] Backend URL known
- [ ] Frontend code pushed to GitHub

### **Railway Configuration**
- [ ] Frontend service created in Railway
- [ ] `NEXT_PUBLIC_API_URL` set to backend URL
- [ ] Optional variables configured

### **After Deployment**
- [ ] Frontend loads correctly
- [ ] API calls reach backend
- [ ] Authentication works
- [ ] Dashboard displays data

---

## 📞 **Troubleshooting**

### **API Connection Failed**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running and accessible
- Check CORS configuration in backend

### **Environment Variables Not Working**
- Ensure `NEXT_PUBLIC_` prefix is used
- Check Railway Variables tab configuration
- Redeploy frontend service

### **Build Failures**
- Check for missing required variables
- Verify variable names are correct
- Check for syntax errors in values

---

## ✅ **Example Railway Configuration**

**Backend Service URL:** `https://coreguard-backend.railway.app`

**Frontend Variables:**
```bash
NEXT_PUBLIC_API_URL=https://coreguard-backend.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Result:** Frontend successfully connects to backend on Railway! 🚀
