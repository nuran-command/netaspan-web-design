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

  const menuItems = ["Projects", "About", "Contact"];

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
        <div className="hidden lg:flex items-center justify-between w-full text-[#FF9F1C]">
          <Link
            href="/"
            className="text-[#FF9F1C] text-2xl font-bold tracking-[-1px]"
          >
            Netaspan
          </Link>

          {menuItems.map((item) => (
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE OVERLAY */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-[#0A2540] border-b border-white/10 flex flex-col p-8 gap-6 lg:hidden"
          >
            {menuItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-xl font-bold uppercase tracking-[2px]"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
