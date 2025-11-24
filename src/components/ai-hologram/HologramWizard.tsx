'use client'

import { useState } from 'react';
import PromptStep from './steps/PromptStep';
import GenerationStep from './steps/GenerationStep';
import ResultStep from './steps/ResultStep';

interface WizardDataType {
  prompt: string;
  category: string;
  style: string;
  referenceImage?: string;
}

export default function HologramWizard() {
  const [step, setStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardDataType | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>('');

  const handlePromptSubmit = (data: WizardDataType) => {
    setWizardData(data);
    setStep(1);
  };

  const handleGenerationComplete = (videoUrl: string) => {
    setFinalVideoUrl(videoUrl);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setWizardData(null);
    setFinalVideoUrl('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full px-6 py-8 max-w-[1800px] mx-auto h-[calc(100vh-60px)] flex flex-col">
        {/* Header */}
        <header className="flex-none flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Custom Hologram</h1>
              <p className="text-xs text-gray-500 tracking-wider">GEN V2.5 ENGINE</p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center space-x-2">
            {[0, 1, 2].map((s) => (
              <div 
                key={s}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step === s ? 'bg-blue-500 scale-125' : 
                  step > s ? 'bg-blue-900' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          {step === 0 && (
            <PromptStep onNext={handlePromptSubmit} initialData={wizardData || undefined} />
          )}
          {step === 1 && wizardData && (
            <GenerationStep 
              promptData={wizardData} 
              onComplete={handleGenerationComplete}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <ResultStep videoUrl={finalVideoUrl} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
}
