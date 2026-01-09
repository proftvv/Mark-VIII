/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel deployment optimization
  swcMinify: true,
  // Static export for Capacitor (commented out for Vercel)
  // output: 'export',
  // trailingSlash: true,
  // Image optimization for Vercel
  images: {
    domains: [],
    unoptimized: false
  }
}

module.exports = nextConfig
