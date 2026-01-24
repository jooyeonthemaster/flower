'use client';

import { ReactNode, useEffect, useState } from 'react';
import OrbitalDial from './OrbitalDial';

interface OrbitalLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    labels: string[];
    isPremium?: boolean;
}

export default function OrbitalLayout({ children, currentStep, totalSteps, labels, isPremium }: OrbitalLayoutProps) {
    const [prevContent, setPrevContent] = useState<ReactNode>(null);
    const [displayContent, setDisplayContent] = useState(children);
    const [isAnimating, setIsAnimating] = useState(false);

    // Transition Logic
    useEffect(() => {
        if (children !== displayContent) {
            setPrevContent(displayContent);
            setDisplayContent(children);
            setIsAnimating(true);

            const timer = setTimeout(() => {
                setIsAnimating(false);
                setPrevContent(null);
            }, 1000); // 1000ms transition

            return () => clearTimeout(timer);
        }
    }, [children, displayContent]);

    // Dynamic Theme Colors
    const themeColor = isPremium ? 'amber' : 'blue';

    return (
        <div className="relative w-full h-[calc(100vh-80px)] flex flex-col overflow-hidden perspective-2000">

            {/* 1. Orbital Navigation (Top Fixed) */}
            <div className="flex-none h-[80px] lg:h-[100px] relative flex justify-center items-end overflow-visible z-20 mt-[-40px] lg:mt-[-50px]">
                {/* Background Glow for Dial */}
                <div className={`absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-[100%] bg-gradient-to-b from-${themeColor}-600/20 to-transparent blur-3xl pointer-events-none`}></div>

                <OrbitalDial
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    labels={labels}
                />
            </div>

            {/* 2. Main Content Stage (3D) */}
            {/* Added pt-4 to clear the dial area slightly */}
            <div className="flex-1 relative w-full max-w-[1920px] mx-auto flex items-center justify-center p-2 lg:p-4 z-10">

                {/* Exiting Screen (Background / Stationary) */}
                {isAnimating && prevContent && (
                    <div className="absolute inset-2 lg:inset-4 z-0 origin-center transition-all duration-1000 ease-in-out transform scale-95 opacity-40 brightness-50 blur-sm pointer-events-none">
                        {prevContent}
                    </div>
                )}

                {/* Entering/Active Screen (Foreground / Cover) */}
                <div
                    className={`absolute inset-2 lg:inset-4 z-10 origin-bottom-right transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isAnimating
                            ? 'opacity-100 scale-100 rotate-0 translate-x-0 blur-0 shadow-2xl'
                            : 'opacity-100 scale-100 rotate-0 translate-x-0'
                        }`}
                    style={{
                        animation: isAnimating ? 'orbit-cover-enter 1.0s cubic-bezier(0.16,1,0.3,1) forwards' : 'none'
                    }}
                >
                    {displayContent}
                </div>
            </div>

            <style jsx>{`
                @keyframes orbit-cover-enter {
                    0% { transform: translateX(100%) rotate(30deg) scale(0.85); opacity: 0; box-shadow: -50px 0 100px rgba(0,0,0,0.5); }
                    100% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; box-shadow: 0 0 0 rgba(0,0,0,0); }
                }
                .perspective-2000 { perspective: 2000px; }
            `}</style>
        </div>
    );
}
