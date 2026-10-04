'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { Moon, Sun, Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  isClosed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isClosed = false }) => {
  const { theme, toggleTheme, data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <>
      <header
        className={`fixed top-4 left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8 z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${isClosed
          ? isDark
            ? 'bg-[#060606]/95 text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md'
            : 'bg-white/95 text-zinc-900 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md'
          : 'bg-black/30 text-white border border-white/15 backdrop-blur-md'
          }`}
      >
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs border border-white/10">
            {data.hero.title.charAt(0) || 'B'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-xs sm:text-sm leading-none">
              {data.hero.title || 'baliqDev'}
            </span>
            <span className="text-[9px] tracking-wider uppercase text-zinc-400 font-mono">
              PORTFOLIO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium">
          <a
            href="/#hero"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Beranda
          </a>
          <a
            href="/#projects"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Proyek
          </a>
          <a
            href="/#tech"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Teknologi
          </a>
          <a
            href="/#rating"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Rating
          </a>
          <a
            href="/#contact"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Kontak
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
            className="btn-fill-effect p-2 rounded-xl text-zinc-400 hover:text-white border border-transparent hover:border-amber-500/40 transition-all cursor-pointer"
            title={`Ubah ke mode ${isDark ? 'terang' : 'gelap'}`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Admin Page Quick Access Link */}
          <Link
            href="/admin"
            style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
            className="btn-fill-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white border border-white/10 hover:border-amber-500/40 bg-white/[0.04] transition-all"
            title="Kelola Master Data / Admin"
          >
            <Shield className="h-3 w-3 text-amber-500" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
            className="btn-fill-effect md:hidden p-2 rounded-xl text-zinc-400 hover:text-white border border-transparent hover:border-amber-500/40 transition-all cursor-pointer"
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

            <nav className="flex flex-col gap-2 font-medium text-sm">
              <a
                href="/#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Beranda
              </a>
              <a
                href="/#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Proyek (Arc)
              </a>
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>Semua Proyek (Grid)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Arsip</span>
              </Link>
              <a
                href="/#tech"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Teknologi
              </a>
              <a
                href="/#rating"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Rating & Testimoni
              </a>
              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Kontak
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/5 text-amber-400 flex items-center justify-between text-xs font-mono mt-2"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" /> Panel Admin
                </span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
