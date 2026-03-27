const express = require('express');
const path = require('path');
const app = express();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'CoreGuard UK Frontend',
    version: '1.0.0'
  });
});

// Serve static files from .next directory
app.use(express.static(path.join(__dirname, '.next')));

// Handle all other routes with Next.js rendering
app.get('*', (req, res) => {
  // For now, serve a simple HTML page
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CoreGuard UK</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ CoreGuard UK</h1>
        <div class="status">
          <h2 class="healthy">✅ Service Healthy</h2>
          <p>Frontend is running and ready to serve requests.</p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
          <p>Port: ${process.env.PORT || 3000}</p>
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
  console.log('Health check available at: /api/health');
  console.log('=====================================');
});
