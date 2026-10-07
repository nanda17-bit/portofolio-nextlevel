'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ArrowUp } from 'lucide-react';
import { SocialPlatformIcon, getSocialPlatformDetails } from '@/components/SocialIcons';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const activeSocials = React.useMemo(() => {
    const contact = data?.contact;
    if (Array.isArray(contact?.socialLinks) && contact.socialLinks.length > 0) {
      return contact.socialLinks
        .filter((item) => item.enabled !== false && item.url && item.url.trim() !== '')
        .map((item) => ({
          platform: item.platform,
          name: item.name || item.platform,
          url: item.url,
        }));
    }

    if (contact?.socials && typeof contact.socials === 'object') {
      return Object.entries(contact.socials)
        .filter(([_, url]) => Boolean(url && typeof url === 'string' && url.trim() !== ''))
        .map(([platform, url]) => ({
          platform,
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: url as string,
        }));
    }

    return [];
  }, [data?.contact?.socialLinks, data?.contact?.socials]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-zinc-300">
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
          <span>•</span>
          <span className="font-mono">
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Dynamic Social Media Links */}
        {activeSocials.length > 0 && (
          <div className="flex items-center gap-3 text-zinc-400 flex-wrap justify-center">
            {activeSocials.map((item, idx) => {
              const details = getSocialPlatformDetails(item.platform);
              return (
                <a
                  key={`${item.platform}-${idx}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${details.textColor} transition-colors p-1 hover:scale-110 transition-transform`}
                  title={item.name}
                >
                  <SocialPlatformIcon platform={item.platform} size={15} />
                </a>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-6">
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
