/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source:   '/auth/:path*',
          destination: 'http://localhost:8000/auth/:path*',
        },
      ]
    },
  }
  
  module.exports = nextConfig
  