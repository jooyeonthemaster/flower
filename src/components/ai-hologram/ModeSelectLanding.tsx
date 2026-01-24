'use client';

import { motion } from 'framer-motion';
import FloatingModeCard from './components/FloatingModeCard';

interface ModeSelectLandingProps {
  onSelectMode: (mode: 'single' | 'composition') => void;
}

export default function ModeSelectLanding({ onSelectMode }: ModeSelectLandingProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large decorative circles - 서로 반대 방향으로 회전 */}
          {/* Premium (Orange): 시계 방향 */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
            style={{ backgroundColor: 'rgba(230, 107, 51, 0.05)' }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Standard (Green): 반시계 방향 */}
          <motion.div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
            style={{ backgroundColor: 'rgba(138, 154, 91, 0.05)' }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #0a0a0a 1px, transparent 1px),
                linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-500 mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            LED Hologram Fan Creator
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="headline-hero text-deep-black mb-2"
          >
            CREATE YOUR
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative inline-block"
          >
            <h1
              className="headline-hero"
              style={{ color: '#E66B33' }}
            >
              HOLOGRAM
            </h1>
            {/* Decorative underline */}
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 md:h-2 rounded-full"
              style={{ backgroundColor: '#E66B33' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </motion.div>

          {/* Fan icon/symbol */}
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
            className="my-6 md:my-8"
          >
            <div className="inline-flex items-center gap-3 text-gray-400">
              <span className="text-2xl">✦</span>
              <span
                className="text-lg md:text-xl tracking-widest uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                FAN
              </span>
              <span className="text-2xl">✦</span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-base md:text-lg max-w-md mx-auto mb-12 md:mb-16"
          >
            원하시는 제작 방식을 선택해주세요
          </motion.p>
        </div>

        {/* Mode Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        >
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-[#8A9A5B]/30 via-gray-300 to-[#E66B33]/30" />

          {/* Standard Card */}
          <FloatingModeCard
            type="standard"
            label="기본 템플릿"
            subLabel="쉽고 빠른 제작 • 6개 문구"
            price="무료"
            features={[
              '사전 제작된 템플릿 사용',
              '텍스트 스타일 커스터마이징',
              '약 5-10분 소요',
            ]}
            onClick={() => onSelectMode('single')}
          />

          {/* Premium Card */}
          <FloatingModeCard
            type="premium"
            label="AI 프리미엄"
            subLabel="AI 맞춤 생성 • 3개 문구"
            price="100,000원"
            features={[
              'AI 기반 배경 이미지 생성',
              '완전한 맞춤형 영상',
              '약 10-15분 소요',
            ]}
            onClick={() => onSelectMode('composition')}
          />
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center text-sm text-gray-400"
        >
          <p>LED 홀로그램 팬에서 재생되는 축하 영상을 제작합니다</p>
        </motion.div>
      </div>

      {/* Footer accent */}
      <div className="h-1 bg-gradient-to-r from-[#8A9A5B] via-[#E66B33] to-[#8A9A5B]" />
    </div>
  );
}
