export interface HeroData {
  badge: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  profileImageUrl?: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  pinned?: boolean;
  year?: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  iconKey: string;
  color?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  telegram?: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  bio: string;
  availability: string;
  socials: SocialLinks;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre?: string;
  duration?: string;
  color?: string;
  gradient?: string;
  coverUrl?: string;
  previewUrl: string;
  spotifyUrl?: string;
  lyrics?: string;
}

export interface PortfolioData {
  hero: HeroData;
  projects: ProjectItem[];
  techStack: TechStackItem[];
  contact: ContactData;
  messages: ContactMessage[];
  songs: SongItem[];
}
