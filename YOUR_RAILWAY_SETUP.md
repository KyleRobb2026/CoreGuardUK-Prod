# CoreGuard UK - Your Railway Setup

## 🚀 **Your Specific Configuration**

### **Backend URL**
```
https://coreguarduk-prod.railway.internal
```

### **Frontend Environment Variables**
Add these to your Railway frontend service:

```bash
NEXT_PUBLIC_API_URL=https://coreguarduk-prod.railway.internal
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### **Backend Environment Variables**
Add these to your Railway backend service:

```bash
PORT=8000
NODE_ENV=production
JWT_SECRET=your-secure-random-string-here
CORS_ORIGIN=https://your-frontend-production.railway.app
```

---

## ⚡ **Quick Setup Steps**

### **1. Backend Service Setup**
1. Go to your backend service in Railway
2. Click "Variables" tab
3. Add these variables:
   ```bash
   PORT=8000
   NODE_ENV=production
   JWT_SECRET=your-secure-random-string-here
   CORS_ORIGIN=https://your-frontend-production.railway.app
   ```
4. Generate JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### **2. Frontend Service Setup**
1. Go to your frontend service in Railway
2. Click "Variables" tab
3. Add these variables:
   ```bash
   NEXT_PUBLIC_API_URL=https://coreguarduk-prod.railway.internal
   NEXT_PUBLIC_APP_NAME=CoreGuard UK
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

### **3. Deploy and Test**
1. Redeploy both services
2. Visit your frontend URL
3. Should show "Connected" status to backend

---

## 🧪 **Testing Your Setup**

### **Backend Health Check**
```bash
curl https://coreguarduk-prod.railway.internal/health
```

### **Frontend Test**
Visit your frontend Railway URL and check:
- API URL shows: `https://coreguarduk-prod.railway.internal`
- Status shows: "Connected"
- Health data displays

---

## 🎯 **Expected Results**

After setup, your frontend will:
- ✅ Connect to `https://coreguarduk-prod.railway.internal`
- ✅ Show "Connected" status
- ✅ Display backend health data
- ✅ Allow authentication with mock data

---

## 🚨 **Important Notes**

### **CORS Configuration**
After deploying frontend, get the frontend URL and update backend CORS_ORIGIN:
```bash
CORS_ORIGIN=https://your-actual-frontend-url.railway.app
```

### **Security**
- Never expose JWT_SECRET in frontend variables
- Use a secure random JWT_SECRET (64+ characters)
- Update CORS_ORIGIN to match frontend URL exactly

---

## 🎉 **Success!**

Your CoreGuard UK application will be fully functional with:
- Backend at: `https://coreguarduk-prod.railway.internal`
- Frontend connecting to backend successfully
- Mock authentication and data working
- Production-ready Railway deployment

**Ready to go!** 🚀
