/** @type {import('next').NextConfig} */
const nextConfig = {
    /*reactStrictMode: false, //ovo stavit kako se ne bi dvaput pozivali npr "GET /auth/users/me HTTP/1.1"*/
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
  