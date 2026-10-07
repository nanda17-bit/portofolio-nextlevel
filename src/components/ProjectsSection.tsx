'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { ProjectItem } from '@/types/portfolio';
import { ProjectModal } from './ProjectModal';
import {
  ArrowRight,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewMode, setViewMode] = useState<'fan' | 'grid'>('fan');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [spreadProgress, setSpreadProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll listener to smoothly calculate spread progress (0: stacked in 1 deck, 1: spread in fanned arc)
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      // Desktop-only fan effect: mobile uses lightweight swipe carousel, skip work
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;
      if (!carouselRef.current) return;
      const rect = carouselRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start spreading when carousel approaches from bottom (rect.top <= 92% window height)
      // Fully spread into arc when centered (rect.top <= 35% window height)
      const start = windowHeight * 0.92;
      const end = windowHeight * 0.35;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, raw));
      setSpreadProgress((prev) => {
        if (Math.abs(prev - clamped) < 0.005 && clamped > 0 && clamped < 1) {
          return prev;
        }
        return clamped;
      });
    };

    const onScroll = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const isDark = theme === 'dark';
  const allProjects = data?.projects || [];
  // Proyek yang tampil di Landing Page (maksimal 5):
  // 1. Prioritas proyek yang di-pin atau featured
  const pinnedList = allProjects.filter(
    (p) => p.pinned === true || (p.pinned === undefined && p.featured === true)
  );
  // 2. Proyek lainnya (unpinned / newly added)
  const unpinnedList = allProjects.filter((p) => !pinnedList.some((pinned) => pinned.id === p.id));
  // 3. Gabungkan: pinned terlebih dahulu, lalu proyek terbaru hingga 5 kartu
  const projects = (pinnedList.length > 0 ? [...pinnedList, ...unpinnedList] : allProjects).slice(0, 5);
  const totalCount = allProjects.length;

  // Animated counter for project number
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!inView && !isMobile) return;
    if (totalCount === 0) {
      setDisplayCount(0);
      return;
    }

    let current = 0;
    const end = totalCount;
    const duration = 750;
    const stepTime = Math.max(25, Math.floor(duration / Math.max(1, end)));

    const timer = setInterval(() => {
      current += 1;
      setDisplayCount(current);
      if (current >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, isMobile, totalCount]);

  // Card fan rotations and offsets (initially stacked as one deck, spreading to arc on scroll)
  const getFanTransform = (
    index: number,
    total: number,
    spread: number
  ) => {
    const center = (total - 1) / 2;
    const diff = index - center;

    // Stacked configuration: all cards brought to center
    // Visual spacing between card centers in flex row is ~208px
    const stackOffsetX = -diff * 208;
    const stackRotate = diff * 1.5; // slight natural deck twist
    const stackTranslateY = Math.abs(diff) * 3;

    // Target spread arc configuration
    const targetRotate = diff * 5.5; // -11deg, -5.5deg, 0deg, 5.5deg, 11deg
    const targetTranslateY = Math.abs(diff) * 16;
    const targetTranslateX = diff * -12;

    // Smoothly interpolate from stacked (spread = 0) to fanned arc (spread = 1)
    const currentTranslateX = stackOffsetX * (1 - spread) + targetTranslateX * spread;
    const currentTranslateY = stackTranslateY * (1 - spread) + targetTranslateY * spread;
    const currentRotate = stackRotate * (1 - spread) + targetRotate * spread;
    const currentScale = 0.96 * (1 - spread) + 1.0 * spread;

    return {
      translateX: currentTranslateX,
      translateY: currentTranslateY,
      rotate: currentRotate,
      scale: currentScale,
      zIndex: 30 - Math.abs(diff),
      nudgeX: index === 0 ? 18 : index === total - 1 ? -18 : 0,
    };
  };

  const scrollMobileTo = (index: number) => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      const scrollPos = targetChild.offsetLeft - (container.clientWidth - targetChild.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth',
      });
      setActiveMobileIndex(index);
    }
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const childCenter = el.offsetLeft + el.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeMobileIndex) {
      setActiveMobileIndex(closestIndex);
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 py-16 sm:py-24 md:py-28 px-4 sm:px-8 md:px-10 lg:px-12 max-w-7xl mx-auto overflow-visible select-none"
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        className={`mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left transition-all duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          inView || isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div>
          <h2 className={`font-montserrat font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none inline-flex items-baseline ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            <span>
              <span className="text-amber-500">{displayCount}</span> Project<span
                aria-hidden="true"
                className="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.78em] -ml-[1px] sm:-ml-[2px] bg-amber-500 rounded-[1px] animate-cursor-blink align-baseline"
              />
            </span>
          </h2>

          <div className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-400 font-poppins font-normal">
            <span>
              <span className="text-amber-500 font-medium">created</span> and succesfully get{' '}
              <span className="text-amber-500 font-semibold">5 star</span>
            </span>
          </div>
        </div>

        {/* View Mode Switcher (Carousel vs Grid) */}
        {projects.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-md self-start sm:self-auto shadow-lg">
            <button
              type="button"
              onClick={() => setViewMode('fan')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                viewMode === 'fan'
                  ? 'bg-amber-500 text-black font-semibold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sorotan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black font-semibold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tampilkan Semua ({projects.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* When 0 projects: Display clean 'Belum memiliki project' empty state */}
      {projects.length === 0 ? (
        <div className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Belum memiliki project
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-md">
            {allProjects.length > 0
              ? 'Belum ada proyek yang di-pin ke Landing Page. Buka halaman arsip untuk melihat semua proyek, atau pin proyek dari Dashboard Admin.'
              : 'Belum ada proyek yang ditambahkan. Silakan tambahkan proyek melalui Dashboard Admin.'}
          </p>
          {allProjects.length > 0 && (
            <div className="mt-6">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:border-amber-500 transition-colors shadow-lg"
              >
                <span>Buka Halaman Arsip Proyek ({allProjects.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </Link>
            </div>
          )}
        </div>
      ) : viewMode === 'fan' ? (
        <div
          ref={carouselRef}
          className={`relative pt-2 pb-8 sm:pb-16 overflow-visible transition-opacity duration-700 will-change-transform ${
            inView || isMobile ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Desktop Fan Carousel */}
          <div className="hidden md:flex justify-center items-center min-h-[500px] px-6 sm:px-8 overflow-visible">
            <div 
              className="flex items-center justify-center relative w-full max-w-6xl overflow-visible"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {projects.slice(0, 5).map((project, idx) => {
                const total = Math.min(projects.length, 5);
                const centerIndex = Math.floor((total - 1) / 2);
                const isCenter = idx === centerIndex;
                const isInteractive = spreadProgress > 0.25;
                const isHovered = isInteractive && hoveredIndex === idx;
                const fan = getFanTransform(idx, total, spreadProgress);

                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex((prev) => (prev === idx ? null : prev))}
                    onClick={() => setSelectedProject(project)}
                    style={{
                      transform: `translateX(${fan.translateX}px) translateY(${fan.translateY}px) rotate(${fan.rotate}deg) scale(${fan.scale}) translateZ(0)`,
                      zIndex: isHovered ? 50 : (isCenter && spreadProgress > 0.7 ? 35 : fan.zIndex),
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                    }}
                    className="relative w-56 lg:w-60 h-[370px] lg:h-[410px] -mx-2.5 lg:-mx-4 rounded-[26px] cursor-pointer flex-shrink-0 will-change-transform before:absolute before:-inset-x-3 before:-top-10 before:-bottom-12 before:content-['']"
                  >
                    {/* Floating inner wrapper that handles hover lift & straightening without moving the parent hitbox */}
                    <div
                      style={{
                        transform: isHovered
                          ? `translateX(${fan.nudgeX}px) translateY(-28px) rotate(${-fan.rotate * 0.95}deg) scale(1.05) translateZ(0)`
                          : 'translateX(0px) translateY(0px) rotate(0deg) scale(1) translateZ(0)',
                        transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 280ms',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        willChange: 'transform',
                      }}
                      className="relative w-full h-full"
                    >
                      {/* Lingkaran / Encircle Highlight untuk project yang tengah (kaya diutamakan) */}
                      {isCenter && (
                        <>
                          {/* Outer ambient glow halo */}
                          <div
                            className={`absolute -inset-3.5 sm:-inset-4 rounded-[36px] lg:rounded-[38px] border border-amber-500/30 transition-all duration-500 pointer-events-none ${
                              spreadProgress < 0.4 ? 'opacity-0 scale-90' : 'opacity-100 animate-pulse'
                            }`}
                          />

                          {/* Main encircling ring */}
                          <div
                            className={`absolute -inset-2 lg:-inset-2.5 rounded-[32px] lg:rounded-[34px] border-2 border-amber-500 transition-all duration-300 pointer-events-none shadow-[0_0_30px_rgba(245,158,11,0.55),inset_0_0_15px_rgba(245,158,11,0.2)] ${
                              spreadProgress < 0.4 ? 'opacity-0 scale-90' : 'opacity-100 ring-2 ring-amber-400/40'
                            }`}
                          />
                        </>
                      )}

                      {/* Inner Card Container with rounded corners & overflow hidden */}
                      <div
                        className={`relative w-full h-full rounded-[26px] overflow-hidden border transition-all duration-300 ${isDark
                          ? 'border-white/10 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
                          : 'border-black/10 bg-white shadow-[0_20px_45px_rgba(0,0,0,0.12)]'
                          } ${isHovered
                            ? 'border-amber-500 shadow-[0_20px_45px_rgba(245,158,11,0.38)] ring-2 ring-amber-500/50'
                            : isCenter
                              ? 'border-amber-500/70 shadow-amber-950/40'
                              : ''
                          }`}
                      >
                        {/* Background Preview Image */}
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Top Category Badge */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-sm text-zinc-300 border border-white/10">
                            {project.category}
                          </span>
                          {project.year && (
                            <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                              {project.year}
                            </span>
                          )}
                        </div>

                        {/* Bottom Card Content */}
                        <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col gap-1.5">
                          <h3 className="font-bold text-base leading-snug drop-shadow">
                            {project.title}
                          </h3>

                          <p className="text-xs text-zinc-300 line-clamp-2 opacity-85">
                            {project.description}
                          </p>

                          {/* Tag list */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.tags.slice(0, 2).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-zinc-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action link */}
                          <div className="pt-2 flex items-center justify-between text-xs text-amber-500 font-medium">
                            <span>Lihat Rincian</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Swipeable Card Carousel */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="md:hidden flex overflow-x-auto gap-4 px-4 py-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {projects.map((project, idx) => {
              const isActive = idx === activeMobileIndex;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    filter: !inView && !isMobile ? 'blur(4px)' : 'none',
                    opacity: !inView && !isMobile ? 0 : 1,
                    transform: !inView && !isMobile
                      ? 'translateY(60px)'
                      : isHovered
                      ? 'translateY(-6px) scale(1.02)'
                      : 'translateY(0px)',
                    transitionProperty: 'transform, filter, opacity',
                    transitionDuration: '400ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="snap-center flex-shrink-0 w-[80vw] max-w-[290px] h-[390px] relative cursor-pointer select-none"
                >
                  {/* Glowing border indicator on active card */}
                  {isActive && (
                    <div className="absolute -inset-1.5 rounded-[22px] border-2 border-amber-500 pointer-events-none shadow-[0_0_24px_rgba(245,158,11,0.55)] z-10" />
                  )}

                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 ${
                      isDark
                        ? 'border-white/10 bg-[#050505]'
                        : 'border-black/10 bg-white'
                    } ${isActive ? 'border-amber-500/80 ring-1 ring-amber-500/40' : ''}`}
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/75 backdrop-blur-sm text-zinc-200 border border-white/15">
                        {project.category}
                      </span>
                      {project.year && (
                        <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                          {project.year}
                        </span>
                      )}
                    </div>

                    {/* Bottom Card Content */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white flex flex-col gap-1.5">
                      <h3 className="font-bold text-sm leading-snug drop-shadow line-clamp-1">{project.title}</h3>
                      <p className="text-xs text-zinc-300 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {project.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/10 text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs text-amber-500 font-medium">
                        <span>Lihat Rincian</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Navigation Controls & Dots */}
          <div className="md:hidden mt-4 flex flex-col items-center gap-3">
            {/* Arrows & Counter */}
            <div className="flex items-center justify-between w-full max-w-[320px] px-2">
              <button
                type="button"
                onClick={() => scrollMobileTo(Math.max(0, activeMobileIndex - 1))}
                disabled={activeMobileIndex === 0}
                aria-label="Proyek sebelumnya"
                className="p-2 rounded-full border border-white/15 bg-zinc-900/90 text-zinc-200 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-500/50 hover:text-white transition-all shadow-md active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-mono text-zinc-200 font-medium">
                  Proyek <span className="text-amber-500 font-bold">{activeMobileIndex + 1}</span> dari <span className="font-bold">{projects.length}</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-normal truncate max-w-[180px]">
                  {projects[activeMobileIndex]?.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => scrollMobileTo(Math.min(projects.length - 1, activeMobileIndex + 1))}
                disabled={activeMobileIndex === projects.length - 1}
                aria-label="Proyek selanjutnya"
                className="p-2 rounded-full border border-white/15 bg-zinc-900/90 text-zinc-200 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-500/50 hover:text-white transition-all shadow-md active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 py-0.5">
              {projects.map((p, i) => (
                <button
                  key={p.id || i}
                  type="button"
                  onClick={() => scrollMobileTo(i)}
                  aria-label={`Buka proyek ${i + 1}: ${p.title}`}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    i === activeMobileIndex
                      ? 'w-7 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Quick Switch to Grid view for users who want all projects at once */}
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tampilkan Semua {projects.length} Proyek Sekaligus (Grid)</span>
            </button>
          </div>

          {/* Link ke Halaman Semua Proyek */}
          <div
            className={`mt-14 flex flex-col items-center justify-center gap-2.5 transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] delay-300 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
          >
            <Link
              href="/projects"
              style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
              className="btn-fill-effect group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-zinc-950/80 text-zinc-100 text-xs sm:text-sm font-mono tracking-wider hover:text-white hover:border-amber-500/50 shadow-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <span>Lihat Semua Proyek</span>
              <ArrowRight className="h-4 w-4 text-amber-500 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] font-mono text-zinc-500 text-center">
              Lihat rilis terbaru format persegi panjang &amp; arsip grid lengkap
            </span>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedProject(project)}
                  className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl ${
                    isDark
                      ? 'bg-[#080808] border-white/10 hover:border-amber-500/50'
                      : 'bg-white border-zinc-200 hover:border-amber-500 shadow-sm'
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/75 backdrop-blur-sm text-zinc-200 border border-white/15">
                        {project.category}
                      </span>
                      {project.year && (
                        <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                          {project.year}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2.5">
                    <h3 className={`text-base font-bold tracking-tight line-clamp-1 ${isDark ? 'text-zinc-100 group-hover:text-amber-400' : 'text-zinc-900 group-hover:text-amber-600'} transition-colors`}>
                      {project.title}
                    </h3>

                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            isDark ? 'bg-white/5 text-zinc-300 border border-white/10' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-amber-500 font-medium">
                      <span>Lihat Rincian</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Link ke Halaman Semua Proyek */}
          <div className="flex flex-col items-center justify-center gap-2.5">
            <Link
              href="/projects"
              style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
              className="btn-fill-effect group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-zinc-950/80 text-zinc-100 text-xs sm:text-sm font-mono tracking-wider hover:text-white hover:border-amber-500/50 shadow-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <span>Buka Arsip Lengkap Proyek ({allProjects.length})</span>
              <ArrowRight className="h-4 w-4 text-amber-500 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] font-mono text-zinc-500 text-center">
              Lihat rilis terbaru format persegi panjang &amp; filter kategori lengkap
            </span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
