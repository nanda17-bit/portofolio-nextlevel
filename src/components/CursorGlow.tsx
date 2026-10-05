'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = usePortfolio();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for buttery inertia
    const loop = () => {
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full z-40 transition-opacity duration-300 ease-out will-change-transform transform-gpu ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(245, 158, 11, 0.26) 0%, rgba(217, 119, 6, 0.14) 38%, rgba(245, 158, 11, 0.04) 60%, transparent 72%)'
          : 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.10) 38%, rgba(245, 158, 11, 0.03) 60%, transparent 72%)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
};
