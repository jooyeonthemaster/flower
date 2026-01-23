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
  // 서버사이드 외부 패키지 설정
  // - sharp: 이미지 처리
  // - @sparticuz/chromium: Vercel 서버리스용 Chromium 바이너리
  // - @remotion/bundler, @remotion/renderer: Remotion 서버사이드 렌더링
  serverExternalPackages: [
    'sharp',
    '@sparticuz/chromium',
    'puppeteer-core',
    '@remotion/bundler',
    '@remotion/renderer',
  ],
  // Next.js 16+ Turbopack configuration
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.externals.push({
      sharp: 'commonjs sharp',
    });

    // Remotion 관련 설정 (서버사이드에서만)
    if (isServer) {
      // @sparticuz/chromium은 Lambda/Vercel 환경에서만 사용
      config.externals.push({
        '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
        'puppeteer-core': 'commonjs puppeteer-core',
      });
    }

    return config;
  },
};

export default nextConfig;
