"use client";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CloudTransition from "@/components/CloudTransition";
import MountainRange from "@/components/MountainRange";
import { motion } from "framer-motion";

export default function Home() {
  return (
    /* 
       GLOBAL CANVAS: The and background are set once here. 
       All child sections are overflow-visible to prevent clipping of parallax elements.
    */
    <main className="relative min-h-screen bg-[#0A2540] overflow-x-hidden selection:bg-[#FF9F1C] selection:text-[#0A2540]">
      <Nav />
      {/* 1. LANDING PAGE: Sky, Clouds, Rottor Headline (z-10) */}
      {/* REMOVED: Fixed height wrappers to prevent clipping */}
      <Hero />
      
      {/* 2. ATMOSPHERE TRANSITION: Bridge between Sky and Landscape (z-20) */}
      <CloudTransition />

      {/* 3. DISCOVER SECTION: The separate "Mountain" page 
          Added mt-[-20vh] to overlap the sections.
          Transparent background and overflow-visible allows all sky elements to mix.
      */}
      <section className="min-h-[100vh] mt-[-20vh] flex items-center justify-center relative z-30 bg-transparent overflow-visible">
        <MountainRange />

        <div className="text-center relative z-40 px-4 pt-40 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="text-[#FF9F1C] text-sm lg:text-base font-bold uppercase tracking-[10px] mb-8 drop-shadow-[0_10px_30px_rgba(255,159,28,0.3)]">
              Discover More
            </h2>
            <p className="max-w-xl mx-auto text-white/50 font-medium leading-relaxed tracking-wide text-sm lg:text-base blur-[0.3px]">
              Step into the high-altitude landscape of Rottor. 
              Our cinematic approach combines raw architectural scale with 
              buttery-smooth motion to create unforgettable digital experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. ADDITIONAL SECTION (Perspective) */}
      <section className="h-[80vh] flex items-center justify-center border-t border-white/5 relative z-40 bg-transparent overflow-visible">
        <span className="text-white/10 uppercase tracking-[20px] font-black italic text-4xl lg:text-7xl select-none">
          Perspective
        </span>
      </section>
    </main>
  );
}
