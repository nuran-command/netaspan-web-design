"use client";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CloudTransition from "@/components/CloudTransition";
import Atmosphere from "@/components/Atmosphere";
import { motion } from "framer-motion";
import Image from "next/image";

const ProjectCard = ({ title, category, num }: { title: string; category: string; num: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
    className="group relative h-[60vh] lg:h-[70vh] w-full rounded-2xl overflow-hidden cursor-pointer"
  >
    {/* Dark glass backdrop */}
    <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-700 group-hover:bg-white/10 group-hover:scale-105" />
    
    {/* Texture Overlay */}
    <div className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40" 
         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

    {/* Content */}
    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
      <div className="flex justify-between items-start">
        <span className="text-[#FF9F1C] text-xs font-bold tracking-[8px] uppercase">{num}</span>
        <div className="w-12 h-[1px] bg-white/20 transition-all duration-700 group-hover:w-20 group-hover:bg-[#FF9F1C]" />
      </div>
      
      <div>
        <p className="text-white/40 text-[10px] tracking-[6px] uppercase mb-4 font-bold">{category}</p>
        <h3 className="text-white text-4xl lg:text-5xl font-black transition-transform duration-700 group-hover:translate-x-4">
          {title}
        </h3>
      </div>
    </div>

    {/* Reveal Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F1C]/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
  </motion.div>
);

export default function Home() {
  return (
    <main className="relative min-h-screen selection:bg-[#FF9F1C] selection:text-[#0A2540] bg-[#0A2540] !overflow-x-hidden">
      <Nav />
      <Atmosphere />

      {/* 1. HERO */}
      <section className="relative h-[100vh] z-10 !overflow-visible">
        <Hero contentOnly={true} />
      </section>
      
      {/* 2. TRANSITION */}
      <section className="relative h-[60vh] z-10 !overflow-visible">
        <CloudTransition contentOnly={true} />
      </section>

      {/* 3. DISCOVER (Mountain Peak Backdrop) */}
      <section className="min-h-[100vh] mt-[-10vh] flex items-center justify-center relative z-20 bg-transparent !overflow-visible">
        <div className="text-center relative z-30 px-4 pt-40 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="text-[#FF9F1C] text-sm lg:text-base font-bold uppercase tracking-[10px] mb-8 drop-shadow-[0_10px_30px_rgba(255,159,28,0.3)]">
              Digital Vista
            </h2>
            <p className="max-w-xl mx-auto text-white/50 font-medium leading-relaxed tracking-wide text-sm lg:text-base text-balance">
              Where architectural scale meets cinematic fluidity. We craft 
              experiences that transcend the standard web boundary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. PROJECTS SECTION */}
      <section id="projects" className="relative z-30 py-40 px-6 lg:px-20 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
            <div>
              <h2 className="text-white text-5xl lg:text-8xl font-black tracking-tight mb-4">
                Selected<br/><span className="text-[#FF9F1C]">Pieces</span>
              </h2>
              <p className="text-white/30 tracking-[4px] uppercase text-[10px] font-bold">Featured Works 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProjectCard num="01" category="Architectural" title="Nordic Peak" />
            <ProjectCard num="02" category="Cinematic" title="Aura Labs" />
            <ProjectCard num="03" category="Interactive" title="Digital Soul" />
            <ProjectCard num="04" category="Branding" title="Rottor Core" />
          </div>
        </div>
      </section>

      {/* FOOTER PERSPECTIVE */}
      <section className="h-[80vh] flex items-center justify-center border-t border-white/5 relative z-40 bg-transparent !overflow-visible">
        <span className="text-white/5 uppercase tracking-[30px] font-black italic text-4xl lg:text-9xl select-none">
          Perspective
        </span>
      </section>
    </main>
  );
}
