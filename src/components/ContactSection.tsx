'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SocialPlatformIcon, getSocialPlatformDetails } from '@/components/SocialIcons';

export const ContactSection: React.FC = () => {
  const { data, theme, submitMessage } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';
  const { contact } = data;

  const activeSocials = React.useMemo(() => {
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
  }, [contact?.socialLinks, contact?.socials]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Pesan dari Portofolio',
        message: formData.message,
      });
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 500);
  };

  return (
    <section id="contact" className="relative z-10 py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 mb-2">
          GET IN TOUCH
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span className="text-amber-500">Kontak</span>{' '}
          <span className={isDark ? 'text-white' : 'text-zinc-900'}>&amp; Kolaborasi</span>
        </h2>

        <p className={`mt-3 max-w-xl text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {contact.bio || 'Hubungi saya untuk diskusi teknis, kolaborasi proyek, ataupun tawaran karir.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#060606] border-white/10'
                : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Informasi Master & Kontak
              </h3>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                  isDark ? 'bg-white/[0.03] hover:bg-white/[0.07]' : 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-white/5 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Email</span>
                  <span className={`text-xs sm:text-sm font-medium transition-colors ${
                    isDark ? 'text-zinc-200 group-hover:text-amber-400' : 'text-zinc-800 group-hover:text-amber-600'
                  }`}>
                    {contact.email}
                  </span>
                </div>
              </a>

              {/* Phone / WhatsApp */}
              <a
                href={
                  contact.whatsapp
                    ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`
                    : `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                  isDark ? 'bg-white/[0.03] hover:bg-white/[0.07]' : 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-white/5 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>WhatsApp / Telepon</span>
                  <span className={`text-xs sm:text-sm font-medium transition-colors ${
                    isDark ? 'text-zinc-200 group-hover:text-emerald-400' : 'text-zinc-800 group-hover:text-emerald-600'
                  }`}>
                    {contact.phone}
                  </span>
                </div>
              </a>

              {/* Location */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50 border border-zinc-200/60'}`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-white/5 text-zinc-400' : 'bg-zinc-200 text-zinc-700'}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Lokasi & Wilayah</span>
                  <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                    {contact.location}
                  </span>
                </div>
              </div>

              {/* Address */}
              {contact.address && (
                <div className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50 border border-zinc-200/60'}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isDark ? 'bg-white/5 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Alamat Lengkap</span>
                    <span className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      {contact.address}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/10 dark:border-white/10">
                <span className={`text-[10px] uppercase font-mono block mb-2.5 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  Profil Sosial & Developer:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeSocials.map((item, idx) => {
                    const details = getSocialPlatformDetails(item.platform);
                    return (
                      <a
                        key={`${item.platform}-${idx}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ '--btn-fill-bg': details.color } as React.CSSProperties}
                        className={`btn-fill-effect p-2.5 rounded-lg border hover:text-white ${details.hoverBorder} transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                        }`}
                        title={item.name}
                      >
                        <SocialPlatformIcon platform={item.platform} className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="md:col-span-7">
          <div
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark
                ? 'bg-[#060606] border-white/10'
                : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Kirim Pesan Langsung
            </h3>
            <p className={`text-xs mb-5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Tuliskan pesan Anda dan saya akan segera meresponsnya.
            </p>

            {isSent && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2.5 text-xs animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Pesan berhasil terkirim. Terima kasih!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className={`text-[11px] font-mono uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-700 font-semibold'}`}>
                    Nama Lengkap <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-white/[0.04] border-white/10 focus:border-amber-500/60 text-white'
                        : 'bg-zinc-50 border-zinc-300 focus:border-amber-600 text-zinc-900'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`text-[11px] font-mono uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-700 font-semibold'}`}>
                    Email <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-white/[0.04] border-white/10 focus:border-amber-500/60 text-white'
                        : 'bg-zinc-50 border-zinc-300 focus:border-amber-600 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[11px] font-mono uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-700 font-semibold'}`}>
                  Subjek
                </label>
                <input
                  type="text"
                  placeholder="Topik / Perihal"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border-white/10 focus:border-amber-500/60 text-white'
                      : 'bg-zinc-50 border-zinc-300 focus:border-amber-600 text-zinc-900'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[11px] font-mono uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-700 font-semibold'}`}>
                  Pesan <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan pesan Anda..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none resize-none transition-colors ${
                    isDark
                      ? 'bg-white/[0.04] border-white/10 focus:border-amber-500/60 text-white'
                      : 'bg-zinc-50 border-zinc-300 focus:border-amber-600 text-zinc-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ '--btn-fill-bg': '#d97706' } as React.CSSProperties}
                className={`btn-fill-effect mt-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-xs sm:text-sm hover:text-white transition-all cursor-pointer disabled:opacity-50 ${
                  isDark
                    ? 'bg-zinc-100 text-zinc-900 border border-transparent hover:border-amber-500/50'
                    : 'bg-zinc-900 text-white border border-transparent hover:border-amber-500/50 shadow-sm'
                }`}
              >
                {isSubmitting ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
