import React from 'react';

interface SocialIconProps {
  className?: string;
  size?: number;
}

export const GithubIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const LinkedinIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const InstagramIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const TwitterIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const TelegramIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const YoutubeIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export const TiktokIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const DiscordIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6h0a14.5 14.5 0 0 0-4-1.3 9.7 9.7 0 0 0-.5 1A13.8 13.8 0 0 0 10.5 5.7 9.7 9.7 0 0 0 10 4.7 14.5 14.5 0 0 0 6 6C3.5 10 3 14 3.3 18a14.7 14.7 0 0 0 4.5 2.3c.4-.5.7-1.1 1-1.7a9.5 9.5 0 0 1-1.6-.8l.4-.3c3.1 1.4 6.5 1.4 9.6 0l.4.3a9.5 9.5 0 0 1-1.6.8c.3.6.6 1.2 1 1.7A14.7 14.7 0 0 0 20.7 18C21.1 13.6 20 9.8 18 6z" />
    <circle cx="8.5" cy="12" r="1.5" />
    <circle cx="15.5" cy="12" r="1.5" />
  </svg>
);

export const WebsiteIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const WhatsappIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const FacebookIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const ThreadsIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 13.5c-.7.7-1.7 1.1-2.8 1.1-2.1 0-3.6-1.5-3.6-3.6 0-2.2 1.6-3.6 3.8-3.6 1.7 0 2.8.9 3.2 2.2h-1.5c-.3-.6-.8-1-1.7-1-1.3 0-2.2.9-2.2 2.4s.9 2.4 2.2 2.4c.7 0 1.2-.2 1.6-.7v.8z" />
  </svg>
);

export const GitlabIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 13.29-1.32-4.06a.79.79 0 0 0-1.5 0L17.85 13.3H6.15L4.82 9.23a.79.79 0 0 0-1.5 0L2 13.29a1.67 1.67 0 0 0 .61 1.86L12 22l9.39-6.85a1.67 1.67 0 0 0 .61-1.86Z" />
  </svg>
);

export const CustomLinkIcon: React.FC<SocialIconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const getSocialPlatformDetails = (platform: string) => {
  const p = (platform || '').toLowerCase().trim();
  switch (p) {
    case 'github':
      return { icon: GithubIcon, name: 'GitHub', color: '#d97706', hoverBorder: 'hover:border-amber-500/40', textColor: 'text-zinc-300 hover:text-amber-400' };
    case 'linkedin':
      return { icon: LinkedinIcon, name: 'LinkedIn', color: '#0a66c2', hoverBorder: 'hover:border-blue-500/40', textColor: 'text-blue-500 hover:text-blue-400' };
    case 'instagram':
      return { icon: InstagramIcon, name: 'Instagram', color: '#e1306c', hoverBorder: 'hover:border-pink-500/40', textColor: 'text-pink-500 hover:text-pink-400' };
    case 'twitter':
    case 'x':
      return { icon: TwitterIcon, name: 'Twitter / X', color: '#1d9bf0', hoverBorder: 'hover:border-sky-500/40', textColor: 'text-sky-400 hover:text-sky-300' };
    case 'whatsapp':
    case 'wa':
      return { icon: WhatsappIcon, name: 'WhatsApp', color: '#25d366', hoverBorder: 'hover:border-emerald-500/40', textColor: 'text-emerald-400 hover:text-emerald-300' };
    case 'telegram':
      return { icon: TelegramIcon, name: 'Telegram', color: '#229ed9', hoverBorder: 'hover:border-sky-400/40', textColor: 'text-sky-400 hover:text-sky-300' };
    case 'youtube':
      return { icon: YoutubeIcon, name: 'YouTube', color: '#ff0000', hoverBorder: 'hover:border-red-500/40', textColor: 'text-red-500 hover:text-red-400' };
    case 'tiktok':
      return { icon: TiktokIcon, name: 'TikTok', color: '#ff0050', hoverBorder: 'hover:border-pink-500/40', textColor: 'text-pink-400 hover:text-pink-300' };
    case 'discord':
      return { icon: DiscordIcon, name: 'Discord', color: '#5865f2', hoverBorder: 'hover:border-indigo-500/40', textColor: 'text-indigo-400 hover:text-indigo-300' };
    case 'website':
    case 'web':
    case 'portofolio':
      return { icon: WebsiteIcon, name: 'Website Pribadi', color: '#10b981', hoverBorder: 'hover:border-emerald-500/40', textColor: 'text-emerald-400 hover:text-emerald-300' };
    case 'facebook':
    case 'fb':
      return { icon: FacebookIcon, name: 'Facebook', color: '#1877f2', hoverBorder: 'hover:border-blue-600/40', textColor: 'text-blue-500 hover:text-blue-400' };
    case 'threads':
      return { icon: ThreadsIcon, name: 'Threads', color: '#ffffff', hoverBorder: 'hover:border-zinc-400/40', textColor: 'text-zinc-200 hover:text-white' };
    case 'gitlab':
      return { icon: GitlabIcon, name: 'GitLab', color: '#fc6d26', hoverBorder: 'hover:border-orange-500/40', textColor: 'text-orange-400 hover:text-orange-300' };
    default:
      return { icon: CustomLinkIcon, name: platform || 'Tautan', color: '#f59e0b', hoverBorder: 'hover:border-amber-500/40', textColor: 'text-amber-400 hover:text-amber-300' };
  }
};

export const SocialPlatformIcon: React.FC<{ platform: string; className?: string; size?: number }> = ({ platform, className, size = 18 }) => {
  const details = getSocialPlatformDetails(platform);
  const IconComponent = details.icon;
  return <IconComponent className={className} size={size} />;
};
