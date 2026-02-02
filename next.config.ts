import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    qualities: [75, 90],
  },
  // Vercel 서버리스에서 ffmpeg-static 바이너리 포함 (핵심!)
  // Next.js가 빌드 시 바이너리를 제외하지 않도록 명시적 선언
  outputFileTracingIncludes: {
    '/api/ai/merge-videos': ['./node_modules/ffmpeg-static/ffmpeg'],
    '/api/ai/loop-video': ['./node_modules/ffmpeg-static/ffmpeg'],
    '/api/ai/overlay-video-on-image': ['./node_modules/ffmpeg-static/ffmpeg'],
    '/api/ai/render-text-overlay': ['./node_modules/ffmpeg-static/ffmpeg'],
  },
  // 서버사이드 외부 패키지 설정
  // - sharp: 이미지 처리
  // - @sparticuz/chromium: Vercel 서버리스용 Chromium 바이너리
  // - @remotion/bundler, @remotion/renderer: Remotion 서버사이드 렌더링
  // - ffmpeg-static: 영상 합성용 FFmpeg 바이너리
  serverExternalPackages: [
    'sharp',
    '@sparticuz/chromium',
    'puppeteer-core',
    '@remotion/bundler',
    '@remotion/renderer',
    'ffmpeg-static',
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
