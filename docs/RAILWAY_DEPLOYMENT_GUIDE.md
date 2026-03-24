# CoreGuard SMS - Railway Production Deployment Guide

## 🚀 Architecture Overview

### Service 1: Frontend (Next.js)
- **Technology**: Next.js 14 with App Router
- **Purpose**: UI rendering and client-side logic
- **Port**: 3000
- **Environment**: Railway-managed

### Service 2: Backend (Node.js + TypeScript)
- **Technology**: Express.js with TypeScript
- **Purpose**: API endpoints, business logic, database access
- **Port**: 8000
- **Environment**: Railway-managed

---

## 📋 Required Environment Variables

### Frontend Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard SMS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Backend Environment Variables
```
# Database
DATABASE_URL=postgresql://postgres:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=8000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-production.railway.app

# Logging
LOG_LEVEL=info
```

---

## 🛠️ Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "feat: add Railway production architecture"
   git push origin main
   ```

### Step 2: Deploy Backend Service

1. **Create Backend Project**
   - In Railway dashboard: "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - **Project Name**: `coreguard-sms-backend`

2. **Configure Backend**
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `8000`

3. **Add Backend Environment Variables**
   ```
   DATABASE_URL=your-postgres-connection-string
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   JWT_SECRET=generate-secure-random-string
   JWT_EXPIRES_IN=24h
   PORT=8000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.railway.app
   LOG_LEVEL=info
   ```

4. **Deploy Backend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the production URL: `https://your-backend-production.railway.app`

### Step 3: Deploy Frontend Service

1. **Create Frontend Project**
   - In Railway dashboard: "New Project" → "Deploy from GitHub repo"
   - Select the same repository
   - **Project Name**: `coreguard-sms-frontend`

2. **Configure Frontend**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

3. **Add Frontend Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
   NEXT_PUBLIC_APP_NAME=CoreGuard SMS
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the production URL: `https://your-frontend-production.railway.app`

### Step 4: Update CORS Configuration

1. **Go back to Backend Service**
2. **Update CORS_ORIGIN** environment variable:
   ```
   CORS_ORIGIN=https://your-frontend-production.railway.app
   ```
3. **Redeploy Backend** to apply changes

---

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL (Recommended)
1. In your backend project: "New Service" → "Add PostgreSQL"
2. Railway will provide connection string
3. Add to `DATABASE_URL` environment variable
4. Run migration script

### Option 2: External Supabase
1. Create Supabase project
2. Run database schema from `NEW_SCHEMA_CLEAN.sql`
3. Add Supabase credentials to environment variables

---

## 🔧 Migration Commands

### Run Database Schema
```bash
# Connect to your database and run:
psql $DATABASE_URL -f NEW_SCHEMA_CLEAN.sql
```

### Seed Data (Optional)
```bash
# Add sample data for testing
curl -X POST https://your-backend-production.railway.app/api/seed \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## ✅ Verification Checklist

### Backend Health Check
```bash
curl https://your-backend-production.railway.app/health
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

### Frontend Health Check
- Visit: `https://your-frontend-production.railway.app`
- Should see CoreGuard SMS landing page
- Check browser console for errors

### API Connection Test
```bash
# Test authentication endpoint
curl -X POST https://your-backend-production.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🔒 Security Configuration

### 1. JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Database Security
- Use Railway's built-in PostgreSQL for automatic SSL
- Enable connection pooling
- Set up read replicas for scaling

### 3. API Security
- Rate limiting is configured (100 requests per 15 minutes)
- CORS is properly configured
- Helmet.js security headers are enabled

---

## 📊 Monitoring & Logging

### Railway Dashboard Features
- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Deployments**: Track deployment history
- **Environment**: Manage environment variables

### Custom Logging
Backend uses Winston for structured logging:
```javascript
logger.info('User login', { userId: '123', email: 'user@example.com' });
logger.error('Database error', { error: error.message, stack: error.stack });
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments
Railway automatically deploys when you push to main branch.

### Manual Deployments
1. Push to a different branch
2. In Railway dashboard: "Deployments" → "New Deployment"
3. Select branch and deploy

### Environment-Specific Configs
- **Production**: Railway production environment
- **Staging**: Create separate Railway project for testing
- **Development**: Local development with `.env.local`

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Frontend Can't Connect to Backend
**Problem**: CORS errors or connection refused
**Solution**: 
- Check `NEXT_PUBLIC_API_URL` in frontend
- Verify `CORS_ORIGIN` in backend
- Ensure both services are running

#### 2. Database Connection Failed
**Problem**: `ECONNREFUSED` database errors
**Solution**:
- Verify `DATABASE_URL` is correct
- Check if database service is running
- Test connection manually

#### 3. JWT Authentication Errors
**Problem**: `Invalid token` or `JWT_SECRET not configured`
**Solution**:
- Ensure `JWT_SECRET` is set in backend
- Check token expiration
- Verify token format

#### 4. Build Failures
**Problem**: TypeScript or dependency errors
**Solution**:
- Check Railway build logs
- Run `npm run build` locally
- Verify all dependencies are installed

### Debug Commands
```bash
# Check backend health
curl https://your-backend.railway.app/health

# Check frontend config
curl https://your-frontend.railway.app/api/config

# Test database connection
curl https://your-backend.railway.app/api/health/db
```

---

## 📈 Scaling & Performance

### Horizontal Scaling
- Railway automatically scales based on load
- Add more instances for high traffic
- Use Railway's load balancer

### Database Scaling
- Enable connection pooling
- Add read replicas for database
- Consider Redis for caching

### Performance Optimization
- Enable Next.js image optimization
- Use Railway CDN for static assets
- Implement API response caching

---

## 🎯 Production Best Practices

### 1. Environment Management
- Never commit secrets to git
- Use Railway environment variables
- Regularly rotate secrets and keys

### 2. Monitoring
- Set up alerting for errors
- Monitor database performance
- Track API response times

### 3. Backup Strategy
- Enable automatic database backups
- Export regular data snapshots
- Test restoration procedures

### 4. Security Updates
- Keep dependencies updated
- Monitor security advisories
- Regularly review access permissions

---

## 📞 Support

### Railway Support
- Documentation: [docs.railway.app](https://docs.railway.app)
- Status: [status.railway.app](https://status.railway.app)
- Support: support@railway.app

### CoreGuard SMS Support
- Repository: Check GitHub issues
- Documentation: Review project README
- Architecture: Review `RAILWAY_ARCHITECTURE_PLAN.md`

---

## 🎉 Success!

Once deployed, your CoreGuard SMS application will be:
- ✅ Securely hosted on Railway
- ✅ Properly separated into frontend/backend
- ✅ Using Railway-managed environment variables
- ✅ Production-ready with monitoring and logging
- ✅ Scalable and maintainable architecture

Your URLs will be:
- **Frontend**: `https://your-frontend-production.railway.app`
- **Backend API**: `https://your-backend-production.railway.app`
- **Health Check**: `https://your-backend-production.railway.app/health`
