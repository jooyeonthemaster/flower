import { motion } from 'framer-motion';

interface StepActionBarProps {
    onNext?: () => void;
    onBack?: () => void;
    nextLabel?: string;
    isNextDisabled?: boolean;
    color: string;
    isLoading?: boolean;
}

export default function StepActionBar({
    onNext,
    onBack,
    nextLabel = '다음 단계로',
    isNextDisabled = false,
    color,
    isLoading = false
}: StepActionBarProps) {
    return (
        <div className="flex-none p-4 md:p-6 lg:p-8 flex items-center justify-end gap-3 pointer-events-none sticky bottom-0 z-50">
            {/* Background Gradient for visibility over scroll content */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent -z-10" />

            <div className="pointer-events-auto flex items-center gap-3">
                {onBack && (
                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                        className="h-14 w-14 rounded-xl flex items-center justify-center border-2 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-white transition-colors bg-white/80 backdrop-blur-md shadow-sm disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                )}

                <motion.button
                    onClick={onNext}
                    disabled={isNextDisabled || isLoading}
                    whileHover={!isNextDisabled && !isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isNextDisabled && !isLoading ? { scale: 0.98 } : {}}
                    className={`h-14 w-[360px] rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 text-white transition-all backdrop-blur-sm ${isNextDisabled || isLoading ? 'bg-gray-300 cursor-not-allowed shadow-none' : ''
                        }`}
                    style={{
                        backgroundColor: isNextDisabled || isLoading ? undefined : color,
                        boxShadow: isNextDisabled || isLoading ? 'none' : `0 10px 30px -10px ${color}80`
                    }}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {nextLabel}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
