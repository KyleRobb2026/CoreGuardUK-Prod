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

// Root endpoint - Launching Soon page (matching landing page design)
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f0f0f;
          color: #d4d4d4;
          line-height: 1.6;
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
        
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-image: 
            linear-gradient(to bottom, rgba(15, 15, 15, 0.3), rgba(15, 15, 15, 0.4), rgba(15, 15, 15, 0.5)),
            url('/The Future Security of Management Starts Here. (Website).png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #1a1a1a;
        }
        
        .status-badge {
          display: flex;
          flex-wrap: items-center;
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
        
        .hero-title .gradient-1 {
          background: linear-gradient(to right, white, #d4d4d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-title .gradient-2 {
          background: linear-gradient(to bottom, #f7b91c, #d4a017);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          color: #a3a3a3;
          font-size: 16px;
          text-align: center;
          max-width: 28rem;
          margin-top: 24px;
          line-height: 1.75;
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
        
        /* Launch Card */
        .launch-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 48px;
          margin: 48px auto;
          max-width: 600px;
          text-align: center;
        }
        
        .countdown {
          font-size: 48px;
          font-weight: bold;
          color: #f7b91c;
          margin: 32px 0;
          letter-spacing: -0.025em;
        }
        
        .launch-date {
          background: rgba(247, 185, 28, 0.1);
          border: 1px solid rgba(247, 185, 28, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
        }
        
        .launch-label {
          font-size: 14px;
          color: #f7b91c;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }
        
        .launch-date-text {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
        }
        
        .launch-time {
          font-size: 16px;
          color: #a3a3a3;
        }
        
        /* Form */
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          color: white;
          font-weight: 500;
          text-align: left;
        }
        
        .form-row {
          display: flex;
          gap: 8px;
          flex-direction: column;
        }
        
        .email-input {
          flex: 1;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .email-input::placeholder {
          color: #666;
        }
        
        .email-input:focus {
          border-color: #f7b91c;
        }
        
        .submit-btn {
          padding: 16px 32px;
          background: linear-gradient(to right, #f7b91c, #d4a017);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(247, 185, 28, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Features */
        .features {
          margin-top: 48px;
          padding-top: 48px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .features-title {
          font-size: 20px;
          margin-bottom: 24px;
          color: white;
          font-weight: 600;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          text-align: left;
        }
        
        .feature-item {
          color: #a3a3a3;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        /* Success Message */
        .success-message {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }
        
        .success-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .success-title {
          color: #22c55e;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .success-text {
          color: #a3a3a3;
          margin: 0;
        }
        
        /* Footer */
        .footer {
          color: #676767;
          font-size: 14px;
          text-align: center;
          padding: 48px 24px;
        }
        
        /* Responsive */
        @media (min-width: 768px) {
          .hero-title {
            font-size: 64px;
          }
          
          .hero-description {
            font-size: 18px;
          }
          
          .form-row {
            flex-direction: row;
          }
          
          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 80px;
          }
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
        
        <div class="status-badge">
          <span class="status-dot"></span>
          <span class="status-text">Launching Monday, April 6th 2025</span>
        </div>

        <h1 class="hero-title">
          <span class="gradient-1">The Future of Security Management</span><br>
          <span class="gradient-2">Starts Soon</span>
        </h1>

        <p class="hero-description">
          The all-in-one platform for UK security companies. Manage workforce, enforce SIA compliance, and run operations — from a single command centre.
        </p>

        <div class="cta-buttons">
          <button class="btn-primary" onclick="scrollToWaitlist()">
            Join Waitlist
            <span>→</span>
          </button>
        </div>
      </section>

      <!-- Launch Card -->
      <div class="launch-card" id="waitlist">
        <div class="launch-date">
          <div class="launch-label">Launch Date</div>
          <div class="launch-date-text">Monday, April 6th 2025</div>
          <div class="launch-time">9:00 AM BST</div>
        </div>
        
        <div class="countdown" id="countdown">Loading...</div>
        
        <form class="form-group" onsubmit="handleWaitlistSubmit(event)">
          <div class="form-label">Be the first to know when we launch</div>
          <div class="form-row">
            <input 
              type="email" 
              class="email-input" 
              placeholder="Enter your email" 
              required 
              id="emailInput"
            />
            <button type="submit" class="submit-btn" id="submitBtn">
              Join Waitlist
            </button>
          </div>
        </form>
        
        <div class="features">
          <h3 class="features-title">What's Coming:</h3>
          <div class="features-grid">
            <div class="feature-item">📱 Real-time Personnel Tracking</div>
            <div class="feature-item">🏢 Site Management</div>
            <div class="feature-item">📋 Compliance Reporting</div>
            <div class="feature-item">⏰ Rota Scheduling</div>
            <div class="feature-item">📞 Check-call System</div>
            <div class="feature-item">🔒 Audit Trails</div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>© 2024 CoreGuard UK. All rights reserved.</p>
        <p>Enterprise Security Management for the UK Private Security Industry</p>
      </div>
      
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
              \`\${days}d \${hours}h \${minutes}m \${seconds}s\`;
          } else {
            document.getElementById('countdown').textContent = '🎉 Launching Now!';
          }
        }
        
        // Smooth scroll to waitlist
        function scrollToWaitlist() {
          document.getElementById('waitlist').scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
        
        // Waitlist form submission
        async function handleWaitlistSubmit(event) {
          event.preventDefault();
          
          const email = document.getElementById('emailInput').value;
          const submitBtn = document.getElementById('submitBtn');
          
          submitBtn.textContent = 'Joining...';
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
              const form = event.target;
              form.innerHTML = \`
                <div class="success-message">
                  <div class="success-icon">✅</div>
                  <h3 class="success-title">You're on the list!</h3>
                  <p class="success-text">
                    We'll notify you as soon as we launch. Get ready to transform your security management!
                  </p>
                </div>
              \`;
            } else {
              throw new Error(data.error || 'Failed to join waitlist');
            }
          } catch (error) {
            submitBtn.textContent = 'Join Waitlist';
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
  console.log(`Running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log('  GET /health');
  console.log('  GET /api/health');
  console.log('  GET /');
  console.log('=====================================');
});
