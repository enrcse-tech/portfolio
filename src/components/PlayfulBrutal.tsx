import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Star, Hexagon, Zap, Box, Smile } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import Lanyard from "./Lanyard";

// --- CONFIG ---
gsap.registerPlugin(ScrollTrigger);

export const COLORS = {
  bg: "bg-[#E0E0E0]", // Light concrete
  primary: "bg-[#FF4D00]", // International Orange
  secondary: "bg-[#0047FF]", // Hyper Blue
  accent: "bg-[#CCFF00]", // Acid Lime
  text: "text-[#1A1A1A]", // Off-black
  border: "border-black",
};

// --- COMPONENTS ---

// 1. MAGNETIC BUTTON (Physics-based interaction)
export function MagneticBtn({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.3);
      yTo(y * 0.3);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", mouseMove);
    el.addEventListener("mouseleave", mouseLeave);
    return () => {
      el.removeEventListener("mousemove", mouseMove);
      el.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border-2 border-black px-8 py-4 text-lg font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-[4px] active:shadow-none cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
}

// 2. SCROLL MARQUEE
export function Marquee({ text, direction = 1, className }: { text: string; direction?: number; className?: string }) {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;

  useLayoutEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (xPercent <= -100) {
        xPercent = 0;
      }
      if (xPercent > 0) {
        xPercent = -100;
      }

      gsap.set(firstText.current, { xPercent: xPercent });
      gsap.set(secondText.current, { xPercent: xPercent });
      xPercent += 0.1 * direction;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Speed up on scroll
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: e => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          direction = e.direction * -1;
        }
      },
      x: "-500px",
    });

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [direction]);

  return (
    <div className={cn("relative flex overflow-hidden border-y-4 border-black bg-white py-6", className)}>
      <div ref={slider} className="relative whitespace-nowrap">
        <p ref={firstText} className="m-0 pr-12 text-5xl md:text-8xl font-black uppercase text-black">
          {text} • {text} • {text} •
        </p>
        <p ref={secondText} className="absolute left-[100%] top-0 m-0 pr-12 text-5xl md:text-8xl font-black uppercase text-black">
          {text} • {text} • {text} •
        </p>
      </div>
    </div>
  );
}

// 3. PARALLAX IMAGE CARD
export function BrutalCard({ title, img, color, url }: { title: string; img: string; color: string; url: string }) {
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(cardRef.current,
      { rotation: Math.random() * 10 - 5, y: 100 },
      {
        rotation: 0,
        y: 0,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          end: "top center",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <a 
      ref={cardRef} 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group relative aspect-[3/4] w-full border-4 border-black p-4 transition-transform hover:-translate-y-2 block", color, "shadow-[8px_8px_0px_0px_#000]")}
    >
      <div className="relative h-full w-full overflow-hidden border-2 border-black bg-white">
        <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
        <div className="absolute bottom-0 left-0 w-full border-t-2 border-black bg-white p-3 text-center font-bold uppercase text-black text-sm md:text-base">
          {title}
        </div>
      </div>
      {/* Decorative Pin */}
      <div className="absolute -top-6 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]" />
    </a>
  );
}

// --- SECTIONS ---

export function Navbar({ onNavigate }: { onNavigate?: (section: string) => void }) {
  return (
    <nav className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-8 rounded-full border-3 sm:border-4 border-black bg-white px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
        <Hexagon className="fill-black text-black" size={32} />
        <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-bold uppercase tracking-widest text-black">
          {['Work', 'Toolkit', 'Credentials'].map(item => (
            <button 
              key={item} 
              onClick={() => onNavigate?.(item)} 
              className="hover:text-[#FF4D00] transition-colors cursor-pointer font-bold"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => onNavigate?.('Talk')}
          className="rounded-full bg-[#CCFF00] px-4 md:px-6 py-1.5 md:py-2 font-black uppercase border-2 border-black hover:bg-[#FF4D00] transition-colors cursor-pointer text-xs md:text-sm text-black"
        >
          Let&apos;s Talk
        </button>
      </div>
    </nav>
  );
}

export function Hero({ onScrollToWork }: { onScrollToWork?: () => void }) {
  const container = useRef(null);
  const textRef = useRef(null);
  const shapeRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Full-Stack Developer", "Backend Engineer", "AI Enthusiast", "Freelancer"];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text Stagger
      gsap.from(".hero-text", {
        y: 200,
        skewY: 10,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out"
      });

      // Hero subtitle fade in
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.8,
        ease: "power3.out"
      });

      // Badges stagger
      gsap.from(".hero-badge", {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        delay: 1.2,
        ease: "back.out(1.7)"
      });

      // Stat counters slide up
      gsap.from(".hero-stat", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        delay: 1.5,
        ease: "power3.out"
      });

      // Tech stack pills slide in
      gsap.from(".hero-tech", {
        x: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        delay: 2,
        ease: "power2.out"
      });

      // CTA buttons pop
      gsap.from(".hero-cta", {
        scale: 0.5,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        delay: 1.8,
        ease: "back.out(1.7)"
      });

      // Spinning Shape
      gsap.to(shapeRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear"
      });

      // Scroll Parallax
      gsap.to(container.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#E0E0E0] pt-32 pb-16 px-6 md:px-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 w-full">
        {/* Left Column: Name & CTA */}
        <div ref={textRef} className="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
          <div className="overflow-hidden">
            <h1 className="hero-text text-[10vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter text-[#1A1A1A] uppercase">
              EPRIN
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-text text-[10vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter text-[#FF4D00] stroke-black uppercase" style={{ WebkitTextStroke: "2px black", color: "#FF4D00" }}>
              NOBLE
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-text text-[10vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter text-[#1A1A1A] uppercase">
              RISHO
            </h1>
          </div>

          {/* Animated Role Rotator */}
          <div className="hero-subtitle mt-6 h-10 overflow-hidden relative w-full flex justify-center lg:justify-start">
            <motion.div
              key={roleIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute"
            >
              <p className="text-lg md:text-xl font-black uppercase tracking-wider text-[#0047FF]">
                {roles[roleIndex]}
              </p>
            </motion.div>
          </div>

          <p className="hero-subtitle mt-2 text-sm md:text-md font-bold uppercase text-black/70 max-w-md tracking-wider">
            2nd Year CSE Student at LPU • Building real products since Semester 2
          </p>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start">
            <span className="hero-badge border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] text-black">
              🚀 3+ Live Sites
            </span>
            <span className="hero-badge border-2 border-black bg-[#CCFF00] px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] text-black">
              🔥 Supabase / Firebase
            </span>
            <span className="hero-badge border-2 border-black bg-[#FF4D00] px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] text-black">
              🤖 Ollama / AI
            </span>
            <span className="hero-badge border-2 border-black bg-[#0047FF] px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] text-white">
              💻 OOP & Logic
            </span>
          </div>

          {/* Animated Stat Counters */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 justify-center lg:justify-start w-full max-w-md">
            {[
              { number: "3+", label: "Projects Live" },
              { number: "2nd", label: "Year B.Tech" },
              { number: "6+", label: "Tools & APIs" },
            ].map((stat, i) => (
              <div key={i} className="hero-stat border-2 border-black bg-white px-2 sm:px-4 py-2 sm:py-3 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#FF4D00]">{stat.number}</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase text-black tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack Strip */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center lg:justify-start">
            {["React", "TypeScript", "Supabase", "Firebase", "Ollama", "Node.js", "Vite", "GSAP"].map((tech, i) => (
              <span key={i} className="hero-tech bg-black text-white text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider">
                {tech}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4">
            <div className="hero-cta">
              <MagneticBtn onClick={onScrollToWork} className="bg-[#0047FF] text-white">View Projects</MagneticBtn>
            </div>
            <a href="mailto:enr.cse@gmail.com" className="hero-cta">
              <MagneticBtn className="bg-white hover:bg-[#CCFF00] text-black">Say hi <ArrowUpRight className="ml-2" /></MagneticBtn>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Lanyard */}
        <div className="w-full h-[40vh] md:h-[50vh] lg:h-[70vh] relative flex items-center justify-center border-3 sm:border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] hover:shadow-none hover:translate-x-1 sm:hover:translate-x-3 hover:translate-y-1 sm:hover:translate-y-3 transition-all rounded-xl sm:rounded-2xl overflow-hidden">
          {/* LPU Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 p-2">
            <img
              src="/lpu.jpg"
              alt="LPU Logo"
              className="w-[95%] h-[95%] object-contain opacity-25 filter contrast-125 select-none scale-110 sm:scale-125"
            />
          </div>

          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="h-4 w-4 rounded-full bg-[#FF4D00] border-2 border-black" />
            <div className="h-4 w-4 rounded-full bg-[#CCFF00] border-2 border-black" />
            <div className="h-4 w-4 rounded-full bg-[#0047FF] border-2 border-black" />
          </div>
          <div className="absolute top-4 right-4 z-20 text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded border border-black">
            Drag to Swing
          </div>
          <Lanyard
            position={[0, 0, 20]}
            gravity={[0, -40, 0]}
            frontImage="/profile.png"
            backImage="/profile.png"
            imageFit="cover"
            lanyardWidth={1.5}
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 hidden md:block z-20">
        <div className="w-24 animate-spin-slow text-black fill-black">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fontSize="14" fontWeight="bold">
              <textPath xlinkHref="#circle">
                SCROLL DOWN • SCROLL DOWN •
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

export function GridSection({ onScrollToWork }: { onScrollToWork?: React.RefObject<HTMLDivElement> }) {
  return (
    <section ref={onScrollToWork} className="bg-black py-24 border-t-8 border-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b-4 border-white pb-8">
          <h2 className="text-6xl md:text-8xl font-black uppercase text-white leading-none">
            Selected <br /> <span className="text-[#CCFF00]">Works</span>
          </h2>
          <p className="max-w-md text-xl font-bold text-gray-400">
            Commercial web applications launched for active businesses. Responsive code built to perform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <BrutalCard
            title="Wings Tuition"
            img="/wings-tuition.png"
            color="bg-[#FF4D00]"
            url="https://wingstuition.com"
          />
          <BrutalCard
            title="Wings Intl School"
            img="/wings-school.png"
            color="bg-[#CCFF00]"
            url="https://wingsinternationalschool.com"
          />
          <BrutalCard
            title="French Bakers"
            img="/french-bakers.png"
            color="bg-[#0047FF]"
            url="https://thefrenchbakers.in"
          />
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const services = [
    { title: "Web Dev", icon: <Box size={40} />, desc: "Fast, responsive web apps designed to break standard container rules." },
    { title: "Cloud Systems", icon: <Zap size={40} />, desc: "Deploying secure environments and scaling virtual instances with AWS." },
    { title: "Software Logic", icon: <Smile size={40} />, desc: "Writing optimized logic structures, networks, and algorithms in C++ & Python." },
  ];

  return (
    <section className="relative z-10 bg-[#E0E0E0] py-32 border-y-8 border-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={i} className="group relative border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-[#CCFF00] text-black">
                {s.icon}
              </div>
              <h3 className="mb-4 text-4xl font-black uppercase italic text-black">{s.title}</h3>
              <p className="text-xl font-medium text-gray-700">{s.desc}</p>
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100 text-black">
                <ArrowUpRight size={32} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BentoGrid({ onScrollToToolkit }: { onScrollToToolkit?: React.RefObject<HTMLDivElement> }) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bento-item", {
        scale: 0.5,
        opacity: 0,
        y: 100,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-32 border-b-8 border-black">
      <div ref={onScrollToToolkit} className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 text-black">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter">
            The <br /> <span className="text-[#0047FF]">Toolkit</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[750px]">
          <div className="bento-item md:col-span-2 md:row-span-2 border-4 border-black bg-[#CCFF00] p-8 flex flex-col justify-between shadow-[12px_12px_0px_0px_#000]">
            <div>
              <h3 className="text-5xl md:text-6xl font-black uppercase text-black mb-4">Visual <br /> Engine</h3>
              <div className="flex flex-col gap-4 max-w-md">
                <p className="text-base md:text-lg font-bold text-black border-l-4 border-black pl-4">
                  Building memory-efficient desktop simulations, mathematical modeling solvers, and custom automation scripts.
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1">OpenGL / Graphics</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1">OOP Architecture</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1">Algorithmic Math</span>
                </div>
                <div className="flex flex-col gap-3 mt-4 border-t-2 border-black pt-4">
                  <h4 className="text-lg font-black uppercase text-black">Core Engine Specs:</h4>
                  <div className="flex flex-col gap-2.5">
                    <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000]">
                      <p className="text-xs font-black uppercase text-[#FF4D00]">01 / Simulation Engines</p>
                      <p className="text-xs font-bold text-black mt-0.5">Mathematical solvers and gravity simulation engines built using custom C++ matrices.</p>
                    </div>
                    <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000]">
                      <p className="text-xs font-black uppercase text-[#0047FF]">02 / System Automation</p>
                      <p className="text-xs font-bold text-black mt-0.5">Cross-platform OS level scripts and network automation sockets programmed in Python.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold uppercase italic text-black mt-4">C++ & Python Specialist</p>
          </div>
          <div className="bento-item md:col-span-1 border-4 border-black bg-[#FF4D00] p-8 shadow-[12px_12px_0px_0px_#000]">
            <div className="h-full flex items-center justify-center">
              <Zap size={80} strokeWidth={3} className="text-black" />
            </div>
          </div>
          <div className="bento-item md:col-span-1 border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#000]">
            <h4 className="text-3xl font-black uppercase text-black">Supabase BaaS</h4>
            <p className="mt-4 font-bold text-black text-sm">Real-time database, auth, and storage services.</p>
          </div>
          <div className="bento-item md:col-span-2 border-4 border-black bg-[#0047FF] text-white p-8 shadow-[12px_12px_0px_0px_#000]">
            <div className="flex justify-between items-end h-full">
              <h4 className="text-4xl font-black uppercase italic text-white">Full-Stack Dev</h4>
              <Hexagon size={48} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TickerTape() {
  return (
    <section className="bg-black py-12 overflow-hidden flex flex-col gap-6">
      <Marquee text="EPRIN NOBLE RISHO" direction={1} className="bg-[#FF4D00] rotate-2 scale-110 border-y-0" />
      <Marquee text="C++ • PYTHON • SUPABASE • FIREBASE" direction={-1} className="bg-[#CCFF00] -rotate-1 scale-105 border-y-0" />
      <Marquee text="WINGS TUITION • FRENCH BAKERS" direction={1} className="bg-[#0047FF] rotate-1 text-white border-y-0" />
    </section>
  );
}

export function SplitInteractive({ onScrollToWhyUs }: { onScrollToWhyUs?: React.RefObject<HTMLDivElement> }) {
  const container = useRef<HTMLElement>(null);
  const leftSide = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftSide.current,
        pinSpacing: false
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="bg-[#E0E0E0] border-b-8 border-black">
      <div ref={onScrollToWhyUs} className="flex flex-col md:flex-row">
        <div ref={leftSide} className="w-full md:w-1/2 h-auto md:h-screen flex items-center justify-center bg-[#FF4D00] p-12 border-b-8 md:border-b-0 md:border-r-8 border-black z-10">
          <h2 className="text-[15vw] md:text-[8vw] font-black uppercase leading-none text-black text-center py-12">
            WHY <br /> <span className="text-white" style={{ WebkitTextStroke: "3px black" }}>ME?</span>
          </h2>
        </div>
        <div className="w-full md:w-1/2 px-6 py-32 space-y-32">
          {[
            { title: "Full-Stack Capability", desc: "React, Node.js, PHP, and databases (MongoDB/MySQL) to build end-to-end web products." },
            { title: "Backend & BaaS", desc: "Supabase & Firebase integration for real-time databases, authentication, and cloud storage." },
            { title: "Object-Oriented Logic", desc: "Strong C++ & Python fundamentals with focus on OOP design patterns and algorithms." },
            { title: "Client Deployed", desc: "Three live production web applications launched for local commercial clients." }
          ].map((item, i) => (
            <div key={i} className="border-3 sm:border-4 border-black bg-white p-6 sm:p-8 md:p-12 shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000]">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#FF4D00]">0{i + 1}</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mt-3 sm:mt-4 mb-4 sm:mb-6 text-black">{item.title}</h3>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ABOUT ME — Academic Background + Skills (Exam Q3B: Points 2 & 3)
export function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-card", {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 30%",
          scrub: 1,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-32 border-b-8 border-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter text-black">
            About <br /> <span className="text-[#FF4D00]">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Background */}
          <div className="about-card border-4 border-black bg-[#E0E0E0] p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_#000] md:shadow-[12px_12px_0px_0px_#000]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-4 border-black bg-[#0047FF] flex items-center justify-center flex-shrink-0">
                <Star size={24} className="text-white fill-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">Academic Background</h3>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                <p className="text-xs font-black uppercase text-[#FF4D00]">University</p>
                <p className="text-base sm:text-lg font-black text-black">Lovely Professional University (LPU)</p>
              </div>
              <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                <p className="text-xs font-black uppercase text-[#0047FF]">Program</p>
                <p className="text-base sm:text-lg font-black text-black">B.Tech — Computer Science & Engineering</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-xs font-black uppercase text-gray-500">CGPA</p>
                  <p className="text-xl sm:text-2xl font-black text-black">7.2 / 10</p>
                </div>
                <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-xs font-black uppercase text-gray-500">Batch</p>
                  <p className="text-xl sm:text-2xl font-black text-black">2025–2029</p>
                </div>
              </div>
              <div className="border-2 border-black bg-[#CCFF00] p-4 shadow-[4px_4px_0px_0px_#000]">
                <p className="text-xs font-black uppercase text-black mb-2">Coursework Focus</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">Cloud Computing</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">OOP</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">AI & ML</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">Data Structures</span>
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">Networking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="about-card border-4 border-black bg-[#E0E0E0] p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_#000] md:shadow-[12px_12px_0px_0px_#000]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-4 border-black bg-[#CCFF00] flex items-center justify-center flex-shrink-0">
                <Zap size={24} className="text-black" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">My Skills</h3>
            </div>

            {/* Technical Skills */}
            <div className="mb-6">
              <p className="text-sm font-black uppercase text-[#FF4D00] mb-3 border-b-2 border-black pb-2">Technical Skills</p>
              <div className="space-y-3">
                {[
                  { name: "C++ / Python", level: 85 },
                  { name: "React / TypeScript", level: 80 },
                  { name: "Node.js / Express", level: 75 },
                  { name: "Supabase / Firebase", level: 78 },
                  { name: "Ollama / AI APIs", level: 65 },
                  { name: "MongoDB / MySQL", level: 70 },
                ].map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-black w-28 sm:w-36 md:w-40 flex-shrink-0 truncate">{skill.name}</span>
                    <div className="flex-1 h-3.5 sm:h-4 border-2 border-black bg-white">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-black w-8 text-right">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <p className="text-sm font-black uppercase text-[#0047FF] mb-3 border-b-2 border-black pb-2">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {["Problem Solving", "Team Collaboration", "Communication", "Time Management", "Adaptability", "Quick Learner", "Self-Motivated", "Analytical Thinking"].map((skill, i) => (
                  <span key={i} className="border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] text-black">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// EXPERIENCE & INTERNSHIP (Exam Q3B: Points 4 & 5)
export function Experience() {
  return (
    <section className="bg-black py-32 border-b-8 border-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter text-white">
            Experience & <br /> <span className="text-[#CCFF00]">Internship</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Freelance Experience */}
          <div className="border-4 border-white bg-[#1A1A1A] p-10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#FF4D00] text-black text-xs font-black uppercase px-2 py-1">Experience</span>
              <span className="bg-white text-black text-xs font-black uppercase px-2 py-1">2nd Sem 2025 — Present</span>
            </div>
            <h3 className="text-3xl font-black uppercase text-white mt-4 mb-2">Freelance Web Developer</h3>
            <p className="text-sm font-bold text-gray-400 uppercase mb-6">Self-Employed • Remote • Started in 2nd Semester</p>
            <div className="space-y-3">
              {[
                "Built and deployed 3 commercial websites for active businesses",
                "Designed responsive frontends with React, TypeScript, and Tailwind CSS",
                "Managed full project lifecycle from client meetings to production deployment",
                "Implemented SEO optimization, PWA capabilities, and performance tuning",
                "Handled hosting, domain configuration, and post-launch maintenance"
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-[#CCFF00] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">React</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">TypeScript</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">Vite</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">Vercel</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">SEO</span>
            </div>
          </div>

          {/* Backend & BaaS Experience */}
          <div className="border-4 border-white bg-[#1A1A1A] p-10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#0047FF] text-white text-xs font-black uppercase px-2 py-1">Backend / BaaS</span>
              <span className="bg-white text-black text-xs font-black uppercase px-2 py-1">2025 — Present</span>
            </div>
            <h3 className="text-3xl font-black uppercase text-white mt-4 mb-2">Backend & Cloud Services</h3>
            <p className="text-sm font-bold text-gray-400 uppercase mb-6">Supabase • Firebase • Google Stitch</p>
            <div className="space-y-3">
              {[
                "Built full-stack apps with Supabase for authentication, database, and real-time features",
                "Integrated Firebase for hosting, Firestore database, and push notifications",
                "Used Google Stitch for data aggregation and third-party API orchestration",
                "Managed and secured API keys across multiple environments and platforms",
                "Designed REST API integrations connecting frontends to BaaS providers"
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-[#FF4D00] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">Supabase</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">Firebase</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">Google Stitch</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">REST APIs</span>
              <span className="border border-gray-600 text-gray-400 text-xs font-bold px-2 py-1">API Keys</span>
            </div>
          </div>

          {/* AI / LLM Experience */}
          <div className="border-4 border-white bg-[#1A1A1A] p-10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)] md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#CCFF00] text-black text-xs font-black uppercase px-2 py-1">AI / LLM</span>
              <span className="bg-white text-black text-xs font-black uppercase px-2 py-1">2025 — Present</span>
            </div>
            <h3 className="text-3xl font-black uppercase text-white mt-4 mb-2">AI & Local LLM Integration</h3>
            <p className="text-sm font-bold text-gray-400 uppercase mb-6">Ollama • Local Models • API Integration</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Running and experimenting with local LLMs using Ollama for AI-powered workflows",
                "Integrating AI model APIs into web applications for intelligent features",
                "Managing API keys, rate limits, and secure credential handling across services"
              ].map((point, i) => (
                <div key={i} className="border-2 border-gray-700 p-4 flex items-start gap-2">
                  <span className="h-2 w-2 bg-[#CCFF00] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-300">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// STRENGTHS & ACHIEVEMENTS (Exam Q3B: Point 7)
export function StrengthsAchievements() {
  return (
    <section className="relative bg-white py-32 border-b-8 border-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter text-black">
            Strengths & <br /> <span className="text-[#0047FF]">Achievements</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="border-4 border-black bg-[#CCFF00] p-10 shadow-[12px_12px_0px_0px_#000]">
            <h3 className="text-3xl font-black uppercase text-black mb-8">My Strengths</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Problem Solver", icon: "🧠", desc: "Logical approach to breaking down complex challenges" },
                { title: "Quick Learner", icon: "⚡", desc: "Rapidly adopt new frameworks & technologies" },
                { title: "Self-Driven", icon: "🚀", desc: "Built 3 commercial sites without external guidance" },
                { title: "Adaptable", icon: "🔄", desc: "Comfortable shifting between frontend, backend, & cloud" },
                { title: "Detail Oriented", icon: "🎯", desc: "Clean code practices and pixel-perfect UI delivery" },
                { title: "Team Player", icon: "🤝", desc: "Effective communication with clients and collaborators" },
              ].map((s, i) => (
                <div key={i} className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-sm font-black uppercase text-black">{s.title}</p>
                  <p className="text-xs font-bold text-gray-600 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="border-4 border-black bg-[#FF4D00] p-10 shadow-[12px_12px_0px_0px_#000]">
            <h3 className="text-3xl font-black uppercase text-black mb-8">Key Achievements</h3>
            <div className="space-y-4">
              {[
                {
                  title: "3 Live Commercial Websites",
                  desc: "Designed, developed, and deployed production websites for real businesses starting from 2nd semester.",
                  tag: "PROJECTS"
                },
                {
                  title: "BaaS & API Integration",
                  desc: "Hands-on experience with Supabase, Firebase, and Google Stitch — building production backends.",
                  tag: "BACKEND"
                },
                {
                  title: "AI & LLM Exploration",
                  desc: "Running local LLMs with Ollama and integrating AI APIs into web applications.",
                  tag: "AI / ML"
                },
                {
                  title: "Freelancing Since 2nd Semester",
                  desc: "Started taking real client projects as a first-year student — now in 2nd year, 3rd semester.",
                  tag: "CAREER"
                },
                {
                  title: "Full-Stack Portfolio Website",
                  desc: "Built this interactive 3D portfolio using React, Three.js, GSAP, and Framer Motion.",
                  tag: "PROJECT"
                },
              ].map((a, i) => (
                <div key={i} className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5">{a.tag}</span>
                  </div>
                  <p className="text-sm font-black uppercase text-black">{a.title}</p>
                  <p className="text-xs font-bold text-gray-600 mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CAREER GOAL & VALUE PROPOSITION (Exam Q3B: Points 8 & 9)
export function CareerGoal() {
  return (
    <section className="relative bg-[#E0E0E0] py-32 border-b-8 border-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] bg-[size:20px_20px]" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Career Goal */}
          <div className="border-4 border-black bg-[#0047FF] p-12 shadow-[12px_12px_0px_0px_#000]">
            <h3 className="text-4xl font-black uppercase text-white mb-6">
              🎯 Career Goal
            </h3>
            <div className="border-2 border-white bg-white/10 p-6 mb-6">
              <p className="text-xl font-black text-white leading-relaxed">
                To become a <span className="bg-[#CCFF00] text-black px-2">Full-Stack Engineer</span> and <span className="bg-[#FF4D00] text-black px-2">AI Systems Developer</span> building scalable, intelligent apps that power real businesses.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white/80">Industries I aspire to work in:</p>
              <div className="flex flex-wrap gap-2">
                {["Cloud Infrastructure", "SaaS Products", "FinTech", "EdTech", "AI / ML Platforms"].map((ind, i) => (
                  <span key={i} className="border-2 border-white text-white text-xs font-black uppercase px-3 py-1.5">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0px_0px_#000]">
            <h3 className="text-4xl font-black uppercase text-black mb-6">
              💎 What I Bring
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Proven Delivery",
                  desc: "3 live production websites — not academic demos, real client projects serving real users.",
                  color: "bg-[#FF4D00]"
                },
                {
                  title: "End-to-End Capability",
                  desc: "From UI design to backend APIs to cloud deployment — I handle the full pipeline.",
                  color: "bg-[#0047FF]"
                },
                {
                  title: "Modern Tech Stack",
                  desc: "React, TypeScript, Node.js, Supabase, Firebase, Ollama — working with modern tools.",
                  color: "bg-[#CCFF00]"
                },
                {
                  title: "Growth Mindset",
                  desc: "Self-taught developer who continuously learns and applies new technologies.",
                  color: "bg-black"
                }
              ].map((v, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn("h-10 w-10 flex-shrink-0 border-2 border-black flex items-center justify-center font-black text-sm", v.color, v.color === 'bg-black' || v.color === 'bg-[#0047FF]' ? 'text-white' : 'text-black')}>
                    0{i + 1}
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase text-black">{v.title}</p>
                    <p className="text-sm font-bold text-gray-600 mt-1">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Credentials({ onScrollToCredentials }: { onScrollToCredentials?: React.RefObject<HTMLDivElement> }) {
  return (
    <section ref={onScrollToCredentials} className="bg-black py-48">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "LPU B.Tech", 
              subtitle: "CSE Student", 
              color: "bg-white", 
              bullets: ["CGPA: 7.2 / 10", "Batch: 2025 - 2029", "Focus on Cloud, OOP & AI"],
              btnText: "LPU Website",
              btnLink: "https://www.lpu.in"
            },
            { 
              title: "Supabase BaaS", 
              subtitle: "Backend Stack", 
              color: "bg-[#FF4D00]", 
              bullets: ["PostgreSQL Database", "User Authentication", "Real-time Subscriptions & Storage"],
              btnText: "Supabase Docs",
              btnLink: "https://supabase.com"
            },
            { 
              title: "Firebase & AI", 
              subtitle: "Cloud & LLM", 
              color: "bg-[#CCFF00]", 
              bullets: ["Firestore & Hosting", "Ollama Local LLMs", "Google Stitch & API Keys"],
              btnText: "Ollama AI",
              btnLink: "https://ollama.com"
            }
          ].map((c, i) => (
            <div key={i} className={cn("relative border-3 sm:border-4 border-black p-6 sm:p-8 md:p-12 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] sm:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none transition-all hover:translate-x-2 hover:translate-y-2 sm:hover:translate-x-4 sm:hover:translate-y-4", c.color)}>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-2 text-black">{c.title}</h3>
                <div className="h-2 w-12 sm:w-16 bg-black mb-4 sm:mb-8" />
                <p className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-black uppercase">{c.subtitle}</p>
              </div>
              <ul className="mt-8 mb-8 space-y-4 font-bold uppercase text-xs md:text-sm text-black">
                {c.bullets.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
              <a 
                href={c.btnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border-3 sm:border-4 border-black bg-white py-3 sm:py-4 text-center text-base sm:text-lg md:text-xl font-black uppercase shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] hover:bg-black hover:text-white transition-colors text-black cursor-pointer block"
              >
                {c.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CharacterReveal() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const content = text.innerText;
    const words = content.split(" ");
    text.innerHTML = "";
    
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "inline-block whitespace-nowrap";

      const chars = word.split("");
      chars.forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.innerText = char;
        charSpan.className = "char opacity-20 inline-block text-black";
        wordSpan.appendChild(charSpan);
      });

      text.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        text.appendChild(document.createTextNode(" "));
      }
    });

    gsap.to(".char", {
      opacity: 1,
      stagger: 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      }
    });
  }, []);

  return (
    <section className="bg-white py-48 border-b-8 border-black overflow-hidden text-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <p ref={textRef} className="text-[6vw] sm:text-[5vw] font-black uppercase leading-none tracking-tighter text-black">
          "I AM A COMPUTER SCIENCE STUDENT PASSIONATE ABOUT SOFTWARE DEVELOPMENT, CLOUD COMPUTING, AND ARTIFICIAL INTELLIGENCE. I ENJOY LEARNING NEW TECHNOLOGIES AND APPLYING THEM."
        </p>
        <div className="mt-12 flex items-center gap-6">
          <div className="h-16 w-16 rounded-full border-4 border-black bg-[#FF4D00] flex items-center justify-center font-display italic text-2xl font-black text-black">
            ER
          </div>
          <div>
            <p className="text-2xl font-black uppercase text-black">Eprin Noble Risho</p>
            <p className="font-bold text-gray-500 uppercase text-black">B.Tech CSE student, LPU 2029 Batch</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TiltRecap() {
  return (
    <section className="bg-[#CCFF00] py-32 border-b-8 border-black overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] bg-[size:20px_20px]" />
      <div className="container mx-auto px-6 relative z-10 text-black">
        <div className="flex flex-wrap gap-8 justify-center">
          {[
            { title: "Fast", color: "bg-[#FF4D00]" },
            { title: "Brutalist", color: "bg-[#0047FF]" },
            { title: "Direct", color: "bg-white" },
            { title: "Vibrant", color: "bg-black" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10 }}
              className={cn("w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 border-3 sm:border-4 border-black p-6 sm:p-8 md:p-12 flex items-center justify-center text-center shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] cursor-pointer", item.color)}
            >
              <h3 className={cn("text-2xl sm:text-3xl md:text-4xl font-black uppercase", item.title === 'Vibrant' ? 'text-white' : 'text-black')}>{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="bg-[#0047FF] py-48 border-b-8 border-black text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-[8vw] font-black leading-none uppercase mb-12">
          LET&apos;S BUILD <br /> <span className="bg-[#CCFF00] text-black px-4 italic">TOGETHER</span>
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
          <a 
            href="mailto:enr.cse@gmail.com"
            className="bg-[#FF4D00] text-black p-4 sm:p-6 md:p-8 text-xl sm:text-2xl md:text-3xl font-black border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] hover:translate-y-2 hover:shadow-none transition-all uppercase whitespace-nowrap cursor-pointer inline-block"
          >
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const triggerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(textRef.current,
      { yPercent: 50 },
      {
        yPercent: 0,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      }
    );
  }, []);

  return (
    <footer ref={triggerRef} className="relative min-h-[80vh] bg-[#FF4D00] px-6 pt-32 pb-12 flex flex-col justify-between overflow-hidden border-t-8 border-black">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-2xl font-bold uppercase tracking-widest text-black">Have an idea?</p>
        </div>

        <div ref={textRef}>
          <h2 className="text-[12vw] font-black leading-[0.8] tracking-tighter text-black">
            LET&apos;S MAKE <br />
            <span className="text-white" style={{ WebkitTextStroke: "4px black" }}>WAVES</span>
          </h2>
        </div>

        <div className="mt-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-t-4 border-black pt-8">
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/enrcse-tech" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/eprin-noble-risho-439b78379" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              LinkedIn
            </a>
            <a href="https://instagram.com/enr.0901" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              Instagram
            </a>
            <a href="https://wa.me/916374434361" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              WhatsApp
            </a>
          </div>
          <p className="font-bold uppercase text-black">© 2026 Eprin Noble Risho.</p>
        </div>
      </div>
    </footer>
  );
}
