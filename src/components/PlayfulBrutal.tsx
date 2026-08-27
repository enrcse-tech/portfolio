import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Star, Hexagon, Zap, Box, Smile } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

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
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center gap-4 md:gap-8 rounded-full border-4 border-black bg-white px-5 md:px-8 py-3 md:py-4 shadow-[4px_4px_0px_0px_#000]">
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
    <section ref={container} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#E0E0E0] pt-24 pb-16">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div ref={shapeRef} className="absolute right-[10%] top-[15%] hidden md:block">
        <Star size={180} strokeWidth={1} className="fill-[#CCFF00] text-black drop-shadow-[8px_8px_0px_#000]" />
      </div>

      <div ref={textRef} className="relative z-10 text-center select-none">
        <div className="overflow-hidden">
          <h1 className="hero-text text-[14vw] font-black leading-[0.8] tracking-tighter text-[#1A1A1A]">
            EPRIN
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-text text-[14vw] font-black leading-[0.8] tracking-tighter text-[#FF4D00] stroke-black" style={{ WebkitTextStroke: "4px black", color: "#FF4D00" }}>
            NOBLE
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-text text-[14vw] font-black leading-[0.8] tracking-tighter text-[#1A1A1A]">
            RISHO
          </h1>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <MagneticBtn onClick={onScrollToWork} className="bg-[#0047FF] text-white">View Projects</MagneticBtn>
        <a href="mailto:enr.cse@gmail.com">
          <MagneticBtn className="bg-white hover:bg-[#CCFF00] text-black">Say hi <ArrowUpRight className="ml-2" /></MagneticBtn>
        </a>
      </div>

      <div className="absolute bottom-12 left-12 hidden md:block">
        <div className="w-32 animate-spin-slow text-black fill-black">
          <svg viewBox="0 0 100 100" width="100" height="100">
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
            img="/Screenshot 2026-08-27 103145.png"
            color="bg-[#FF4D00]"
            url="https://wingstuition.com"
          />
          <BrutalCard
            title="Wings Intl School"
            img="/Screenshot 2026-08-27 103212.png"
            color="bg-[#CCFF00]"
            url="https://wingsinternationalschool.com"
          />
          <BrutalCard
            title="French Bakers"
            img="/Screenshot 2026-08-27 103238.png"
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
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          <div className="bento-item md:col-span-2 md:row-span-2 border-4 border-black bg-[#CCFF00] p-12 flex flex-col justify-between shadow-[12px_12px_0px_0px_#000]">
            <h3 className="text-6xl font-black uppercase text-black">Visual <br /> Engine</h3>
            <p className="text-2xl font-bold uppercase italic text-black">C++ & Python Specialist</p>
          </div>
          <div className="bento-item md:col-span-1 border-4 border-black bg-[#FF4D00] p-8 shadow-[12px_12px_0px_0px_#000]">
            <div className="h-full flex items-center justify-center">
              <Zap size={80} strokeWidth={3} className="text-black" />
            </div>
          </div>
          <div className="bento-item md:col-span-1 border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#000]">
            <h4 className="text-3xl font-black uppercase text-black">AWS Cloud</h4>
            <p className="mt-4 font-bold text-black text-sm">Designing secure, scalable host architectures.</p>
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
      <Marquee text="C++ • PYTHON • AWS CLOUD" direction={-1} className="bg-[#CCFF00] -rotate-1 scale-105 border-y-0" />
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
            { title: "Cloud Architecture", desc: "Deploying, hosting, and maintaining active server instances and CDNs on AWS." },
            { title: "Object-Oriented Logic", desc: "Deep logic foundation in C++ & Python with 200+ solved programming problems." },
            { title: "Client Deployed", desc: "Three live production web applications launched for local commercial clients." }
          ].map((item, i) => (
            <div key={i} className="border-4 border-black bg-white p-12 shadow-[12px_12px_0px_0px_#000]">
              <span className="text-6xl font-black text-[#FF4D00]">0{i + 1}</span>
              <h3 className="text-4xl font-black uppercase mt-4 mb-6 text-black">{item.title}</h3>
              <p className="text-xl font-bold text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FloatingStickers() {
  return (
    <section className="relative h-[60vh] bg-white border-b-8 border-black flex items-center justify-center overflow-hidden">
      <div className="text-center z-10 px-6">
        <h2 className="text-6xl md:text-9xl font-black uppercase leading-tight italic text-black">
          Student <span className="bg-[#CCFF00] px-4">Creator</span>
        </h2>
      </div>
      {/* Floating elements */}
      {[
        { icon: <Star size={100} className="fill-[#FF4D00] text-black" />, pos: "top-10 left-[10%]" },
        { icon: <Zap size={100} className="fill-[#0047FF] text-white" />, pos: "bottom-20 right-[15%]" },
        { icon: <Smile size={100} className="fill-[#CCFF00] text-black" />, pos: "top-[20%] right-[10%]" },
        { icon: <Hexagon size={100} className="fill-black text-black" />, pos: "bottom-[10%] left-[20%]" },
      ].map((s, i) => (
        <div key={i} className={cn("absolute scale-[0.5] md:scale-1 pointer-events-none", s.pos)}>
          <div className="animate-bounce" style={{ animationDuration: `${(i + 2) * 0.5}s` }}>
            {s.icon}
          </div>
        </div>
      ))}
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
              title: "AWS Cloud", 
              subtitle: "Academy Certs", 
              color: "bg-[#FF4D00]", 
              bullets: ["Cloud Foundations", "Cloud Architecting", "VPC & Serverless Setup"],
              btnText: "AWS Academy",
              btnLink: "https://aws.amazon.com/training/"
            },
            { 
              title: "CCNA Network", 
              subtitle: "Cisco Academy", 
              color: "bg-[#CCFF00]", 
              bullets: ["Routing & Switching", "IP Subnetting & Topologies", "Network Security"],
              btnText: "Cisco Networking",
              btnLink: "https://www.netacad.com"
            }
          ].map((c, i) => (
            <div key={i} className={cn("relative border-4 border-black p-12 flex flex-col justify-between shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none transition-all hover:translate-x-4 hover:translate-y-4", c.color)}>
              <div>
                <h3 className="text-4xl font-black uppercase mb-2 text-black">{c.title}</h3>
                <div className="h-2 w-16 bg-black mb-8" />
                <p className="text-2xl font-black tracking-tighter text-black uppercase">{c.subtitle}</p>
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
                className="w-full border-4 border-black bg-white py-4 text-center text-xl font-black uppercase shadow-[8px_8px_0px_0px_#000] hover:bg-black hover:text-white transition-colors text-black hover:text-white cursor-pointer block"
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
        <p ref={textRef} className="text-[5vw] font-black uppercase leading-none tracking-tighter text-black">
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
              className={cn("w-64 h-64 border-4 border-black p-12 flex items-center justify-center text-center shadow-[12px_12px_0px_0px_#000] cursor-pointer", item.color)}
            >
              <h3 className={cn("text-4xl font-black uppercase", item.title === 'Vibrant' ? 'text-white' : 'text-black')}>{item.title}</h3>
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
            className="bg-[#FF4D00] text-black p-8 text-3xl font-black border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:translate-y-2 hover:shadow-none transition-all uppercase whitespace-nowrap cursor-pointer inline-block"
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
          <div className="flex gap-4">
            <a href="https://github.com/enrcse-tech" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/eprin-noble-risho-439b78379" target="_blank" rel="noopener noreferrer" className="border-2 border-black bg-white px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all text-black">
              LinkedIn
            </a>
          </div>
          <p className="font-bold uppercase text-black">© 2026 Eprin Noble Risho.</p>
        </div>
      </div>
    </footer>
  );
}
