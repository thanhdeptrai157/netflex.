/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['phimimg.com'],
  },
};

module.exports = nextConfig;