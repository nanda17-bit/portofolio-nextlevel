'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { TechIcon } from './TechIcons';

export const RunningLogoSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const isDark = theme === 'dark';

  const techList = data.techStack || [];

  // Split languages into Left and Right semi-circles
  const leftTech = useMemo(() => {
    return techList.filter((_, idx) => idx % 2 === 0);
  }, [techList]);

  const rightTech = useMemo(() => {
    return techList.filter((_, idx) => idx % 2 !== 0);
  }, [techList]);

  // Independent pause states: hovering or pressing right does not stop left and vice-versa
  const [isLeftPaused, setIsLeftPaused] = useState(false);
  const [isRightPaused, setIsRightPaused] = useState(false);

  // Responsive radius & container dimensions
  const [dimensions, setDimensions] = useState({
    radius: 340,
    photoWidth: 260,
    photoHeight: 320,
    itemSize: 50,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        // Mobile: compact arcs hugging the borders
        setDimensions({
          radius: Math.min(130, Math.floor(w * 0.30)),
          photoWidth: 150,
          photoHeight: 190,
          itemSize: 36,
        });
      } else if (w < 640) {
        setDimensions({
          radius: Math.min(160, Math.floor(w * 0.28)),
          photoWidth: 180,
          photoHeight: 230,
          itemSize: 40,
        });
      } else if (w < 1024) {
        // Tablet
        setDimensions({
          radius: Math.min(240, Math.floor(w * 0.26)),
          photoWidth: 220,
          photoHeight: 270,
          itemSize: 46,
        });
      } else if (w < 1440) {
        // Standard Laptop / Desktop
        setDimensions({
          radius: Math.min(320, Math.floor(w * 0.24)),
          photoWidth: 250,
          photoHeight: 310,
          itemSize: 50,
        });
      } else {
        // Large Screen
        setDimensions({
          radius: 380,
          photoWidth: 280,
          photoHeight: 340,
          itemSize: 52,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Independent continuous orbital glides
  const [leftOffset, setLeftOffset] = useState(0);
  const [rightOffset, setRightOffset] = useState(0);

  const leftAnimRef = useRef({ offset: 0, isPaused: false });
  const rightAnimRef = useRef({ offset: 0, isPaused: false });

  useEffect(() => {
    leftAnimRef.current.isPaused = isLeftPaused;
  }, [isLeftPaused]);

  useEffect(() => {
    rightAnimRef.current.isPaused = isRightPaused;
  }, [isRightPaused]);

  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '120px 0px 120px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Only compute orbital math on desktop (width >= 768)
      if (window.innerWidth >= 768) {
        // Faster, energetic orbital motion as requested (~0.18 rad/s)
        const speed = 0.18;

        if (!leftAnimRef.current.isPaused) {
          leftAnimRef.current.offset = (leftAnimRef.current.offset + speed * dt) % (2 * Math.PI);
          setLeftOffset(leftAnimRef.current.offset);
        }

        if (!rightAnimRef.current.isPaused) {
          rightAnimRef.current.offset = (rightAnimRef.current.offset + speed * dt) % (2 * Math.PI);
          setRightOffset(rightAnimRef.current.offset);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isInView]);

  // User photo (fallback to hero image)
  const profilePhoto = data.hero.profileImageUrl || data.hero.imageUrl;

  return (
    <section
      id="tech"
      ref={sectionRef}
      className="relative z-10 w-full py-10 sm:py-16 md:py-24 overflow-hidden border-t border-b border-white/5 select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-amber-500/5 blur-[140px]" />
      </div>

      {/* Main Full-Width Constellation Stage - DESKTOP ONLY */}
      <div className="hidden md:flex relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] items-center justify-center">

        {/* ======================================================== */}
        {/* 1. LEFT SEMI-CIRCLE (LAYAR KIRI - SETENGAH LINGKARAN MERAH) */}
        {/* Directly anchored to the LEFT SCREEN BORDER (left: 0) */}
        {/* ======================================================== */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{
            width: dimensions.radius + 60,
            height: dimensions.radius * 2 + 80,
          }}
        >
          {/* Subtle curved orbital guide arc along the left edge */}
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
            width={dimensions.radius + 20}
            height={dimensions.radius * 2 + 40}
          >
            {/* Ambient accent glow path */}
            <path
              d={`M 0,20 A ${dimensions.radius} ${dimensions.radius} 0 0 1 0,${dimensions.radius * 2 + 20}`}
              fill="none"
              stroke="rgba(239, 68, 68, 0.12)"
              strokeWidth="6"
              className="blur-[2px]"
            />
            {/* Dashed orbital trajectory */}
            <path
              d={`M 0,20 A ${dimensions.radius} ${dimensions.radius} 0 0 1 0,${dimensions.radius * 2 + 20}`}
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Left Arc Tech Badges */}
          {leftTech.map((tech, idx) => {
            const total = leftTech.length;
            // Travel all the way to the ends: -0.48 * PI (top edge) to +0.48 * PI (bottom edge)
            const angleSpan = 0.96 * Math.PI;
            const baseProgress = idx / total;
            const currentProgress = (baseProgress + leftOffset / (2 * Math.PI)) % 1;
            const angle = -0.48 * Math.PI + currentProgress * angleSpan;

            // X is positive (curves inwards into screen from left edge)
            const x = Math.cos(angle) * dimensions.radius;
            // Y is vertical position relative to center (flows from top to bottom)
            const y = Math.sin(angle) * dimensions.radius;

            // Fades in at the top, stays fully visible, fades out at the bottom end
            // No upward slide: resets instantly to top when reaching bottom
            let opacity = 1;
            if (currentProgress < 0.08) {
              opacity = currentProgress / 0.08;
            } else if (currentProgress > 0.92) {
              opacity = Math.max(0, (1 - currentProgress) / 0.08);
            }

            return (
              <div
                key={tech.id}
                onMouseEnter={() => setIsLeftPaused(true)}
                onMouseLeave={() => setIsLeftPaused(false)}
                onClick={() => setIsLeftPaused((p) => !p)}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
                  opacity: opacity,
                  pointerEvents: opacity < 0.1 ? 'none' : 'auto',
                }}
                className="absolute left-0 top-1/2 group cursor-pointer will-change-transform z-20"
              >
                <div
                  style={{
                    borderColor: tech.color ? `${tech.color}45` : undefined,
                  }}
                  className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border transform-gpu [backface-visibility:hidden] transition-transform duration-200 hover:scale-110 shadow-lg ${
                    isDark
                      ? 'bg-[#0f0f13] text-zinc-200 hover:border-amber-500/70 hover:shadow-amber-500/20'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-amber-500 hover:shadow-amber-500/15'
                  }`}
                >
                  <div
                    className="flex items-center justify-center rounded-xl p-1.5 flex-shrink-0"
                    style={{ backgroundColor: `${tech.color || '#d97706'}18` }}
                  >
                    <TechIcon iconKey={tech.iconKey} size={dimensions.itemSize > 45 ? 20 : 16} />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-semibold text-xs leading-none group-hover:text-amber-500 transition-colors">
                      {tech.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 mt-0.5">
                      {tech.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* 2. CENTER USER PHOTO (BAGIAN WARNA BIRU - FOTO DI TENGAH) */}
        {/* Matches the user's blue box drawn in the middle */}
        {/* ======================================================== */}
        <div className="relative z-30 flex flex-col items-center justify-center group pointer-events-auto">
          {/* Subtle cyan/blue ambient glow matching the user's blue box annotation */}
          <div
            className="absolute rounded-3xl -inset-4 bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-amber-500/10 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"
          />

          {/* Center Card Container (The Blue Box) - Photo Only */}
          <div
            style={{
              width: dimensions.photoWidth,
              height: dimensions.photoHeight,
            }}
            className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 backdrop-blur-md shadow-2xl group/img ${
              isDark
                ? 'bg-zinc-950/70 border-cyan-500/30 group-hover:border-cyan-400/80 shadow-black'
                : 'bg-white/80 border-cyan-500/30 group-hover:border-cyan-500 shadow-xl'
            }`}
          >
            {/* The Photo itself fills the card */}
            <img
              src={profilePhoto}
              alt="Iqbal Isnanda Nurhuda"
              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
            />

            {/* Subtle bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Owner Name OUTSIDE the photo card as requested */}
          <div className="mt-4 flex flex-col items-center text-center">
            <h3
              className={`text-sm sm:text-base font-medium tracking-wide transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              Iqbal Isnanda Nurhuda
            </h3>
            <p
              className={`text-base sm:text-lg font-semibold tracking-tight mt-0.5 transition-colors duration-300 ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Backend Developer
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. RIGHT SEMI-CIRCLE (LAYAR KANAN - SETENGAH LINGKARAN MERAH) */}
        {/* Directly anchored to the RIGHT SCREEN BORDER (right: 0) */}
        {/* ======================================================== */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{
            width: dimensions.radius + 60,
            height: dimensions.radius * 2 + 80,
          }}
        >
          {/* Subtle curved orbital guide arc along the right edge */}
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
            width={dimensions.radius + 20}
            height={dimensions.radius * 2 + 40}
          >
            {/* Ambient accent glow path */}
            <path
              d={`M ${dimensions.radius + 20},20 A ${dimensions.radius} ${dimensions.radius} 0 0 0 ${dimensions.radius + 20},${dimensions.radius * 2 + 20}`}
              fill="none"
              stroke="rgba(239, 68, 68, 0.12)"
              strokeWidth="6"
              className="blur-[2px]"
            />
            {/* Dashed orbital trajectory */}
            <path
              d={`M ${dimensions.radius + 20},20 A ${dimensions.radius} ${dimensions.radius} 0 0 0 ${dimensions.radius + 20},${dimensions.radius * 2 + 20}`}
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Right Arc Tech Badges */}
          {rightTech.map((tech, idx) => {
            const total = rightTech.length;
            // Travel all the way to the ends: -0.48 * PI (top edge) to +0.48 * PI (bottom edge)
            const angleSpan = 0.96 * Math.PI;
            const baseProgress = idx / total;
            const currentProgress = (baseProgress + rightOffset / (2 * Math.PI)) % 1;
            const angle = -0.48 * Math.PI + currentProgress * angleSpan;

            // X is negative (curves inward into screen from right edge)
            const x = -Math.cos(angle) * dimensions.radius;
            // Y is vertical position relative to center (flows from top to bottom)
            const y = Math.sin(angle) * dimensions.radius;

            // Fades in at the top, stays fully visible, fades out at the bottom end
            // No upward slide: resets instantly to top when reaching bottom
            let opacity = 1;
            if (currentProgress < 0.08) {
              opacity = currentProgress / 0.08;
            } else if (currentProgress > 0.92) {
              opacity = Math.max(0, (1 - currentProgress) / 0.08);
            }

            return (
              <div
                key={tech.id}
                onMouseEnter={() => setIsRightPaused(true)}
                onMouseLeave={() => setIsRightPaused(false)}
                onClick={() => setIsRightPaused((p) => !p)}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) translate(50%, -50%)`,
                  opacity: opacity,
                  pointerEvents: opacity < 0.1 ? 'none' : 'auto',
                }}
                className="absolute right-0 top-1/2 group cursor-pointer will-change-transform z-20"
              >
                <div
                  style={{
                    borderColor: tech.color ? `${tech.color}45` : undefined,
                  }}
                  className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border transform-gpu [backface-visibility:hidden] transition-transform duration-200 hover:scale-110 shadow-lg ${
                    isDark
                      ? 'bg-[#0f0f13] text-zinc-200 hover:border-amber-500/70 hover:shadow-amber-500/20'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-amber-500 hover:shadow-amber-500/15'
                  }`}
                >
                  <div
                    className="flex items-center justify-center rounded-xl p-1.5 flex-shrink-0"
                    style={{ backgroundColor: `${tech.color || '#d97706'}18` }}
                  >
                    <TechIcon iconKey={tech.iconKey} size={dimensions.itemSize > 45 ? 20 : 16} />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-semibold text-xs leading-none group-hover:text-amber-500 transition-colors">
                      {tech.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 mt-0.5">
                      {tech.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (md:hidden): Clean Photo + Horizontal Running Marquee */}
      {/* ======================================================== */}
      <div className="md:hidden flex flex-col items-center justify-center w-full max-w-full px-4 pt-2 pb-4 gap-6 overflow-hidden">
        {/* Center User Photo */}
        <div className="relative z-30 flex flex-col items-center justify-center group pointer-events-auto">
          {/* Subtle cyan/blue ambient glow matching the design */}
          <div
            className="absolute rounded-3xl -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-amber-500/15 blur-2xl pointer-events-none opacity-80"
          />

          {/* Photo Card Container */}
          <div
            className={`relative w-[150px] h-[190px] rounded-3xl overflow-hidden border-2 transition-all duration-300 backdrop-blur-md shadow-2xl ${
              isDark
                ? 'bg-zinc-950/70 border-cyan-500/30 shadow-black'
                : 'bg-white/80 border-cyan-500/30 shadow-xl'
            }`}
          >
            <img
              src={profilePhoto}
              alt="Iqbal Isnanda Nurhuda"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Owner Name */}
          <div className="mt-3.5 flex flex-col items-center text-center">
            <h3
              className={`text-sm sm:text-base font-medium tracking-wide transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              Iqbal Isnanda Nurhuda
            </h3>
            <p
              className={`text-base sm:text-lg font-semibold tracking-tight mt-0.5 transition-colors duration-300 ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Backend Developer
            </p>
          </div>
        </div>

        {/* 2-Row Horizontal Running Logo / Programming Language Marquee */}
        <div className="relative w-full max-w-full overflow-hidden py-2 flex flex-col gap-3">
          {/* Gradient fade edge masks */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-10 z-20 bg-gradient-to-r ${
              isDark ? 'from-black to-transparent' : 'from-[#fafafa] to-transparent'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-10 z-20 bg-gradient-to-l ${
              isDark ? 'from-black to-transparent' : 'from-[#fafafa] to-transparent'
            }`}
          />

          {/* Row 1: Running Left */}
          <div className="overflow-hidden w-full">
            <div
              className="flex gap-2.5 w-max animate-marquee"
              style={{ animationDuration: '30s' }}
            >
              {[...leftTech, ...leftTech, ...leftTech, ...leftTech].map((tech, idx) => (
                <div
                  key={`mob-l-${tech.id}-${idx}`}
                  style={{
                    borderColor: tech.color ? `${tech.color}45` : undefined,
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-md flex-shrink-0 ${
                    isDark
                      ? 'bg-[#0f0f11]/90 text-zinc-200 border-white/10'
                      : 'bg-white/95 text-zinc-800 border-zinc-200'
                  }`}
                >
                  <div
                    className="flex items-center justify-center rounded-lg p-1 flex-shrink-0"
                    style={{ backgroundColor: `${tech.color || '#d97706'}18` }}
                  >
                    <TechIcon iconKey={tech.iconKey} size={15} />
                  </div>
                  <span className="font-semibold text-xs leading-none">
                    {tech.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    {tech.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Running Right (Reverse) */}
          <div className="overflow-hidden w-full">
            <div
              className="flex gap-2.5 w-max animate-marquee-reverse"
              style={{ animationDuration: '30s' }}
            >
              {[...rightTech, ...rightTech, ...rightTech, ...rightTech].map((tech, idx) => (
                <div
                  key={`mob-r-${tech.id}-${idx}`}
                  style={{
                    borderColor: tech.color ? `${tech.color}45` : undefined,
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-md flex-shrink-0 ${
                    isDark
                      ? 'bg-[#0f0f11]/90 text-zinc-200 border-white/10'
                      : 'bg-white/95 text-zinc-800 border-zinc-200'
                  }`}
                >
                  <div
                    className="flex items-center justify-center rounded-lg p-1 flex-shrink-0"
                    style={{ backgroundColor: `${tech.color || '#d97706'}18` }}
                  >
                    <TechIcon iconKey={tech.iconKey} size={15} />
                  </div>
                  <span className="font-semibold text-xs leading-none">
                    {tech.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    {tech.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
