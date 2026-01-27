'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    zIndex: number;
}

export default function ScrollSection({ children, className = '', zIndex }: ScrollSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"]
    });

    // Animation Timing: Finish at 80% to create a "Sweet Spot" (Plateau)
    // Input: [0, 0.8] -> Output: Transforms complete. [0.8, 1.0] -> Stays flat/static.
    const rotate = useTransform(scrollYProgress, [0, 0.8], [45, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [0.8, 1]);
    const y = useTransform(scrollYProgress, [0, 0.8], [150, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]); // Fade in by 40%

    // Separate layout classes from visual classes if possible, but for now we apply passed className (bg, shadow) to inner div.
    // We need a base layout for the container.

    return (
        <div
            ref={containerRef}
            className="sticky top-0 w-full h-screen overflow-hidden"
            style={{ zIndex }}
        >
            <motion.div
                style={{ rotate, scale, y, opacity, transformOrigin: 'center bottom' }}
                className={`w-full h-full origin-bottom ${className}`}
            >
                {children}
            </motion.div>
        </div>
    );
}
