'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export const BackgroundGrid: React.FC = () => {
  const { theme } = usePortfolio();
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Pitch black base */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? 'bg-[#000000]' : 'bg-[#fafafa]'
        }`}
      />

      {/* Grid layer with blur and soft edge fading */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
          filter: 'blur(0.55px)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, rgba(0,0,0,0.3) 65%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, rgba(0,0,0,0.3) 65%, transparent 100%)',
        }}
      />
    </div>
  );
};
