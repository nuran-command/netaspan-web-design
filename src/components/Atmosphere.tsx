"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const getStableValue = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
};

interface CloudInstance {
  img: string;
  left: number;
  top: number;
  scale: number;
  rot: number;
  opMult: number;
}

interface MountainInstance {
  left: number;
  scale: number;
  brightness: number;
  yOffset: number;
  width: number;
  rot: number;
}

const GlobalCloudLayer = ({
  speed, zIndex, scaleRange, opacityRange, yParallaxRange, count = 8, seedBase, topRange = [-10, 300]
}: {
  speed: number; zIndex: number; scaleRange: [number, number]; opacityRange: [number, number]; yParallaxRange: [number, number]; count?: number; seedBase: number; topRange?: [number, number];
}) => {
  const { scrollY } = useScroll();
  const yTranslate = useTransform(scrollY, [0, 4000], yParallaxRange);
  const clouds = useMemo(() => {
    const images = ["cloud4.webp", "cloud5.webp", "cloud6.webp", "cloud7.webp"];
    const instances: CloudInstance[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i + seedBase;
      instances.push({
        img: images[i % images.length],
        left: getStableValue(seed + 1, -20, 110),
        top: getStableValue(seed + 2, topRange[0], topRange[1]),
        scale: getStableValue(seed + 3, scaleRange[0], scaleRange[1]),
        rot: getStableValue(seed + 4, -15, 30),
        opMult: getStableValue(seed + 5, opacityRange[0], opacityRange[1])
      });
    }
    return instances;
  }, [count, scaleRange, opacityRange, seedBase, topRange]);

  return (
    <motion.div style={{ y: yTranslate, zIndex }} className="absolute inset-0 w-full h-full pointer-events-none transform-gpu !overflow-visible">
      <div className="flex w-[200%] h-full relative" style={{ animation: `drift ${speed}s linear infinite`, willChange: 'transform' }}>
        {[0, 1].map((s) => (
          <div key={s} className="flex-1 h-full relative">
            {clouds.map((cloud, idx) => (
              <div key={idx} className="absolute pointer-events-none" style={{ left: `${cloud.left}%`, top: `${cloud.top}%`, width: `${280 * cloud.scale}px`, opacity: cloud.opMult, transform: `rotate(${cloud.rot}deg) translateZ(0)` }}>
                <Image src={`/images/${cloud.img}`} alt="" width={500} height={500} className="w-full h-auto" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MountainLayer = ({
  src, y, opacity, zIndex, baseHeight, count, seedOffset, sizeRange, brightnessRange, blur = "blur-none"
}: {
  src: string; y: any; opacity: any; zIndex: number; baseHeight: number; count: number; seedOffset: number; sizeRange: [number, number]; brightnessRange: [number, number]; blur?: string;
}) => {
  const instances = useMemo(() => {
    const mnts: MountainInstance[] = [];
    for (let i = 0; i < count; i++) {
        const seed = i + seedOffset;
        mnts.push({
            left: getStableValue(seed + 1, -20, 120),
            scale: getStableValue(seed + 2, sizeRange[0], sizeRange[1]),
            brightness: getStableValue(seed + 3, brightnessRange[0], brightnessRange[1]),
            yOffset: getStableValue(seed + 4, -50, 50),
            width: getStableValue(seed + 5, 80, 120),
            rot: getStableValue(seed + 6, -5, 5)
        });
    }
    return mnts;
  }, [count, seedOffset, sizeRange, brightnessRange]);

  return (
    <motion.div style={{ y, opacity, zIndex }} className="absolute inset-x-0 bottom-[-10%] w-full h-full pointer-events-none transform-gpu !overflow-visible">
      {instances.map((mnt, idx) => (
        <div key={idx} className="absolute bottom-0 -translate-x-1/2 will-change-transform"
          style={{ 
            left: `${mnt.left}%`, 
            width: `${mnt.width}%`, 
            height: `${baseHeight * mnt.scale}%`, 
            bottom: `${mnt.yOffset}px`, 
            filter: `brightness(${mnt.brightness}) ${blur}`,
            transform: `rotate(${mnt.rot}deg) translateZ(0)`,
            // FIX: Use mask-image to prevent sharp square borders
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 95%), linear-gradient(to right, transparent 2%, black 15%, black 85%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 95%), linear-gradient(to right, transparent 2%, black 15%, black 85%, transparent 98%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}>
          <Image src={src} alt="" fill className="object-contain object-bottom" sizes="100vw" priority={zIndex >= 12} />
        </div>
      ))}
    </motion.div>
  );
};

export default function Atmosphere() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => { setIsMounted(true); }, []);

  const yMntFar = useTransform(scrollY, [0, 4000], [1000, -100]);
  const yMntMid = useTransform(scrollY, [0, 4000], [1400, -500]);
  const yMntNear = useTransform(scrollY, [0, 4000], [1800, -1000]);
  const mntOpacity = useTransform(scrollY, [400, 1400], [0, 1]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#0A2540] overflow-hidden">
      <GlobalCloudLayer speed={240} zIndex={1} scaleRange={[0.6, 1.2]} opacityRange={[0.1, 0.2]} yParallaxRange={[0, -500]} count={12} seedBase={100} topRange={[-10, 400]} />
      
      {/* 
          REFINED MOUNTAIN VISTA:
          1. Far layer: Small, dark, slightly blurred peaks (z-10)
          2. Mid layer: Medium peaks with varied scale (z-11)
          3. Near layer: Large focal peaks with focus (z-12)
      */}
      <MountainLayer src="/images/mountain1.webp" y={yMntFar} opacity={mntOpacity} zIndex={10} baseHeight={30} count={6} seedOffset={100} sizeRange={[0.8, 1.4]} brightnessRange={[0.6, 0.9]} blur="blur-[2px]" />
      <MountainLayer src="/images/mountain5.webp" y={yMntMid} opacity={mntOpacity} zIndex={11} baseHeight={35} count={5} seedOffset={200} sizeRange={[1.2, 1.8]} brightnessRange={[0.7, 1.0]} />
      <MountainLayer src="/images/mountain4.webp" y={yMntNear} opacity={mntOpacity} zIndex={12} baseHeight={45} count={3} seedOffset={300} sizeRange={[1.5, 2.5]} brightnessRange={[0.9, 1.2]} />

      <GlobalCloudLayer speed={180} zIndex={5} scaleRange={[0.8, 1.5]} opacityRange={[0.2, 0.4]} yParallaxRange={[0, -1000]} count={8} seedBase={200} topRange={[50, 300]} />
      <GlobalCloudLayer speed={100} zIndex={25} scaleRange={[1.5, 2.5]} opacityRange={[0.4, 0.7]} yParallaxRange={[600, -2500]} count={6} seedBase={800} topRange={[100, 400]} />
      <GlobalCloudLayer speed={50} zIndex={40} scaleRange={[4.0, 7.0]} opacityRange={[0.8, 1.0]} yParallaxRange={[0, -6000]} count={4} seedBase={500} topRange={[-10, 150]} />
      
      <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-[#0A2540] via-[#0A2540]/80 to-transparent z-50 pointer-events-none" />
    </div>
  );
}
