'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

interface FanProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  isPremium?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FanProgressIndicator({
  currentStep,
  totalSteps,
  labels,
  isPremium = false,
  size = 'md',
}: FanProgressIndicatorProps) {
  // Size configurations
  const sizeConfig = {
    sm: { container: 120, hub: 24, blade: 40, font: 'text-[8px]' },
    md: { container: 180, hub: 36, blade: 60, font: 'text-[10px]' },
    lg: { container: 240, hub: 48, blade: 80, font: 'text-xs' },
  };

  const config = sizeConfig[size];
  const accentColor = isPremium ? '#E66B33' : '#8A9A5B';

  // Calculate rotation based on current step
  // Each blade is 90 degrees apart (4 blades)
  const baseRotation = useMemo(() => {
    return -currentStep * 90;
  }, [currentStep]);

  // Blade positions (0, 90, 180, 270 degrees)
  const blades = useMemo(() => {
    return Array.from({ length: totalSteps }, (_, i) => ({
      index: i,
      angle: i * (360 / totalSteps),
      label: labels[i] || `Step ${i + 1}`,
      isActive: i === currentStep,
      isCompleted: i < currentStep,
    }));
  }, [totalSteps, labels, currentStep]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: config.container, height: config.container }}
    >
      {/* Outer ring - subtle glow */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `conic-gradient(from 0deg, ${accentColor}20, transparent, ${accentColor}20)`,
        }}
      />

      {/* Rotating container */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: baseRotation }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 20,
          mass: 1.5,
        }}
      >
        {/* Fan blades */}
        {blades.map((blade) => (
          <motion.div
            key={blade.index}
            className="absolute"
            style={{
              width: config.blade,
              height: config.blade / 2,
              left: '50%',
              top: '50%',
              transformOrigin: '0% 50%',
              transform: `rotate(${blade.angle}deg)`,
            }}
          >
            {/* Blade shape */}
            <motion.div
              className="relative w-full h-full"
              initial={false}
              animate={{
                scale: blade.isActive ? 1.1 : 1,
                opacity: blade.isCompleted ? 0.6 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Blade body */}
              <svg
                viewBox="0 0 60 30"
                className="w-full h-full"
                style={{
                  filter: blade.isActive
                    ? `drop-shadow(0 0 8px ${accentColor})`
                    : 'none',
                }}
              >
                <path
                  d="M0,15 Q20,5 55,2 Q58,15 55,28 Q20,25 0,15 Z"
                  fill={blade.isActive ? accentColor : blade.isCompleted ? '#888' : '#ddd'}
                  opacity={blade.isActive ? 1 : 0.7}
                />
              </svg>

              {/* Step number - rotated to always be readable */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${-blade.angle - baseRotation}deg)`,
                }}
              >
                <span
                  className={`font-bold ${config.font} ${
                    blade.isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {blade.index + 1}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Center hub */}
      <motion.div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: config.hub,
          height: config.hub,
          backgroundColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}80`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Hub icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-1/2 h-1/2 text-white"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="3" />
        </svg>
      </motion.div>

      {/* Current step label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${config.font} font-bold uppercase tracking-wider`}
            style={{ color: accentColor }}
          >
            {labels[currentStep]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Compact version for header/sidebar
export function FanProgressCompact({
  currentStep,
  totalSteps,
  isPremium = false,
}: {
  currentStep: number;
  totalSteps: number;
  isPremium?: boolean;
}) {
  const accentColor = isPremium ? '#E66B33' : '#8A9A5B';

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: i === currentStep ? 24 : 8,
            height: 8,
            backgroundColor: i <= currentStep ? accentColor : '#ddd',
          }}
          animate={{
            width: i === currentStep ? 24 : 8,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />
      ))}
    </div>
  );
}
