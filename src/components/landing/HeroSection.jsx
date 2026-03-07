// HeroSection.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center px-6 text-center z-10 overflow-hidden">
      {/* Background floating orbs + subtle gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#E91E63]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -40, 0], scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-[#FFC1CC]/15 rounded-full blur-3xl"
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-3 px-6 py-3 mb-12 rounded-full bg-white/80 backdrop-blur-sm border border-[#E91E63]/20 shadow-lg"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E91E63] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E91E63]"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E91E63]">
          Trusted by 10K+ Couples
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[min(15vw,120px)] md:text-[min(10vw,140px)] font-serif font-bold tracking-tighter leading-[0.85] mb-8 relative"
      >
        Love,{" "}
        <span className="relative inline-block">
          <span className="italic text-[#E91E63]">Digitized</span>
          <svg className="absolute -bottom-4 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
            <path d="M2 10C50 2 150 2 198 10" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl text-[#8B5E66] text-lg md:text-xl mb-16 leading-relaxed z-10"
      >
        A small <span className="font-semibold text-[#E91E63]">private corner</span> on the internet,
        <br className="hidden md:block" />
        <span className="italic">just for the memories you share together.</span>
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-6 items-center z-10"
      >
        <Link
          href="#vault"
          className="group relative bg-[#E91E63] text-white px-12 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-[0_20px_60px_rgba(233,30,99,0.4)] hover:shadow-[0_30px_80px_rgba(233,30,99,0.5)] hover:-translate-y-1 transition-all overflow-hidden"
        >
          <span className="relative z-10">Explore the Vault</span>
          <div className="absolute inset-0 bg-[#FF6F91] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Link>

        <Link
          href="/quiz"
          className="px-12 py-5 rounded-2xl border-2 border-[#E91E63]/30 text-[#4A2C2C] font-bold uppercase text-xs tracking-widest hover:bg-white hover:border-[#E91E63] transition-all"
        >
          Start Free Quiz →
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-[#8B5E66] font-semibold">Scroll</span>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#E91E63" strokeWidth="2"/>
            <circle cx="10" cy="10" r="3" fill="#E91E63" className="animate-pulse"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
