'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ArrowUp, Shield } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-zinc-300">
            {data.hero.title}
          </span>
          <span>•</span>
          <span className="font-mono">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-zinc-300 flex items-center gap-1.5 transition-colors">
            <Shield className="h-3 w-3 text-amber-500" />
            <span>Master Data</span>
          </Link>
          <a href="/#projects" className="hover:text-zinc-300 transition-colors">
            Proyek
          </a>
          <a href="/#tech" className="hover:text-zinc-300 transition-colors">
            Teknologi
          </a>
          <a href="/#contact" className="hover:text-zinc-300 transition-colors">
            Kontak
          </a>
        </div>

        <button
          onClick={scrollToTop}
          style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
          className="btn-fill-effect p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-amber-500/40 bg-white/5 transition-all cursor-pointer"
          title="Ke Atas"
          aria-label="Back to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  );
};
