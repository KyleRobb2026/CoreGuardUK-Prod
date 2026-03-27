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

// Root endpoint - Launching Soon page (exact landing page styling)
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
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'f7b91c': '#f7b91c',
                'd4a017': '#d4a017'
              }
            }
          }
        }
      </script>
      <style>
        /* Custom animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Gradient text */
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
        
        /* Mix blend mode for SVG */
        .mix-blend-screen {
          mix-blend-mode: screen;
        }
      </style>
    </head>
    <body class="min-h-screen bg-[#0f0f0f] text-sm antialiased text-gray-300">

      {/* ═══ BANNER ═══ */}
      <div class="flex w-full flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] py-2 text-center font-medium text-[#1a1a1a]">
        <p class="text-sm">CoreGuard UK — Professional Security Management Platform</p>
        <button
          onclick="scrollToWaitlist()"
          class="ml-2 flex items-center gap-1 rounded-md bg-[#1a1a1a] px-3 py-1 text-[#f7b91c] text-xs font-semibold transition hover:bg-[#262626] active:scale-95"
        >
          Join Waitlist
          <span class="text-xs">→</span>
        </button>
      </div>

      {/* ═══ HERO ═══ */}
      <section class="flex flex-col items-center justify-center relative min-h-[90vh] overflow-hidden px-6 py-24 md:px-16 z-10">
        {/* Background image with overlay */}
        <div 
          class="absolute inset-0 w-full h-full -z-10"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(15, 15, 15, 0.3), rgba(15, 15, 15, 0.4), rgba(15, 15, 15, 0.5)), url(/The Future Security of Management Starts Here. (Website).png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#1a1a1a'
          }}
        />
        
        {/* Background glow for additional depth */}
        <svg class="absolute inset-0 -z-10 w-full h-full mix-blend-screen" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g filter="url(#glow1)">
            <ellipse cx="300" cy="200" rx="300" ry="200" fill="#f7b91c" fillOpacity="0.06" />
          </g>
          <g filter="url(#glow2)">
            <ellipse cx="1100" cy="500" rx="400" ry="280" fill="#f7b91c" fillOpacity="0.04" />
          </g>
          <defs>
            <filter id="glow1" x="-200" y="-200" width="1000" height="800" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="150" /></filter>
            <filter id="glow2" x="500" y="20" width="1200" height="960" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="150" /></filter>
          </defs>
        </svg>

        <div class="flex flex-wrap items-center justify-center rounded-full border border-[#f7b91c]/20 bg-[#f7b91c]/5 p-1.5 px-4 mb-8">
          <span class="w-2 h-2 rounded-full bg-[#f7b91c] animate-pulse mr-2" />
          <p class="text-[#f7b91c] text-xs font-medium">Launching Monday, April 6th 2025</p>
        </div>

        <h1 class="text-4xl md:text-5xl lg:text-6xl text-center font-bold max-w-3xl leading-[1.15] tracking-tight">
          <span class="gradient-text-1">The Future of Security Management</span><br>
          <span class="gradient-text-2">Starts Soon</span>
        </h1>

        <p class="text-gray-400 text-base md:text-lg text-center max-w-xl mt-6 leading-relaxed">
          The all-in-one platform for UK security companies. Manage workforce, enforce SIA compliance, and run operations — from a single command centre.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onclick="scrollToWaitlist()"
            class="flex items-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-8 py-3 rounded-full transition"
          >
            Join Waitlist
            <span class="text-sm">→</span>
          </button>
        </div>
      </section>

      {/* ═══ LAUNCH CARD ═══ */}
      <section class="flex flex-col items-center justify-center px-6 py-24 md:px-16">
        <div class="relative shrink-0 rounded-2xl overflow-hidden border border-[#333] bg-[#1a1a1a] p-8 shadow-2xl shadow-[#f7b91c]/5 max-w-2xl w-full">
          
          <div class="text-center mb-8">
            <div class="inline-flex flex-wrap items-center justify-center rounded-full border border-[#f7b91c]/20 bg-[#f7b91c]/5 p-2 px-6 mb-6">
              <span class="w-2 h-2 rounded-full bg-[#f7b91c] animate-pulse mr-2" />
              <p class="text-[#f7b91c] text-sm font-medium">Launch Date</p>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Monday, April 6th 2025</h3>
            <p class="text-gray-400">9:00 AM BST</p>
          </div>
          
          <div class="text-center mb-8">
            <div id="countdown" class="text-4xl md:text-5xl font-bold gradient-text-2 mb-4">Loading...</div>
          </div>

          {/* Waitlist Form */}
          <div id="waitlist-form">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-white mb-2">Be the first to know when we launch</h3>
              <p class="text-gray-400 text-sm">Join our exclusive waitlist for early access</p>
            </div>
            
            <form onsubmit="handleWaitlistSubmit(event)" class="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                id="emailInput"
                placeholder="Enter your email"
                required
                class="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]/20 transition"
              />
              <button
                type="submit"
                id="submitBtn"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#f7b91c] to-[#d4a017] hover:opacity-90 text-[#1a1a1a] font-semibold px-6 py-3 rounded-full transition min-w-[140px]"
              >
                <span id="btn-text">Join Waitlist</span>
                <span class="text-sm">→</span>
              </button>
            </form>
          </div>

          {/* Features */}
          <div class="mt-12 pt-8 border-t border-[#333]">
            <h3 class="text-xl font-semibold text-white text-center mb-6">What's Coming:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">📱</span>
                <span>Real-time Personnel Tracking</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">🏢</span>
                <span>Site Management</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">📋</span>
                <span>Compliance Reporting</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">⏰</span>
                <span>Rota Scheduling</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">📞</span>
                <span>Check-call System</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="text-lg">🔒</span>
                <span>Audit Trails</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer class="border-t border-[#262626] bg-[#0f0f0f]">
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="text-center text-gray-500 text-sm">
            <p class="mb-2">© 2024 CoreGuard UK. All rights reserved.</p>
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
              \`\${days}d \${hours}h \${minutes}m \${seconds}s\`;
          } else {
            document.getElementById('countdown').textContent = '🎉 Launching Now!';
          }
        }
        
        // Smooth scroll to waitlist
        function scrollToWaitlist() {
          document.getElementById('waitlist-form').scrollIntoView({ 
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
              form.innerHTML = \`
                <div class="text-center py-8">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                    <span class="text-2xl">✅</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                  <p class="text-gray-400 max-w-md mx-auto">
                    We'll notify you as soon as we launch. Get ready to transform your security management!
                  </p>
                  <div class="mt-6 text-sm text-gray-500">
                    Total waitlist: \${data.totalWaitlist || 1} members
                  </div>
                </div>
              \`;
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
  console.log(`Running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log('  GET /health');
  console.log('  GET /api/health');
  console.log('  GET /');
  console.log('=====================================');
});
