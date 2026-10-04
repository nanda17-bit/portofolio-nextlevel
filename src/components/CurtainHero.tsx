'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface CurtainHeroProps {
  onScrollProgress?: (progress: number, isClosed: boolean) => void;
}

// Animated counting number for hero stats (0 -> target)
const StatCounter: React.FC<{ value: string }> = ({ value }) => {
  const [currentVal, setCurrentVal] = useState(0);

  const match = value.match(/\d+/);
  const targetNum = match ? parseInt(match[0], 10) : 0;
  const suffix = value.replace(/\d+/, '');

  useEffect(() => {
    let start = performance.now();
    const duration = 1800; // ms
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrentVal(Math.floor(ease * targetNum));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setCurrentVal(targetNum);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetNum]);

  return (
    <span className="tabular-nums">
      {currentVal}{suffix}
    </span>
  );
};

// Typewriter effect with natural human typing cadence, ultra-close blinking cursor, 1.5s pause, and erasing effect
const TypewriterTagline: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx % phrases.length] || '';
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        const nextChar = currentPhrase[displayText.length];
        // Kecepatan mengetik realistis dengan variasi natural
        const isPauseChar = nextChar === ' ' || nextChar === '&' || nextChar === '-';
        const typeDelay = isPauseChar
          ? 105 + Math.floor(Math.random() * 25)
          : 45 + Math.floor(Math.random() * 30); // 45ms - 75ms variasi alami

        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typeDelay);
      } else {
        // Jeda 1.5 detik saat kalimat selesai diketik
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        // Efek backspace cepat dan natural
        const deleteDelay = 22 + Math.floor(Math.random() * 12);
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, deleteDelay);
      } else {
        // Jeda sejenak sebelum mulai mengetik frasa berikutnya
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
        }, 320);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIdx, phrases]);

  return (
    <div className="w-full flex items-center justify-start text-left">
      <span className="inline-block text-xs sm:text-sm md:text-base font-normal text-zinc-300 font-poppins text-left">
        {displayText}<span className="inline-block w-[2px] sm:w-[2.5px] h-[1.12em] -ml-[1px] bg-amber-400 align-baseline animate-cursor-blink" />
      </span>
    </div>
  );
};

export const CurtainHero: React.FC<CurtainHeroProps> = ({ onScrollProgress }) => {
  const { data, theme } = usePortfolio();
  const trackRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftArrowIconRef = useRef<HTMLDivElement>(null);
  const rightArrowIconRef = useRef<HTMLDivElement>(null);
  const leftArrowTrackRef = useRef<HTMLDivElement>(null);
  const rightArrowTrackRef = useRef<HTMLDivElement>(null);
  const leftArrowWrapperRef = useRef<HTMLDivElement>(null);
  const rightArrowWrapperRef = useRef<HTMLDivElement>(null);
  const [showResetBtn, setShowResetBtn] = useState(false);

  const isDark = theme === 'dark';

  const phrases = useMemo(() => [
    data.hero.tagline || 'CRAFTING ROBUST WEB SYSTEMS & SCALABLE DIGITAL PRODUCTS',
    'FULL-STACK ENGINEERING & MODERN CLOUD ARCHITECTURES',
    'TURNING COMPLEX IDEAS INTO CLEAN DIGITAL PRODUCTS',
    'HIGH PERFORMANCE WEB APPS & INTUITIVE EXPERIENCES',
  ], [data.hero.tagline]);

  useEffect(() => {
    const track = trackRef.current;
    const pl = leftPanelRef.current;
    const pr = rightPanelRef.current;
    const trackLeftArrow = leftArrowTrackRef.current;
    const trackRightArrow = rightArrowTrackRef.current;
    const content = contentRef.current;
    const titleEl = titleRef.current;
    const tagEl = taglineRef.current;
    const btnEl = buttonsRef.current;
    const statsEl = statsRef.current;
    const bg = bgRef.current;

    if (!track || !pl || !pr || !content) return;

    const SKEW = -15; // -15deg skew angle from skariga-curtain-hero
    const TRAVEL = 135; // Panel slides from 0 (closed) to 135% (open)
    const CLOSE_AT = 0.70; // Trigger header closed state when completely shut
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      pl.style.transform = `translateX(0) skewX(${SKEW}deg)`;
      pr.style.transform = `translateX(0) skewX(${SKEW}deg)`;
      if (trackLeftArrow) trackLeftArrow.style.transform = `translateX(0) skewX(${SKEW}deg)`;
      if (trackRightArrow) trackRightArrow.style.transform = `translateX(0) skewX(${SKEW}deg)`;
      return;
    }

    let targetP = 0;
    let currentP = 0;
    let isRunning = false;
    let animId: number | null = null;

    const computeTargetP = () => {
      const rect = track.getBoundingClientRect();
      const range = track.offsetHeight - window.innerHeight;
      const y = Math.min(Math.max(-rect.top, 0), range);
      return reduceMotion ? 1 : range > 0 ? y / range : 0;
    };

    const applyProgress = (p: number) => {
      // Tirai menutup 100% penuh dari p = 0 hingga p = 0.70 (benar-benar menutup rapat tanpa celah)
      const closeP = Math.min(1, Math.max(0, p / 0.70));
      // Ken Perlin's Smootherstep curve for curtain closing (zero 1st & 2nd derivatives at boundaries for ultra-smooth inertia)
      const e = closeP <= 0 ? 0 : closeP >= 1 ? 1 : closeP * closeP * closeP * (closeP * (closeP * 6 - 15) + 10);
      const x = TRAVEL * (1 - e); // Starts at 135% (open), closes completely to 0 (closed)

      // Hardware-accelerated translate3d for sub-pixel 60/120fps GPU rasterization
      pl.style.transform = `translate3d(${-x.toFixed(3)}%, 0, 0) skewX(${SKEW}deg)`;
      pr.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0) skewX(${SKEW}deg)`;
      if (trackLeftArrow) {
        trackLeftArrow.style.transform = `translate3d(${-x.toFixed(3)}%, 0, 0) skewX(${SKEW}deg)`;
      }
      if (trackRightArrow) {
        trackRightArrow.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0) skewX(${SKEW}deg)`;
      }

      // Kinetic typographic scratch + zoom on the name, fully synchronized with curtain eased momentum (e)
      if (titleEl) {
        // Continuous smooth scratch and stretch synchronized with curtain's smootherstep e
        // Dilakukan murni via GPU scale 3D tanpa letterSpacing agar tidak memicu font glyph reflow (anti getar)
        const stretchY = 1 + e * 0.72;
        const compressX = Math.max(0.74, 1 - e * 0.16);
        const zoom = 1 + e * 0.38;
        const opacity = Math.max(0.18, 1 - e * 0.3);

        titleEl.style.transform = `translate3d(0, 0, 0) scale(${(compressX * zoom).toFixed(4)}, ${(stretchY * zoom).toFixed(4)})`;
        titleEl.style.opacity = `${opacity.toFixed(3)}`;
      }

      // Panah melewati 2 potongan penutup section saat menutup
      // Begitu bener-bener menutup 100% rapat (closeP >= 0.999), panah berputar menghadap ke atas
      const isClosedNow = closeP >= 0.999;
      const leftAngle = isClosedNow ? -90 : 0;
      const rightAngle = isClosedNow ? 90 : 0;

      if (leftArrowIconRef.current) {
        leftArrowIconRef.current.style.transform = `rotate(${leftAngle}deg)`;
      }
      if (rightArrowIconRef.current) {
        rightArrowIconRef.current.style.transform = `rotate(${rightAngle}deg)`;
      }

      // Pergerakan setelah tertutup: panah meluncur menuju ke POJOK KIRI LAYAR ("baru nanti ke pojok kiri")
      const rawDown = isClosedNow ? Math.min(1, Math.max(0, (p - 0.70) / 0.22)) : 0;
      const downProgress = rawDown * rawDown * (3 - 2 * rawDown);

      // Panah kiri meluncur dari tengah diagonal ke pojok kiri bawah:
      // Y meluncur turun (+48vh), X meluncur ke kiri (-34vw) menuju posisi fixed bottom-5 left-5
      const leftMoveYVh = downProgress * 48;
      const leftMoveXvw = downProgress * 34;

      // Panah kanan memudar setelah tirai menutup rapat
      const rightArrowOpacity = isClosedNow ? Math.max(0, 1 - downProgress * 2.5) : 1;
      // Panah kiri tetap tampak saat meluncur ke pojok kiri, lalu bertransisi mulus ke tombol fixed
      const leftArrowOpacity = downProgress >= 0.85 ? Math.max(0, (1 - downProgress) / 0.15) : 1;

      if (leftArrowWrapperRef.current) {
        leftArrowWrapperRef.current.style.transform = `translate3d(-${leftMoveXvw.toFixed(2)}vw, calc(-50% + ${leftMoveYVh.toFixed(2)}vh), 0) skewX(15deg)`;
        leftArrowWrapperRef.current.style.opacity = `${leftArrowOpacity.toFixed(3)}`;
      }
      if (rightArrowWrapperRef.current) {
        rightArrowWrapperRef.current.style.transform = `translate3d(0, -50%, 0) skewX(15deg)`;
        rightArrowWrapperRef.current.style.opacity = `${rightArrowOpacity.toFixed(3)}`;
      }

      // Tombol reset di pojok kiri muncul ketika panah sudah sampai di pojok kiri
      setShowResetBtn(downProgress >= 0.8 || p >= 0.92);

      // Background photo: tetap statis (tanpa zoom) dan menggelap tipis saat tirai mau tertutup
      if (bg) {
        bg.style.transform = 'none';
        const darkProgress = Math.min(1, Math.max(0, (closeP - 0.18) / 0.82));
        const brightness = 1 - darkProgress * 0.42; // Efek gelap tipis dan elegan (turun perlahan dari 1.0 ke ~0.58)
        bg.style.filter = `brightness(${brightness.toFixed(3)})`;
      }

      // Tombol hanya keluar jika penutup section terbuka >= 75% (yaitu p <= 0.25)
      // Sebelum 75% terbuka (p > 0.25 / saat tertutup): tombol hilang, hanya nama di celah tirai
      if (p <= 0.25) {
        const reveal = 1 - p / 0.25;
        if (btnEl) {
          btnEl.style.opacity = `${reveal}`;
          btnEl.style.transform = `translateY(${(1 - reveal) * 16}px)`;
          btnEl.style.pointerEvents = reveal > 0.6 ? 'auto' : 'none';
        }
        if (tagEl) {
          tagEl.style.opacity = `${reveal}`;
          tagEl.style.transform = `translateY(${(1 - reveal) * 10}px)`;
        }
        if (statsEl) {
          statsEl.style.opacity = `${reveal}`;
          statsEl.style.transform = `translateY(${(1 - reveal) * 12}px)`;
        }
      } else {
        // Tertutup atau celah tirai < 75%: sembunyikan tombol & tagline
        if (btnEl) {
          btnEl.style.opacity = '0';
          btnEl.style.transform = 'translateY(16px)';
          btnEl.style.pointerEvents = 'none';
        }
        if (tagEl) {
          tagEl.style.opacity = '0';
          tagEl.style.transform = 'translateY(10px)';
        }
        if (statsEl) {
          statsEl.style.opacity = '0';
          statsEl.style.transform = 'translateY(12px)';
        }
      }

      const closed = p >= CLOSE_AT;
      if (onScrollProgress) {
        onScrollProgress(p, closed);
      }
    };

    // Smooth inertia / momentum loop: deselerasi ultra-smooth dari 100% kecepatan ke 0%
    const loop = () => {
      const diff = targetP - currentP;
      if (Math.abs(diff) > 0.00008) {
        // Faktor redaman lerp 0.075: luncuran sutra yang stabil dan responsif
        currentP += diff * 0.075;
        applyProgress(currentP);
        animId = requestAnimationFrame(loop);
      } else {
        currentP = targetP;
        applyProgress(currentP);
        isRunning = false;
        animId = null;
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowResetBtn(currentY > 150);

      targetP = computeTargetP();
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    // Inisialisasi posisi awal tanpa hentakan
    targetP = computeTargetP();
    currentP = targetP;
    applyProgress(currentP);
    setShowResetBtn(window.scrollY > 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [onScrollProgress, isDark]);

  return (
    <div id="hero" ref={trackRef} className="relative h-[220vh] w-full">
      {/* Sticky Hero Stage */}
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-black select-none">
        {/* Dynamic Background Image - Static (gausah ikut ngezoom, dia tetap) */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.94) 100%), url("${data.hero.imageUrl}")`,
          }}
        />

        {/* Hero Content - Placed BEHIND the curtain panels (z-10) so panels cover it */}
        <div
          ref={contentRef}
          className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-14 pb-12 text-center text-white will-change-transform max-w-5xl mx-auto"
        >
          {/* Main Headline - Montserrat Bold with hardware accelerated compositor */}
          <h1
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-montserrat)',
              textShadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
            }}
            className="font-montserrat font-extrabold text-white text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] tracking-tight leading-none will-change-transform origin-center select-none [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            {data.hero.title}
          </h1>

          {/* Tagline with Left-to-Right Typewriter Effect (Cursor moves from left to right) */}
          <div
            ref={taglineRef}
            className="mt-4 sm:mt-5 min-h-[3rem] sm:min-h-[2.5rem] w-full max-w-xl mx-auto flex items-center justify-start text-left px-4 will-change-transform transition-all duration-200"
          >
            <TypewriterTagline phrases={phrases} />
          </div>

          {/* Action Buttons with Water Liquid Fill on Hover */}
          <div
            ref={buttonsRef}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5 will-change-transform transition-all duration-200"
          >
            <a
              href={data.hero.primaryBtnLink}
              style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
              className="btn-fill-effect px-7 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:text-white border border-transparent hover:border-amber-600/40 shadow-sm cursor-pointer"
            >
              <span className="relative z-10">{data.hero.primaryBtnText}</span>
            </a>
            <a
              href={data.hero.secondaryBtnLink}
              style={{ '--btn-fill-bg': '#ffffff' } as React.CSSProperties}
              className="btn-fill-effect px-7 py-3 rounded-full bg-black/60 text-zinc-200 font-medium text-xs sm:text-sm border border-white/20 hover:text-black hover:border-white shadow-sm cursor-pointer"
            >
              <span className="relative z-10">{data.hero.secondaryBtnText}</span>
            </a>
          </div>

          {/* Bottom Quick Stats with Animated Counting Effect (0 -> target) */}
          <div
            ref={statsRef}
            className="mt-8 sm:mt-10 hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 border-t border-white/10 pt-5 will-change-transform transition-all duration-200"
          >
            {data.hero.stats?.map((stat: { label: string; value: string }, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-base sm:text-lg md:text-xl font-bold text-zinc-100 font-mono">
                  <StatCounter value={stat.value} />
                </span>
                <span className="text-[10px] text-zinc-400 tracking-wider uppercase mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-8 hidden lg:flex flex-col items-center gap-1.5 opacity-60">
            <span className="text-[9px] tracking-widest uppercase font-mono text-zinc-400">
              Scroll ke Bawah
            </span>
            <ArrowDown className="h-3 w-3 text-zinc-400 animate-bounce" />
          </div>
        </div>

        {/* Skariga Curtain Left Panel - IN FRONT OF CONTENT (z-20) to physically cover text */}
        <div
          ref={leftPanelRef}
          className={`pointer-events-none absolute -top-[10vh] -bottom-[10vh] z-20 will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d] transition-colors duration-300 ${isDark ? 'bg-[#000000]' : 'bg-[#fafafa]'
            }`}
          style={{
            width: 'calc(50% + 40vh)',
            left: '-20vh',
            transform: 'translateX(-135%) skewX(-15deg)',
          }}
        />

        {/* Skariga Curtain Right Panel - IN FRONT OF CONTENT (z-20) to physically cover text */}
        <div
          ref={rightPanelRef}
          className={`pointer-events-none absolute -top-[10vh] -bottom-[10vh] z-20 will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d] transition-colors duration-300 ${isDark ? 'bg-[#000000]' : 'bg-[#fafafa]'
            }`}
          style={{
            width: 'calc(50% + 40vh)',
            right: '-20vh',
            transform: 'translateX(135%) skewX(-15deg)',
          }}
        />

        {/* Arrow Layer: z-30 (Above both panels so arrows pass through/over the 2 curtain pieces) */}
        {/* Left Panel Arrow Track - synchronous with Left Panel */}
        <div
          ref={leftArrowTrackRef}
          className="pointer-events-none absolute -top-[10vh] -bottom-[10vh] z-30 will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
          style={{
            width: 'calc(50% + 40vh)',
            left: '-20vh',
            transform: 'translateX(-135%) skewX(-15deg)',
          }}
        >
          {/* Panah kiri menonjol ke kanan melewati potongan penutup */}
          <div
            ref={leftArrowWrapperRef}
            className="absolute top-[38%] -right-16 sm:-right-24 md:-right-28 -translate-y-1/2 z-30 pointer-events-none [backface-visibility:hidden] transition-opacity duration-300 ease-out"
            style={{ transform: 'translateY(-50%) skewX(15deg)' }}
          >
            <div
              ref={leftArrowIconRef}
              className="will-change-transform origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-amber-500"
            >
              <svg
                viewBox="0 0 140 32"
                className="w-24 sm:w-36 md:w-44 h-7 sm:h-9 md:h-11"
                fill="currentColor"
              >
                <path d="M0 10 H95 V0 L140 16 L95 32 V22 H0 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel Arrow Track - synchronous with Right Panel */}
        <div
          ref={rightArrowTrackRef}
          className="pointer-events-none absolute -top-[10vh] -bottom-[10vh] z-30 will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
          style={{
            width: 'calc(50% + 40vh)',
            right: '-20vh',
            transform: 'translateX(135%) skewX(-15deg)',
          }}
        >
          {/* Panah kanan menonjol ke kiri melewati potongan penutup */}
          <div
            ref={rightArrowWrapperRef}
            className="absolute top-[62%] -left-16 sm:-left-24 md:-left-28 -translate-y-1/2 z-30 pointer-events-none [backface-visibility:hidden] transition-opacity duration-300 ease-out"
            style={{ transform: 'translateY(-50%) skewX(15deg)' }}
          >
            <div
              ref={rightArrowIconRef}
              className="will-change-transform origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-amber-500"
            >
              <svg
                viewBox="0 0 140 32"
                className="w-24 sm:w-36 md:w-44 h-7 sm:h-9 md:h-11"
                fill="currentColor"
              >
                <path d="M140 10 H45 V0 L0 16 L45 32 V22 H140 Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Tombol Panah Reset ke Atas di Pojok Kiri Layar */}
      <div
        className={`fixed bottom-5 left-5 z-40 transition-all duration-300 ${showResetBtn ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-amber-500 text-black font-semibold text-xs shadow-2xl border border-amber-600/40 hover:bg-amber-400 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Reset ke Atas"
          aria-label="Reset ke Atas"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
            <span className="hidden sm:inline">Reset ke Atas</span>
            <span className="sm:hidden">Atas</span>
          </span>
        </button>
      </div>
    </div>
  );
};
