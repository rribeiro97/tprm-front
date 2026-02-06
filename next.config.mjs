/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript checks during build (run separately in pre-commit)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Optimize for production
  reactStrictMode: true,

  // Output configuration
  output: 'standalone',
};

export default nextConfig;
