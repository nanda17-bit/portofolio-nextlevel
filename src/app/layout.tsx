import type { Metadata, Viewport } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import './globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import { CursorGlow } from '@/components/CursorGlow';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  weight: ['600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'baliqDev | Software Engineer & Full-Stack Developer',
  description:
    'Portofolio profesional baliqDev - Full-Stack Developer & Software Engineer. Dibangun dengan Next.js, React, efek scroll-curtain hero, dan arsitektur modern.',
  keywords: [
    'baliqDev',
    'Portfolio',
    'Full-Stack Developer',
    'Next.js',
    'React',
    'Software Engineer',
    'Skariga Curtain Hero',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable} dark`} style={{ colorScheme: 'dark' }}>
      <body className="min-h-screen relative flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black w-full max-w-full">
        <PortfolioProvider>
          <BackgroundGrid />
          <CursorGlow />
          <div className="relative z-10 flex-1 flex flex-col w-full max-w-full">
            {children}
          </div>
        </PortfolioProvider>
      </body>
    </html>
  );
}

