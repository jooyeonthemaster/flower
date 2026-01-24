'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface FanSpinTransitionProps {
  children: ReactNode;
  stepKey: string | number;
  direction?: 'forward' | 'backward';
  duration?: number;
  isPremium?: boolean; // Premium 모드는 반대 방향으로 회전
}

// Custom data type for variants
interface CustomVariantData {
  direction: 'forward' | 'backward';
  isPremium: boolean;
}

const fanVariants: Variants = {
  initial: (custom: CustomVariantData) => {
    // Standard: forward = 90 (반시계), backward = -90 (시계)
    // Premium: forward = -90 (시계), backward = 90 (반시계) - 반대로
    const baseRotation = custom.direction === 'forward' ? 90 : -90;
    const rotation = custom.isPremium ? -baseRotation : baseRotation;
    return {
      rotateZ: rotation,
      opacity: 0,
      scale: 0.85,
    };
  },
  animate: {
    rotateZ: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
      mass: 1,
      duration: 0.8,
    },
  },
  exit: (custom: CustomVariantData) => {
    // Standard: forward = -90 (시계), backward = 90 (반시계)
    // Premium: forward = 90 (반시계), backward = -90 (시계) - 반대로
    const baseRotation = custom.direction === 'forward' ? -90 : 90;
    const rotation = custom.isPremium ? -baseRotation : baseRotation;
    return {
      rotateZ: rotation,
      opacity: 0,
      scale: 0.85,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    };
  },
};

export default function FanSpinTransition({
  children,
  stepKey,
  direction = 'forward',
  duration = 0.8,
  isPremium = false,
}: FanSpinTransitionProps) {
  const customData: CustomVariantData = { direction, isPremium };

  return (
    <AnimatePresence mode="wait" custom={customData}>
      <motion.div
        key={stepKey}
        custom={customData}
        variants={fanVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
        style={{
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Simpler fade + slide variant for mobile or reduced motion
export function FadeSlideTransition({
  children,
  stepKey,
  direction = 'forward',
}: FanSpinTransitionProps) {
  const slideVariants: Variants = {
    initial: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
