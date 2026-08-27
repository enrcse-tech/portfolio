import React, { useRef, useCallback } from 'react';
import {
  Navbar,
  Hero,
  GridSection,
  Services,
  BentoGrid,
  TickerTape,
  SplitInteractive,
  FloatingStickers,
  Credentials,
  CharacterReveal,
  TiltRecap,
  Newsletter,
  Footer
} from './components/PlayfulBrutal';

export default function App() {
  const workRef = useRef<HTMLDivElement>(null);
  const agencyRef = useRef<HTMLDivElement>(null);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const talkRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((section: string) => {
    const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
      Work: workRef,
      Agency: agencyRef,
      Credentials: credentialsRef,
      Talk: talkRef,
    };

    const ref = refMap[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleScrollToWork = useCallback(() => {
    handleNavigate('Work');
  }, [handleNavigate]);

  return (
    <div className="min-h-screen bg-[#E0E0E0] text-[#1A1A1A] font-body select-none">
      <Navbar onNavigate={handleNavigate} />
      <Hero onScrollToWork={handleScrollToWork} />
      <GridSection onScrollToWork={workRef} />
      <Services />
      <BentoGrid />
      <TickerTape />
      <SplitInteractive onScrollToWhyUs={agencyRef} />
      <FloatingStickers />
      <Credentials onScrollToCredentials={credentialsRef} />
      <CharacterReveal />
      <TiltRecap />
      <div ref={talkRef}>
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}
