"use client";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import React, { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CloudTransition from "@/components/CloudTransition";
import Atmosphere from "@/components/Atmosphere";
import { AnimatedText } from "@/components/ui/animated-shiny-text";

const getStableValue = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  const val = min + (x - Math.floor(x)) * (max - min);
  return Math.round(val * 10000) / 10000; // Round to 4 decimal places for hydration stability
};

/**
 * OPTIMIZED DIVING ATMOSPHERE
 * 1. Reduced count to 30 for better GPU memory handling
 * 2. Pre-calculated values to minimize hook logic
 * 3. Simplified animations (removed complex filters during motion)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DivingAtmosphere = ({ scrollY }: { scrollY: any }) => {
  const cloudCount = 30; // Optimized count

  const clouds = useMemo(() => Array.from({ length: cloudCount }).map((_, i) => {
    const seed = i * 211.7;
    const journeyStart = 3000 + getStableValue(seed, 0, 8000);
    const duration = getStableValue(seed + 1, 2500, 4500);

    return {
      left: getStableValue(seed + 2, -30, 130),
      top: getStableValue(seed + 3, -30, 130),
      img: (i % 4) + 4,
      range: [journeyStart, journeyStart + duration],
      driftSpeed: getStableValue(seed + 4, 30, 60),
      driftDir: 1,
      scale: getStableValue(seed + 5, 0.8, 1.2)
    };
  }), []);

  return (
    <div className="fixed inset-0 z-[15] pointer-events-none overflow-hidden perspective-[1200px]">
      {clouds.map((cloud, i) => (
        <DivingCloud key={i} cloud={cloud} scrollY={scrollY} />
      ))}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DivingCloud = ({ cloud, scrollY }: { cloud: any, scrollY: any }) => {
  // Optimized: Single transform for scale and x-shift to reduce compositor work
  const scale = useTransform(scrollY, [cloud.range[0], cloud.range[1]], [0.01, 12]);
  const opacity = useTransform(scrollY, [cloud.range[0], cloud.range[0] + 500, cloud.range[1] - 500, cloud.range[1]], [0, 0.4, 0.4, 0]);
  const xDrift = useTransform(scrollY, [cloud.range[0], cloud.range[1]], [0, 400 * cloud.driftDir]);

  return (
    <motion.div
      style={{ scale, opacity, x: xDrift }}
      className="absolute inset-0 flex items-center justify-center will-change-transform transform-gpu"
    >
      <div className="absolute" style={{
        left: `${cloud.left}%`,
        top: `${cloud.top}%`,
        width: '1600px',
        animation: `drift ${cloud.driftSpeed}s linear infinite`,
        willChange: 'transform'
      }}>
        {/* OPTIMIZED: Width/Height for better resizing */}
        <Image src={`/images/cloud${cloud.img}.webp`} alt="" width={1000} height={1000} className="w-full h-auto opacity-50" />
      </div>
    </motion.div>
  );
};

const ProjectIsland = ({ title, category, num, side = "left" }: { title: string; category: string; num: string, side?: "left" | "right" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);
  const glowX = useTransform(smoothX, [0, 1], ["-20%", "20%"]);
  const glowY = useTransform(smoothY, [0, 1], ["-20%", "20%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  // Magnetic Typography
  const titleX = useTransform(smoothX, [0, 1], [-25, 25]);
  const titleY = useTransform(smoothY, [0, 1], [-25, 25]);

  return (
    <div ref={ref} className={`relative h-[80vh] flex items-center ${side === "left" ? "justify-start pl-20" : "justify-end pr-20"} w-full`}>
      <motion.div
        style={{ opacity, y, scale, transformStyle: "preserve-3d" }}
        className="relative z-10"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative group w-[500px] h-[300px] lg:w-[650px] lg:h-[380px] pointer-events-auto cursor-none lg:cursor-default"
        >
          <div className="absolute inset-0 bg-[#0A2540]/90 border border-white/20 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden">
            <motion.div
              style={{ x: glowX, y: glowY }}
              className="absolute -inset-full bg-gradient-to-br from-[#FF9F1C]/20 to-transparent blur-[80px] pointer-events-none"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="absolute inset-0 p-12 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[#FF9F1C] text-xs font-black tracking-[20px]">{num}</span>
                <div className="h-px flex-1 mx-10 bg-white/10" />
              </div>

              <motion.div style={{ x: titleX, y: titleY, transformStyle: "preserve-3d" }}>
                <h3 className="text-white text-4xl lg:text-[4.5vw] font-black tracking-tighter leading-none mb-6 drop-shadow-2xl">
                  {title}
                </h3>
                <p className="text-[#FF9F1C] text-[10px] tracking-[10px] uppercase font-black">{category}</p>
              </motion.div>
            </div>
          </div>
          <div className="absolute -inset-10 bg-[#FF9F1C]/2 blur-[100px] -z-10" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const introScale = useTransform(scrollY, [1800, 2600, 3200], [1, 1.2, 12]);
  const introOpacity = useTransform(scrollY, [2500, 3200], [1, 0]);
  const bgOpacity = useTransform(scrollY, [2000, 3500], [0, 1]);
  const atmosphereOpacity = 1;
  const divingOpacity = useTransform(scrollY, [6000, 7000], [1, 0]);

  // Localized Cloud Parallaxes
  const cloudAboutY1 = useTransform(scrollY, [6000, 8000], [0, -200]);
  const cloudAboutY2 = useTransform(scrollY, [6000, 8000], [0, -400]);
  const cloudAboutY3 = useTransform(scrollY, [6000, 8000], [0, -600]);

  const cloudContactY1 = useTransform(scrollY, [8000, 10000], [0, -300]);
  const cloudContactY2 = useTransform(scrollY, [8000, 10000], [0, -150]);
  const cloudContactY3 = useTransform(scrollY, [8000, 10000], [0, -500]);
  const cloudContactY4 = useTransform(scrollY, [8000, 10000], [0, -700]);

  // Removed fixed scroll hooks for about - will use whileInView for smoother transition

  if (!isMounted) return <main className="bg-[#0A2540] min-h-screen" />;

  return (
    <main ref={containerRef} className="relative selection:bg-[#FF9F1C] selection:text-[#0A2540] bg-[#0A2540] !overflow-x-hidden">
      <Nav />
      <Atmosphere opacity={atmosphereOpacity} />

      {/* NO LAG DIVING LAYER */}
      <motion.div style={{ opacity: divingOpacity }}>
        <DivingAtmosphere scrollY={scrollY} />
      </motion.div>


      <div className="relative z-30">
        <section className="h-[100vh]">
          <Hero />
        </section>
        <section className="h-[60vh]">
          <CloudTransition />
        </section>

        <div className="relative h-[200vh]">
          <motion.section
            style={{ scale: introScale, opacity: introOpacity }}
            className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6"
          >
            <h2 className="text-[#FF9F1C] text-[10px] font-black uppercase tracking-[30px] mb-12 opacity-50">Discovery</h2>
            <h3 className="text-white text-7xl lg:text-[10vw] font-[1000] tracking-tighter uppercase italic leading-none">
              Sea of<br /><span className="text-[#FF9F1C] not-italic">Clouds</span>
            </h3>
          </motion.section>
        </div>

        <div id="projects" className="relative py-[20vh] space-y-[20vh]">
          <ProjectIsland num="01" category="Architectural" title="Nordic Peak" side="left" />
          <ProjectIsland num="02" category="Cinematic" title="Aura Labs" side="right" />
          <ProjectIsland num="03" category="Interactive" title="Digital Soul" side="left" />
          <ProjectIsland num="04" category="Branding" title="Netaspan Core" side="right" />
        </div>

        <section id="about" className="relative min-h-screen flex flex-col items-center justify-center py-64 bg-transparent overflow-hidden">
          {/* Decorative Clouds: LAYERED BACKGROUND */}
          <motion.div
            style={{ y: cloudAboutY1 }}
            className="absolute top-0 left-[-15%] w-[1200px] h-[900px] opacity-20 pointer-events-none"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 200s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud4.webp" alt="" fill className="object-contain" /></div>)}
            </div>
          </motion.div>
          <motion.div
            style={{ y: cloudAboutY2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[1500px] h-[1100px] opacity-15 pointer-events-none grayscale brightness-150"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 180s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud6.webp" alt="" fill className="object-contain" /></div>)}
            </div>
          </motion.div>

          {/* ADDED LAYERED CLOUDS (FOREGROUND - OVERLAPS TEXT) */}
          <motion.div
            style={{ y: cloudAboutY3 }}
            className="absolute top-[10%] right-[10%] w-[1000px] h-[800px] opacity-25 z-40 pointer-events-none"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 120s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud5.webp" alt="" fill className="object-contain brightness-125" /></div>)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-200px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center mb-32 z-20"
          >
            <h2 className="text-[#FF9F1C] text-[10vw] font-black uppercase tracking-[-0.05em] opacity-5 leading-none">Creative</h2>
            <h2 className="text-white text-[12vw] font-black uppercase tracking-[-0.08em] leading-none -mt-10 lg:-mt-20">Agility</h2>
            <h2 className="text-[#FF9F1C] text-[10vw] font-black uppercase tracking-[-0.05em] opacity-5 leading-none -mt-10 lg:-mt-20">Studio</h2>
          </motion.div>

          <div className="max-w-4xl px-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-40"
            >
              <p className="text-white text-2xl lg:text-4xl font-bold leading-tight tracking-tighter mb-12 italic">
                “Bridging architectural precision with cinematic motion to help small businesses dominate the digital sea.”
              </p>
              <p className="text-white/50 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Netaspan builds more than just websites. We architect business ideas, full-scale digital portals, AI agents, and custom social ecosystems tailored for global and local growth.
              </p>
            </motion.div>
          </div>
        </section>
        {/* CONTACT SECTION: THE STACKING REVEAL */}
        <section id="contact" className="relative h-[150vh] flex flex-col items-center justify-center bg-transparent overflow-hidden">
          {/* Section Clouds: LAYERED BACKGROUND */}
          <motion.div
            style={{ y: cloudContactY1, scale: 1.2 }}
            className="absolute top-[-15%] right-[-15%] w-[1400px] h-[1100px] opacity-20 pointer-events-none"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 220s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud6.webp" alt="" fill className="object-contain" /></div>)}
            </div>
          </motion.div>
          <motion.div
            style={{ y: cloudContactY2 }}
            className="absolute bottom-[0%] left-[-20%] w-[1200px] h-[900px] opacity-15 pointer-events-none blur-sm"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 190s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud7.webp" alt="" fill className="object-contain" /></div>)}
            </div>
          </motion.div>

          {/* ADDED LAYERED CLOUDS: FRONT OVERLAY (OVERLAPS TEXT) */}
          <motion.div
            style={{ y: cloudContactY3 }}
            className="absolute top-[25%] left-[10%] w-[1300px] h-[1000px] opacity-35 z-40 pointer-events-none"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 100s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud4.webp" alt="" fill className="object-contain brightness-150" /></div>)}
            </div>
          </motion.div>

          <motion.div
            style={{ y: cloudContactY4 }}
            className="absolute bottom-[-10%] right-[-15%] w-[1600px] h-[1100px] opacity-20 z-50 pointer-events-none"
          >
            <div className="w-[200%] h-full flex" style={{ animation: 'drift 140s linear infinite' }}>
              {[0, 1].map(i => <div key={i} className="flex-1 relative h-full"><Image src="/images/cloud6.webp" alt="" fill className="object-contain" /></div>)}
            </div>
          </motion.div>

          <div className="text-center px-6">
            <AnimatedText
              text="Let's Build"
              gradientColors="linear-gradient(90deg, #FF9F1C, #FFFFFF, #FF9F1C)"
              textClassName="text-7xl lg:text-[12vw] font-black tracking-tight italic uppercase"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 space-y-6"
            >
              <h4 className="text-white text-base lg:text-xl font-bold tracking-tight mb-2 italic">Global & Kazakhstan Operations</h4>
              <p className="text-[#FF9F1C] text-xs font-black tracking-[8px] uppercase">netaspan.agency@gmail.com</p>

              <div className="pt-12 flex flex-col items-center gap-6">
                <a href="#" className="flex flex-col items-center group">
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-[10px] group-hover:text-[#FF9F1C] transition-colors">Order via Telegram</span>
                  <span className="text-white text-lg font-black tracking-tighter mt-2">@netaspan_agency</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="h-[20vh] flex items-center justify-center border-t border-white/5 opacity-20">
          <span className="text-[10px] font-black tracking-[20px] uppercase">© 2026 Netaspan Digital</span>
        </section>
      </div>
    </main>
  );
}
