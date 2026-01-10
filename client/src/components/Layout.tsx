import { ReactNode, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/backgrounds/InteractiveBackground';
import MouseGlowBackground from '@/components/backgrounds/MouseGlowBackground';
import CodingBackground from '@/components/backgrounds/CodingBackground';

interface LayoutProps {
  children: ReactNode;
  backgroundType?: 'ocean' | 'glow' | 'coding' | 'none';
}

export default function Layout({ children, backgroundType = 'ocean' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative flex flex-col overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {backgroundType === 'ocean' && <InteractiveBackground />}
        {backgroundType === 'glow' && <MouseGlowBackground />}
        {backgroundType === 'coding' && <CodingBackground />}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow min-h-[calc(100vh-300px)]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}