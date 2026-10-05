'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { usePortfolio } from '@/context/PortfolioContext';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface HeaderProps {
  isClosed?: boolean;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Beranda', href: '/#hero' },
  { id: 'projects', label: 'Proyek', href: '/#projects' },
  { id: 'tech', label: 'Teknologi', href: '/#tech' },
  { id: 'titikSpotify', label: 'Spotify', href: '/#titikSpotify' },
  { id: 'rating', label: 'Rating', href: '/#rating' },
  { id: 'contact', label: 'Kontak', href: '/#contact' },
];

export const Header: React.FC<HeaderProps> = ({ isClosed = false }) => {
  const { theme, toggleTheme, data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const pathname = usePathname();
  const isDark = theme === 'dark';

  // Scroll-spy to automatically track and update active navigation item
  useEffect(() => {
    if (pathname === '/projects') {
      setActiveSection('projects');
      return;
    }
    if (pathname === '/admin') {
      setActiveSection('admin');
      return;
    }
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'projects', 'tech', 'titikSpotify', 'rating', 'contact'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom reached check: automatically highlight contact
      if (windowHeight + scrollY >= docHeight - 100) {
        setActiveSection('contact');
        return;
      }

      // Top reached check: highlight hero
      if (scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // Find section currently occupying the top-third of viewport
      const targetOffset = 220;
      let current = 'hero';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetOffset) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      if (pathname === '/') {
        e.preventDefault();
        setActiveSection(id);
        if (id === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(id);
          if (element) {
            const yOffset = -70;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }
    },
    [pathname]
  );

  // Liquid glass when curtain is open above hero photo; Solid when curtain is closed over content
  const isLiquidGlass = !isClosed;

  const headerContainerClass = isLiquidGlass
    ? isDark
      ? 'bg-black/30 border-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl'
      : 'bg-white/20 border-white/40 text-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl'
    : isDark
      ? 'bg-[#060606]/95 border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md'
      : 'bg-white/95 border-zinc-200/90 text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md';

  return (
    <>
      <header
        className={`fixed top-4 left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8 z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl border transition-all duration-300 ${headerContainerClass}`}
      >
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/profil.jpeg"
            alt="Logo baliqDev"
            width={28}
            height={28}
            priority
            className="h-7 w-7 rounded-lg object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span
              className={`font-bold tracking-tight text-xs sm:text-sm leading-none transition-colors ${
                isLiquidGlass || isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {(() => {
                const title = data.hero.title || 'baliqDev';
                const match = title.match(/^(.*)(dev)$/i);
                if (match) {
                  return (
                    <>
                      {match[1]}
                      <span className="text-amber-500">{match[2]}</span>
                    </>
                  );
                }
                return title;
              })()}
            </span>
            <span
              className={`text-[9px] tracking-wider uppercase font-mono transition-colors ${
                isLiquidGlass ? 'text-white/70' : isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              PORTFOLIO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Adaptive Text Colors & Underline */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative py-1.5 transition-colors duration-200 ${
                  isLiquidGlass
                    ? isActive
                      ? 'text-white font-bold drop-shadow-sm'
                      : 'text-white/80 hover:text-white'
                    : isDark
                      ? isActive
                        ? 'text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                      : isActive
                        ? 'text-zinc-950 font-bold'
                        : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>{item.label}</span>
                {/* Underline Indicator */}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                      isLiquidGlass
                        ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                        : isDark
                          ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                          : 'bg-zinc-950 shadow-[0_0_6px_rgba(0,0,0,0.25)]'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              '--btn-fill-bg': isLiquidGlass || isDark ? '#ffffff' : '#000000',
            } as React.CSSProperties}
            className={`btn-fill-effect p-2 rounded-xl transition-all cursor-pointer border ${
              isLiquidGlass
                ? 'text-white hover:text-white border-white/20 hover:border-white/50 bg-white/10'
                : isDark
                  ? 'text-zinc-400 hover:text-white border-transparent hover:border-white/40'
                  : 'text-zinc-600 hover:text-zinc-950 border-transparent hover:border-zinc-300'
            }`}
            title={`Ubah ke mode ${isDark ? 'terang' : 'gelap'}`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              '--btn-fill-bg': isLiquidGlass || isDark ? '#ffffff' : '#000000',
            } as React.CSSProperties}
            className={`btn-fill-effect md:hidden p-2 rounded-xl transition-all cursor-pointer border ${
              isLiquidGlass
                ? 'text-white hover:text-white border-white/20 bg-white/10'
                : isDark
                  ? 'text-zinc-400 hover:text-white border-transparent hover:border-white/40'
                  : 'text-zinc-600 hover:text-zinc-950 border-transparent hover:border-zinc-300'
            }`}
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden transition-all flex flex-col pt-24 px-6 pb-8"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`w-full rounded-2xl p-6 flex flex-col gap-4 border ${isDark
              ? 'bg-[#0a0a0a] border-white/10 text-white'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-semibold text-xs tracking-wider uppercase font-mono text-zinc-400">
                Menu Navigasi
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 font-medium text-sm">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id && pathname === '/';
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between py-3 px-1 border-b transition-colors ${
                      isActive
                        ? isDark
                          ? 'text-white font-semibold border-white'
                          : 'text-black font-semibold border-black'
                        : isDark
                          ? 'border-white/10 text-zinc-400 hover:text-white'
                          : 'border-zinc-200 text-zinc-500 hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Aktif
                      </span>
                    )}
                  </a>
                );
              })}

              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 px-1 border-b transition-colors ${
                  pathname === '/projects'
                    ? isDark
                      ? 'text-white font-semibold border-white'
                      : 'text-black font-semibold border-black'
                    : isDark
                      ? 'border-white/10 text-zinc-400 hover:text-white'
                      : 'border-zinc-200 text-zinc-500 hover:text-black'
                }`}
              >
                <span>Semua Proyek (Grid)</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-black/10 text-black border-black/20'
                  }`}
                >
                  Arsip
                </span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
