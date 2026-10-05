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
      {/* Base Solid Background Color */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? 'bg-[#000000]' : 'bg-[#fafafa]'
        }`}
      />

      {/* Infinite Fixed Blueprint Grid Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.10) 1px, transparent 0),
               linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px)`
            : `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.10) 1px, transparent 0),
               linear-gradient(to right, rgba(0, 0, 0, 0.055) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(0, 0, 0, 0.055) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Soft Ambient Depth Glow (Does not obscure the grid) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.6) 100%)'
            : 'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 60%, rgba(250, 250, 250, 0.6) 100%)',
        }}
      />
    </div>
  );
};
