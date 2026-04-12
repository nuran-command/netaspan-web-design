"use client";
import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * Deterministic Stable generator for Clouds
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

const TransitionCloudLayer = ({ 
  speed, 
  zIndex,
  scaleRange,
  opacityRange,
  yParallaxRange,
  count = 6,
  containerRef
}: { 
  speed: number; 
  zIndex: number;
  scaleRange: [number, number];
  opacityRange: [number, number];
  yParallaxRange: [number, number];
  count?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTranslate = useTransform(scrollYProgress, [0, 1], yParallaxRange);

  const clouds = useMemo(() => {
    const images = ["cloud4.webp", "cloud5.webp", "cloud6.webp", "cloud7.webp"];
    const instances: CloudInstance[] = [];
    
    for (let i = 0; i < count; i++) {
        const seed = i + zIndex * 22.3; 
        instances.push({
            img: images[i % images.length],
            left: getStableValue(seed + 1, -20, 100),
            top: getStableValue(seed + 2, -10, 90),
            scale: getStableValue(seed + 3, scaleRange[0], scaleRange[1]),
            rot: getStableValue(seed + 4, -10, 20),
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
            width: `${300 * cloud.scale}px`,
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
          />
        </div>
      ))}
    </div>
  );

  return (
    /* CRITICAL FIX: Removed height constraints. Added overflow-visible. 
       This allows clouds to travel across all sections. 
    */
    <motion.div
      style={{ y: yTranslate, zIndex }}
      className="absolute inset-x-0 w-full h-screen pointer-events-none will-change-transform overflow-visible"
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

export default function CloudTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center -mt-1 z-10 overflow-visible"
    >
      {/* 1. MISTY BACK LAYER */}
      <TransitionCloudLayer
        speed={120}
        zIndex={10}
        scaleRange={[0.8, 1.5]}
        opacityRange={[0.2, 0.4]}
        yParallaxRange={[400, -400]}
        count={5}
        containerRef={containerRef}
      />

      {/* 2. CENTER PIECE */}
      <div className="text-center relative z-20 px-4 opacity-30">
        <span className="text-white/10 text-[10px] tracking-[15px] font-bold uppercase">
          Atmosphere
        </span>
      </div>

      {/* 3. FRONT BOLD LAYER */}
      <TransitionCloudLayer
        speed={50}
        zIndex={30}
        scaleRange={[2.5, 4.0]}
        opacityRange={[0.6, 0.8]}
        yParallaxRange={[600, -600]}
        count={4}
        containerRef={containerRef}
      />

      {/* 4. FEATHERED GRADIENT BLENDS */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0A2540] to-transparent z-40 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/80 to-transparent z-40 pointer-events-none" />
    </section>
  );
}
