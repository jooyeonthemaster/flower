'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    zIndex: number;
    safeZoneMultiplier?: number;
}

export default function ScrollSection({
    children,
    className = '',
    zIndex,
    safeZoneMultiplier = 1.4
}: ScrollSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"]
    });

    // 회전 각도를 줄이고, 스케일을 더 크게 시작해서 모서리 잘림 방지
    const rotate = useTransform(scrollYProgress, [0, 0.8], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [0.95, 1]);
    const y = useTransform(scrollYProgress, [0, 0.8], [200, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <div
            ref={containerRef}
            className="sticky top-0 w-full"
            style={{
                zIndex,
                height: `${safeZoneMultiplier * 100}vh`,
            }}
        >
            <div className="w-full h-screen">
                <motion.div
                    style={{
                        rotate,
                        scale,
                        y,
                        opacity,
                        transformOrigin: 'center bottom',
                    }}
                    className={`w-full h-full origin-bottom rounded-[60px] overflow-hidden ${className}`}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
