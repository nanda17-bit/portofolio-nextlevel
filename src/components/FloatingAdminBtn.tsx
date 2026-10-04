'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Eye } from 'lucide-react';

export const FloatingAdminBtn: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Link
        href={isAdmin ? '/' : '/admin'}
        style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
        className="btn-fill-effect flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white text-[11px] font-mono shadow-xl border border-white/10 hover:border-amber-500/40 backdrop-blur-md transition-all group"
      >
        {isAdmin ? (
          <>
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Lihat Portofolio</span>
            <span className="sm:hidden">Portofolio</span>
          </>
        ) : (
          <>
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Data Master / Admin</span>
            <span className="sm:hidden">Admin</span>
          </>
        )}
      </Link>
    </div>
  );
};
