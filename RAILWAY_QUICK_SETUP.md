# CoreGuard UK - Railway Quick Setup Guide

## 🚀 **5-Minute Railway Deployment**

### **Prerequisites**
- GitHub repository with CoreGuard UK code
- Railway account
- Backend deployed first

---

## ⚡ **Step 1: Backend Deployment (Already Fixed)**

Your backend is ready with:
- ✅ Fixed TypeScript compilation
- ✅ Mock authentication system
- ✅ Health check endpoint
- ✅ Basic API endpoints

**Deploy Backend:**
1. Push backend code to GitHub
2. Create Railway project from repo
3. Set root directory: `backend`
4. Build: `npm run build`
5. Start: `npm start`
6. **Copy the production URL**

---

## ⚡ **Step 2: Frontend Environment Variables**

In Railway frontend service, add these variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**How to add:**
1. Go to Railway frontend service
2. Click "Variables" tab
3. Add the variables above
4. Replace `your-backend-production.railway.app` with your actual backend URL

---

## ⚡ **Step 3: Frontend Deployment**

**Deploy Frontend:**
1. Set root directory: `frontend`
2. Build: `npm run build`
3. Start: `npm start`
4. Deploy!

---

## ✅ **Verification**

After deployment, visit your frontend URL and check:

1. **Environment Variables** - Should show your API URL
2. **Backend Connection** - Should show "Connected" status
3. **Health Check** - Should display backend health data

---

## 🔧 **Example Configuration**

**Backend URL:** `https://coreguard-backend.railway.app`

**Frontend Variables:**
```bash
NEXT_PUBLIC_API_URL=https://coreguard-backend.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard UK
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🎯 **What You Get**

### **Working Features**
- ✅ Health check monitoring
- ✅ Mock authentication (login/register)
- ✅ Dashboard with sample data
- ✅ Personnel management (mock)
- ✅ Responsive design
- ✅ Environment variable testing

### **Test Credentials**
- **Email:** `test@example.com`
- **Password:** `password`
- **Officer Code:** `OFF001`
- **PIN:** `1234`

---

## 📞 **Troubleshooting**

### **Frontend Shows "Connection Failed"**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is deployed and running
- Check CORS configuration in backend

### **Build Failures**
- Ensure all required variables are set
- Check variable names have `NEXT_PUBLIC_` prefix
- Redeploy the service

### **Authentication Issues**
- Use mock credentials above
- Check JWT_SECRET is set in backend
- Verify API calls in browser network tab

---

## 🎉 **Success!**

Your CoreGuard UK application is now running on Railway with:
- ✅ Separate frontend and backend services
- ✅ Environment variable configuration
- ✅ Working API communication
- ✅ Mock data for testing
- ✅ Production-ready architecture

**Ready for real database integration!** 🚀
