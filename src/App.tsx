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
import TextLoop from './components/TextLoop';

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
      <div className="py-6 bg-black border-b-8 border-black overflow-hidden relative">
        <TextLoop
          text="EPRIN NOBLE RISHO ✦ DEVELOPER ✦ ARCHITECT"
          shape="wave"
          speed={90}
          direction="forward"
          separator="✦"
          curviness={90}
          fontSize={46}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="#ffffff"
          ribbon
          ribbonColor="#5227FF"
          ribbonWidth={86}
          pauseOnHover
        />
      </div>
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
