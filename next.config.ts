import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    'esbuild',
    'sharp'
  ],
  // Next.js 16+ Turbopack configuration
  turbopack: {},
  webpack: (config) => {
    config.externals.push({
      sharp: 'commonjs sharp',
    });
    return config;
  },
};

export default nextConfig;
