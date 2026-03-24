# CoreGuard SMS - Railway Production Architecture

## 🏗️ Target Structure

```
coreguard-sms/
├── frontend/                 # Next.js App (Railway Service 1)
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # UI components
│   │   ├── lib/            # API client, utils
│   │   └── types/          # TypeScript types
│   ├── package.json
│   ├── next.config.js
│   └── railway.json
├── backend/                  # Node.js API (Railway Service 2)
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   ├── models/         # Data models
│   │   ├── config/         # Database, Supabase
│   │   └── utils/          # Helpers
│   ├── package.json
│   ├── tsconfig.json
│   └── railway.json
└── docs/
    ├── deployment.md
    └── env-vars.md
```

## 🚀 Railway Services

### Service 1: Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Port**: 3000
- **Build**: `npm run build`
- **Start**: `npm start`

### Service 2: Backend (Node.js)
- **Framework**: Express.js with TypeScript
- **Port**: 8000
- **Build**: `npm run build`
- **Start**: `npm start`

## 🔐 Security Architecture
- Frontend: No direct DB access, API calls only
- Backend: All sensitive operations, auth, DB access
- Communication: HTTPS with proper CORS
- Environment: Railway-managed secrets

## 📋 Environment Variables

### Frontend (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_API_URL=https://your-backend-production.railway.app
NEXT_PUBLIC_APP_NAME=CoreGuard SMS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Backend (Secure)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://....
SUPABASE_ANON_KEY=....
SUPABASE_SERVICE_KEY=....
JWT_SECRET=....
PORT=8000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-production.railway.app
```

## 🔄 Migration Steps
1. Create new folder structure
2. Migrate frontend to Next.js
3. Create backend API with all endpoints
4. Update frontend to use API calls
5. Configure Railway deployment
6. Test end-to-end functionality
