'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarBg: string;
  initials: string;
  orderType: string;
  rating: number;
  date: string;
  content: string;
}

const ROW_1_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'rev-1',
    name: 'Reza Mahendra',
    role: 'CEO & Founder',
    company: 'Nexa Solusindo',
    avatarBg: 'from-amber-500 to-orange-600',
    initials: 'RM',
    orderType: 'Enterprise Web App & Dashboard',
    rating: 5,
    date: '2 minggu lalu',
    content:
      'Mas Iqbal berhasil mewujudkan dashboard manajemen inventori yang super kompleks jadi sangat ringan dan mudah dipakai tim operasional. Delivery tepat waktu dan kodingannya sangat rapi!',
  },
  {
    id: 'rev-2',
    name: 'Siti Rahmayanti',
    role: 'Owner',
    company: 'Bloom Beauty Official',
    avatarBg: 'from-rose-500 to-pink-600',
    initials: 'SR',
    orderType: 'Custom E-Commerce & Payment Gateway',
    rating: 5,
    date: '1 bulan lalu',
    content:
      'Website e-commerce kami sekarang loadingnya kilat di bawah 1 detik! Sejak launching dengan desain mas Iqbal, checkout conversion kami naik 45%. Puas banget order di sini!',
  },
  {
    id: 'rev-3',
    name: 'Budi Santoso',
    role: 'Head of IT',
    company: 'Logistik Nusantara Express',
    avatarBg: 'from-blue-600 to-indigo-700',
    initials: 'BS',
    orderType: 'Scalable Logistics Tracking System',
    rating: 5,
    date: '3 minggu lalu',
    content:
      'Arsitektur cloud dan API integration yang dibangun mas Iqbal sangat solid dan reliable. Menghandle puluhan ribu request harian tanpa kendala. Developer berbakat!',
  },
  {
    id: 'rev-4',
    name: 'Aliffia Putri',
    role: 'Co-Founder',
    company: 'EduSpace Interactive',
    avatarBg: 'from-emerald-500 to-teal-600',
    initials: 'AP',
    orderType: 'Interactive Learning Platform',
    rating: 5,
    date: '1 bulan lalu',
    content:
      'Komunikasi sangat responsif, revisi ditangani dengan cepat dan solutif tanpa bertele-tele. Desain UI/UX-nya fresh, modern, dan sangat disukai user kami!',
  },
  {
    id: 'rev-5',
    name: 'Dimas Arya Pratama',
    role: 'Marketing Lead',
    company: 'Finvestura Indonesia',
    avatarBg: 'from-violet-500 to-purple-700',
    initials: 'DP',
    orderType: 'High-Converting FinTech Landing Page',
    rating: 5,
    date: '2 bulan lalu',
    content:
      'Landing page dengan performa skor 99 di Google Lighthouse. SEO langsung nancep di page 1 dan lead yang masuk melonjak drastis. Worth every penny!',
  },
];

const ROW_2_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'rev-6',
    name: 'Kevin Wijaya',
    role: 'Product Lead',
    company: 'SaaSify Studio',
    avatarBg: 'from-cyan-500 to-blue-600',
    initials: 'KW',
    orderType: 'SaaS Multi-Tenant Architecture',
    rating: 5,
    date: '3 minggu lalu',
    content:
      'Paling suka cara mas Iqbal memecahkan problem teknis. Codebase Next.js & TypeScript yang dikerjakan sangat terstruktur, mempermudah tim internal kami untuk scaling.',
  },
  {
    id: 'rev-7',
    name: 'Nadia Kurnia',
    role: 'Owner & Creative Director',
    company: 'Rupa Kriya Living',
    avatarBg: 'from-amber-600 to-yellow-600',
    initials: 'NK',
    orderType: 'Premium Catalog & Brand Showcase',
    rating: 5,
    date: '1 bulan lalu',
    content:
      'Tampilan website katalog kami jadi terlihat sangat mewah kelas internasional. Banyak klien luar negeri yang memuji kesan pertama website kami. Terima kasih mas Iqbal!',
  },
  {
    id: 'rev-8',
    name: 'Fajar Nugraha',
    role: 'Managing Partner',
    company: 'RestoChain Group',
    avatarBg: 'from-red-500 to-orange-600',
    initials: 'FN',
    orderType: 'POS Cloud & Kitchen Display System',
    rating: 5,
    date: '2 bulan lalu',
    content:
      'Dari konsultasi awal sampai serah terima produk, servisnya bintang lima. Dibantu deployment ke server dan diajari cara pakainya sampai tuntas. Sangat bertanggung jawab!',
  },
  {
    id: 'rev-9',
    name: 'Hendra Kusuma',
    role: 'CTO',
    company: 'Karya Mandiri Tech',
    avatarBg: 'from-indigo-500 to-purple-600',
    initials: 'HK',
    orderType: 'Backend Microservices & Next.js App',
    rating: 5,
    date: '1 bulan lalu',
    content:
      'Eksekusi cepat, standar kualitas tinggi, dan memperhatikan detail mikro-animasi yang membuat aplikasi terasa hidup. Pasti bakal repeat order untuk proyek berikutnya.',
  },
  {
    id: 'rev-10',
    name: 'Dewi Anggraini',
    role: 'Founder',
    company: 'HijabStyle Official Store',
    avatarBg: 'from-pink-500 to-rose-600',
    initials: 'DA',
    orderType: 'High-Traffic Fashion Webstore',
    rating: 5,
    date: '2 minggu lalu',
    content:
      'Waktu event flash sale website tetap stabil dan lancar jaya tanpa down sama sekali. Sangat puas dengan hasil kerja mas Iqbal, pelayanannya ramah dan profesional!',
  },
];

const ReviewCard: React.FC<{ item: TestimonialItem; isDark: boolean }> = ({ item, isDark }) => {
  return (
    <div
      className={`rating-card group relative w-[310px] sm:w-[370px] md:w-[410px] flex-shrink-0 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.03] cursor-default border backdrop-blur-xl ${
        isDark
          ? 'bg-[#0f0f11]/90 border-white/10 hover:border-amber-500/50 hover:bg-[#151518] shadow-2xl hover:shadow-amber-500/10'
          : 'bg-white/95 border-zinc-200 hover:border-amber-500/60 hover:bg-white shadow-xl hover:shadow-amber-500/15'
      }`}
    >
      {/* Top Header: Avatar + Name + Verified Badge */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${item.avatarBg} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0`}
          >
            {item.initials}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-semibold text-xs sm:text-sm tracking-tight ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                {item.name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[190px]">
              {item.role} • {item.company}
            </span>
          </div>
        </div>

        {/* Quote decorative icon */}
        <Quote className="w-5 h-5 text-amber-500/25 flex-shrink-0 group-hover:text-amber-500/50 transition-colors" />
      </div>

      {/* Star rating & Date */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-0.5">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />
          ))}
          <span className="ml-1.5 text-[11px] font-bold text-amber-400 font-mono">5.0</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{item.date}</span>
      </div>

      {/* Review quote content */}
      <p
        className={`text-xs sm:text-[13px] leading-relaxed text-left line-clamp-3 sm:line-clamp-none ${
          isDark ? 'text-zinc-300' : 'text-zinc-700'
        }`}
      >
        &ldquo;{item.content}&rdquo;
      </p>
    </div>
  );
};

export const RatingSection: React.FC = () => {
  const { theme } = usePortfolio();
  const isDark = theme === 'dark';

  // Duplicate items for continuous seamless loop
  const row1Items = [...ROW_1_TESTIMONIALS, ...ROW_1_TESTIMONIALS];
  const row2Items = [...ROW_2_TESTIMONIALS, ...ROW_2_TESTIMONIALS];

  return (
    <section
      id="rating"
      className="relative z-10 w-full py-16 sm:py-24 overflow-hidden border-t border-b border-white/5 select-none"
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] rounded-full bg-amber-500/5 blur-[160px]" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          Rating <span className="text-amber-500">Customer</span>
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-base text-zinc-400 leading-relaxed">
          Cerita nyata dari para klien, founder, dan partner bisnis yang telah mempercayakan pembuatan
          website, aplikasi full-stack, serta sistem digital kepada saya.
        </p>
      </div>

      {/* Dual-Row Running Text Container - Tilted / Rotated slightly upwards as requested */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge gradient fade masks so running cards emerge and dissolve smoothly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20" />

        {/* Tilted Stage Wrapper: slightly angled upwards (-2.2deg) */}
        <div
          className="w-[110%] -ml-[5%] flex flex-col gap-4 sm:gap-6 will-change-transform"
          style={{ transform: 'rotate(-2.2deg)' }}
        >
          {/* Row 1: Running to the RIGHT */}
          <div className="overflow-hidden w-full py-1">
            <div className="animate-rating-marquee-right flex gap-4 sm:gap-6">
              {row1Items.map((item, idx) => (
                <ReviewCard key={`r1-${item.id}-${idx}`} item={item} isDark={isDark} />
              ))}
            </div>
          </div>

          {/* Row 2: Running to the LEFT */}
          <div className="overflow-hidden w-full py-1">
            <div className="animate-rating-marquee-left flex gap-4 sm:gap-6">
              {row2Items.map((item, idx) => (
                <ReviewCard key={`r2-${item.id}-${idx}`} item={item} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
