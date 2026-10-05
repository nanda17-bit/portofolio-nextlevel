'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { SongItem } from '@/types/portfolio';
import { DEFAULT_PORTFOLIO_DATA } from '@/data/defaultData';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Disc3,
  ExternalLink,
  FileText,
  ListMusic,
  Heart,
  Shuffle,
  Repeat,
  MoreHorizontal,
  Home,
  Search,
  Library,
  Laptop2,
  ArrowDownCircle,
  ChevronLeft,
} from 'lucide-react';

const SpotifyIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export const TitikSpotifySection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const isDark = theme === 'dark';

  // Dynamic songs from context with default fallback
  const songs: SongItem[] =
    data?.songs && data.songs.length > 0 ? data.songs : DEFAULT_PORTFOLIO_DATA.songs;

  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [isOrbitHovered, setIsOrbitHovered] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [phoneViewMode, setPhoneViewMode] = useState<'tracklist' | 'lyrics'>('tracklist');

  // Safe active song index calculation
  const safeActiveIndex = activeSongIndex >= songs.length ? 0 : Math.max(0, activeSongIndex);
  const activeSong = songs[safeActiveIndex] || songs[0];

  // Audio preview playback states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState('0:00');
  const [audioDuration, setAudioDuration] = useState('0:30');

  const fadeAnimRef = useRef<number | null>(null);

  // Smooth Volume Fade In (from 0 to targetVolume over durationMs with cubic easing)
  const fadeAudioIn = (audio: HTMLAudioElement, targetVolume = 0.9, durationMs = 380) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            // Ease-out cubic curve for natural volume swelling
            const eased = 1 - Math.pow(1 - progress, 3);
            audio.volume = Math.max(0, Math.min(1, targetVolume * eased));
            if (progress < 1) {
              fadeAnimRef.current = requestAnimationFrame(step);
            } else {
              audio.volume = targetVolume;
              fadeAnimRef.current = null;
            }
          };
          fadeAnimRef.current = requestAnimationFrame(step);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('Audio playback error:', err);
          }
        });
    }
  };

  // Smooth Volume Fade Out (from current volume to 0 over durationMs, then pauses)
  const fadeAudioOut = (audio: HTMLAudioElement, durationMs = 350, onComplete?: () => void) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    const startVolume = audio.volume;
    if (startVolume <= 0.01) {
      audio.pause();
      setIsPlaying(false);
      if (onComplete) onComplete();
      return;
    }

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease-in quadratic curve for silky smooth fade to silence
      const eased = Math.pow(1 - progress, 2);
      audio.volume = Math.max(0, Math.min(1, startVolume * eased));

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(step);
      } else {
        audio.pause();
        audio.volume = 0;
        setIsPlaying(false);
        fadeAnimRef.current = null;
        if (onComplete) onComplete();
      }
    };
    fadeAnimRef.current = requestAnimationFrame(step);
  };

  // Play a song preview directly via HTML5 Audio with smooth fade-in
  const playSong = (index: number) => {
    const safeIdx = Math.max(0, Math.min(songs.length - 1, index));
    setActiveSongIndex(safeIdx);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch {
      // AudioContext state check safe guard
    }

    const targetUrl = songs[safeIdx].previewUrl;
    if (audio.src !== targetUrl) {
      audio.src = targetUrl;
      audio.load();
    }

    fadeAudioIn(audio, 0.9, 380);
  };

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hover-to-play handlers: Song ONLY plays while hovered, stops when hover ends
  const handleSongHover = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsOrbitHovered(true);
    if (!isFlipped) setIsFlipped(true);
    if (!areCardsVisible) setAreCardsVisible(true);
    playHoverSound(index);
    playSong(index);
  };

  const handleSongLeave = () => {
    setIsOrbitHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        fadeAudioOut(audioRef.current, 350);
      }
    }, 80);
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeAudioOut(audio, 300);
    } else {
      if (!audio.src || audio.src === '' || audio.src === window.location.href) {
        audio.src = songs[safeActiveIndex].previewUrl;
        audio.load();
      }
      fadeAudioIn(audio, 0.9, 350);
    }
  };

  // Section auto-animation state: triggers automatically when entering viewport
  const [isInView, setIsInView] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const isHoveredRef = useRef(false);
  const angleRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize soft, modern UI harmonic sound on hover using Web Audio API
  const playHoverSound = (index: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pentatonic warm chime scale
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const freq = notes[index % notes.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.97, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.17);
    } catch {
      // Audio context restricted or unavailable
    }
  };

  // Harmonized confirmation chime on click
  const playSelectSound = (index: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const baseFreq = notes[index % notes.length];

      [baseFreq, baseFreq * 1.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.23);
      });
    } catch {
      // Audio context restricted or unavailable
    }
  };

  useEffect(() => {
    isHoveredRef.current = isOrbitHovered;
  }, [isOrbitHovered]);

  // Track viewport dimensions
  useEffect(() => {
    const updateDims = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Preload initial track preview safely on mount & cleanup audio fade on unmount
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src && songs[0]?.previewUrl) {
      audioRef.current.src = songs[0].previewUrl;
      audioRef.current.load();
    }
    return () => {
      if (fadeAnimRef.current) cancelAnimationFrame(fadeAnimRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [songs]);

  // Continuous gentle rotation loop (NOT driven by scroll, pauses when hovered or offscreen)
  useEffect(() => {
    if (!isInView || isMobile) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // Slow, relaxing constant rotation: ~8 degrees per second (full 360° in 45s)
      // Pauses when any card is hovered
      if (!isHoveredRef.current) {
        angleRef.current = (angleRef.current + delta * 8.2) % 360;
        setOrbitAngle(angleRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isInView, isMobile]);

  // Scroll detection: Triggers transition when scrolling down into section,
  // and smoothly returns UI to center when scrolling back up so the effect can replay
  useEffect(() => {
    let animId: number;

    const checkVisibility = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Section is active when its top is at or above 50% of viewport
      // and its bottom is still visible above 20% of viewport
      const inTriggerZone = rect.top <= windowHeight * 0.50 && rect.bottom >= windowHeight * 0.20;

      setIsInView((prev) => {
        if (inTriggerZone && !prev) return true;
        if (!inTriggerZone && prev) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(checkVisibility);
    };

    checkVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Automatic sequence when section is entered:
  // 1. Center pause (Spotify logo on phone back)
  // 2. Glides & 3D flips to right column
  // Automatic 3D Flip & Card Orbit Sequence when section is entered:
  // 1. Starts with phone back (Spotify logo on phone back at 180°)
  // 2. Smoothly 3D flips to front player with stylish 3D tilt!
  // 3. Orbiting song cards emerge
  useEffect(() => {
    if (!isInView) {
      setIsFlipped(false);
      setAreCardsVisible(false);
      return;
    }

    // Brief pause showing glowing Spotify back emblem, then 3D flips!
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
    }, 400);

    const cardsTimer = setTimeout(() => {
      setAreCardsVisible(true);
    }, 1100);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(cardsTimer);
    };
  }, [isInView]);

  // Next / Prev song handlers
  const handlePrevSong = () => {
    const prevIdx = safeActiveIndex === 0 ? songs.length - 1 : safeActiveIndex - 1;
    playSong(prevIdx);
  };

  const handleNextSong = () => {
    const nextIdx = safeActiveIndex === songs.length - 1 ? 0 : safeActiveIndex + 1;
    playSong(nextIdx);
  };

  // Calculate pixel shift to position the phone dead-center when outside section / not yet scrolled into view
  const containerWidth = Math.min(1280, viewportWidth - 48);
  const centerShift = -Math.round(containerWidth * 0.28);
  const currentShiftX = isMobile ? 0 : isFlipped ? 0 : centerShift;

  const isPhone = viewportWidth > 0 && viewportWidth < 640;

  // Phone 3D POV: starts at 180° (showing back Spotify emblem in center) and flips to front player with stylish 3D tilt on the right!
  const phoneRotateX = isPhone ? (isFlipped ? 3 : 0) : isFlipped ? 8 : 4;
  const phoneRotateY = isPhone ? (isFlipped ? 360 : 180) : isFlipped ? 378 : 180;
  const phoneRotateZ = isPhone ? 0 : isFlipped ? -3 : -1;

  // Dynamic scale factor: adapts smoothly when the viewport or browser zoom scale shrinks
  const dynamicScale = useMemo(() => {
    if (viewportWidth === 0) return 1;
    if (viewportWidth >= 1536) return 1.0;
    if (viewportWidth >= 1280) return 0.94;
    if (viewportWidth >= 1024) return 0.85;
    if (viewportWidth >= 768) return 0.78;
    return 1;
  }, [viewportWidth]);

  // Adaptive orbit radius so cards stay centered symmetrically around the phone without overflowing to the right
  const cardCount = songs.length;
  const radiusX = isMobile
    ? 160
    : Math.round((cardCount > 10 ? 300 : cardCount > 7 ? 275 : 250) * dynamicScale);
  const radiusZ = isMobile
    ? 120
    : Math.round((cardCount > 10 ? 200 : cardCount > 7 ? 185 : 170) * dynamicScale);

  return (
    <section
      id="titikSpotify"
      ref={sectionRef}
      onMouseLeave={handleSongLeave}
      className={`relative z-10 w-full min-h-0 md:min-h-[92vh] lg:min-h-screen py-10 sm:py-16 lg:py-28 flex items-center justify-center overflow-hidden border-t border-b border-white/5 transition-colors duration-500 select-none ${
        isDark ? 'text-white' : 'text-zinc-900'
      }`}
    >
      {/* Hidden Audio Element for Instant Song Preview */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn('Audio playback error on element:', e);
        }}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 30;
          setAudioProgress((cur / dur) * 100);
          const mins = Math.floor(cur / 60);
          const secs = Math.floor(cur % 60);
          setAudioCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          const dur = audioRef.current.duration || 30;
          const mins = Math.floor(dur / 60);
          const secs = Math.floor(dur % 60);
          setAudioDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }}
        onEnded={handleNextSong}
      />
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

          {/* Subtle warm ambient shadow lights - soft diffused glow, not glaring */}
          <div
            className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[170px] opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, #d97706 0%, #b45309 50%, transparent 80%)',
            }}
          />
          <div
            className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[170px] opacity-[0.05]"
            style={{
              background: 'radial-gradient(circle, #b45309 0%, #78350f 40%, transparent 80%)',
            }}
          />
        </div>

        {/* Main Content Layout Container */}
        <div
          ref={containerRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-10"
        >
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Text reveals smoothly when UI is transitioning to the right  */}
        {/* ========================================================================= */}
        <div
          className={`w-full lg:w-[44%] xl:w-[42%] flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1 lg:order-1 mb-3 sm:mb-5 lg:mb-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobile || isPhone || isFlipped
              ? 'opacity-100 translate-x-0 pointer-events-auto delay-100'
              : 'opacity-0 -translate-x-12 pointer-events-none'
          }`}
          style={{
            willChange: 'opacity, transform',
          }}
        >
          {/* Heading */}
          <h2
            className="font-extrabold tracking-tight text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] transition-all duration-500"
          >
            <span className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]">
              Musik
            </span>{' '}
            <span className={isDark ? 'text-white' : 'text-zinc-900'}>adalah</span> <br />
            <span className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]">
              Teman Terbaik.
            </span>
          </h2>

          <p
            className={`mt-3 sm:mt-5 text-xs sm:text-sm md:text-base leading-relaxed max-w-md lg:max-w-lg transition-all duration-500 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            Menemani pagi yang sepi, debugging puluhan baris kode di larut malam, perjalanan
            panjang mencari inspirasi, dan saat butuh teman bicara.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 3D Phone & Orbiting Cards (Glides from Center to Right)     */}
        {/* ========================================================================= */}
        <div
          ref={rightColRef}
          className="w-full lg:w-[56%] xl:w-[58%] flex items-center justify-center min-h-[460px] sm:min-h-[560px] md:min-h-[640px] relative pointer-events-none order-2 lg:order-2 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            transform: isMobile ? 'none' : `translateX(${currentShiftX}px)`,
          }}
        >
          {/* Centered Column for 3D Phone & Orbiting System */}
          <div className="flex flex-col items-center justify-center">
            {/* 3D Scene Wrapper with Perspective & Dynamic Scale */}
            <div
              className="relative flex items-center justify-center pointer-events-auto transition-transform duration-300"
              style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d',
                transform: !isMobile && dynamicScale < 1 ? `scale(${dynamicScale})` : undefined,
                transformOrigin: 'center center',
              }}
            >
            {/* ========================================================================= */}
            {/* 360-DEGREE TILTED ORBITING SONG CARDS (DESKTOP ONLY)                      */}
            {/* ========================================================================= */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:block"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {songs.map((song, i) => {
                const cardCount = songs.length;
                const baseAngle = (i / cardCount) * 360;
                // Pure time-based rotation (DOES NOT SPIN ON SCROLL)
                const currentAngle = (baseAngle + orbitAngle) % 360;
                const rad = (currentAngle * Math.PI) / 180;

                // 3D inclined orbit geometry (miring selaras dengan sudut ponsel)
                const tiltX = 18 * (Math.PI / 180);
                const tiltZ = -8 * (Math.PI / 180);

                const rawX = Math.sin(rad) * radiusX;
                const rawZ = Math.cos(rad) * radiusZ;

                // Coordinates with 3D inclination:
                const tiltedY = -rawZ * Math.sin(tiltX);
                const tiltedZ = rawZ * Math.cos(tiltX);

                const posX = rawX * Math.cos(tiltZ) - tiltedY * Math.sin(tiltZ);
                const posY = rawX * Math.sin(tiltZ) + tiltedY * Math.cos(tiltZ) + 16;
                const posZ = tiltedZ;

                // Depth normal (-1 in back to +1 in front)
                const depthNorm = posZ / (radiusZ * Math.cos(tiltX));
                const isFront = posZ > 0;

                // Scale and Opacity: front cards are larger, only visible when UI is truly settled on the right
                const cardScale = isPhone
                  ? 0.72 + depthNorm * 0.12
                  : isMobile
                  ? 0.82 + depthNorm * 0.15
                  : 0.90 + depthNorm * 0.18;
                const cardOpacity = isFront
                  ? 0.95 + depthNorm * 0.05
                  : 0.35 + (1 + depthNorm) * 0.25;

                // Depth sorting: back cards go behind the phone (zIndex: 15), front cards in front (zIndex > 100)
                const zIndexVal = isFront ? 120 + Math.round(posZ) : 15;
                const isCurrentActive = activeSong.id === song.id;

                // Face orientation:
                // Front cards face directly towards the viewer with maximum legibility
                const facingY = -Math.sin(rad) * 16 + 6;
                const facingX = -tiltX * (180 / Math.PI) * 0.35;

                return (
                  <div
                    key={song.id}
                    onMouseEnter={() => {
                      if (!areCardsVisible) return;
                      handleSongHover(i);
                    }}
                    onMouseLeave={handleSongLeave}
                    onClick={() => {
                      if (!isFlipped) setIsFlipped(true);
                      if (!areCardsVisible) setAreCardsVisible(true);
                      handleSongHover(i);
                      playSelectSound(i);
                    }}
                    className="absolute select-none group pointer-events-auto cursor-pointer"
                    style={{
                      transform: `translate3d(${posX}px, ${posY}px, ${posZ}px) rotateY(${facingY}deg) rotateX(${facingX}deg) scale(${
                        areCardsVisible ? cardScale : cardScale * 0.35
                      })`,
                      opacity: areCardsVisible ? cardOpacity : 0,
                      zIndex: isCurrentActive ? 220 : zIndexVal,
                      willChange: 'transform, opacity',
                      transformStyle: 'preserve-3d',
                      transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    title={`Arahkan kursor untuk memutar ${song.title} - ${song.artist}`}
                  >
                    {/* Floating Glassmorphic Song Capsule Card with Rich Border Radius */}
                    <div
                      className={`w-[120px] xs:w-[130px] sm:w-[155px] md:w-[195px] p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl md:rounded-[20px] border transform-gpu [backface-visibility:hidden] transition-all duration-300 flex items-center gap-2 sm:gap-2.5 ${
                        isDark
                          ? // Portfolio DARK theme -> Spotify UI is "PUTIH TIDAK MENCOLOK"
                            isCurrentActive
                            ? 'bg-white border-[#1ed760] shadow-[0_8px_25px_rgba(30,215,96,0.25)] ring-2 ring-[#1ed760]/40 scale-[1.05] text-zinc-900'
                            : 'bg-zinc-100/90 border-zinc-300/80 hover:border-zinc-400 hover:scale-[1.04] shadow-[0_8px_20px_rgba(0,0,0,0.35)] text-zinc-800'
                          : // Portfolio LIGHT theme -> Spotify UI is "HITAM" with SOFT REDUCED SHADOW
                            isCurrentActive
                            ? 'bg-[#18181f] border-[#1ed760] shadow-[0_8px_20px_rgba(30,215,96,0.22)] ring-1 ring-[#1ed760]/50 scale-[1.05] text-white'
                            : 'bg-[#121215]/92 border-white/10 hover:border-white/25 hover:scale-[1.04] shadow-[0_6px_18px_rgba(0,0,0,0.12)] text-zinc-200'
                      }`}
                    >
                      {/* Mini Cover Thumbnail with Vinyl Effect or Artwork */}
                      <div
                        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md"
                        style={{ background: song.gradient }}
                      >
                        {song.coverUrl ? (
                          <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <Disc3
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-white/90 ${
                              isCurrentActive && isPlaying ? 'animate-spin' : ''
                            }`}
                            style={{ animationDuration: '4s' }}
                          />
                        )}
                        {isCurrentActive && (
                          <div className="absolute inset-0 bg-[#1ed760]/20 flex items-center justify-center pointer-events-none">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1ed760] animate-ping"></span>
                          </div>
                        )}
                      </div>

                      {/* Song Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`text-[10px] sm:text-xs font-bold truncate leading-tight ${
                              isCurrentActive
                                ? 'text-[#1ed760]'
                                : isDark
                                ? 'text-zinc-900'
                                : 'text-white'
                            }`}
                          >
                            {song.title}
                          </h5>
                          {isCurrentActive && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-[#1ed760] shadow-[0_0_8px_rgba(30,215,96,0.8)]"></span>
                          )}
                        </div>
                        <p className={`text-[8px] sm:text-[10px] truncate mt-0.5 ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          {song.artist}
                        </p>
                        <div className={`flex items-center justify-between mt-0.5 sm:mt-1 text-[7px] sm:text-[9px] font-mono ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          <div className="flex items-center gap-1">
                            <span>{song.duration}</span>
                            {song.lyrics && (
                              <span className={`text-[6px] sm:text-[7px] px-1 py-0.2 rounded font-mono font-medium ${
                                isDark ? 'bg-zinc-200 text-zinc-700' : 'bg-white/10 text-zinc-300'
                              }`}>
                                Lirik
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {isCurrentActive && isPlaying && (
                              <span className="flex items-end gap-0.5 h-2 sm:h-2.5">
                                <span className="w-0.5 h-full rounded-full animate-pulse bg-[#1ed760]" />
                                <span className="w-0.5 h-1.5 rounded-full animate-pulse [animation-delay:0.15s] bg-[#1ed760]" />
                                <span className="w-0.5 h-2 rounded-full animate-pulse [animation-delay:0.3s] bg-[#1ed760]" />
                              </span>
                            )}
                            <span
                              className={`flex items-center gap-0.5 ${
                                isCurrentActive
                                  ? 'text-[#1ed760] font-semibold'
                                  : isDark ? 'text-zinc-500' : 'text-zinc-400'
                              }`}
                            >
                              <SpotifyIcon className="w-2.5 h-2.5" />
                              <span>Spotify</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================================= */}
            {/* 3D DOUBLE-SIDED PHONE BODY (Back: Spotify Logo -> Flips -> Front: Player) */}
            {/* ========================================================================= */}
            <div
              onClick={() => {
                if (!isFlipped) {
                  setIsFlipped(true);
                  setTimeout(() => setAreCardsVisible(true), 600);
                }
              }}
              className="relative w-[215px] xs:w-[230px] sm:w-[260px] md:w-[285px] h-[440px] xs:h-[470px] sm:h-[520px] md:h-[580px] select-none transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              style={{
                transform: `rotateX(${phoneRotateX}deg) rotateY(${phoneRotateY}deg) rotateZ(${phoneRotateZ}deg)`,
                transformStyle: 'preserve-3d',
                borderRadius: isPhone ? '44px' : '52px',
                zIndex: 40, // phone stays steady in middle of 3D depth
              }}
            >
              {/* ======================================================================= */}
              {/* FACE 1: FRONT FACE (Spotify Music Player & Interactive Tracklist)       */}
              {/* ======================================================================= */}
              <div
                className={`absolute inset-0 rounded-[44px] sm:rounded-[52px] overflow-hidden p-2.5 sm:p-3.5 border-[3px] transition-all duration-300 ${
                  isDark
                    ? 'bg-[#e4e4e7] border-zinc-300/90 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(255,255,255,0.06)]'
                    : 'bg-[#09090b] border-zinc-800 shadow-[0_15px_35px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.08)]'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg) translateZ(1px)',
                }}
              >
                {/* Screen Glass Surface */}
                <div className={`relative w-full h-full rounded-[36px] sm:rounded-[42px] overflow-hidden transition-colors p-3 sm:p-4 pt-7 sm:pt-8 flex flex-col justify-between ${
                  isDark
                    ? 'bg-gradient-to-b from-[#f4f4f5] via-[#e4e4e7] to-[#d4d4d8] text-zinc-900'
                    : 'bg-gradient-to-b from-[#141416] via-[#0d0d0f] to-[#080809] text-white'
                }`}>
                  {/* Dynamic Island Music Pill */}
                  <div className="absolute left-1/2 top-2.5 sm:top-3 -translate-x-1/2 z-50 bg-black/95 rounded-full flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 shadow-2xl border border-white/10 w-[170px] xs:w-[185px] sm:w-[200px] md:w-[210px] h-[32px] sm:h-[36px]">
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: activeSong.gradient }}
                    >
                      {activeSong.coverUrl ? (
                        <img src={activeSong.coverUrl} alt={activeSong.title} className="w-full h-full object-cover" />
                      ) : (
                        <Disc3 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-white ${isPlaying ? 'animate-spin' : ''}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-[11px] font-bold truncate leading-none text-white">
                        {activeSong.title}
                      </p>
                      <p className="text-[8px] sm:text-[9px] text-[#1ed760] truncate leading-none mt-0.5 font-medium">
                        {activeSong.artist}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px]">
                      <span className="w-0.5 sm:w-1 h-2 bg-[#1ed760] rounded-full animate-pulse" />
                      <span className="w-0.5 sm:w-1 h-3 bg-[#1ed760] rounded-full animate-pulse" />
                      <span className="w-0.5 sm:w-1 h-1.5 bg-[#1ed760] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* FULL AUTHENTIC SPOTIFY MOBILE SCREEN */}
                  <div
                    className={`absolute inset-0 z-40 rounded-[36px] sm:rounded-[42px] overflow-hidden flex flex-col justify-between pt-10 sm:pt-11 border transition-colors ${
                      isDark
                        ? 'bg-[#f4f4f6] text-zinc-900 border-black/5'
                        : 'bg-[#121212] text-white border-white/10'
                    }`}
                  >
                    {/* 1. Spotify Top Navigation Bar */}
                    <div className="px-3 sm:px-4 py-1 flex items-center justify-between flex-shrink-0">
                      <ChevronLeft className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
                      <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase opacity-75 font-mono">
                        Playlist
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhoneViewMode(phoneViewMode === 'lyrics' ? 'tracklist' : 'lyrics');
                          }}
                          className={`px-2 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-bold tracking-wide transition-all cursor-pointer ${
                            phoneViewMode === 'lyrics'
                              ? 'bg-[#1ed760] text-black font-extrabold shadow-xs'
                              : isDark
                              ? 'bg-black/10 text-zinc-700 hover:bg-black/15'
                              : 'bg-white/15 text-zinc-200 hover:bg-white/25'
                          }`}
                        >
                          {phoneViewMode === 'lyrics' ? 'Lagu' : 'Lirik'}
                        </button>
                        <MoreHorizontal className="w-4 h-4 opacity-80 cursor-pointer" />
                      </div>
                    </div>

                    {/* 2. Main Content: Tracklist Mode OR Lyrics Mode */}
                    {phoneViewMode === 'lyrics' ? (
                      /* Spotify Karaoke Lyrics Mode */
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 overflow-y-auto no-scrollbar px-3 sm:px-4 py-2 flex flex-col justify-between my-auto"
                        style={{
                          background: isDark
                            ? 'linear-gradient(180deg, rgba(22,163,74,0.08) 0%, transparent 100%)'
                            : 'linear-gradient(180deg, rgba(30,215,96,0.12) 0%, transparent 100%)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#1ed760] flex items-center gap-1">
                            <SpotifyIcon className="w-3 h-3" />
                            <span>Spotify Karaoke</span>
                          </span>
                          <span className="text-[8px] opacity-60 font-mono">
                            {activeSong.title}
                          </span>
                        </div>

                        {activeSong.lyrics ? (
                          <div className="space-y-1.5 py-1">
                            {activeSong.lyrics.split('\n').map((line, lIdx) => {
                              const isHighlighted = lIdx === 0 || lIdx === 2;
                              return (
                                <p
                                  key={`lyr-${lIdx}`}
                                  className={`text-[11px] sm:text-xs font-bold leading-relaxed transition-all ${
                                    line.trim() === ''
                                      ? 'h-2'
                                      : isHighlighted
                                      ? isDark ? 'text-zinc-950 font-extrabold' : 'text-white font-extrabold'
                                      : isDark ? 'text-zinc-400 opacity-60' : 'text-white/40'
                                  }`}
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="my-auto text-center py-4">
                            <FileText className={`w-6 h-6 mx-auto mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
                            <p className="text-[10px] font-semibold opacity-75">Lirik belum tersedia untuk lagu ini</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Spotify Playlist View: Header + Tracklist */
                      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Spotify Playlist Hero Section */}
                        <div className="px-3 sm:px-4 pt-0.5 pb-2 flex-shrink-0">
                          <div className="flex items-center gap-2.5">
                            {/* Album Square Cover with Spotify Badge */}
                            <div
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-md shadow-md flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                              style={{ background: activeSong.gradient }}
                            >
                              {activeSong.coverUrl ? (
                                <img src={activeSong.coverUrl} alt={activeSong.title} className="w-full h-full object-cover" />
                              ) : (
                                <Disc3
                                  className={`w-5 h-5 sm:w-6 sm:h-6 text-white/90 ${
                                    isPlaying ? 'animate-spin' : ''
                                  }`}
                                  style={{ animationDuration: '4s' }}
                                />
                              )}
                              <div className="absolute bottom-0.5 right-0.5 z-10 bg-black/60 rounded-full p-0.5">
                                <SpotifyIcon className="w-2.5 h-2.5 text-white/90" />
                              </div>
                            </div>

                            {/* Playlist Details */}
                            <div className="flex-1 min-w-0">
                              <span className="text-[7.5px] uppercase tracking-widest font-extrabold text-[#1ed760] block">
                                Spotify Playlist
                              </span>
                              <h3 className={`font-black text-xs sm:text-sm tracking-tight truncate leading-tight mt-0.5 ${
                                isDark ? 'text-zinc-900' : 'text-white'
                              }`}>
                                {activeSong.album || 'Coding Beats & Focus'}
                              </h3>
                              <div className={`flex items-center gap-1 text-[8px] sm:text-[8.5px] mt-0.5 ${
                                isDark ? 'text-zinc-500' : 'text-[#b3b3b3]'
                              }`}>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#1ed760] flex items-center justify-center text-[6px] text-black font-black">
                                  ✓
                                </span>
                                <span className="font-semibold">baliqDev</span>
                                <span>•</span>
                                <span>{songs.length} lagu</span>
                              </div>
                            </div>
                          </div>

                          {/* Spotify Action Bar: Like, Download, Shuffle, and THE BIG GREEN PLAY BUTTON */}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                title="Sukai Playlist"
                              >
                                <Heart className="w-3.5 h-3.5 fill-[#1ed760] text-[#1ed760]" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                title="Telah Diunduh"
                              >
                                <ArrowDownCircle className="w-3.5 h-3.5 text-[#1ed760]" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className={`cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                                  isDark ? 'text-zinc-500' : 'text-[#b3b3b3]'
                                }`}
                                title="Opsi"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <Shuffle className="w-3.5 h-3.5 text-[#1ed760] cursor-pointer" />
                              {/* THE ICONIC BIG GREEN ROUND SPOTIFY PLAY BUTTON */}
                              <button
                                type="button"
                                onMouseEnter={() => handleSongHover(safeActiveIndex)}
                                onMouseLeave={handleSongLeave}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlayPause();
                                }}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_4px_14px_rgba(30,215,96,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title={isPlaying ? 'Jeda' : 'Putar'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-black text-black" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Spotify Tracklist Rows */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-2 sm:px-3 space-y-1">
                          {songs.map((track, idx) => {
                            const isSelected = activeSong.id === track.id;
                            return (
                              <div
                                key={track.id}
                                onMouseEnter={() => handleSongHover(idx)}
                                onMouseLeave={handleSongLeave}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSongHover(idx);
                                  playSelectSound(idx);
                                }}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                                  isSelected
                                    ? isDark
                                      ? 'bg-black/8'
                                      : 'bg-white/10'
                                    : isDark
                                    ? 'hover:bg-black/5'
                                    : 'hover:bg-white/5'
                                }`}
                              >
                                {/* Thumbnail or Track Index */}
                                <div
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-xs"
                                  style={{ background: track.gradient }}
                                >
                                  {track.coverUrl ? (
                                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                                  ) : isSelected && isPlaying ? (
                                    <span className="flex items-end gap-0.5 h-2.5">
                                      <span className="w-0.5 h-full bg-[#1ed760] rounded-full animate-pulse" />
                                      <span className="w-0.5 h-1.5 bg-[#1ed760] rounded-full animate-pulse [animation-delay:0.15s]" />
                                      <span className="w-0.5 h-2 bg-[#1ed760] rounded-full animate-pulse [animation-delay:0.3s]" />
                                    </span>
                                  ) : (
                                    <Music className="w-3 h-3 text-white/90" />
                                  )}
                                </div>

                                {/* Track Title & Artist */}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-[9.5px] sm:text-[10.5px] font-semibold truncate leading-tight ${
                                      isSelected
                                        ? 'text-[#1ed760] font-bold'
                                        : isDark
                                        ? 'text-zinc-900 group-hover:text-black'
                                        : 'text-white group-hover:text-zinc-100'
                                    }`}
                                  >
                                    {track.title}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {track.lyrics && (
                                      <span className={`text-[5.5px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
                                        isDark ? 'bg-zinc-200 text-zinc-700' : 'bg-white/15 text-zinc-300'
                                      }`}>
                                        Lyrics
                                      </span>
                                    )}
                                    <p className={`text-[7.5px] sm:text-[8.5px] truncate ${
                                      isDark ? 'text-zinc-500' : 'text-[#b3b3b3]'
                                    }`}>
                                      {track.artist}
                                    </p>
                                  </div>
                                </div>

                                {/* Right Side: Heart & Options */}
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {isSelected && (
                                    <Heart className="w-3 h-3 fill-[#1ed760] text-[#1ed760]" />
                                  )}
                                  <MoreHorizontal className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-[#b3b3b3]'}`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Floating Spotify Mini-Player (Now Playing Bar with glued 2px green scrubber) */}
                    <div className="px-2 sm:px-2.5 pt-1 pb-1 flex-shrink-0">
                      <div
                        className={`rounded-lg p-1.5 flex items-center justify-between relative overflow-hidden backdrop-blur-md border shadow-md cursor-pointer ${
                          isDark
                            ? 'bg-white/95 border-zinc-200 text-zinc-900'
                            : 'bg-[#282828]/95 border-white/10 text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs"
                            style={{ background: activeSong.gradient }}
                          >
                            {activeSong.coverUrl ? (
                              <img src={activeSong.coverUrl} alt={activeSong.title} className="w-full h-full object-cover" />
                            ) : (
                              <Disc3 className={`w-3.5 h-3.5 text-white ${isPlaying ? 'animate-spin' : ''}`} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[8.5px] sm:text-[9.5px] font-bold truncate leading-tight ${
                              isDark ? 'text-zinc-900' : 'text-white'
                            }`}>
                              {activeSong.title}
                            </p>
                            <p className={`text-[7px] sm:text-[7.5px] truncate mt-0.5 ${
                              isDark ? 'text-zinc-500' : 'text-[#b3b3b3]'
                            }`}>
                              {activeSong.artist}
                            </p>
                          </div>
                        </div>

                        {/* Right: Device Connect, Heart, Play/Pause */}
                        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={activeSong.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka di Spotify"
                            className="text-[#1ed760] hover:scale-110 transition-transform"
                          >
                            <Laptop2 className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="cursor-pointer"
                          >
                            <Heart className="w-3 h-3 fill-[#1ed760] text-[#1ed760]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause();
                            }}
                            className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                          >
                            {isPlaying ? (
                              <Pause className={`w-3.5 h-3.5 fill-current ${isDark ? 'text-zinc-900' : 'text-white'}`} />
                            ) : (
                              <Play className={`w-3.5 h-3.5 fill-current ml-0.5 ${isDark ? 'text-zinc-900' : 'text-white'}`} />
                            )}
                          </button>
                        </div>

                        {/* Glued 2px Spotify Green Progress Bar at bottom of mini player */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!audioRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const pct = Math.max(0, Math.min(1, clickX / rect.width));
                            const newTime = pct * (audioRef.current.duration || 30);
                            audioRef.current.currentTime = newTime;
                          }}
                        >
                          <div
                            className="h-full bg-[#1ed760] transition-all duration-150"
                            style={{ width: `${audioProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Spotify 3-Tab Bottom Navigation Bar */}
                    <div className={`h-9 sm:h-10 border-t px-4 flex items-center justify-around flex-shrink-0 ${
                      isDark
                        ? 'bg-[#eaebee]/95 border-zinc-300/70 text-zinc-600'
                        : 'bg-[#121212] border-white/10 text-[#b3b3b3]'
                    }`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhoneViewMode('tracklist');
                        }}
                        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                          phoneViewMode === 'tracklist'
                            ? isDark ? 'text-zinc-950 font-bold' : 'text-white font-bold'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span className="text-[7px] tracking-tight">Home</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(activeSong.spotifyUrl, '_blank');
                        }}
                        className="flex flex-col items-center gap-0.5 cursor-pointer opacity-60 hover:opacity-100 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span className="text-[7px] tracking-tight">Search</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhoneViewMode('tracklist');
                        }}
                        className="flex flex-col items-center gap-0.5 cursor-pointer text-[#1ed760] font-bold"
                      >
                        <Library className="w-3.5 h-3.5" />
                        <span className="text-[7px] tracking-tight">Your Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* FACE 2: BACK FACE (Punggung Ponsel: Inversi Tema + Soft Shadows)        */}
              {/* ======================================================================= */}
              <div
                className={`absolute inset-0 rounded-[44px] sm:rounded-[52px] overflow-hidden p-3 sm:p-5 border-[3px] flex flex-col justify-between transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#f4f4f5] via-[#e4e4e7] to-[#d4d4d8] border-zinc-300/90 text-zinc-900'
                    : 'bg-gradient-to-b from-[#18181b] via-[#0d0d0f] to-[#050506] border-zinc-800 text-white'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  boxShadow: isDark
                    ? 'inset 0 0 0 2px rgba(255,255,255,0.6), 0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(255,255,255,0.06)'
                    : 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 15px 35px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Subtle Frosted Glass Sheen Highlight */}
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    isDark
                      ? 'bg-[radial-gradient(circle_at_25%_15%,rgba(245,158,11,0.05),transparent_55%)]'
                      : 'bg-[radial-gradient(circle_at_25%_15%,rgba(245,158,11,0.07),transparent_55%)]'
                  }`}
                />

                {/* Top Camera Module */}
                <div
                  className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[24px] border p-2 sm:p-2.5 grid grid-cols-2 gap-1.5 sm:gap-2 ${
                    isDark
                      ? 'bg-[#dcdce0] border-zinc-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]'
                      : 'bg-[#121215] border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shadow-sm ${
                      isDark
                        ? 'bg-gradient-to-br from-[#e4e4e7] to-[#d4d4d8] border-zinc-300'
                        : 'bg-gradient-to-br from-[#202024] to-[#09090b] border-white/10'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border ${
                        isDark ? 'bg-zinc-600 border-zinc-400' : 'bg-[#121215] border-white/20'
                      }`}
                    />
                  </div>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shadow-sm ${
                      isDark
                        ? 'bg-gradient-to-br from-[#e4e4e7] to-[#d4d4d8] border-zinc-300'
                        : 'bg-gradient-to-br from-[#202024] to-[#09090b] border-white/10'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border ${
                        isDark ? 'bg-zinc-600 border-zinc-400' : 'bg-[#121215] border-white/20'
                      }`}
                    />
                  </div>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shadow-sm ${
                      isDark
                        ? 'bg-gradient-to-br from-[#e4e4e7] to-[#d4d4d8] border-zinc-300'
                        : 'bg-gradient-to-br from-[#202024] to-[#09090b] border-white/10'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border ${
                        isDark ? 'bg-zinc-600 border-zinc-400' : 'bg-[#121215] border-white/20'
                      }`}
                    />
                  </div>
                  <div
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full self-center justify-self-center border ${
                      isDark ? 'bg-amber-400/90 border-amber-500/50' : 'bg-zinc-600 border-white/10'
                    }`}
                  />
                </div>

                {/* Center: Spotify Brand Emblem with Theme Inversion */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`absolute w-28 sm:w-36 h-28 sm:h-36 rounded-full blur-3xl pointer-events-none ${
                        isDark ? 'bg-[#1ed760]/[0.10]' : 'bg-[#1ed760]/[0.18]'
                      }`}
                    />
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border flex items-center justify-center backdrop-blur-md ${
                        isDark
                          ? 'bg-white/85 border-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
                          : 'bg-black/75 border-[#1ed760]/30 shadow-[0_0_25px_rgba(30,215,96,0.3)]'
                      }`}
                    >
                      {/* Official Spotify Icon */}
                      <svg
                        className={`w-11 h-11 sm:w-14 sm:h-14 ${
                          isDark
                            ? 'text-zinc-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                            : 'text-[#1ed760] drop-shadow-[0_0_20px_rgba(30,215,96,0.5)]'
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </div>
                  </div>

                  <h3
                    className={`mt-3 sm:mt-4 font-black tracking-widest text-base sm:text-lg md:text-xl font-mono uppercase ${
                      isDark ? 'text-zinc-900' : 'text-white drop-shadow-[0_0_12px_rgba(30,215,96,0.35)]'
                    }`}
                  >
                    Spotify
                  </h3>
                  <p
                    className={`mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider ${
                      isDark ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    Audio Experience // 360°
                  </p>
                </div>

                {/* Bottom Hardware Badge */}
                <div
                  className={`relative z-10 flex items-center justify-between pt-3 sm:pt-4 border-t text-[8px] sm:text-[9px] font-mono uppercase tracking-widest ${
                    isDark ? 'border-zinc-300 text-zinc-600' : 'border-white/5 text-zinc-500'
                  }`}
                >
                  <span>
                    baliq<span className="text-amber-500 font-semibold">Dev</span> Edition
                  </span>
                  <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>● Live Radio</span>
                </div>
              </div>
            </div>
            {/* Closes 3D Scene Wrapper */}
          </div>

          {/* Hint text directly below the 3D Spotify Phone UI */}
          <p
            className={`mt-4 sm:mt-6 z-30 text-center text-[10px] sm:text-xs font-mono tracking-wide transition-all duration-700 pointer-events-auto select-none ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            } ${
              isPhone || areCardsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            arahkan kursor ke lagu untuk memutar
          </p>

          {/* Mobile Simple Fast Song Selector Carousel (Swipeable, clean, touch-friendly) */}
          <div className="md:hidden w-full max-w-[320px] xs:max-w-[360px] mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x pointer-events-auto">
            {songs.map((song, idx) => {
              const isCur = activeSong.id === song.id;
              return (
                <button
                  key={`mob-song-${song.id}`}
                  onMouseEnter={() => handleSongHover(idx)}
                  onMouseLeave={handleSongLeave}
                  onClick={() => {
                    handleSongHover(idx);
                    playSelectSound(idx);
                  }}
                  className={`snap-center flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-left transition-all ${
                    isCur
                      ? isDark
                        ? 'bg-white border-[#1ed760] text-zinc-900 shadow-[0_4px_12px_rgba(30,215,96,0.3)] ring-1 ring-[#1ed760]/40'
                        : 'bg-[#18181f] border-[#1ed760] text-white shadow-[0_4px_12px_rgba(30,215,96,0.25)] ring-1 ring-[#1ed760]/40'
                      : isDark
                      ? 'bg-zinc-100/90 border-zinc-300 text-zinc-800 hover:bg-white'
                      : 'bg-[#121215]/90 border-white/10 text-zinc-300 hover:bg-[#18181f]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] flex-shrink-0"
                    style={{ background: song.gradient }}
                  >
                    {isCur && isPlaying ? '▶' : '♫'}
                  </span>
                  <span className="text-[11px] font-medium truncate max-w-[95px]">
                    {song.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
