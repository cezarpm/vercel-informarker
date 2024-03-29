/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  register: true,
  sw: 'sw.js',
})


const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [
    'page.tsx',
    'api.ts',
    'api.tsx',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPWA(nextConfig)
