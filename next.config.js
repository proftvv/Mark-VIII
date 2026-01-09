/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel deployment optimization
  swcMinify: true,
  // Image optimization for Vercel
  images: {
    domains: [],
    unoptimized: false
  }
}

module.exports = nextConfig
