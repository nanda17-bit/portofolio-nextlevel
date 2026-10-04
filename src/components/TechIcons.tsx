import React from 'react';

interface TechIconProps {
  iconKey: string;
  className?: string;
  size?: number;
}

export const TechIcon: React.FC<TechIconProps> = ({ iconKey, className = '', size = 24 }) => {
  const normalizedKey = iconKey.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalizedKey) {
    case 'typescript':
    case 'ts':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path d="M12.5 13.5H10.5V19H8.5V13.5H6.5V11.8H12.5V13.5Z" fill="white" />
          <path d="M14.5 17.2C14.9 17.5 15.5 17.7 16.2 17.7C17.1 17.7 17.6 17.3 17.6 16.6C17.6 16 17.2 15.6 16.2 15.3L15.4 15C14 14.5 13.3 13.7 13.3 12.5C13.3 11.1 14.5 10 16.3 10C17.2 10 18.1 10.3 18.7 10.7L18.1 12.2C17.6 11.9 16.9 11.7 16.2 11.7C15.5 11.7 15.1 12.1 15.1 12.6C15.1 13.1 15.5 13.5 16.4 13.8L17.2 14.1C18.7 14.6 19.5 15.4 19.5 16.7C19.5 18.2 18.3 19.3 16.3 19.3C15.2 19.3 14.1 18.9 13.4 18.4L14.5 17.2Z" fill="white" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path d="M12.5 17.4C12.5 18.6 11.6 19.2 10.3 19.2C9.2 19.2 8.4 18.7 7.9 18.1L8.9 16.8C9.3 17.3 9.8 17.6 10.4 17.6C10.9 17.6 11.2 17.4 11.2 16.9V11.2H12.5V17.4Z" fill="#000" />
          <path d="M14.5 17.2C14.9 17.5 15.5 17.7 16.2 17.7C17.1 17.7 17.6 17.3 17.6 16.6C17.6 16 17.2 15.6 16.2 15.3L15.4 15C14 14.5 13.3 13.7 13.3 12.5C13.3 11.1 14.5 10 16.3 10C17.2 10 18.1 10.3 18.7 10.7L18.1 12.2C17.6 11.9 16.9 11.7 16.2 11.7C15.5 11.7 15.1 12.1 15.1 12.6C15.1 13.1 15.5 13.5 16.4 13.8L17.2 14.1C18.7 14.6 19.5 15.4 19.5 16.7C19.5 18.2 18.3 19.3 16.3 19.3C15.2 19.3 14.1 18.9 13.4 18.4L14.5 17.2Z" fill="#000" />
        </svg>
      );

    case 'react':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        </svg>
      );

    case 'nextjs':
    case 'next':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 7.5V16.5M7 7.5L16.5 18M17 7.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'python':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M11.8 3C8.5 3 8.7 4.4 8.7 4.4L8.7 5.9H12.2V6.4H5.8C5.8 6.4 3 6.1 3 9.4C3 12.8 4.7 12.6 4.7 12.6H6.1V10.8C6.1 8.8 7.8 8.8 7.8 8.8H12.1C12.1 8.8 13.8 8.9 13.8 7.3V4.5C13.8 4.5 14 3 11.8 3ZM10.4 4.3C10.8 4.3 11.2 4.6 11.2 5.1C11.2 5.5 10.8 5.8 10.4 5.8C10 5.8 9.6 5.5 9.6 5.1C9.6 4.6 10 4.3 10.4 4.3Z" fill="#3776AB" />
          <path d="M12.2 21C15.5 21 15.3 19.6 15.3 19.6L15.3 18.1H11.8V17.6H18.2C18.2 17.6 21 17.9 21 14.6C21 11.2 19.3 11.4 19.3 11.4H17.9V13.2C17.9 15.2 16.2 15.2 16.2 15.2H11.9C11.9 15.2 10.2 15.1 10.2 16.7V19.5C10.2 19.5 10 21 12.2 21ZM13.6 19.7C13.2 19.7 12.8 19.4 12.8 18.9C12.8 18.5 13.2 18.2 13.6 18.2C14 18.2 14.4 18.5 14.4 18.9C14.4 19.4 14 19.7 13.6 19.7Z" fill="#FFD43B" />
        </svg>
      );

    case 'golang':
    case 'go':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#00ADD8" />
          <path d="M5 12C5 8.7 7.7 6 11 6C13.4 6 15.4 7.4 16.3 9.4H13.8C13.1 8.5 12.1 8 11 8C8.8 8 7 9.8 7 12C7 14.2 8.8 16 11 16C12.3 16 13.4 15.3 14 14.2H11V12.2H16.8C16.9 12.7 17 13.2 17 13.7C17 17.2 14.3 20 11 20C7.7 20 5 17.3 5 12Z" fill="white" />
        </svg>
      );

    case 'nodejs':
    case 'node':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2L21 7.2V17.6L12 22.8L3 17.6V7.2L12 2Z" fill="#339933" />
          <path d="M12 4.2L19.2 8.4V16.8L12 21L4.8 16.8V8.4L12 4.2Z" fill="#205A20" />
          <path d="M10.2 9V15.5L12 16.5L13.8 15.5V11.2L16 12.5V10.2L12 7.8L10.2 9Z" fill="white" />
        </svg>
      );

    case 'tailwind':
    case 'tailwindcss':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 10C7.5 7.5 9.5 6.5 12 7C14.5 7.5 15.5 9 17 9.5C18.5 10 20 9 21.5 7C20 9.5 18 10.5 15.5 10C13 9.5 12 8 10.5 7.5C9 7 7.5 8 6 10ZM2.5 16C4 13.5 6 12.5 8.5 13C11 13.5 12 15 13.5 15.5C15 16 16.5 15 18 13C16.5 15.5 14.5 16.5 12 16C9.5 15.5 8.5 14 7 13.5C5.5 13 4 14 2.5 16Z" fill="#06B6D4" />
        </svg>
      );

    case 'postgres':
    case 'postgresql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 3C8 3 5 5.5 5 9C5 12 7 13.5 8 15V19C8 20.1 8.9 21 10 21H14C15.1 21 16 20.1 16 19V15C17 13.5 19 12 19 9C19 5.5 16 3 12 3Z" fill="#336791" />
          <path d="M10 9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9V14H10V9Z" fill="white" fillOpacity="0.8" />
        </svg>
      );

    case 'docker':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M22.5 10.5C22 10.5 21.2 10.8 20.6 11.3C19.8 9.5 18.2 8.3 16.2 8.2L16 7.5C15.7 6.4 14.8 5.7 13.7 5.7H13.5C13.5 5.7 13.3 5.7 13.1 5.8V7.5H15.1L15.3 8.3C13.8 8.4 12.5 9.1 11.7 10.3H3.2C2.5 10.3 2 10.8 2 11.5C2 15.8 5.4 19.3 9.7 19.3C15.5 19.3 20.3 15.3 21.3 9.8C21.8 10.2 22.3 10.5 22.5 10.5Z" fill="#2496ED" />
          <rect x="5.5" y="8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
          <rect x="8" y="8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
          <rect x="8" y="5.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
          <rect x="10.5" y="8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
          <rect x="10.5" y="5.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
        </svg>
      );

    case 'redis':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 8L12 4L21 8L12 12L3 8Z" fill="#DC382D" />
          <path d="M3 12L12 16L21 12L12 8L3 12Z" fill="#A82820" />
          <path d="M3 16L12 20L21 16L12 12L3 16Z" fill="#751813" />
        </svg>
      );

    case 'rust':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="8" stroke="#DEA584" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M9 16V8H13C14.5 8 15.5 9 15.5 10.5C15.5 11.6 14.8 12.5 13.8 12.8L16 16H14L12.2 13.2H10.5V16H9ZM10.5 11.7H12.8C13.5 11.7 14 11.2 14 10.6C14 10 13.5 9.5 12.8 9.5H10.5V11.7Z" fill="#DEA584" />
        </svg>
      );

    case 'graphql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="#E10098" strokeWidth="1.5" fill="none" />
          <polygon points="12,6.5 17,9.5 17,14.5 12,17.5 7,14.5 7,9.5" stroke="#E10098" strokeWidth="1" fill="none" />
          <circle cx="12" cy="3" r="2" fill="#E10098" />
          <circle cx="20" cy="7.5" r="2" fill="#E10098" />
          <circle cx="20" cy="16.5" r="2" fill="#E10098" />
          <circle cx="12" cy="21" r="2" fill="#E10098" />
          <circle cx="4" cy="16.5" r="2" fill="#E10098" />
          <circle cx="4" cy="7.5" r="2" fill="#E10098" />
        </svg>
      );

    case 'kubernetes':
    case 'k8s':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <polygon points="12,2 21,7.2 21,17.2 12,22.4 3,17.2 3,7.2" stroke="#326CE5" strokeWidth="1.5" fill="#326CE5" fillOpacity="0.2" />
          <circle cx="12" cy="12.2" r="3.5" fill="#326CE5" />
          <line x1="12" y1="5" x2="12" y2="8.7" stroke="white" strokeWidth="1.5" />
          <line x1="18.2" y1="8.6" x2="15" y2="10.5" stroke="white" strokeWidth="1.5" />
          <line x1="18.2" y1="15.8" x2="15" y2="13.9" stroke="white" strokeWidth="1.5" />
          <line x1="12" y1="19.4" x2="12" y2="15.7" stroke="white" strokeWidth="1.5" />
          <line x1="5.8" y1="15.8" x2="9" y2="13.9" stroke="white" strokeWidth="1.5" />
          <line x1="5.8" y1="8.6" x2="9" y2="10.5" stroke="white" strokeWidth="1.5" />
        </svg>
      );

    case 'git':
    case 'github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M19.4 10.8L13.2 4.6C12.4 3.8 11.2 3.8 10.4 4.6L8.8 6.2L11 8.4C11.6 8.2 12.3 8.3 12.8 8.8C13.3 9.3 13.5 10 13.2 10.6L15.3 12.7C15.9 12.4 16.7 12.6 17.2 13.1C17.9 13.8 17.9 15 17.2 15.7C16.5 16.4 15.3 16.4 14.6 15.7C14.1 15.2 14 14.4 14.2 13.8L12.3 11.9V16.3C12.5 16.5 12.6 16.8 12.6 17.1C12.6 18.2 11.7 19.1 10.6 19.1C9.5 19.1 8.6 18.2 8.6 17.1C8.6 16.2 9.2 15.4 10.1 15.2V10.7C9.2 10.5 8.6 9.7 8.6 8.8C8.6 8.5 8.7 8.2 8.9 7.9L7.2 6.2L4.6 8.8C3.8 9.6 3.8 10.8 4.6 11.6L10.8 17.8C11.6 18.6 12.8 18.6 13.6 17.8L19.4 12C20.2 11.2 20.2 12 19.4 10.8Z" fill="#F05032" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
};
