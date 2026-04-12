"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero({ contentOnly = false }: { contentOnly?: boolean }) {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const yText = useTransform(scrollY, [0, 800], [0, -250]);

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
