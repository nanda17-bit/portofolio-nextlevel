'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { ProjectItem } from '@/types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ArrowRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewMode, setViewMode] = useState<'fan' | 'grid'>('fan');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [inView, setInView] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Observer khusus untuk Fan Cards Carousel agar efek fade-in dan naiknya sangat terasa saat discroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCardsInView(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const projects = data.projects || [];

  // Card fan rotations and offsets (matching image 1, dengan efek naik dari bawah)
  const getFanTransform = (
    index: number,
    total: number,
    isHovered: boolean,
    inView: boolean = true
  ) => {
    if (!inView) {
      return {
        transform: 'translateX(0px) translateY(140px) scale(0.85) rotate(0deg)',
        zIndex: 10,
      };
    }

    if (isHovered) {
      // Inward nudge for leftmost and rightmost cards so they never get cut off by side margins
      const nudgeX = index === 0 ? 20 : index === total - 1 ? -20 : 0;
      return {
        transform: `translateX(${nudgeX}px) translateY(-26px) scale(1.05) rotate(0deg)`,
        zIndex: 50,
      };
    }

    const center = (total - 1) / 2;
    const diff = index - center;

    // Angles: left negative, center 0, right positive
    const rotation = diff * 5.5; // -11deg, -5.5deg, 0deg, 5.5deg, 11deg
    const translateY = Math.abs(diff) * 16;
    const translateX = diff * -12;

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
      zIndex: 20 - Math.abs(diff),
    };
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible"
    >
      {/* Section Header - Left aligned with comfortable indent & fade in from below */}
      <div
        ref={headerRef}
        className={`mb-10 sm:mb-14 text-left px-2 sm:px-6 md:px-10 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
      >
        <h2 className={`font-montserrat font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none inline-flex items-baseline ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <span>
            <span className="text-amber-500">99+</span> Project<span
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

      {/* Fan / Arc View (with deep dramatic rise and smooth fade-in from below) */}
      {viewMode === 'fan' ? (
        <div
          ref={carouselRef}
          className={`relative pt-4 pb-16 overflow-visible transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-transform ${cardsInView
            ? 'opacity-100 translate-y-0 filter-none'
            : 'opacity-0 translate-y-48 sm:translate-y-64 scale-95 blur-sm pointer-events-none'
            }`}
        >
          {/* Desktop Fan Carousel */}
          <div className="hidden md:flex justify-center items-center min-h-[500px] px-6 sm:px-8 overflow-visible">
            <div className="flex items-center justify-center relative w-full max-w-6xl overflow-visible">
              {projects.slice(0, 5).map((project, idx) => {
                const total = Math.min(projects.length, 5);
                const centerIndex = Math.floor((total - 1) / 2);
                const isCenter = idx === centerIndex;
                const isHovered = hoveredIndex === idx;
                const isAnyHovered = hoveredIndex !== null;
                const isBlurred = isAnyHovered && !isHovered;
                const fanStyle = getFanTransform(idx, total, isHovered, cardsInView);

                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedProject(project)}
                    style={{
                      transform: isBlurred
                        ? `${fanStyle.transform} scale(0.94)`
                        : fanStyle.transform,
                      zIndex: isHovered ? 50 : (isCenter && !isAnyHovered ? 35 : fanStyle.zIndex),
                      filter: !cardsInView
                        ? 'blur(6px)'
                        : isBlurred
                          ? 'blur(4.5px) brightness(0.6)'
                          : 'none',
                      opacity: !cardsInView
                        ? 0
                        : isBlurred
                          ? 0.38
                          : 1,
                      transitionProperty: 'transform, filter, opacity, box-shadow, border-color',
                      transitionDuration: isAnyHovered ? '300ms' : '1100ms',
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: isAnyHovered ? '0ms' : `${Math.abs(idx - centerIndex) * 75}ms`,
                    }}
                    className="relative w-56 lg:w-60 h-[370px] lg:h-[410px] -mx-2.5 lg:-mx-4 rounded-[26px] cursor-pointer shadow-2xl flex-shrink-0 will-change-transform"
                  >
                    {/* Lingkaran / Encircle Highlight untuk project yang tengah (kaya diutamakan) */}
                    {isCenter && (
                      <>
                        {/* Outer ambient glow halo */}
                        <div
                          className={`absolute -inset-3.5 sm:-inset-4 rounded-[36px] lg:rounded-[38px] border border-amber-500/30 transition-all duration-500 pointer-events-none ${isBlurred ? 'opacity-20' : 'opacity-100 animate-pulse'
                            }`}
                        />

                        {/* Main encircling ring */}
                        <div
                          className={`absolute -inset-2 lg:-inset-2.5 rounded-[32px] lg:rounded-[34px] border-2 border-amber-500 transition-all duration-300 pointer-events-none shadow-[0_0_30px_rgba(245,158,11,0.55),inset_0_0_15px_rgba(245,158,11,0.2)] ${isBlurred ? 'opacity-30' : 'opacity-100 ring-2 ring-amber-400/40'
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
                          ? 'border-amber-500 shadow-[0_15px_40px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/50'
                          : isCenter
                            ? 'border-amber-500/70 shadow-amber-950/40'
                            : ''
                        }`}
                    >
                      {/* Background Preview Image */}
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                );
              })}
            </div>
          </div>

          {/* Mobile Swipeable Card Carousel */}
          <div className="md:hidden flex overflow-x-auto gap-4 px-2 py-4 no-scrollbar snap-x snap-mandatory">
            {projects.map((project, idx) => {
              const centerIndex = Math.floor((Math.min(projects.length, 5) - 1) / 2);
              const isCenter = idx === centerIndex;
              const isHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;
              const isBlurred = isAnyHovered && !isHovered;

              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    filter: !cardsInView ? 'blur(4px)' : isBlurred ? 'blur(3.5px) brightness(0.65)' : 'none',
                    opacity: !cardsInView ? 0 : isBlurred ? 0.4 : 1,
                    transform: !cardsInView ? 'translateY(60px)' : 'translateY(0px)',
                    transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 60}ms`,
                  }}
                  className="snap-center flex-shrink-0 w-[260px] h-[370px] relative cursor-pointer"
                >
                  {isCenter && (
                    <div className="absolute -inset-2 rounded-[24px] border-2 border-amber-500 pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.45)]" />
                  )}

                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden border shadow-xl ${isDark
                      ? 'border-white/10 bg-[#050505]'
                      : 'border-black/10 bg-white'
                      } ${isCenter ? 'border-amber-500/80' : ''}`}
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/70 text-zinc-300 border border-white/10">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white flex flex-col gap-1.5">
                      <h3 className="font-bold text-sm">{project.title}</h3>
                      <p className="text-xs text-zinc-300 line-clamp-2">{project.description}</p>
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

          {/* Link ke Halaman Semua Proyek */}
          <div
            className={`mt-14 flex flex-col items-center justify-center gap-2.5 transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] delay-300 will-change-transform ${cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            const isBlurred = isAnyHovered && !isHovered;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedProject(project)}
                style={{
                  filter: isBlurred ? 'blur(3px) brightness(0.7)' : 'none',
                  opacity: isBlurred ? 0.45 : 1,
                }}
                className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isDark
                  ? 'bg-[#080808] border-white/10 hover:border-amber-600/40'
                  : 'bg-white border-zinc-200 hover:border-amber-500 shadow-sm'
                  }`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/70 text-zinc-300 border border-white/10">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {project.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-white/5 text-zinc-300 border border-white/10' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
