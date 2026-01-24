'use client';

interface OrbitalDialProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
}

export default function OrbitalDial({ currentStep, totalSteps, labels }: OrbitalDialProps) {
    // Calculate rotation to keep current step at top (0 deg)
    // We assume steps are distributed around a circle.
    // Let's place them at the bottom arc for visibility or full circle?
    // User asked for "Orbital Dial... 12 o'clock position".
    // So if Step 0 is at 12, Step 1 is at 3 (90deg)? Or evenly spaced?
    // Let's divide 360 by totalSteps? Or just use a fixed angle dist?
    const anglePerStep = 60; // 60 degrees between steps
    // We want currentStep to be at the BOTTOM (180 deg) because the dial is hanging from the top.
    // So we add 180 offset to the target rotation.
    const rotation = -(currentStep * anglePerStep) + 180;

    return (
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] pointer-events-none flex items-center justify-center -mt-[200px] md:-mt-[300px] z-50">

            {/* Main Ring Container */}
            <div
                className="absolute inset-0 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Ring Visuals */}
                <div className="absolute inset-4 rounded-full border border-white/10 border-dashed animate-spin-slow"></div>
                <div className="absolute inset-10 rounded-full border border-white/5 opacity-50"></div>

                {/* Steps (Satellites) */}
                {labels.map((label, index) => {
                    const stepAngle = index * anglePerStep;
                    const isActive = index === currentStep;

                    return (
                        <div
                            key={index}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-64 origin-bottom transition-all duration-500"
                            style={{
                                transform: `translateX(-50%) rotate(${stepAngle}deg)`,
                                height: '50%' // Radius
                            }}
                        >
                            {/* Note: The content itself is at the 'top' of this stick (outer rim) */}
                            {/* Since we rotated 180, 'Top' is visually Bottom. We need to counter-rotate text so it's readable */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] flex flex-col items-center gap-2"
                                style={{ transform: `rotate(${-stepAngle - rotation}deg)` }}
                            >
                                {/* Node */}
                                <div
                                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                        ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-125'
                                        : 'bg-slate-900 border-slate-700 text-gray-500 opacity-50'}`}
                                >
                                    <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${isActive
                                        ? 'text-blue-300 opacity-100 translate-y-0'
                                        : 'text-gray-600 opacity-0 -translate-y-2'}`}
                                >
                                    {label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Indicator (Fixed at Bottom / 6 o'clock visually -> relative to container??) */}
            {/* Since we rotate the container so the active step is at 180 (Bottom), the indicator should be at Bottom. */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-10"></div>
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-[1px] h-10 w-[2px] bg-gradient-to-t from-transparent via-blue-500 to-transparent"></div>

        </div>
    );
}
