const express = require('express');
const path = require('path');
const app = express();

// Add JSON middleware for API routes
app.use(express.json());

// In-memory storage for demo purposes (in production, use a database)
const waitlist = new Set();

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

// Waitlist API endpoint
app.post('/api/waitlist', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if email already exists
    if (waitlist.has(email)) {
      return res.json({ message: 'Email already registered for waitlist' });
    }

    // Add to waitlist
    waitlist.add(email);

    // Log the signup (in production, save to database)
    console.log(`Waitlist signup: ${email}`);
    console.log(`Total waitlist: ${waitlist.size} emails`);

    return res.json({
      message: 'Successfully joined waitlist',
      email: email,
      totalWaitlist: waitlist.size
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/waitlist', (req, res) => {
  return res.json({
    message: 'CoreGuard UK Waitlist API',
    totalSignups: waitlist.size,
    launchDate: '2025-04-06T09:00:00+01:00'
  });
});

// Root endpoint - Launching Soon page (exact landing page structure)
app.get('/', (req, res) => {
  console.log('Root endpoint requested - serving launching soon page');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CoreGuard UK - Launching Soon</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="Enterprise Security Management System launching April 6th, 2025. Join our waitlist for early access.">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          min-height: 100vh;
          background: #0f0f0f;
          color: #d4d4d4;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Banner */
        .banner {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(to right, #f7b91c, #d4a017);
          padding: 8px;
          text-align: center;
          font-weight: 500;
          color: #1a1a1a;
        }
        
        .banner p {
          font-size: 14px;
        }
        
        .banner button {
          margin-left: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 6px;
          background: #1a1a1a;
          padding: 4px 12px;
          color: #f7b91c;
          font-size: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .banner button:hover {
          background: #262626;
        }
        
        .banner button:active {
          transform: scale(0.95);
        }
        
        /* Hero Section */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 90vh;
          overflow: hidden;
          padding: 96px 24px;
          z-index: 10;
        }
        
        @media (min-width: 768px) {
          .hero {
            padding: 96px 64px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero {
            padding: 96px 96px;
          }
        }
        
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-image: 
            linear-gradient(to bottom, rgba(15, 15, 15, 0.3), rgba(15, 15, 15, 0.4), rgba(15, 15, 15, 0.5)),
            url('https://i.ibb.co/ZRmjPt68/The-Future-of-Security-Management-Starts-Here-Website.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #1a1a1a;
        }
        
        .hero-glow {
          position: absolute;
          inset: 0;
          z-index: -1;
          mix-blend-mode: screen;
        }
        
        .status-badge {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1px solid rgba(247, 185, 28, 0.2);
          background: rgba(247, 185, 28, 0.05);
          padding: 6px 16px;
          margin-bottom: 32px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f7b91c;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          margin-right: 8px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .status-text {
          color: #f7b91c;
          font-size: 12px;
          font-weight: 500;
        }
        
        .hero-title {
          font-size: 48px;
          line-height: 1.15;
          font-weight: 700;
          text-align: center;
          max-width: 48rem;
          letter-spacing: -0.025em;
          margin-bottom: 24px;
        }
        
        @media (min-width: 768px) {
          .hero-title {
            font-size: 64px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 80px;
          }
        }
        
        .gradient-text-1 {
          background: linear-gradient(to right, white, #d4d4d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-2 {
          background: linear-gradient(to bottom, #f7b91c, #d4a017);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          color: #9ca3af;
          font-size: 16px;
          text-align: center;
          max-width: 28rem;
          margin-top: 24px;
          line-height: 1.75;
        }
        
        @media (min-width: 768px) {
          .hero-description {
            font-size: 18px;
          }
        }
        
        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
        }
        
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(to right, #f7b91c, #d4a017);
          color: #1a1a1a;
          font-weight: 600;
          padding: 12px 32px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          text-decoration: none;
        }
        
        .btn-primary:hover {
          opacity: 0.9;
        }
        
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #555;
          color: white;
          padding: 12px 32px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          text-decoration: none;
          background: transparent;
        }
        
        .btn-secondary:hover {
          border-color: #f7b91c;
        }
        
        /* What We Do Section */
        .what-we-do-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 48px;
          padding: 112px 24px;
        }
        
        @media (min-width: 768px) {
          .what-we-do-section {
            flex-direction: row;
            gap: 48px;
            padding: 112px 64px;
          }
        }
        
        @media (min-width: 1024px) {
          .what-we-do-section {
            gap: 80px;
            padding: 112px 96px;
          }
        }
        
        .dashboard-card {
          position: relative;
          flex-shrink: 0;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #333;
          background: #1a1a1a;
          padding: 20px;
          box-shadow: 0 25px 50px -12px rgba(247, 185, 28, 0.05);
          max-width: 384px;
          width: 100%;
        }
        
        .window-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .window-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .window-dot.red {
          background: rgba(239, 68, 68, 0.6);
        }
        
        .window-dot.yellow {
          background: rgba(245, 158, 11, 0.6);
        }
        
        .window-dot.green {
          background: rgba(34, 197, 94, 0.6);
        }
        
        .window-title {
          margin-left: auto;
          font-size: 10px;
          color: #6b7280;
          font-family: monospace;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .stat-card {
          background: #0f0f0f;
          border-radius: 8px;
          padding: 12px;
          border: 1px solid #262626;
        }
        
        .stat-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: bold;
        }
        
        .stat-value.white {
          color: white;
        }
        
        .stat-value.gold {
          color: #f7b91c;
        }
        
        .stat-value.orange {
          color: #fb923c;
        }
        
        .activity-log {
          background: #0f0f0f;
          border-radius: 8px;
          border: 1px solid #262626;
        }
        
        .activity-item {
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(38, 38, 38, 0.5);
          font-size: 11px;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .activity-dot.green {
          background: #22c55e;
        }
        
        .activity-dot.orange {
          background: #fb923c;
        }
        
        .activity-text {
          color: #d1d5db;
        }
        
        .activity-time {
          color: #6b7280;
        }
        
        .dashboard-glow {
          position: absolute;
          bottom: -16px;
          right: -16px;
          width: 128px;
          height: 128px;
          background: rgba(247, 185, 28, 0.05);
          border-radius: 50%;
          filter: blur(24px);
        }
        
        .what-we-do-content {
          max-width: 28rem;
        }
        
        .section-title {
          font-size: 24px;
          text-transform: uppercase;
          font-weight: bold;
          color: white;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }
        
        .what-we-do-text {
          color: #9ca3af;
          line-height: 1.75;
          font-size: 15px;
          margin-bottom: 20px;
        }
        
        /* Features Section */
        .features-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 112px 24px;
        }
        
        @media (min-width: 768px) {
          .features-section {
            padding: 112px 64px;
          }
        }
        
        @media (min-width: 1024px) {
          .features-section {
            padding: 112px 96px;
          }
        }
        
        .features-title {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          color: white;
          margin-bottom: 16px;
          max-width: 48rem;
        }
        
        .features-subtitle {
          color: #9ca3af;
          text-align: center;
          max-width: 42rem;
          margin-bottom: 48px;
          line-height: 1.75;
        }
        
        .features-grid {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        
        @media (min-width: 768px) {
          .features-grid {
            gap: 32px;
          }
        }
        
        .feature-card {
          max-width: 320px;
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(247, 185, 28, 0.3);
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: linear-gradient(to right, #f7b91c, #d4a017);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 24px;
        }
        
        .feature-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }
        
        .feature-description {
          color: #9ca3af;
          line-height: 1.75;
          font-size: 14px;
        }
        
        /* Launch Countdown Section */
        .launch-section {
          background: rgba(26, 26, 26, 0.5);
          border-top: 1px solid #262626;
          border-bottom: 1px solid #262626;
          padding: 112px 24px;
        }
        
        @media (min-width: 768px) {
          .launch-section {
            padding: 112px 64px;
          }
        }
        
        @media (min-width: 1024px) {
          .launch-section {
            padding: 112px 96px;
          }
        }
        
        .launch-content {
          max-width: 96rem;
          margin: 0 auto;
        }
        
        .launch-title {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          color: white;
          margin-bottom: 16px;
        }
        
        .launch-subtitle {
          color: #9ca3af;
          text-align: center;
          max-width: 42rem;
          margin: 0 auto 48px;
          line-height: 1.75;
        }
        
        .countdown-container {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .countdown {
          font-size: 64px;
          font-weight: bold;
          background: linear-gradient(to bottom, #f7b91c, #d4a017);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
        }
        
        @media (min-width: 768px) {
          .countdown {
            font-size: 80px;
          }
        }
        
        .waitlist-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 28rem;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .waitlist-form {
            flex-direction: row;
          }
        }
        
        .email-input {
          flex: 1;
          padding: 12px 16px;
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .email-input::placeholder {
          color: #6b7280;
        }
        
        .email-input:focus {
          border-color: #f7b91c;
          box-shadow: 0 0 0 1px rgba(247, 185, 28, 0.2);
        }
        
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(to right, #f7b91c, #d4a017);
          color: #1a1a1a;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          min-width: 140px;
        }
        
        .submit-btn:hover {
          opacity: 0.9;
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Success Message */
        .success-message {
          text-align: center;
          padding: 32px 0;
        }
        
        .success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          margin-bottom: 16px;
          font-size: 24px;
        }
        
        .success-title {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
        }
        
        .success-text {
          color: #9ca3af;
          max-width: 28rem;
          margin: 0 auto;
        }
        
        .success-count {
          margin-top: 24px;
          font-size: 14px;
          color: #6b7280;
        }
        
        /* Footer */
        .footer {
          border-top: 1px solid #262626;
          background: #0f0f0f;
          padding: 48px 24px;
        }
        
        .footer-content {
          max-width: 80rem;
          margin: 0 auto;
          text-align: center;
        }
        
        .footer-text {
          color: #6b7280;
          font-size: 14px;
        }
        
        .footer-text p {
          margin-bottom: 8px;
        }
        
        .footer-text p:last-child {
          margin-bottom: 0;
        }
      </style>
    </head>
    <body>

      <!-- Banner -->
      <div class="banner">
        <p>CoreGuard UK — Professional Security Management Platform</p>
        <button onclick="scrollToWaitlist()">
          Join Waitlist
          <span>→</span>
        </button>
      </div>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg"></div>
        
        <!-- Background glow for additional depth -->
        <svg class="hero-glow" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <filter id="glow1">
              <feGaussianBlur stdDeviation="150" />
            </filter>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="150" />
            </filter>
            <filter id="glow3">
              <feGaussianBlur stdDeviation="100" />
            </filter>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f7b91c;stop-opacity:0.08" />
              <stop offset="100%" style="stop-color:#d4a017;stop-opacity:0.04" />
            </linearGradient>
          </defs>
          <g filter="url(#glow1)">
            <ellipse cx="300" cy="200" rx="300" ry="200" fill="url(#grad1)" />
          </g>
          <g filter="url(#glow2)">
            <ellipse cx="1100" cy="500" rx="400" ry="280" fill="url(#grad1)" />
          </g>
          <g filter="url(#glow3)">
            <ellipse cx="720" cy="450" rx="250" ry="150" fill="#f7b91c" fillOpacity="0.03" />
          </g>
        </svg>

        <div class="status-badge">
          <span class="status-dot"></span>
          <span class="status-text">Launching Monday, April 6th 2025</span>
        </div>

        <h1 class="hero-title">
          <span class="gradient-text-1">The Future of Security Management</span><br>
          <span class="gradient-text-2">Starts Soon</span>
        </h1>

        <p class="hero-description">
          The all-in-one platform for UK security companies. Manage workforce, enforce SIA compliance, and run operations — from a single command centre.
        </p>

        <div class="cta-buttons">
          <button class="btn-primary" onclick="scrollToWaitlist()">
            Join Waitlist
            <span>→</span>
          </button>
          <button class="btn-secondary" onclick="scrollToWaitlist()">
            Learn More
            <span>→</span>
          </button>
        </div>
      </section>

      <!-- What We Do Section -->
      <section class="what-we-do-section">
        <!-- Mock dashboard card -->
        <div class="dashboard-card">
          <div class="window-controls">
            <div class="window-dot red"></div>
            <div class="window-dot yellow"></div>
            <div class="window-dot green"></div>
            <span class="window-title">coreguard.app/dashboard</span>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Officers</div>
              <div class="stat-value white">127</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Compliance</div>
              <div class="stat-value gold">94%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Alerts</div>
              <div class="stat-value orange">3</div>
            </div>
          </div>
          <div class="activity-log">
            <div class="activity-item">
              <div class="activity-left">
                <span class="activity-dot green"></span>
                <span class="activity-text">Licence verified</span>
              </div>
              <span class="activity-time">2m</span>
            </div>
            <div class="activity-item">
              <div class="activity-left">
                <span class="activity-dot green"></span>
                <span class="activity-text">Shift started</span>
              </div>
              <span class="activity-time">5m</span>
            </div>
            <div class="activity-item">
              <div class="activity-left">
                <span class="activity-dot orange"></span>
                <span class="activity-text">Licence expiring</span>
              </div>
              <span class="activity-time">12m</span>
            </div>
          </div>
          <div class="dashboard-glow"></div>
        </div>

        <!-- Text -->
        <div class="what-we-do-content">
          <div>
            <h3 class="section-title">What We Do</h3>
          </div>
          <div>
            <p class="what-we-do-text">
              CoreGuard is an all-in-one security management platform built for UK private security companies.
            </p>
            <p class="what-we-do-text">
              We handle workforce management, SIA licence compliance, site deployments, real-time check calls, and audit-ready reporting — so you can focus on delivering safe, professional services.
            </p>
            <p class="what-we-do-text">
              From single-site operators to national firms, CoreGuard scales with your operation and keeps you inspection-ready at all times.
            </p>
          </div>
          <button class="btn-primary" onclick="scrollToWaitlist()">
            Learn More
            <span>→</span>
          </button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="features-title">Built for Security Operations</h2>
        <p class="features-subtitle">
          Three core modules designed to give you complete control over your workforce, compliance, and day-to-day operations.
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">�</div>
            <h3 class="feature-title">Workforce Command</h3>
            <p class="feature-description">
              Centralised personnel registry with SIA licence tracking, identity verification, and role-based access control.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3 class="feature-title">Compliance Engine</h3>
            <p class="feature-description">
              Automated licence monitoring, expiry enforcement, and deployment blocking for non-compliant officers.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3 class="feature-title">Operations Centre</h3>
            <p class="feature-description">
              Real-time site visibility, shift management, check-call monitoring, and instant incident reporting.
            </p>
          </div>
        </div>
      </section>

      <!-- Launch Countdown Section -->
      <section class="launch-section" id="waitlist">
        <div class="launch-content">
          <h2 class="features-title">Launching Soon</h2>
          <p class="features-subtitle">
            Be the first to experience the future of security management. Join our exclusive waitlist for early access.
          </p>
          
          <div class="countdown-container">
            <div class="countdown" id="countdown">Loading...</div>
            <p style="color: #f7b91c; font-size: 18px; font-weight: 500;">Monday, April 6th 2025 • 9:00 AM BST</p>
          </div>

          <!-- Waitlist Form -->
          <div id="waitlist-form">
            <form class="waitlist-form" onsubmit="handleWaitlistSubmit(event)">
              <input
                type="email"
                id="emailInput"
                placeholder="Enter your email"
                required
                class="email-input"
              />
              <button type="submit" id="submitBtn" class="submit-btn">
                <span id="btn-text">Join Waitlist</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-text">
            <p>© 2024 CoreGuard UK. All rights reserved.</p>
            <p>Enterprise Security Management for the UK Private Security Industry</p>
          </div>
        </div>
      </footer>
      
      <script>
        // Countdown timer
        function updateCountdown() {
          const launchDate = new Date('2025-04-06T09:00:00+01:00');
          const now = new Date();
          const diff = launchDate - now;
          
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('countdown').textContent = 
              days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
          } else {
            document.getElementById('countdown').textContent = '🎉 Launching Now!';
          }
        }
        
        // Smooth scroll to waitlist
        function scrollToWaitlist() {
          document.getElementById('waitlist').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
        
        // Waitlist form submission
        async function handleWaitlistSubmit(event) {
          event.preventDefault();
          
          const email = document.getElementById('emailInput').value;
          const submitBtn = document.getElementById('submitBtn');
          const btnText = document.getElementById('btn-text');
          
          btnText.textContent = 'Joining...';
          submitBtn.disabled = true;
          
          try {
            const response = await fetch('/api/waitlist', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
              // Show success message
              const form = document.getElementById('waitlist-form');
              form.innerHTML = '<div class="success-message">' +
                '<div class="success-icon">✅</div>' +
                '<h3 class="success-title">You're on the list!</h3>' +
                '<p class="success-text">' +
                  'We'll notify you as soon as we launch. Get ready to transform your security management!' +
                '</p>' +
                '<div class="success-count">' +
                  'Total waitlist: ' + (data.totalWaitlist || 1) + ' members' +
                '</div>' +
                '</div>';
            } else {
              throw new Error(data.error || 'Failed to join waitlist');
            }
          } catch (error) {
            btnText.textContent = 'Join Waitlist';
            submitBtn.disabled = false;
            alert('Something went wrong. Please try again.');
          }
        }
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    </body>
    </html>
  `);
});

// Get port from environment or use default
const PORT = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=== Simple Frontend Server Started ===');
  console.log('Running on port ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Available endpoints:');
  console.log('  GET /health');
  console.log('  GET /api/health');
  console.log('  GET /');
  console.log('=====================================');
});

// ... (rest of the code remains the same)
