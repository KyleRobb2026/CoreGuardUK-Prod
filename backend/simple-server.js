const express = require('express');
const app = express();

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'CoreGuard UK Backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CoreGuard UK Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get port from environment or use default
const PORT = Number(process.env.PORT) || 8000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=== Simple Health Server Started ===');
  console.log(`Running on port ${PORT}`);
  console.log('Health check available at: /health');
  console.log('=====================================');
});
