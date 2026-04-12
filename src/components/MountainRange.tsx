"use client";
import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * Deterministic Stable generator for Mountains
 */
const getStableValue = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  const val = min + (x - Math.floor(x)) * (max - min);
  return parseFloat(val.toFixed(6));
};

interface MountainInstance {
  left: number;
  scale: number;
  brightness: number;
  yOffset: number;
  width: number;
}

const MountainLayer = ({ 
    src, 
    y, 
    opacity, 
    zIndex, 
    baseHeight, 
    count, 
    seedOffset,
    isFarLayer = false,
    blur = "blur-none"
}: { 
    src: string; 
    y: any; 
    opacity: any; 
    zIndex: number; 
    baseHeight: number; 
    count: number; 
    seedOffset: number;
    isFarLayer?: boolean;
    blur?: string;
}) => {
    const instances = useMemo(() => {
        const mnts: MountainInstance[] = [];
        if (isFarLayer) {
            mnts.push({
                left: 50,
                scale: 3.2,
                brightness: 1.1,
                yOffset: -120,
                width: 120
            });
        }
        for (let i = 0; i < count; i++) {
            const seed = i + seedOffset;
            mnts.push({
                left: getStableValue(seed + 1, -30, 110),
                scale: getStableValue(seed + 2, 1.2, 2.2),
                brightness: getStableValue(seed + 3, 0.75, 1.15),
                yOffset: getStableValue(seed + 4, -40, 40),
                width: getStableValue(seed + 5, 70, 100)
            });
        }
        return mnts;
    }, [count, seedOffset, isFarLayer]);

    return (
        <motion.div 
            style={{ y, opacity, zIndex }} 
            className="absolute inset-x-0 top-[-30vh] bottom-0 w-full pointer-events-none"
        >
            {instances.map((mnt, idx) => (
                <div 
                    key={idx}
                    className="absolute bottom-0 aspect-[16/9] transform-gpu -translate-x-1/2"
                    style={{ 
                        left: `${mnt.left}%`,
                        width: `${mnt.width}%`,
                        height: `${baseHeight * mnt.scale}%`,
                        bottom: `${mnt.yOffset}px`,
                        filter: `brightness(${mnt.brightness})`
                    }}
                >
                    <Image 
                        src={src} 
                        alt="Peak" 
                        fill 
                        className={`object-contain object-bottom ${blur}`} 
                    />
                </div>
            ))}
        </motion.div>
    );
};

export default function MountainRange() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yMntFar = useTransform(scrollYProgress, [0, 1], [450, -100]);
  const yMntMid = useTransform(scrollYProgress, [0, 1], [650, -350]);
  const yMntNear = useTransform(scrollYProgress, [0, 1], [850, -700]);
  
  const mntOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    /* CRITICAL CHANGE: Removed 'overflow-hidden' from MountainRange. 
       Allows mountains and sky elements to bleed vertically. 
       Removed fixed background to allow sectional mixing.
    */
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full pointer-events-none"
    >
      {/* Mid Layer */}
      <MountainLayer 
        src="/images/mountain1.webp" 
        y={yMntFar} 
        opacity={mntOpacity} 
        zIndex={1} 
        baseHeight={48}
        count={5}
        seedOffset={100}
        isFarLayer={true}
        blur="blur-[1.5px]"
      />

      <MountainLayer 
        src="/images/mountain5.webp" 
        y={yMntMid} 
        opacity={mntOpacity} 
        zIndex={2} 
        baseHeight={42}
        count={7}
        seedOffset={200}
      />

      <MountainLayer 
        src="/images/mountain4.webp" 
        y={yMntNear} 
        opacity={mntOpacity} 
        zIndex={3} 
        baseHeight={45}
        count={5}
        seedOffset={300}
      />

      {/* Horizon Mist/Fog Blend - Thickened for seamless integration */}
      <div className="absolute inset-x-0 bottom-[-10%] h-[60%] bg-gradient-to-t from-[#0A2540] via-[#0A2540]/90 to-transparent z-10" />
      
      {/* Top Blend: Feather the transition from previous clouds section */}
      <div className="absolute inset-x-0 top-[-10%] h-64 bg-gradient-to-b from-[#0A2540] to-transparent z-20" />
    </div>
  );
}
