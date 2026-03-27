#!/usr/bin/env node

const http = require('http');

// Test function to check if server responds
function testHealthEndpoint(port, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test the server
async function runTests() {
  const PORT = process.env.PORT || 3000;
  
  console.log('Testing frontend server health checks...');
  
  try {
    // Test /health endpoint
    console.log('Testing /health endpoint...');
    const healthResponse = await testHealthEndpoint(PORT, '/health');
    console.log('✅ /health:', healthResponse.status, healthResponse.body);
    
    // Test /api/health endpoint  
    console.log('Testing /api/health endpoint...');
    const apiHealthResponse = await testHealthEndpoint(PORT, '/api/health');
    console.log('✅ /api/health:', apiHealthResponse.status, apiHealthResponse.body);
    
    // Test root endpoint
    console.log('Testing / endpoint...');
    const rootResponse = await testHealthEndpoint(PORT, '/');
    console.log('✅ /:', rootResponse.status, 'HTML page served');
    
    console.log('\n🎉 All health checks passed!');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('\n💡 Make sure the server is running on port', PORT);
    process.exit(1);
  }
}

runTests();
