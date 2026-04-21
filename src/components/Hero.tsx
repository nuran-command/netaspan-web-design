"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
          textClassName="text-white font-black text-center select-none"
          className="py-0"
        />
      </motion.div>

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
