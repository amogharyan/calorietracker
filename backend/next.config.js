/** @type {import('next').NextConfig} */
const nextConfig = 
{
  experimental: 
  {
    appDir: true,
  },
  env: 
  {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    USDA_API_KEY: process.env.USDA_API_KEY,
  },
}

module.exports = nextConfig;