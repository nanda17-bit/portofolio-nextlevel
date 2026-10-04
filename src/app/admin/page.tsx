'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { HeroData, ProjectItem, TechStackItem, ContactData } from '@/types/portfolio';
import { TechIcon } from '@/components/TechIcons';
import {
  Shield,
  Layers,
  Sparkles,
  Terminal,
  Mail,
  Inbox,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Moon,
  Sun
} from 'lucide-react';

export default function AdminPage() {
  const {
    data,
    theme,
    toggleTheme,
    updateHero,
    addProject,
    updateProject,
    deleteProject,
    addTech,
    updateTech,
    deleteTech,
    updateContact,
    deleteMessage,
    markMessageRead,
    resetToDefault,
  } = usePortfolio();

  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'tech' | 'contact' | 'inbox'>('hero');
  const [saveToast, setSaveToast] = useState(false);

  // Hero form state
  const [heroForm, setHeroForm] = useState<HeroData>(data.hero);

  // Projects form & modal state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    subtitle: '',
    category: 'Full-Stack Web',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'TypeScript'],
    demoUrl: '',
    githubUrl: '',
    year: '2026',
  });
  const [tagsInput, setTagsInput] = useState('');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  // Tech stack form & state
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techForm, setTechForm] = useState<Omit<TechStackItem, 'id'>>({
    name: '',
    category: 'Language',
    iconKey: 'typescript',
    color: '#3178C6',
  });
  const [isTechFormOpen, setIsTechFormOpen] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactData>(data.contact);

  const showNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Preset image collections for easy one-click selection
  const imagePresets = [
    { label: 'Cyberpunk Code', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Modern Workspace', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Data Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { label: 'FinTech Graph', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Abstract AI Mesh', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Dark Cloud Server', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
  ];

  const portraitPresets = [
    { label: 'Developer Minimalist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tech Specialist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cyber Casual', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Creative Designer', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showNotification();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
    showNotification();
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : projectForm.tags;

    if (editingProjectId) {
      updateProject(editingProjectId, { ...projectForm, tags: tagsArray });
    } else {
      addProject({ ...projectForm, tags: tagsArray });
    }

    setIsProjectFormOpen(false);
    setEditingProjectId(null);
    showNotification();
  };

  const startEditProject = (p: ProjectItem) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      tags: p.tags,
      demoUrl: p.demoUrl || '',
      githubUrl: p.githubUrl || '',
      year: p.year || '2026',
    });
    setTagsInput(p.tags.join(', '));
    setIsProjectFormOpen(true);
  };

  const startAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      subtitle: '',
      category: 'Full-Stack Web',
      description: '',
      imageUrl: imagePresets[0].url,
      tags: ['Next.js', 'TypeScript'],
      demoUrl: '',
      githubUrl: '',
      year: '2026',
    });
    setTagsInput('Next.js, TypeScript, Tailwind');
    setIsProjectFormOpen(true);
  };

  const handleSaveTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTechId) {
      updateTech(editingTechId, techForm);
    } else {
      addTech(techForm);
    }
    setIsTechFormOpen(false);
    setEditingTechId(null);
    showNotification();
  };

  const startEditTech = (t: TechStackItem) => {
    setEditingTechId(t.id);
    setTechForm({
      name: t.name,
      category: t.category,
      iconKey: t.iconKey,
      color: t.color || '#3178C6',
    });
    setIsTechFormOpen(true);
  };

  const startAddTech = () => {
    setEditingTechId(null);
    setTechForm({
      name: '',
      category: 'Language',
      iconKey: 'typescript',
      color: '#3178C6',
    });
    setIsTechFormOpen(true);
  };

  const availableIconKeys = [
    'typescript', 'javascript', 'react', 'nextjs', 'python', 'golang',
    'nodejs', 'tailwind', 'postgres', 'docker', 'redis', 'rust',
    'graphql', 'kubernetes', 'git'
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#000000] text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-zinc-800 text-white font-medium text-xs border border-white/20 shadow-2xl animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Perubahan Berhasil Disimpan ke Master Data!</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-md transition-colors ${
        isDark ? 'bg-[#000000]/95 border-white/10' : 'bg-white/90 border-zinc-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800'
              }`}
              title="Kembali ke Portofolio"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-sm">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-none">
                  Master Data &amp; Panel Admin
                </h1>
                <p className="text-[11px] opacity-60 font-mono mt-0.5">
                  Kelola Konten Portofolio Secara Dinamis
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-white/10 border-white/15 text-yellow-400' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
              }`}
              title="Ubah Tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data contoh bawaan?')) {
                  resetToDefault();
                  showNotification();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-500/25 hover:opacity-95 transition-all"
            >
              <span>Lihat Portofolio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-white/10 no-scrollbar">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isDark
                ? 'bg-white/5 text-zinc-400 hover:text-white'
                : 'bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Section 1: Hero &amp; Gambar</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isDark
                ? 'bg-white/5 text-zinc-400 hover:text-white'
                : 'bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Section 2: Kartu Proyek ({data.projects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tech'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isDark
                ? 'bg-white/5 text-zinc-400 hover:text-white'
                : 'bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Section 3: Running Logo / Bahasa ({data.techStack?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isDark
                ? 'bg-white/5 text-zinc-400 hover:text-white'
                : 'bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Section 4: Kontak &amp; Sosmed</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isDark
                ? 'bg-white/5 text-zinc-400 hover:text-white'
                : 'bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Kotak Masuk Pesan ({data.messages?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: HERO SECTION */}
        {activeTab === 'hero' && (
          <form onSubmit={handleHeroSubmit} className="flex flex-col gap-6 max-w-4xl">
            <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-400" />
                <span>Pengaturan Hero Section &amp; Gambar Utama</span>
              </h2>
              <p className="text-xs opacity-60 mb-6">
                Semua teks dan latar belakang gambar di efek curtain hero dapat disesuaikan di sini.
              </p>

              <div className="flex flex-col gap-5">
                {/* Hero Title & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Nama / Judul Utama</label>
                    <input
                      type="text"
                      required
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Badge / Eyebrow Text</label>
                    <input
                      type="text"
                      required
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase opacity-75">Tagline / Sub-Headline</label>
                  <input
                    type="text"
                    required
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase opacity-75">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    className={`px-4 py-2.5 rounded-xl border text-sm outline-none resize-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Background Image URL & Presets */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-semibold uppercase opacity-75 flex items-center justify-between">
                    <span>URL Gambar Background Hero</span>
                    <span className="text-[11px] text-orange-400 lowercase font-mono">Dinamis</span>
                  </label>

                  <input
                    type="url"
                    required
                    value={heroForm.imageUrl}
                    onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />

                  {/* Preset Quick Select */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs opacity-60 self-center mr-1">Preset Cepat:</span>
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroForm({ ...heroForm, imageUrl: preset.url })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                          heroForm.imageUrl === preset.url
                            ? 'bg-orange-500 text-white border-orange-500'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Preview of Hero Background Image */}
                  <div className="mt-3 relative h-40 w-full rounded-2xl overflow-hidden border border-white/15">
                    <img
                      src={heroForm.imageUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                      <span className="text-xs font-mono text-zinc-300">
                        Pratinjau Gambar Latar Belakang Hero Saat Ini
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Photo for Tech Stack Section */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <label className="text-xs font-semibold uppercase opacity-75 flex items-center justify-between">
                    <span>Foto Profil Tengah (Section Bahasa / Tech Stack)</span>
                    <span className="text-[11px] text-orange-400 lowercase font-mono">Dinamis</span>
                  </label>
                  <p className="text-xs opacity-60">
                    Foto ini akan tampil di bagian tengah, diapit oleh setengah lingkaran bahasa pemrograman di sisi kiri dan kanan.
                  </p>

                  <input
                    type="url"
                    value={heroForm.profileImageUrl || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, profileImageUrl: e.target.value })}
                    placeholder="https://... (URL foto profil Anda)"
                    className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />

                  {/* Preset Quick Select for Profile */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs opacity-60 self-center mr-1">Preset Cepat:</span>
                    {portraitPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroForm({ ...heroForm, profileImageUrl: preset.url })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                          heroForm.profileImageUrl === preset.url
                            ? 'bg-orange-500 text-white border-orange-500'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Preview of Profile Photo */}
                  <div className="mt-3 flex items-center gap-4 p-3 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-amber-500 flex-shrink-0">
                      <img
                        src={heroForm.profileImageUrl || heroForm.imageUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-zinc-200 font-mono">Pratinjau Foto Profil</span>
                      <span className="text-zinc-400 text-[11px] mt-0.5">
                        Tampil di tengah section setengah lingkaran orbit bahasa.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Teks Tombol Utama</label>
                    <input
                      type="text"
                      value={heroForm.primaryBtnText}
                      onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Tautan Tombol Utama</label>
                    <input
                      type="text"
                      value={heroForm.primaryBtnLink}
                      onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Teks Tombol Kedua</label>
                    <input
                      type="text"
                      value={heroForm.secondaryBtnText}
                      onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Tautan Tombol Kedua</label>
                    <input
                      type="text"
                      value={heroForm.secondaryBtnLink}
                      onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnLink: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ '--btn-fill-bg': '#000000' } as React.CSSProperties}
                  className="btn-fill-effect mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:text-white text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer self-start"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan Hero</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: PROJECTS SECTION */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-orange-400" />
                  <span>Master Data Proyek Portofolio</span>
                </h2>
                <p className="text-xs opacity-60 mt-0.5">
                  5 proyek teratas akan ditampilkan dalam susunan kartu kipas / arc seperti di foto referensi.
                </p>
              </div>
              <button
                onClick={startAddProject}
                style={{ '--btn-fill-bg': '#000000' } as React.CSSProperties}
                className="btn-fill-effect flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:text-white text-white font-semibold text-xs transition-all shadow-md shadow-orange-500/30 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {/* List of current projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className={`rounded-2xl overflow-hidden border p-4 flex flex-col justify-between ${
                    isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                        #{idx + 1} {idx < 5 ? '(Tampil di Kipas)' : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <h3 className="font-bold text-base leading-tight mt-0.5">{proj.title}</h3>
                      <p className="text-xs opacity-75 line-clamp-2 mt-1">{proj.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((t, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-white/10">
                    <button
                      onClick={() => startEditProject(proj)}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isDark ? 'border-white/10 hover:bg-white/10 text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-800'
                      }`}
                      title="Edit Proyek"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus proyek "${proj.title}"?`)) {
                          deleteProject(proj.id);
                          showNotification();
                        }
                      }}
                      className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Form for Add/Edit Project */}
            {isProjectFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                <div
                  className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl overflow-y-auto max-h-[90vh] ${
                    isDark ? 'bg-[#0f111a] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-4">
                    {editingProjectId ? 'Edit Data Proyek' : 'Tambah Proyek Baru'}
                  </h3>

                  <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Judul Proyek</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase opacity-75">Kategori</label>
                        <input
                          type="text"
                          required
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase opacity-75">Tahun</label>
                        <input
                          type="text"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Deskripsi Proyek</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className={`px-4 py-2 rounded-xl border text-sm outline-none resize-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">URL Foto / Gambar Proyek</label>
                      <input
                        type="url"
                        required
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {imagePresets.slice(0, 4).map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setProjectForm({ ...projectForm, imageUrl: p.url })}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/5 hover:bg-white/10 border border-white/10"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Teknologi / Tags (pisahkan koma)</label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Next.js, TypeScript, Tailwind, Python"
                        className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase opacity-75">Link Live Demo (opsional)</label>
                        <input
                          type="url"
                          value={projectForm.demoUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase opacity-75">Link GitHub (opsional)</label>
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsProjectFormOpen(false)}
                        className="px-4 py-2 rounded-xl border border-white/15 text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                      >
                        Simpan Proyek
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RUNNING LOGO / TECH STACK */}
        {activeTab === 'tech' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-orange-400" />
                  <span>Master Data Running Logo &amp; Bahasa Pemrograman</span>
                </h2>
                <p className="text-xs opacity-60 mt-0.5">
                  Bahasa dan teknologi ini akan berjalan otomatis di running ticker / marquee.
                </p>
              </div>
              <button
                onClick={startAddTech}
                style={{ '--btn-fill-bg': '#000000' } as React.CSSProperties}
                className="btn-fill-effect flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:text-white text-white font-semibold text-xs transition-all shadow-md shadow-orange-500/30 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Bahasa / Tech</span>
              </button>
            </div>

            {/* Grid of tech badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.techStack.map((tech) => (
                <div
                  key={tech.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                    isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">
                      <TechIcon iconKey={tech.iconKey} size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{tech.name}</h4>
                      <span className="text-[10px] opacity-60 font-mono uppercase">{tech.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/10">
                    <button
                      onClick={() => startEditTech(tech)}
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-xs"
                      title="Edit"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus "${tech.name}"?`)) {
                          deleteTech(tech.id);
                          showNotification();
                        }
                      }}
                      className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs"
                      title="Hapus"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Form for Add/Edit Tech */}
            {isTechFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                <div
                  className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl ${
                    isDark ? 'bg-[#0f111a] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-4">
                    {editingTechId ? 'Edit Bahasa / Teknologi' : 'Tambah Bahasa Baru'}
                  </h3>

                  <form onSubmit={handleSaveTech} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Nama Bahasa / Tech</label>
                      <input
                        type="text"
                        required
                        value={techForm.name}
                        onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                        className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Kategori</label>
                      <select
                        value={techForm.category}
                        onChange={(e) => setTechForm({ ...techForm, category: e.target.value as any })}
                        className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? 'bg-[#0f111a] border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      >
                        <option value="Language">Language (Bahasa Pemrograman)</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Tools">Tools</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase opacity-75">Pilih Ikon Preset</label>
                      <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl bg-white/5 border border-white/10">
                        {availableIconKeys.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setTechForm({ ...techForm, iconKey: key })}
                            className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                              techForm.iconKey === key
                                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                : 'border-transparent hover:bg-white/10'
                            }`}
                          >
                            <TechIcon iconKey={key} size={20} />
                            <span className="text-[9px] truncate w-full text-center">{key}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsTechFormOpen(false)}
                        className="px-4 py-2 rounded-xl border border-white/15 text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT & SOCIAL DATA */}
        {activeTab === 'contact' && (
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-6 max-w-4xl">
            <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-400" />
                <span>Pengaturan Kontak &amp; Jejaring Sosial</span>
              </h2>
              <p className="text-xs opacity-60 mb-6">
                Informasi ini ditampilkan di section kontak dan footer website portofolio Anda.
              </p>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Email Resmi</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">No. WhatsApp / Telepon</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Lokasi / Domisili</label>
                    <input
                      type="text"
                      required
                      value={contactForm.location}
                      onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase opacity-75">Status Ketersediaan</label>
                    <input
                      type="text"
                      value={contactForm.availability}
                      onChange={(e) => setContactForm({ ...contactForm, availability: e.target.value })}
                      className={`px-4 py-2.5 rounded-xl border text-sm outline-none ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase opacity-75">Bio Kontak / Subtitle</label>
                  <textarea
                    rows={2}
                    value={contactForm.bio}
                    onChange={(e) => setContactForm({ ...contactForm, bio: e.target.value })}
                    className={`px-4 py-2.5 rounded-xl border text-sm outline-none resize-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>

                {/* Social media links */}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Tautan Media Sosial &amp; Profil Developer
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">GitHub URL</label>
                      <input
                        type="url"
                        value={contactForm.socials.github}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            socials: { ...contactForm.socials, github: e.target.value },
                          })
                        }
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">LinkedIn URL</label>
                      <input
                        type="url"
                        value={contactForm.socials.linkedin}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            socials: { ...contactForm.socials, linkedin: e.target.value },
                          })
                        }
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">Instagram URL</label>
                      <input
                        type="url"
                        value={contactForm.socials.instagram}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            socials: { ...contactForm.socials, instagram: e.target.value },
                          })
                        }
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">Twitter / X URL</label>
                      <input
                        type="url"
                        value={contactForm.socials.twitter}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            socials: { ...contactForm.socials, twitter: e.target.value },
                          })
                        }
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ '--btn-fill-bg': '#000000' } as React.CSSProperties}
                  className="btn-fill-effect mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:text-white text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer self-start"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan Kontak</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 5: INBOX MESSAGES */}
        {activeTab === 'inbox' && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Inbox className="h-5 w-5 text-orange-400" />
                <span>Pesan Masuk dari Formulir Kontak</span>
              </h2>
              <p className="text-xs opacity-60 mt-0.5">
                Daftar pesan yang dikirimkan oleh pengunjung melalui formulir kontak langsung di portofolio Anda.
              </p>
            </div>

            {(!data.messages || data.messages.length === 0) ? (
              <div className={`p-12 text-center rounded-3xl border ${isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200'}`}>
                <Inbox className="h-10 w-10 mx-auto opacity-30 mb-2" />
                <p className="text-sm font-medium opacity-70">Belum ada pesan masuk.</p>
                <p className="text-xs opacity-50 mt-1">
                  Pesan yang dikirim melalui formulir kontak akan otomatis muncul di sini.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      isDark ? 'bg-[#0f111a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                    } ${!msg.read ? 'ring-1 ring-orange-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base">{msg.name}</h4>
                          <span className="text-xs opacity-60 font-mono">&lt;{msg.email}&gt;</span>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                              Baru
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-orange-400 mt-1">{msg.subject}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] opacity-50 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          onClick={() => {
                            deleteMessage(msg.id);
                            showNotification();
                          }}
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 p-4 rounded-xl bg-white/5 text-sm opacity-90 leading-relaxed font-sans">
                      {msg.message}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" /> Balas ke {msg.email}
                      </a>
                      {!msg.read && (
                        <button
                          onClick={() => markMessageRead(msg.id)}
                          className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          Tandai telah dibaca
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
