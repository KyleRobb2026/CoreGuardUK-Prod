const express = require('express');
const path = require('path');
const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (Railway default)
app.get('/health', (req, res) => {
  console.log('Health check requested at /health');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'CoreGuard UK Frontend',
    version: '1.0.0',
    port: process.env.PORT || 3000
  });
});

// Health check endpoint (Next.js API style)
app.get('/api/health', (req, res) => {
  console.log('Health check requested at /api/health');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'CoreGuard UK Frontend',
    version: '1.0.0',
    port: process.env.PORT || 3000
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CoreGuard UK - Frontend</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          margin: 0;
          padding: 40px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #1e1e1e;
          color: #ffffff;
          text-align: center;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
        }
        h1 {
          color: #f7b91c;
          margin-bottom: 20px;
        }
        .status {
          background: #2e2e2e;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .healthy {
          color: #22C55E;
        }
        .endpoint {
          background: #1a1a1a;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ CoreGuard UK</h1>
        <div class="status">
          <h2 class="healthy">✅ Frontend Service Healthy</h2>
          <p>Frontend is running and ready to serve requests.</p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
          <p>Port: ${process.env.PORT || 3000}</p>
          <p>Uptime: ${Math.floor(process.uptime())}s</p>
        </div>
        
        <div class="status">
          <h3>Available Endpoints:</h3>
          <div class="endpoint">GET /health</div>
          <div class="endpoint">GET /api/health</div>
        </div>
        
        <p>Enterprise Security Management System</p>
      </div>
    </body>
    </html>
  `);
});

// Get port from environment or use default
const PORT = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=== Simple Frontend Server Started ===');
  console.log(`Running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log('  GET /health');
  console.log('  GET /api/health');
  console.log('  GET /');
  console.log('=====================================');
});
