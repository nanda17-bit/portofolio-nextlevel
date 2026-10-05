'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { ProjectItem } from '@/types/portfolio';
import { Header } from '@/components/Header';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import { Footer } from '@/components/Footer';
import { ProjectModal } from '@/components/ProjectModal';
import { GithubIcon } from '@/components/SocialIcons';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Calendar,
  Tag,
  Search,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function ProjectsPage() {
  const { data, theme } = usePortfolio();
  const isDark = theme === 'dark';
  const projects = data.projects || [];

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Produk Terbaru: 2 proyek teratas dalam bentuk persegi panjang (atas - bawah)
  const latestTwoProjects = useMemo(() => {
    return projects.slice(0, 2);
  }, [projects]);

  // Filtered projects for the grid
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory =
        activeCategory === 'all' ||
        project.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className={`min-h-screen relative flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'
      }`}>
      {/* Background Grids */}
      <BackgroundGrid />

      {/* Navigation Header */}
      <Header />

      {/* Main Page Content */}
      <main className="relative z-10 flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-xs font-mono tracking-wider transition-colors group ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <span>INDEX / PROYEK</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold">ARSIP REPOSITORI</span>
          </div>
        </div>

        {/* Page Title & Mission */}
        <div className="border-b pb-8 mb-14 border-white/10 dark:border-white/10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 block mb-2 font-semibold">
            ENGINEERING &amp; SOFTWARE ARCHITECTURE
          </span>
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-[family-name:var(--font-barlow-condensed)] ${isDark ? 'text-white' : 'text-zinc-950'
            }`}>
            Koleksi &amp; Arsip Proyek
          </h1>
          <p className={`mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
            Daftar komprehensif sistem aplikasi web, perkakas pengembang, dan arsitektur digital yang dibangun dengan penekanan pada stabilitas, performa kode, dan antarmuka modern.
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: PRODUK TERBARU (2 FOTO PERSEGI PANJANG ATAS-BAWAH) */}
        {/* ======================================================== */}
        <section className="mb-20">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-mono tracking-wider uppercase font-semibold text-zinc-300">
                PRODUK &amp; RILIS TERBARU
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Format Persegi Panjang • 2 Rilis Utama
            </span>
          </div>

          {/* 2 Persegi Panjang Atas - Bawah */}
          <div className="flex flex-col gap-8">
            {latestTwoProjects.map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={project.id}
                  className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 ${isDark
                      ? 'border-white/10 bg-[#070707] hover:border-amber-600/50 shadow-2xl'
                      : 'border-zinc-200 bg-white hover:border-amber-500 shadow-xl'
                    }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Visual Media Rectangle (7 Cols) */}
                    <div
                      onClick={() => setSelectedProject(project)}
                      className={`relative lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden cursor-pointer bg-zinc-950 ${isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}
                    >
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />

                      {/* Floating Badge on Image */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-black/80 backdrop-blur-md text-amber-400 border border-white/15">
                          RILIS #{idx === 0 ? '01 TERBARU' : '02 UNGGULAN'}
                        </span>
                        {project.year && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md border border-white/10">
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details Rectangle (5 Cols) */}
                    <div
                      className={`lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${isEven ? 'lg:order-2' : 'lg:order-1'
                        } ${isDark ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}
                    >
                      <div>
                        {/* Meta info */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-mono text-amber-500 font-semibold uppercase tracking-wider">
                            {project.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => setSelectedProject(project)}
                          className={`text-2xl sm:text-3xl font-extrabold tracking-tight cursor-pointer font-[family-name:var(--font-barlow-condensed)] transition-colors ${isDark ? 'text-white group-hover:text-amber-400' : 'text-zinc-900 group-hover:text-amber-600'
                            }`}
                        >
                          {project.title}
                        </h3>

                        {/* Subtitle */}
                        {project.subtitle && (
                          <p className="mt-1 text-xs font-mono text-zinc-400">
                            {project.subtitle}
                          </p>
                        )}

                        {/* Description */}
                        <p className={`mt-4 text-xs sm:text-sm leading-relaxed line-clamp-4 ${isDark ? 'text-zinc-300' : 'text-zinc-600'
                          }`}>
                          {project.description}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="mt-6 flex flex-wrap gap-1.5">
                          {project.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono border ${isDark
                                  ? 'bg-white/[0.04] text-zinc-300 border-white/10'
                                  : 'bg-white text-zinc-800 border-zinc-200'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons with Fill Hover Effect */}
                      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setSelectedProject(project)}
                          style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
                          className="btn-fill-effect inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white text-black hover:text-white border border-transparent hover:border-amber-500/50 shadow-sm cursor-pointer"
                        >
                          <span>Rincian Lengkap</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ '--btn-fill-bg': '#ffffff' } as React.CSSProperties}
                            className={`btn-fill-effect inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm border transition-all cursor-pointer ${isDark
                                ? 'bg-zinc-900 border-white/15 text-zinc-200 hover:text-black hover:border-white'
                                : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:text-black hover:border-zinc-900'
                              }`}
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
                            className={`btn-fill-effect inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm border hover:text-white hover:border-amber-500/50 transition-all cursor-pointer ${isDark
                                ? 'bg-white/[0.04] border-white/10 text-zinc-300'
                                : 'bg-white border-zinc-200 text-zinc-700'
                              }`}
                            title="Source Code Repository"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: GRID SEMUA PROYEK (SAMA ADA GRIDNYA) */}
        {/* ======================================================== */}
        <section id="all-grid" className="pt-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 font-[family-name:var(--font-barlow-condensed)]">
                <Layers className="h-5 w-5 text-amber-500" />
                <span>Eksplorasi Grid Proyek ({filteredProjects.length})</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Navigasi seluruh arsip perangkat lunak dan repositori
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari proyek atau teknologi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs outline-none border transition-colors ${isDark
                    ? 'bg-zinc-950 border-white/10 focus:border-amber-500/60 text-white'
                    : 'bg-zinc-50 border-zinc-200 focus:border-amber-600 text-zinc-900'
                  }`}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-4">
            <button
              onClick={() => setActiveCategory('all')}
              style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
              className={`btn-fill-effect px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${activeCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : isDark
                    ? 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
            >
              Semua ({projects.length})
            </button>
            {categories.map((cat) => {
              const count = projects.filter((p) => p.category === cat).length;
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
                  className={`btn-fill-effect px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${isActive
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : isDark
                        ? 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                    }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid Layout: 3 Columns of Cards */}
          {filteredProjects.length === 0 ? (
            <div className={`p-16 text-center rounded-2xl border ${isDark ? 'border-white/10 bg-[#080808]' : 'border-zinc-200 bg-zinc-50'
              }`}>
              <Layers className="h-8 w-8 mx-auto text-zinc-500 mb-3" />
              <p className="text-sm font-semibold">Tidak ada proyek yang sesuai filter</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-amber-500 hover:underline font-mono"
              >
                Reset Filter &amp; Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${isDark
                      ? 'bg-[#080808] border-white/10 hover:border-amber-600/50 shadow-xl shadow-black/80'
                      : 'bg-white border-zinc-200 hover:border-amber-500 shadow-md'
                    }`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-sm text-zinc-200 border border-white/10">
                          {project.category}
                        </span>
                        {project.year && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-black/60">
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col gap-2">
                      <h3 className={`text-base font-bold tracking-tight transition-colors ${isDark ? 'text-zinc-100 group-hover:text-amber-400' : 'text-zinc-900 group-hover:text-amber-600'
                        }`}>
                        {project.title}
                      </h3>

                      {project.subtitle && (
                        <p className="text-[11px] font-mono text-zinc-400 line-clamp-1">
                          {project.subtitle}
                        </p>
                      )}

                      <p className={`text-xs line-clamp-2 leading-relaxed mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>
                        {project.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${isDark
                                ? 'bg-white/5 text-zinc-300 border border-white/10'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                              }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className={`p-5 pt-3 border-t flex items-center justify-between text-xs font-medium ${isDark ? 'border-white/5 text-zinc-400' : 'border-zinc-100 text-zinc-600'
                    }`}>
                    <span className="group-hover:text-amber-500 transition-colors font-mono text-[11px]">
                      Lihat Rincian
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
