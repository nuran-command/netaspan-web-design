"use client";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 100);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-6 px-8 lg:px-12 ${scrolled ? "bg-[#0A2540]/60 backdrop-blur-md border-b border-white/5 py-4" : ""
        }`}
    >
      <div className="w-full">
        {/* DESKTOP: EVENLY SPACED ELEMENTS */}
        <div className="hidden lg:flex items-center justify-evenly w-full px-4 text-[#FF9F1C]">
          <Link
            href="/"
            className="text-2xl font-[900] tracking-[-0.05em] text-white uppercase italic"
          >
            Netaspan
          </Link>

          {["Services", "Projects", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="uppercase text-sm font-bold tracking-[2px] hover:text-white transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          <button className="flex items-center gap-1 border border-[#FF9F1C]/30 rounded-full px-4 py-1.5 uppercase text-sm font-medium tracking-[1px] hover:bg-white/10 transition-colors duration-300">
            EN
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* MOBILE: LOGO + HAMBURGER */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <Link
            href="/"
            className="text-[#FF9F1C] text-2xl font-bold tracking-[-1px]"
          >
            Netaspan
          </Link>

          <button
            className="text-[#FF9F1C] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? "auto" : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        className="lg:hidden overflow-hidden bg-[#0A2540]/95 backdrop-blur-lg absolute top-full left-0 w-full border-b border-white/10"
      >
        <div className="flex flex-col items-center py-8 gap-y-6">
          {["Services", "Projects", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="uppercase text-[#FF9F1C] text-lg font-medium tracking-[1.5px]"
            >
              {item}
            </Link>
          ))}
          <button className="flex items-center mt-4 gap-1 border border-[#FF9F1C]/30 rounded-full px-6 py-2 uppercase text-[#FF9F1C] text-base font-medium tracking-[1px]">
            EN
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
}
