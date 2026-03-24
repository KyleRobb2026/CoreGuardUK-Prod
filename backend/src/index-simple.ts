import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

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
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Simple auth endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock authentication for Railway deployment
    const token = jwt.sign(
      { 
        id: '1', 
        email: email || 'admin@example.com', 
        actor_type: 'admin', 
        organisation_id: '1' 
      },
      process.env.JWT_SECRET || 'fallback-secret-for-railway',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: '1',
        email: email || 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        actor_type: 'admin',
        organisation_id: '1',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, first_name, last_name, organisation_name } = req.body;
    
    // Mock registration for Railway deployment
    const token = jwt.sign(
      { 
        id: '1', 
        email: email || 'admin@example.com', 
        actor_type: 'admin', 
        organisation_id: '1' 
      },
      process.env.JWT_SECRET || 'fallback-secret-for-railway',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: '1',
        email: email || 'admin@example.com',
        first_name: first_name || 'Admin',
        last_name: last_name || 'User',
        actor_type: 'admin',
        organisation_id: '1',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    res.json({
      user: {
        id: '1',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        actor_type: 'admin',
        organisation_id: '1',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Simple dashboard endpoints
app.get('/api/dashboard/stats', (req, res) => {
  try {
    res.json({
      stats: {
        personnel: 10,
        sites: 5,
        activeShifts: 3,
        todayCheckCalls: 15,
        pendingIncidents: 2,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.get('/api/dashboard/recent-activity', (req, res) => {
  try {
    const activity = [
      {
        id: '1',
        type: 'check_call',
        title: 'Check Call - Site A',
        description: 'By John Doe',
        status: 'completed',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'incident',
        title: 'Security Incident',
        description: 'Severity: medium',
        status: 'investigating',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    
    res.json({
      activity,
      total: activity.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// Simple personnel endpoints
app.get('/api/personnel', (req, res) => {
  try {
    const personnel = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+447123456789',
        officer_code: 'OFF001',
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '+447987654321',
        officer_code: 'OFF002',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
    
    res.json({
      personnel,
      pagination: {
        page: 1,
        limit: 10,
        total: personnel.length,
        pages: 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get personnel' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CoreGuard SMS Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
