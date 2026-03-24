# CoreGuard UK - Production

Enterprise security management system for regulated private security companies.

## 🏗️ Architecture

This is a production-ready microservices architecture deployed on Railway:

```
CoreGuardUK-Prod/
├── backend/                 # Railway Service 2 - Node.js API
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── config/         # Database configuration
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers, logging
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── railway.json        # Railway deployment config
├── frontend/               # Railway Service 1 - Next.js App
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # UI components
│   │   ├── lib/           # API client, utilities
│   │   └── types/         # TypeScript types
│   ├── package.json       # Dependencies
│   ├── next.config.js     # Next.js config
│   └── railway.json      # Railway deployment config
├── docs/                  # Documentation
│   ├── RAILWAY_DEPLOYMENT_GUIDE.md
│   ├── RAILWAY_ARCHITECTURE_PLAN.md
│   ├── REFACTOR_SUMMARY.md
│   └── SUPABASE_SETUP_GUIDE.md
├── NEW_SCHEMA_CLEAN.sql   # Database schema
└── DATABASE_SCHEMA.sql     # Full database schema
```

## 🚀 Quick Start

### 1. Deploy to Railway

Follow the step-by-step deployment guide:
```bash
# View deployment instructions
cat docs/RAILWAY_DEPLOYMENT_GUIDE.md
```

### 2. Set Up Database

Run the database schema in Supabase:
```bash
# Use the clean schema for new deployments
psql $DATABASE_URL -f NEW_SCHEMA_CLEAN.sql
```

### 3. Configure Environment Variables

#### Frontend (Next.js)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard UK
```

#### Backend (Node.js)
```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend.railway.app
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin vs Officer permissions
- **Input Validation**: Joi schemas for all API endpoints
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Proper cross-origin configuration
- **Security Headers**: Helmet.js protection
- **Audit Logging**: Winston structured logging

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/officer-login` - Officer login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-activity` - Recent activity

### Personnel
- `GET /api/personnel` - List personnel (paginated)
- `POST /api/personnel` - Create personnel
- `PUT /api/personnel/:id` - Update personnel
- `DELETE /api/personnel/:id` - Delete personnel

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev  # Development server on port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev  # Development server on port 3000
```

## 📋 Documentation

- [Railway Deployment Guide](docs/RAILWAY_DEPLOYMENT_GUIDE.md)
- [Architecture Plan](docs/RAILWAY_ARCHITECTURE_PLAN.md)
- [Refactor Summary](docs/REFACTOR_SUMMARY.md)
- [Supabase Setup Guide](docs/SUPABASE_SETUP_GUIDE.md)

## 🔧 Technologies

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **JWT** - Authentication
- **Joi** - Input validation
- **Winston** - Logging
- **Supabase** - Database

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Infrastructure
- **Railway** - Deployment platform
- **Supabase** - PostgreSQL database
- **Railway Environment Variables** - Secret management

## 🎯 Production Features

- ✅ **Scalable**: Separate services for frontend/backend
- ✅ **Secure**: JWT auth, RBAC, input validation
- ✅ **Compliant**: Audit logging, security headers
- ✅ **Monitorable**: Structured logging, health checks
- ✅ **Maintainable**: TypeScript, clean architecture

## 📞 Support

For deployment issues, see the [Railway Deployment Guide](docs/RAILWAY_DEPLOYMENT_GUIDE.md).

---

**CoreGuard UK** - Enterprise Security Management System  
© 2024 CoreGuard UK. All rights reserved.
