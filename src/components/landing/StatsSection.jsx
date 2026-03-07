"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  return (
    <section className="relative py-32 px-6 text-center bg-white z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#4A2C2C] mb-6">
          Trusted by{" "}
          <span className="relative inline-block text-[#E91E63]">
            10,000+
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#FFC1CC]/30 -z-10" />
          </span>{" "}
          Couples
        </h3>
        
        <p className="text-lg text-[#8B5E66] italic mb-20">
          Aur counting... ❤️
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -10 }}
            className="p-12 bg-gradient-to-br from-[#FFF5F7] to-white rounded-[3rem] border-2 border-[#FADADD] shadow-lg"
          >
            <div className="text-6xl mb-4">📖</div>
            <h5 className="text-6xl font-serif font-black text-[#E91E63] mb-3">2.4M</h5>
            <p className="text-sm uppercase tracking-widest font-bold text-[#8B5E66]">
              Moments Captured
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.05 }}
            className="p-12 bg-gradient-to-br from-[#E91E63] to-[#FF6F91] text-white rounded-[3rem] shadow-[0_30px_80px_rgba(233,30,99,0.4)] transform scale-105"
          >
            <div className="text-6xl mb-4">💕</div>
            <h5 className="text-6xl font-serif font-black mb-3">500+</h5>
            <p className="text-sm uppercase tracking-widest font-bold">
              Happy Souls
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="p-12 bg-gradient-to-br from-[#FFF5F7] to-white rounded-[3rem] border-2 border-[#FADADD] shadow-lg"
          >
            <div className="text-6xl mb-4">✨</div>
            <h5 className="text-6xl font-serif font-black text-[#E91E63] mb-3">∞</h5>
            <p className="text-sm uppercase tracking-widest font-bold text-[#8B5E66]">
              Blush Reactions
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}