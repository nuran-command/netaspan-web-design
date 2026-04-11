"use client";
import React, { useMemo } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";

/**
 * CloudLayer Component: Dynamic infinite parallax system
 * Creates an organic, deep atmosphere with varied cloud sizes and horizontal drift.
 */
const CloudLayer = ({ 
  speed, 
  baseOpacity, 
  yParallax, 
  zIndex,
  layerType // Added to vary distribution per layer
}: { 
  speed: number; 
  baseOpacity: number; 
  yParallax: number; 
  zIndex: number;
  layerType: 'back' | 'mid' | 'front';
}) => {
  const { scrollY } = useScroll();
  const yTranslate = useTransform(scrollY, [0, 1000], [0, yParallax]);

  // Define 12 unique cloud instances with organic, non-uniform distribution
  const clouds = useMemo(() => {
    const images = ["cloud4.webp", "cloud5.webp", "cloud6.webp", "cloud7.webp"];
    const instances = [];
    
    // Distribute clouds across the 100% width of the strip
    for (let i = 0; i < 12; i++) {
      instances.push({
        img: images[i % images.length],
        left: (i * 8.3) + (Math.random() * 5), // Spread them out but with jitter
        top: Math.random() * 80,
        // Layer-specific scale logic
        scale: layerType === 'back' 
          ? 0.6 + Math.random() * 1.0 
          : layerType === 'mid'
          ? 0.8 + Math.random() * 1.4
          : 1.0 + Math.random() * 1.2,
        rot: -12 + Math.random() * 24,
        opMult: 0.7 + Math.random() * 0.6
      });
    }
    return instances;
  }, [layerType]);

  const cloudGroup = (
    <div className="flex w-1/2 h-full relative">
      {clouds.map((cloud, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${250 * cloud.scale}px`, // Increased base size for architectural feel
            height: "auto",
            transform: `rotate(${cloud.rot}deg)`,
            opacity: baseOpacity * cloud.opMult,
          }}
        >
          <Image 
            src={`/images/${cloud.img}`} 
            alt="" 
            width={600} 
            height={600} 
            className="w-full h-auto"
            priority={zIndex > 10}
          />
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      style={{ y: yTranslate, zIndex }}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex w-[200%] h-full relative"
      >
        {cloudGroup}
        {cloudGroup}
      </motion.div>
    </motion.div>
  );
};

export default function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, -180]);

  return (
    <section className="relative w-full h-[100vh] min-h-[750px] flex items-center justify-center overflow-hidden bg-[#0A2540]">
      
      {/* 1. LAYER: BACK (Deepest, Slowest, Wispiest) */}
      <CloudLayer 
        speed={75} 
        baseOpacity={0.38} 
        yParallax={-80} 
        zIndex={5} 
        layerType="back" 
      />

      {/* 2. LAYER: MID (Natural Volume) */}
      <CloudLayer 
        speed={47} 
        baseOpacity={0.62} 
        yParallax={-190} 
        zIndex={13} 
        layerType="mid" 
      />

      {/* 3. HERO TEXT: ROTTOR (Center Stage) */}
      <motion.div
        style={{ y: yText }}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="relative z-20 flex items-center justify-center w-full px-4"
        style={{ 
          zIndex: 20, 
          transform: "rotate(-3.2deg)", 
          y: yText 
        }}
      >
        <h1 
          className="text-white font-black text-center select-none"
          style={{ 
            fontSize: "clamp(6.5rem, 18vw, 24rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.7,
            textShadow: "0 25px 100px rgba(0,0,0,0.6)"
          }}
        >
          Rottor
        </h1>
      </motion.div>

      {/* 4. LAYER: FRONT (Fastest, Largest, Fullest) */}
      <CloudLayer 
        speed={29} 
        baseOpacity={0.82} 
        yParallax={-320} 
        zIndex={17} 
        layerType="front" 
      />

      {/* 5. FINISHING FOG BLEND (Grounding the sky) */}
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0A2540] via-[#0A2540]/60 to-transparent z-25 pointer-events-none" />

      {/* 6. MOTION BLUR TAGLINE (The cinematic signature) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="relative px-12 py-4"
        >
          {/* Layered blur for soft illegibility */}
          <span className="text-white/25 text-[11px] lg:text-xs tracking-[10px] font-bold uppercase whitespace-nowrap blur-[1px] block">
            Custom Made Creativity
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-white/10 text-[11px] lg:text-xs tracking-[10px] font-bold uppercase whitespace-nowrap blur-[8px]">
            Custom Made Creativity
          </span>
        </motion.div>
      </div>

    </section>
  );
}
