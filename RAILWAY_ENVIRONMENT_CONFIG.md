# CoreGuard UK - Railway Environment Configuration

## 🚀 **Your Railway Environment Variables**

### **Frontend Service Variables**
Add these to your Railway frontend service in the "Variables" tab:

```bash
NEXT_PUBLIC_API_URL=https://coreguarduk-prod.railway.internal
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **Backend Service Variables**
Add these to your Railway backend service in the "Variables" tab:

```bash
PORT=8000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-generate-a-secure-random-string
CORS_ORIGIN=https://your-frontend-production.railway.app
```

---

## 🔧 **Setup Instructions**

### **Step 1: Configure Backend Service**
1. Go to your backend service in Railway
2. Click "Variables" tab
3. Add the backend variables above
4. **Important**: Generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### **Step 2: Configure Frontend Service**
1. Go to your frontend service in Railway
2. Click "Variables" tab
3. Add the frontend variables:
   ```bash
   NEXT_PUBLIC_API_URL=https://coreguarduk-prod.railway.internal
   NEXT_PUBLIC_APP_NAME=CoreGuard UK
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

### **Step 3: Get Frontend URL**
After deploying frontend, get the production URL from Railway dashboard and update backend CORS:
```bash
CORS_ORIGIN=https://your-frontend-production.railway.app
```

---

## 🔐 **Security Notes**

### **JWT Secret Generation**
Generate a secure JWT secret for your backend:
```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 32

# Method 3: Online generator (use reputable site)
```

### **Environment Security**
- ✅ **Frontend**: Only `NEXT_PUBLIC_` variables (safe for browser)
- ✅ **Backend**: All secrets (JWT_SECRET, database URLs)
- ❌ **Never**: Put secrets in `NEXT_PUBLIC_` variables

---

## 🌐 **Service URLs**

### **Internal Communication**
- **Backend**: `https://coreguarduk-prod.railway.internal`
- **Frontend**: `https://your-frontend.railway.app` (after deployment)

### **External Access**
- **Backend**: Available via frontend API calls
- **Frontend**: Public Railway URL

---

## 📋 **Verification Checklist**

### **Backend Service**
- [ ] JWT_SECRET configured (secure random string)
- [ ] PORT set to 8000
- [ ] CORS_ORIGIN set to frontend URL
- [ ] Health check working: `/health`

### **Frontend Service**
- [ ] NEXT_PUBLIC_API_URL set to backend URL
- [ ] App name and version configured
- [ ] Build successful
- [ ] API connection working

---

## 🧪 **Testing the Configuration**

### **1. Backend Health Check**
```bash
curl https://coreguarduk-prod.railway.internal/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-24T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### **2. Frontend API Test**
Visit your frontend URL and check:
- Environment configuration shows correct API URL
- Backend connection status shows "Connected"
- Health check data displays correctly

### **3. Authentication Test**
```bash
curl -X POST https://coreguarduk-prod.railway.internal/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🚨 **Troubleshooting**

### **CORS Issues**
- Check that CORS_ORIGIN matches frontend URL exactly
- Ensure frontend URL includes https://
- Redeploy backend after updating CORS_ORIGIN

### **API Connection Issues**
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is running and accessible
- Look at browser network tab for failed requests

### **Authentication Issues**
- Verify JWT_SECRET is set in backend
- Check token generation and validation
- Ensure proper Authorization header format

---

## 🎯 **Production Ready Configuration**

### **Final Environment Setup**

**Backend Variables:**
```bash
PORT=8000
NODE_ENV=production
JWT_SECRET=your-secure-64-character-hex-string
CORS_ORIGIN=https://your-frontend.railway.app
```

**Frontend Variables:**
```bash
NEXT_PUBLIC_API_URL=https://coreguarduk-prod.railway.internal
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **Result**
- ✅ Secure backend with JWT authentication
- ✅ Proper CORS configuration
- ✅ Frontend-backend communication
- ✅ Production-ready deployment

---

## 🚀 **Next Steps**

1. **Add environment variables** to both Railway services
2. **Redeploy both services** to apply changes
3. **Test the connection** between frontend and backend
4. **Verify authentication** flow works correctly
5. **Test all API endpoints** are accessible

**Your CoreGuard UK application will be fully functional!** 🎉
