'use client'

import HologramWizard from '@/components/ai-hologram/HologramWizard';
import { useEffect } from 'react';

export default function AIHologramPage() {
  useEffect(() => {
    document.title = 'AI 커스텀 홀로그램 만들기 | Digital Hologram Wreaths';
  }, []);

  return <HologramWizard />;
}

