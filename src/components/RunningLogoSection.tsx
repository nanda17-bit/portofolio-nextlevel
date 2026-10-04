'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { TechIcon } from './TechIcons';
import { Camera, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

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

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // User photo (fallback to hero image)
  const profilePhoto = data.hero.profileImageUrl || data.hero.imageUrl;

  return (
    <section
      id="tech"
      className="relative z-10 w-full py-16 sm:py-20 md:py-24 overflow-hidden border-t border-b border-white/5 select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-amber-500/5 blur-[140px]" />
      </div>

      {/* Main Full-Width Constellation Stage */}
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] flex items-center justify-center">

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
                  className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-xl ${
                    isDark
                      ? 'bg-[#0a0a0a]/90 text-zinc-200 hover:border-amber-500/70 hover:shadow-amber-500/20'
                      : 'bg-white/95 text-zinc-800 border-zinc-200 hover:border-amber-500 hover:shadow-amber-500/15'
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

            {/* Quick edit photo overlay on hover (links to /admin) */}
            <Link
              href="/admin"
              title="Ganti Foto di Data Master / Admin"
              className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-400 mb-1.5 border border-amber-500/30">
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-amber-200">
                Ganti Foto
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                Klik untuk ubah di Admin
              </span>
            </Link>
          </div>

          {/* Owner Name OUTSIDE the photo card as requested */}
          <div className="mt-4 flex flex-col items-center text-center">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold tracking-wide text-zinc-100 drop-shadow-md">
              Iqbal Isnanda Nurhuda
            </h3>
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
                  className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-xl ${
                    isDark
                      ? 'bg-[#0a0a0a]/90 text-zinc-200 hover:border-amber-500/70 hover:shadow-amber-500/20'
                      : 'bg-white/95 text-zinc-800 border-zinc-200 hover:border-amber-500 hover:shadow-amber-500/15'
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
    </section>
  );
};
