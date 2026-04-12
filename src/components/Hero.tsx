"use client";
import React, { useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * Deterministic "Stable" generator to prevent Hydration Mismatch.
 */
const getStableValue = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  const val = min + (x - Math.floor(x)) * (max - min);
  return parseFloat(val.toFixed(6));
};

interface CloudInstance {
  img: string;
  left: number;
  top: number;
  scale: number;
  rot: number;
  opMult: number;
}

const CloudLayer = ({ 
  speed, 
  zIndex,
  scaleRange,
  opacityRange,
  yParallaxRange,
  count = 12
}: { 
  speed: number; 
  zIndex: number;
  scaleRange: [number, number];
  opacityRange: [number, number];
  yParallaxRange: [number, number];
  count?: number;
}) => {
  const { scrollY } = useScroll();
  const yTranslate = useTransform(scrollY, [0, 1000], yParallaxRange);

  const clouds = useMemo(() => {
    const images = ["cloud4.webp", "cloud5.webp", "cloud6.webp", "cloud7.webp"];
    const instances: CloudInstance[] = [];
    
    for (let i = 0; i < count; i++) {
        const seed = i + zIndex * 15.7; 
        instances.push({
            img: images[i % images.length],
            left: parseFloat(((i * (100 / count)) + getStableValue(seed + 1, 0, 100 / count)).toFixed(6)),
            top: getStableValue(seed + 2, 0, 85),
            scale: getStableValue(seed + 3, scaleRange[0], scaleRange[1]),
            rot: getStableValue(seed + 4, -15, 30),
            opMult: getStableValue(seed + 5, opacityRange[0], opacityRange[1])
          });
    }
    return instances;
  }, [count, scaleRange, opacityRange, zIndex]);

  const cloudGroup = (
    <div className="flex w-1/2 h-full relative">
      {clouds.map((cloud, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${280 * cloud.scale}px`,
            height: "auto",
            transform: `rotate(${cloud.rot}deg)`,
            opacity: cloud.opMult,
          }}
        >
          <Image 
            src={`/images/${cloud.img}`} 
            alt="Cloud" 
            width={800} 
            height={800} 
            className="w-full h-auto"
            priority={zIndex >= 30}
          />
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      style={{ y: yTranslate, zIndex }}
      className="absolute inset-x-0 top-0 bottom-0 w-full h-full pointer-events-none will-change-transform"
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const yText = useTransform(scrollY, [0, 800], [0, -250]);

  if (!isMounted) {
    return (
        <section className="relative w-full h-[100vh] min-h-[750px] bg-[#0A2540]" />
    );
  }

  return (
    /* CHANGE: Remove 'overflow-hidden'. This allows clouds to bleed into the next section. */
    <section className="relative w-full h-[100vh] min-h-[750px] flex items-center justify-center bg-[#0A2540]">
      
      {/* 0. DEEP BACKGROUND */}
      <div className="absolute inset-0 bg-[#0A2540] z-0" />

      {/* 1. ATMOSPHERE: BACK CLOUDS (z-10) */}
      <CloudLayer
        speed={140}
        zIndex={10}
        scaleRange={[0.6, 1.2]}
        opacityRange={[0.3, 0.45]}
        yParallaxRange={[0, -500]} 
        count={8}
      />

      {/* 2. HERO TEXT (z-20) */}
      <motion.div
        style={{ zIndex: 20, y: yText, transform: "rotate(-3.2deg)" }}
        className="relative flex items-center justify-center w-full px-4"
      >
        <h1 
          className="text-white font-black text-center select-none"
          style={{ 
            fontSize: "clamp(6.5rem, 18vw, 24rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.7,
            textShadow: "0 30px 120px rgba(0,0,0,0.8)"
          }}
        >
          Rottor
        </h1>
      </motion.div>

      {/* 3. DYNAMIC FOG: Soften the transition even more (Stretched to bottom-[-5vh]) */}
      <div className="absolute inset-x-0 bottom-[-5vh] h-[50%] bg-gradient-to-t from-[#0A2540] via-[#0A2540]/60 to-transparent z-25 pointer-events-none" />

      {/* 4. FRONT CLOUDS (z-30): Increased yParallaxRange to fly over everything */}
      <CloudLayer
        speed={45}
        zIndex={30}
        scaleRange={[3.0, 4.0]}
        opacityRange={[0.8, 0.9]}
        yParallaxRange={[0, -1500]} 
        count={4}
      />

      {/* 5. TAGLINE (z-40) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[40]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
          className="relative px-12 py-4"
        >
          <span className="text-white/20 text-[11px] lg:text-xs tracking-[12px] font-bold uppercase whitespace-nowrap blur-[1.2px] block">
            Custom Made Creativity
          </span>
        </motion.div>
      </div>

    </section>
  );
}
