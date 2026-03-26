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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

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
    if (!origin || allowedOrigins.includes(origin as string)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all origins
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

// Health check
app.get('/health', async (req, res) => {
  const dbHealthy = await config.healthCheck();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// Public auth routes (no auth required)
app.use('/api/auth', authRouter);
app.use('/api/organisations', authRouter);

// Protected routes (auth required)
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
    await config.connect();
    app.listen(PORT, () => {
      console.log(`CoreGuard SMS Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
