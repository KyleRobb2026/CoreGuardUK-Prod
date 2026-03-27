#!/usr/bin/env node

const http = require('http');

// Test the frontend page loads
function testFrontendPage() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200 && data.includes('waitlist-form')) {
          console.log('✅ Frontend page loads correctly');
          console.log('✅ Waitlist form found in HTML');
          resolve(true);
        } else {
          console.log('❌ Frontend page issue');
          reject(new Error('Frontend page not loading correctly'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Test the waitlist API
function testWaitlistAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email: 'test@frontend.com' });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/waitlist',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ Waitlist API working');
          console.log('✅ Response:', result.message);
          resolve(true);
        } else {
          console.log('❌ Waitlist API failed');
          reject(new Error('API returned status ' + res.statusCode));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Frontend Waitlist Functionality...\n');
  
  try {
    await testFrontendPage();
    console.log('');
    await testWaitlistAPI();
    console.log('');
    console.log('🎉 All tests passed! Frontend waitlist is working correctly.');
    console.log('');
    console.log('📋 To test manually:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Scroll to the waitlist form');
    console.log('3. Enter your email and click "Join Waitlist"');
    console.log('4. Check browser console for debugging info');
    console.log('5. You should see a success message and confirmation in console');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
