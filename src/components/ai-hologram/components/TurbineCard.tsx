'use client';

import { useState } from 'react';

interface TurbineCardProps {
    type: 'standard' | 'premium';
    onClick: () => void;
    label: string;
    subLabel: string;
    price?: string;
}

export default function TurbineCard({ type, onClick, label, subLabel, price }: TurbineCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const isPremium = type === 'premium';

    // Colors
    const mainColor = isPremium ? 'text-amber-500' : 'text-blue-500';
    const glowColor = isPremium ? 'shadow-[0_0_50px_rgba(245,158,11,0.3)]' : 'shadow-[0_0_50px_rgba(59,130,246,0.3)]';
    const borderColor = isPremium ? 'border-amber-500/30' : 'border-blue-500/30';
    const gradient = isPremium
        ? 'from-amber-500/10 via-amber-900/5 to-black'
        : 'from-blue-600/10 via-blue-900/5 to-black';

    return (
        <div
            className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] cursor-pointer group perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* 1. Outer Static Ring (Container) */}
            <div className={`absolute inset-0 rounded-full border-2 ${borderColor} bg-black/40 backdrop-blur-sm ${glowColor} transition-all duration-500 group-hover:scale-105 group-hover:border-opacity-100`}>

                {/* 2. Rotating Turbine Blade (Slow -> Fast) */}
                <div className={`absolute inset-2 md:inset-4 rounded-full border border-dashed border-white/10 ${isHovered ? 'animate-spin-turbo' : 'animate-spin-slow'}`}>
                    {/* Fan Blades Visuals */}
                    <div className="absolute inset-0 opacity-50">
                        <svg viewBox="0 0 100 100" className={`w-full h-full ${mainColor} opacity-20`}>
                            <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" fill="currentColor" />
                            <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" fill="currentColor" />
                        </svg>
                    </div>
                    {/* Inner Dashed Ring */}
                    <div className="absolute inset-8 rounded-full border-2 border-dashed border-white/10 opacity-50"></div>
                </div>

                {/* 3. Counter-Rotating Decorative Ring */}
                <div className={`absolute inset-0 rounded-full ${isHovered ? 'animate-spin-turbo-reverse' : 'animate-spin-slow-reverse'}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/50 rounded-full shadow-[0_0_10px_white]"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/50 rounded-full shadow-[0_0_10px_white]"></div>
                </div>

                {/* 4. Center Hub (Static Content) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Hologram Projection Beam Effect (Only on Hover) */}
                    <div className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-gradient-to-t ${gradient} to-transparent blur-xl transition-opacity duration-300 origin-bottom transform -translate-y-[100px] ${isHovered ? 'opacity-80' : 'opacity-0'}`}></div>

                    <div className="relative z-10 text-center transform transition-transform duration-300 group-hover:scale-110">
                        {/* Icon */}
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full border ${borderColor} flex items-center justify-center bg-black/80 backdrop-blur-md shadow-2xl`}>
                            {isPremium ? (
                                <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">✨</span>
                            ) : (
                                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">💠</span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className={`text-2xl font-bold font-display uppercase tracking-wider mb-2 ${isPremium ? 'text-white' : 'text-gray-100'}`}>
                            {label}
                        </h3>

                        {/* SubLabel */}
                        <p className={`text-xs font-mono mb-3 ${isPremium ? 'text-amber-200' : 'text-blue-200'}`}>
                            {subLabel}
                        </p>

                        {/* Price Badge */}
                        {price && (
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${isPremium ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-blue-500/20 border-blue-500/50 text-blue-300'}`}>
                                {price}
                            </div>
                        )}

                        {/* Hologram Status Text */}
                        <div className={`mt-6 text-[10px] tracking-[0.2em] font-mono transition-opacity duration-300 ${isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
                            {isPremium ? 'AI 시스템 구동 중...' : '템플릿 불러오는 중...'}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
