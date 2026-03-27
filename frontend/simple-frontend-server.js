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

// Root endpoint - Launching Soon page
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
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          position: relative;
        }
        
        .logo-section {
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f7b91c, #e6a719);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 8px 32px rgba(247, 185, 28, 0.3);
        }
        
        .brand {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
          background: linear-gradient(135deg, #f7b91c, #e6a719);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .main-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
        }
        
        .title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        
        .description {
          font-size: 1.1rem;
          color: #a0a0a0;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .launch-date {
          background: rgba(247, 185, 28, 0.1);
          border: 1px solid rgba(247, 185, 28, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .launch-label {
          font-size: 0.9rem;
          color: #f7b91c;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .launch-date-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        
        .launch-time {
          font-size: 1rem;
          color: #a0a0a0;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ffffff;
          font-weight: 500;
        }
        
        .form-row {
          display: flex;
          gap: 0.5rem;
          flex-direction: column;
        }
        
        .email-input {
          flex: 1;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .email-input::placeholder {
          color: #666;
        }
        
        .submit-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #f7b91c, #e6a719);
          color: #1e1e1e;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(247, 185, 28, 0.3);
        }
        
        .features {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .features-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          text-align: left;
        }
        
        .feature-item {
          color: #a0a0a0;
          font-size: 0.9rem;
        }
        
        .footer {
          color: #676767;
          font-size: 0.9rem;
        }
        
        .countdown {
          font-size: 2rem;
          font-weight: bold;
          color: #f7b91c;
          margin: 1rem 0;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .main-card {
            padding: 2rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <div class="logo">🛡️</div>
          <h1 class="brand">CoreGuard UK</h1>
        </div>
        
        <div class="main-card">
          <h2 class="title">🚀 Launching Soon</h2>
          
          <p class="description">
            Enterprise Security Management System designed for regulated private security companies in the UK.
          </p>
          
          <div class="launch-date">
            <div class="launch-label">Launch Date</div>
            <div class="launch-date-text">Monday, April 6th 2025</div>
            <div class="launch-time">9:00 AM BST</div>
          </div>
          
          <div class="countdown" id="countdown">Loading...</div>
          
          <form class="form-group" onsubmit="handleWaitlistSubmit(event)">
            <div class="form-label">Join the Waitlist</div>
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
        
        <div class="footer">
          <p>© 2024 CoreGuard UK. All rights reserved.</p>
          <p>Enterprise Security Management for the UK Private Security Industry</p>
        </div>
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
                <div style="
                  background: rgba(34, 197, 94, 0.1);
                  border: 1px solid rgba(34, 197, 94, 0.3);
                  border-radius: 12px;
                  padding: 1.5rem;
                  text-align: center;
                ">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                  <h3 style="color: #22c55e; margin-bottom: 0.5rem;">You're on the list!</h3>
                  <p style="color: #a0a0a0; margin: 0;">
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
