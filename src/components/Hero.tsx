"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { AnimatedText } from "@/components/ui/animated-shiny-text";

export default function Hero() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const yText = useTransform(scrollY, [0, 800], [0, -250]);

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 1. LAYERED CLOUDS (ONE DIRECTION DRIFT) */}

      {/* FAR BACK (zIndex 1) */}
      <div className="absolute inset-0 z-[1] w-[200%] h-full flex opacity-10 pointer-events-none" style={{ animation: 'drift 240s linear infinite' }}>
        {[0, 1].map((s) => (
          <div key={s} className="flex-1 relative h-full">
            <div className="absolute top-[10%] left-[5%] w-[400px] h-[300px]">
              <Image src="/images/cloud4.webp" alt="" fill className="object-contain" />
            </div>
            <div className="absolute top-[60%] left-[70%] w-[500px] h-[400px]">
              <Image src="/images/cloud6.webp" alt="" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* MID BACK (zIndex 10) - Behind Text */}
      <div className="absolute inset-0 z-[10] w-[200%] h-full flex opacity-15 pointer-events-none" style={{ animation: 'drift 180s linear infinite' }}>
        {[0, 1].map((s) => (
          <div key={s} className="flex-1 relative h-full">
            <div className="absolute top-[25%] left-[45%] w-[600px] h-[400px]">
              <Image src="/images/cloud5.webp" alt="" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. HERO TEXT (z-20) */}
      <motion.div
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ zIndex: 20, y: yText, perspective: "1000px" } as unknown as any}
        className="relative flex items-center justify-center w-full px-4"
      >
        <AnimatedText
          text="Netaspan"
          gradientColors="linear-gradient(90deg, #FF9F1C, #FFFFFF, #FF9F1C)"
          gradientAnimationDuration={3}
          textClassName="text-white font-black text-center select-none tracking-[-0.12em] text-[18vw] lg:text-[15vw] leading-[0.8] italic transform-gpu"
          className="py-0"
        />
      </motion.div>

      {/* 3. FRONT DRIFT (zIndex 30) - In Front of Text */}
      <div className="absolute inset-0 z-[30] w-[200%] h-full flex opacity-20 pointer-events-none" style={{ animation: 'drift 100s linear infinite' }}>
        {[0, 1].map((s) => (
          <div key={s} className="flex-1 relative h-full">
            <div className="absolute top-[40%] left-[60%] w-[800px] h-[600px]">
              <Image src="/images/cloud4.webp" alt="" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
