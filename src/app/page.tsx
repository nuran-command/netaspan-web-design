"use client";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CloudTransition from "@/components/CloudTransition";
import Atmosphere from "@/components/Atmosphere";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const ProjectCard = ({ title, category, num }: { title: string; category: string; num: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
    className="group relative h-[60vh] lg:h-[70vh] w-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-black/20"
  >
    {/* Clean, minimalist card backdrop */}
    <div className="absolute inset-0 bg-[#2A4B6B]/40 backdrop-blur-3xl border border-white/10 transition-all duration-700 group-hover:bg-[#FF9F1C]/5 group-hover:scale-[1.02]" />
    
    <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
      <div className="flex justify-between items-start">
        <span className="text-[#FF9F1C] text-[10px] font-black tracking-[10px] uppercase">{num}</span>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-[2px] text-white/40 group-hover:text-[#FF9F1C] group-hover:border-[#FF9F1C]/30 transition-colors">
          Case Study
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-4 mb-4">
           <div className="w-8 h-[1px] bg-[#FF9F1C]" />
           <p className="text-white/60 text-[10px] tracking-[5px] uppercase font-bold">{category}</p>
        </div>
        <h3 className="text-white text-5xl lg:text-7xl font-black transition-transform duration-700 group-hover:translate-x-4">
          {title}
        </h3>
      </div>
    </div>

    {/* Elegant Interactive Glow */}
    <div className="absolute -inset-20 bg-gradient-to-tr from-[#FF9F1C]/10 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100 blur-[60px]" />
  </motion.div>
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // BACKGROUND TRANSITION: Deep sky to Lighter slate-blue mix
  // Starts fading in when we reach the Projects section
  const sectionBgOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const atmosphereOpacity = useTransform(scrollYProgress, [0.45, 0.55], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen selection:bg-[#FF9F1C] selection:text-[#0A2540] bg-[#0A2540] !overflow-x-hidden">
      <Nav />
      
      {/* 1. ATMOSPHERE (Fixed Background Layer) */}
      <motion.div style={{ opacity: atmosphereOpacity }}>
        <Atmosphere />
      </motion.div>

      {/* 2. SOLID OVERLAY (Fades in to 'End' the mountains and start the new page) */}
      <motion.div 
        style={{ opacity: sectionBgOpacity }}
        className="fixed inset-0 z-0 bg-gradient-to-b from-[#1A3A5A] to-[#0D1F2F] pointer-events-none" 
      />

      {/* 3. CONTENT SECTIONS */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="relative h-[100vh] !overflow-visible">
          <Hero contentOnly={true} />
        </section>
        
        {/* TRANSITION */}
        <section className="relative h-[60vh] !overflow-visible">
          <CloudTransition contentOnly={true} />
        </section>

        {/* DISCOVER (The Peak of the Mountains) */}
        <section className="min-h-[100vh] flex items-center justify-center relative !overflow-visible">
          <div className="text-center relative z-30 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="text-[#FF9F1C] text-sm lg:text-base font-bold uppercase tracking-[15px] mb-8">
                The Descent
              </h2>
              <div className="w-1 h-32 bg-gradient-to-b from-[#FF9F1C] to-transparent mx-auto mb-10" />
            </motion.div>
          </div>
        </section>

        {/* 4. PROJECTS SECTION (The 'New Page' feeling) */}
        <section id="projects" className="relative py-60 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col lg:flex-row justify-between items-baseline mb-32 gap-6"
            >
              <h2 className="text-white text-6xl lg:text-9xl font-black tracking-tight leading-[0.9]">
                Cinematic<br/><span className="text-[#FF9F1C] italic">Portfolio</span>
              </h2>
              <p className="text-white/40 tracking-[6px] uppercase text-xs font-bold border-l border-white/10 pl-8">
                Curated Works<br/>Autumn 2024
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
              <ProjectCard num="01" category="Global Architecture" title="Nordic Peak" />
              <ProjectCard num="02" category="Digital Experience" title="Aura Labs" />
              <ProjectCard num="03" category="Visual Identity" title="Digital Soul" />
              <ProjectCard num="04" category="Product Strategy" title="Rottor Core" />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section className="h-[100vh] flex flex-col items-center justify-center p-10 mt-40">
           <motion.div
             whileInView={{ opacity: [0, 1], y: [20, 0] }}
             className="text-center"
           >
              <h2 className="text-white/10 text-9xl lg:text-[20vw] font-black uppercase tracking-tighter leading-none mb-20 pointer-events-none">
                ROTTOR
              </h2>
              <button className="px-12 py-5 bg-[#FF9F1C] text-[#0A2540] text-xs font-black uppercase tracking-[5px] rounded-full hover:scale-110 transition-transform">
                Start a Project
              </button>
           </motion.div>
        </section>
      </div>
    </main>
  );
}
