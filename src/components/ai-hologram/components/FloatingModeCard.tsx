'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FloatingModeCardProps {
  type: 'standard' | 'premium';
  onClick: () => void;
  label: string;
  subLabel: string;
  price?: string;
  features?: string[];
}

export default function FloatingModeCard({
  type,
  onClick,
  label,
  subLabel,
  price,
  features = [],
}: FloatingModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isPremium = type === 'premium';

  // Colors based on type
  const accentColor = isPremium ? '#E66B33' : '#8A9A5B';
  const tiltDirection = isPremium ? 3 : -3;

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-[280px] md:w-[340px] bg-white rounded-2xl overflow-hidden"
        initial={{ rotate: tiltDirection }}
        animate={{
          rotate: isHovered ? 0 : tiltDirection,
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -12 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 2px ${accentColor}`
            : '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-2"
          style={{ backgroundColor: accentColor }}
        />

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Icon */}
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `2px solid ${accentColor}30`,
            }}
            animate={{
              // Premium: 시계 방향 (양수), Standard: 반시계 방향 (음수)
              rotate: isHovered
                ? (isPremium ? [0, 10, 0] : [0, -10, 0])
                : 0,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
            }}
          >
            {isPremium ? (
              <span className="text-4xl md:text-5xl">✨</span>
            ) : (
              <svg
                className="w-8 h-8 md:w-10 md:h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
          </motion.div>

          {/* Title */}
          <h3
            className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              color: '#0a0a0a',
            }}
          >
            {label}
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 text-sm mb-4">
            {subLabel}
          </p>

          {/* Features (if provided) */}
          {features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill={accentColor}
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          {price && (
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {price}
            </div>
          )}

          {/* Hover CTA */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white"
            style={{
              backgroundColor: accentColor,
            }}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0.8,
            }}
          >
            <span>시작하기</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              animate={{
                x: isHovered ? 4 : 0,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-4 right-4">
            <motion.div
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: accentColor }}
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isHovered ? Infinity : 0,
              }}
            >
              AI
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Floor shadow */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 rounded-[100%] blur-xl"
        style={{ backgroundColor: accentColor }}
        animate={{
          opacity: isHovered ? 0.4 : 0.2,
          scaleX: isHovered ? 1.1 : 1,
        }}
      />
    </motion.div>
  );
}
