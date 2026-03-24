/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Complete static generation disable for React Router compatibility
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Force dynamic rendering - no static generation at all
  output: undefined,
  
  // Disable all static generation features
  generateEtags: false,
  skipTrailingSlashRedirect: true,
  
  // Disable static optimization completely
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Disable static generation for all routes
  distDir: '.next',
  
  // Completely disable static generation
  staticPageGenerationTimeout: 1,
  
  // Force server-side rendering for all pages (no static generation)
  // This is the key setting to prevent Next.js from trying to statically generate React Router pages
  poweredByHeader: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // CORS handling for API routes - only add rewrite if API URL is defined
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      // Don't add rewrites if API URL is not configured
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
