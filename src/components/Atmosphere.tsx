"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const getStableValue = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
};

interface GlobalCloudLayerProps {
  speed: number;
  zIndex: number;
  scaleRange: [number, number];
  opacityRange: [number, number];
  yParallaxRange: [number, number];
  count?: number;
  seedBase: number;
  topRange?: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollY: any;
}

const GlobalCloudLayer = ({ speed, zIndex, scaleRange, opacityRange, yParallaxRange, count = 6, seedBase, topRange = [-10, 300], scrollY }: GlobalCloudLayerProps) => {
  const yTranslate = useTransform(scrollY, [0, 4000], yParallaxRange);
  const clouds = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    img: `cloud${(i % 4) + 4}.webp`,
    left: getStableValue(i + seedBase + 1, -20, 110),
    top: getStableValue(i + seedBase + 2, topRange[0], topRange[1]),
    scale: getStableValue(i + seedBase + 3, scaleRange[0], scaleRange[1]),
    rot: getStableValue(i + seedBase + 4, -10, 10),
    opMult: getStableValue(i + seedBase + 5, opacityRange[0], opacityRange[1])
  })), [count, scaleRange, opacityRange, seedBase, topRange]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <motion.div style={{ y: yTranslate, zIndex } as unknown as any} className="absolute top-0 left-0 w-full h-[500vh] pointer-events-none transform-gpu">
      <div className="flex w-[200%] h-full relative" style={{ animation: `drift ${speed}s linear infinite`, willChange: 'transform' }}>
        {[0, 1].map((s) => (
          <div key={s} className="flex-1 h-full relative">
            {clouds.map((cloud, idx) => (
              <div key={idx} className="absolute" style={{ left: `${cloud.left}%`, top: `${cloud.top}%`, width: `${250 * cloud.scale}px`, opacity: cloud.opMult, transform: `rotate(${cloud.rot}deg) translateZ(0)` }}>
                <Image src={`/images/${cloud.img}`} alt="" width={400} height={400} className="w-full h-auto" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

interface MountainLayerProps {
  src: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opacity: any;
  zIndex: number;
  baseHeight: number;
  count: number;
  seedOffset: number;
  sizeRange: [number, number];
  brightnessRange: [number, number];
}

const MountainLayer = ({ src, y, opacity, zIndex, baseHeight, count, seedOffset, sizeRange, brightnessRange }: MountainLayerProps) => {
  const instances = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left: getStableValue(i + seedOffset + 1, -20, 120),
    scale: getStableValue(i + seedOffset + 2, sizeRange[0], sizeRange[1]),
    brightness: getStableValue(i + seedOffset + 3, brightnessRange[0], brightnessRange[1]),
    yOffset: getStableValue(i + seedOffset + 4, -50, 50),
    width: getStableValue(i + seedOffset + 5, 80, 120),
    rot: getStableValue(i + seedOffset + 6, -5, 5)
  })), [count, seedOffset, sizeRange, brightnessRange]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <motion.div style={{ y, opacity, zIndex } as unknown as any} className="absolute inset-x-0 bottom-[-10%] w-full h-full pointer-events-none transform-gpu">
      {instances.map((mnt, idx) => (
        <div key={idx} className="absolute bottom-0 -translate-x-1/2 will-change-transform"
          style={{
            left: `${mnt.left}%`,
            width: `${mnt.width}%`,
            height: `${baseHeight * mnt.scale}%`,
            bottom: `${mnt.yOffset}px`,
            filter: `brightness(${mnt.brightness})`,
            transform: `rotate(${mnt.rot}deg) translateZ(0)`,
            // Simplified mask for better scrolling
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 95%)'
          }}>
          <Image src={src} alt="" fill className="object-contain object-bottom" sizes="(max-width: 1024px) 100vw, 50vw" priority={zIndex >= 12} />
        </div>
      ))}
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Atmosphere({ opacity = 1 }: { opacity?: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMounted(true);

    const handleBurst = () => {
      setIsBursting(true);
      setTimeout(() => setIsBursting(false), 1200); // Reset after animation
    };

    window.addEventListener("nav-burst", handleBurst);
    return () => window.removeEventListener("nav-burst", handleBurst);
  }, []);

  const yMntFar = useTransform(scrollY, [0, 4000], [1000, -100]);
  const yMntMid = useTransform(scrollY, [0, 4000], [1400, -500]);
  const yMntNear = useTransform(scrollY, [0, 4000], [1800, -1000]);
  const mntOpacity = useTransform(scrollY, [400, 1400, 2200, 2800], [0, 1, 1, 0]);

  if (!isMounted) return null;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <motion.div style={{ opacity } as unknown as any} className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#0A2540] transform-gpu">
      {/* 1. MIST-SYNC BURST LAYER (zIndex 60) - Triggered by Nav */}
      <motion.div
        animate={{ 
          opacity: isBursting ? 1 : 0,
          scale: isBursting ? [1, 1.5, 2] : 1,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-x-0 inset-y-0 z-[60] pointer-events-none"
      >
        <GlobalCloudLayer scrollY={scrollY} speed={20} zIndex={60} scaleRange={[3, 5]} opacityRange={[0.6, 1]} yParallaxRange={[0, 0]} count={4} seedBase={555} topRange={[-10, 110]} />
      </motion.div>

      {/* EXTREME DEEP BACK LAYER (zIndex 1) */}
      <GlobalCloudLayer scrollY={scrollY} speed={360} zIndex={1} scaleRange={[1.2, 2.2]} opacityRange={[0.08, 0.15]} yParallaxRange={[0, -400]} count={25} seedBase={50} topRange={[-300, 2000]} />
      
      <GlobalCloudLayer scrollY={scrollY} speed={280} zIndex={4} scaleRange={[0.8, 1.8]} opacityRange={[0.1, 0.2]} yParallaxRange={[0, -600]} count={24} seedBase={800} topRange={[-100, 1500]} />
      <GlobalCloudLayer scrollY={scrollY} speed={240} zIndex={2} scaleRange={[0.9, 1.6]} opacityRange={[0.12, 0.24]} yParallaxRange={[0, -500]} count={18} seedBase={100} topRange={[-50, 1000]} />

      <MountainLayer src="/images/mountain1.webp" y={yMntFar} opacity={mntOpacity} zIndex={10} baseHeight={30} count={5} seedOffset={100} sizeRange={[0.8, 1.3]} brightnessRange={[0.6, 0.9]} />

      <GlobalCloudLayer scrollY={scrollY} speed={210} zIndex={10} scaleRange={[0.7, 1.3]} opacityRange={[0.15, 0.25]} yParallaxRange={[0, -700]} count={4} seedBase={600} topRange={[100, 500]} />

      <MountainLayer src="/images/mountain5.webp" y={yMntMid} opacity={mntOpacity} zIndex={11} baseHeight={35} count={4} seedOffset={200} sizeRange={[1.2, 1.6]} brightnessRange={[0.7, 1.0]} />
      <MountainLayer src="/images/mountain4.webp" y={yMntNear} opacity={mntOpacity} zIndex={12} baseHeight={45} count={3} seedOffset={300} sizeRange={[1.5, 2.2]} brightnessRange={[0.9, 1.2]} />

      <GlobalCloudLayer scrollY={scrollY} speed={180} zIndex={5} scaleRange={[0.8, 1.5]} opacityRange={[0.2, 0.3]} yParallaxRange={[0, -1000]} count={5} seedBase={200} topRange={[50, 300]} />
      <GlobalCloudLayer scrollY={scrollY} speed={150} zIndex={15} scaleRange={[1.2, 2.0]} opacityRange={[0.1, 0.2]} yParallaxRange={[0, -1200]} count={6} seedBase={900} topRange={[300, 1200]} />
      <GlobalCloudLayer scrollY={scrollY} speed={120} zIndex={20} scaleRange={[1.5, 2.5]} opacityRange={[0.1, 0.2]} yParallaxRange={[0, -1500]} count={3} seedBase={700} topRange={[200, 800]} />

      {/* NEW MID-ALTITUDE LAYERS (Spanning all pages) */}
      <GlobalCloudLayer scrollY={scrollY} speed={150} zIndex={28} scaleRange={[1.0, 1.8]} opacityRange={[0.12, 0.22]} yParallaxRange={[0, -900]} count={10} seedBase={444} topRange={[-100, 1800]} />
      <GlobalCloudLayer scrollY={scrollY} speed={110} zIndex={32} scaleRange={[1.3, 2.0]} opacityRange={[0.08, 0.15]} yParallaxRange={[0, -1300]} count={8} seedBase={333} topRange={[200, 2000]} />

      <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-[#0A2540] to-transparent z-50 pointer-events-none" />
    </motion.div>
  );
}
