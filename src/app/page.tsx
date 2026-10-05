'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { CurtainHero } from '@/components/CurtainHero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { RunningLogoSection } from '@/components/RunningLogoSection';
import { TitikSpotifySection } from '@/components/TitikSpotifySection';
import { RatingSection } from '@/components/RatingSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [headerClosed, setHeaderClosed] = useState(false);

  const handleScrollProgress = useCallback((progress: number, isClosed: boolean) => {
    setHeaderClosed(isClosed);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col">
      {/* Floating Capsule Header */}
      <Header isClosed={headerClosed} />

      {/* Section 1: Skariga Curtain Hero with Scroll Reveal Mechanism */}
      <CurtainHero onScrollProgress={handleScrollProgress} />

      {/* Section 2: Fanned-Out Projects Showcase (Photo Cards inspired by image 1) */}
      <ProjectsSection />

      {/* Section 3: Infinite Running Logo / Programming Languages & Tech Stack */}
      <RunningLogoSection />

      {/* Section 4: Titik Spotify - 3D Interactive Phone & 360° Orbiting Song Cards */}
      <TitikSpotifySection />

      {/* Section 5: Dual-Row Tilted Running Text Client Reviews & Rating Section */}
      <RatingSection />

      {/* Section 5: Contact & Social Collaboration */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
