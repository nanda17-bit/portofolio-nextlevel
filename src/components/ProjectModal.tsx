'use client';

import React from 'react';
import { ProjectItem } from '@/types/portfolio';
import { usePortfolio } from '@/context/PortfolioContext';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';
import { GithubIcon } from '@/components/SocialIcons';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { theme } = usePortfolio();
  const isDark = theme === 'dark';

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0f111a] border-white/15 text-white shadow-black/80'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-900">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{ '--btn-fill-bg': '#dc2626' } as React.CSSProperties}
            className="btn-fill-effect absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:text-white border border-white/10 hover:border-red-500/50 transition-all backdrop-blur-sm cursor-pointer"
            aria-label="Tutup Detail"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Category & Year badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-black shadow-md">
              {project.category}
            </span>
            {project.year && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm border border-white/10 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          <div>
            <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{project.title}</h3>
            {project.subtitle && (
              <p className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'} mt-1`}>{project.subtitle}</p>
            )}
          </div>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-col gap-2 pt-2">
            <span className={`text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <Tag className={`h-3.5 w-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} /> Teknologi yang Digunakan:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-lg text-xs font-medium font-mono ${
                    isDark
                      ? 'bg-white/10 text-zinc-200 border border-white/10'
                      : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className={`flex items-center gap-3 pt-4 border-t mt-2 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--btn-fill-bg': '#ffffff' } as React.CSSProperties}
                className="btn-fill-effect flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:text-black text-white font-medium text-sm border border-transparent hover:border-white shadow-md transition-all cursor-pointer"
              >
                <span>Lihat Live Demo</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
                className={`btn-fill-effect flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm hover:text-white hover:border-amber-500/50 transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/20 bg-white/5 text-white'
                    : 'border-zinc-300 bg-zinc-100 text-zinc-800'
                }`}
              >
                <GithubIcon className="h-4 w-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
