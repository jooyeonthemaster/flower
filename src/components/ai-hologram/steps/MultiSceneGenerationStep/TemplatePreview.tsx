'use client';

import { motion } from 'framer-motion';
import { STANDARD_COLOR, getPhaseLabel, getPhaseDescription, type GenerationPhase } from './constants';

interface TemplatePreviewProps {
  templateImageUrl: string;
  currentPhase: GenerationPhase;
}

export default function TemplatePreview({ templateImageUrl, currentPhase }: TemplatePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col items-center justify-center min-h-0 w-full"
    >
      <div className="w-full max-w-[600px] aspect-square bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse-slow pointer-events-none opacity-5"
          style={{ backgroundColor: STANDARD_COLOR }}
        />

        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl ring-2 ring-gray-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={templateImageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-3">
              {currentPhase === 'completed' ? (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: STANDARD_COLOR }}
                >
                  <span className="text-xl text-white">✓</span>
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${STANDARD_COLOR} transparent ${STANDARD_COLOR} ${STANDARD_COLOR}` }}
                />
              )}
              <div>
                <p className="text-white font-bold text-lg">{getPhaseLabel(currentPhase)}</p>
                <p className="text-gray-200 text-xs">{getPhaseDescription(currentPhase)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
