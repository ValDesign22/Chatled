const { join } = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [join(__dirname, 'styles')],
  },
  images: {
    domains: ['ik.imagekit.io']
  }
}

module.exports = nextConfig
