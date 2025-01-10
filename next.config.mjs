/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Skips TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint errors during build
  },
};

export default nextConfig;
