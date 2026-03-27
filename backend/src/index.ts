import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { config } from './config/database';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './controllers/auth';
import dashboardRouter from './controllers/dashboard';
import personnelRouter from './controllers/personnel';
import betterAuthRouter from './routes/auth';
import protectedRouter from './routes/protected';
import organisationRouter from './routes/organisation';
import rbacRouter from './routes/rbac';
import sessionRouter from './routes/session';
import onboardingRouter from './routes/onboarding';
import secureSignupRouter from './routes/secureSignup';
import invitationsRouter from './routes/invitations';
import onboardingSetupRouter from './routes/onboardingSetup';
import proFeaturesRouter from './routes/proFeatures';
import subscriptionRouter from './routes/subscription';
import billingRouter from './routes/billing';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Log startup info
console.log('=== CoreGuard SMS Backend Starting ===');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('PORT from env:', process.env.PORT);
console.log('Final PORT:', PORT);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.coreguard-uk.co.uk',
  'https://coreguard-uk.co.uk',
  'https://app.coreguardsms.co.uk',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log unauthorized origin attempts for security monitoring
      console.warn(`CORS violation attempt from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint for basic connectivity test
app.get('/', (req, res) => {
  res.json({
    message: 'CoreGuard SMS Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Simple health check - just verify the service is running
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      service: 'CoreGuard SMS Backend',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Better Auth routes
app.use(betterAuthRouter);

// Onboarding routes - organize with specific subpaths
app.use('/api/onboarding/signup', secureSignupRouter);
app.use('/api/onboarding/setup', onboardingSetupRouter);
app.use('/api/onboarding', onboardingRouter);

// Invitation routes
app.use('/api/invitations', invitationsRouter);

// Pro features routes (feature-locked)
app.use('/api/pro', proFeaturesRouter);

// Subscription management routes
app.use('/api/subscription', subscriptionRouter);

// Billing management routes
app.use('/api/billing', billingRouter);

// Organisation management routes
app.use('/api/organisation', organisationRouter);

// RBAC-protected routes
app.use('/api/rbac', rbacRouter);

// Session management routes
app.use('/api/session', sessionRouter);

// Better Auth protected routes
app.use('/api/protected', protectedRouter);

// Legacy auth routes (keep for backward compatibility)
app.use('/api/auth', authRouter);
app.use('/api/organisations', authRouter);

// Legacy protected routes (auth required)
app.use('/api/dashboard', authMiddleware, dashboardRouter);
app.use('/api/personnel', authMiddleware, personnelRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // Try to connect to database but don't fail if it's not ready
    try {
      console.log('Attempting database connection...');
      await config.connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.warn('Database connection failed during startup, but service will continue:', dbError.message);
    }
    
    console.log(`Attempting to start server on port ${PORT}...`);
    
    const server = app.listen(PORT, () => {
      console.log('=== Server Started Successfully ===');
      console.log(`CoreGuard SMS Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Health check available at: /health');
      console.log('Root endpoint available at: /');
      console.log('=====================================');
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
