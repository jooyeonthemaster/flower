'use client';

import { useState, MouseEvent } from 'react';

type Mode = 'single' | 'composition';

interface ModeSelectLandingProps {
  onSelectMode: (mode: Mode) => void;
}

export default function ModeSelectLanding({ onSelectMode }: ModeSelectLandingProps) {
  // 3D Tilt State
  const [tilt, setTilt] = useState<{ x: number; y: number; id: string | null }>({ x: 0, y: 0, id: null });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-15deg to 15deg)
    const xRot = ((y / rect.height) - 0.5) * 20 * -1; // Invert tilt for natural feel
    const yRot = ((x / rect.width) - 0.5) * 20;

    setTilt({ x: xRot, y: yRot, id });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, id: null });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full min-h-[80vh]">

      {/* Hero Text */}
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-5xl lg:text-7xl font-bold mb-4 font-display tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          CHOOSE YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">REALITY</span>
        </h2>
        <p className="text-gray-400 text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto">
          Select a creation method to begin your holographic journey.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-6xl px-4 perspective-1000">

        {/* Option 1: Template Mode (Free) */}
        <div
          className="group relative h-[500px] w-full cursor-pointer perspective-card"
          onMouseMove={(e) => handleMouseMove(e, 'single')}
          onMouseLeave={handleMouseLeave}
          onClick={() => onSelectMode('single')}
          style={{
            transform: tilt.id === 'single'
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Card Content */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-blue-500/50 group-hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.2)]">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image/Visual Area */}
            <div className="h-[60%] w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
              <div className="w-48 h-48 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <div className="w-32 h-32 rounded-full border border-blue-400/50 flex items-center justify-center animate-spin-slow">
                  <span className="text-4xl">💠</span>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider">STANDARD</span>
                <span className="text-gray-500 text-xs font-mono">FREE</span>
              </div>
              <h3 className="text-3xl font-bold font-display text-white mb-2 group-hover:text-blue-400 transition-colors">Template Mode</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Choose from professionally designed templates.
                <br />Perfect for quick, beautiful messages.
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Composition Mode (Premium) */}
        <div
          className="group relative h-[500px] w-full cursor-pointer perspective-card"
          onMouseMove={(e) => handleMouseMove(e, 'composition')}
          onMouseLeave={handleMouseLeave}
          onClick={() => onSelectMode('composition')}
          style={{
            transform: tilt.id === 'composition'
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Card Content */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border border-amber-500/20 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-amber-500/60 group-hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.2)]">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image/Visual Area */}
            <div className="h-[60%] w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black opacity-50" />
              <div className="relative z-10">
                <div className="absolute inset-0 bg-amber-500 blur-[80px] opacity-20 animate-pulse-slow" />
                <div className="w-48 h-48 border border-amber-500/30 rotate-45 flex items-center justify-center group-hover:rotate-[225deg] transition-transform duration-[1.5s] ease-in-out">
                  <div className="w-32 h-32 border border-amber-400/50 flex items-center justify-center -rotate-45 group-hover:-rotate-[225deg] transition-transform duration-[1.5s]">
                    <span className="text-5xl drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]">PREMIUM</span>
                <span className="text-gray-500 text-xs font-mono">PAID</span>
              </div>
              <h3 className="text-3xl font-bold font-display text-white mb-2 group-hover:text-amber-400 transition-colors">AI Composition</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate 100% unique holograms with Generative AI.
                <br />High-end visuals tailored to your story.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .perspective-card {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
