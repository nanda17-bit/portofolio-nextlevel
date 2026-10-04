'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioData, HeroData, ProjectItem, TechStackItem, ContactData, ContactMessage } from '@/types/portfolio';
import { DEFAULT_PORTFOLIO_DATA } from '@/data/defaultData';

interface PortfolioContextType {
  data: PortfolioData;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  updateHero: (hero: HeroData) => void;
  setProjects: (projects: ProjectItem[]) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  setTechStack: (tech: TechStackItem[]) => void;
  addTech: (tech: Omit<TechStackItem, 'id'>) => void;
  updateTech: (id: string, tech: Partial<TechStackItem>) => void;
  deleteTech: (id: string) => void;
  updateContact: (contact: ContactData) => void;
  submitMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  resetToDefault: () => void;
  isHydrated: boolean;
}

const STORAGE_KEY = 'baliqdev_store_v4';
const THEME_KEY = 'baliqdev_theme_v4';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Clear legacy storage keys if present
      if (typeof window !== 'undefined') {
        localStorage.removeItem('iqbal_portfolio_data_v1');
        localStorage.removeItem('portfolio_data_v1');
        localStorage.removeItem('portfolio_data_v3');
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData({
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          hero: {
            ...DEFAULT_PORTFOLIO_DATA.hero,
            ...(parsed.hero || {}),
            // Always respect hardcoded title from DEFAULT_PORTFOLIO_DATA if user updated it
            title: DEFAULT_PORTFOLIO_DATA.hero.title,
          },
          contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
          projects: parsed.projects?.length ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
          techStack: parsed.techStack?.length ? parsed.techStack : DEFAULT_PORTFOLIO_DATA.techStack,
          messages: parsed.messages || DEFAULT_PORTFOLIO_DATA.messages,
        });
      } else {
        setData(DEFAULT_PORTFOLIO_DATA);
      }

      const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme('dark');
      }
    } catch (e) {
      console.warn('Failed to load local storage data:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when data changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data to local storage:', e);
    }
  }, [data, isHydrated]);

  // Handle HTML document theme class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateHero = (hero: HeroData) => {
    setData((prev) => ({ ...prev, hero }));
  };

  const setProjects = (projects: ProjectItem[]) => {
    setData((prev) => ({ ...prev, projects }));
  };

  const addProject = (projectData: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
  };

  const updateProject = (id: string, updatedFields: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const setTechStack = (techStack: TechStackItem[]) => {
    setData((prev) => ({ ...prev, techStack }));
  };

  const addTech = (techData: Omit<TechStackItem, 'id'>) => {
    const newTech: TechStackItem = {
      ...techData,
      id: `tech-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      techStack: [...prev.techStack, newTech],
    }));
  };

  const updateTech = (id: string, updatedFields: Partial<TechStackItem>) => {
    setData((prev) => ({
      ...prev,
      techStack: prev.techStack.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
    }));
  };

  const deleteTech = (id: string) => {
    setData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t.id !== id),
    }));
  };

  const updateContact = (contact: ContactData) => {
    setData((prev) => ({ ...prev, contact }));
  };

  const submitMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setData((prev) => ({
      ...prev,
      messages: [newMessage, ...(prev.messages || [])],
    }));
  };

  const deleteMessage = (id: string) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id),
    }));
  };

  const markMessageRead = (id: string) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).map((m) => (m.id === id ? { ...m, read: true } : m)),
    }));
  };

  const resetToDefault = () => {
    setData(DEFAULT_PORTFOLIO_DATA);
    setTheme('dark');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(THEME_KEY, 'dark');
    } catch {
      // ignore
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        theme,
        toggleTheme,
        updateHero,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        setTechStack,
        addTech,
        updateTech,
        deleteTech,
        updateContact,
        submitMessage,
        deleteMessage,
        markMessageRead,
        resetToDefault,
        isHydrated,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
