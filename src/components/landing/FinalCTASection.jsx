"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-br from-[#E91E63] via-[#FF6F91] to-[#FFC1CC] text-white text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
          Ready to Create{" "}
          <span className="italic block mt-2">Digital Magic?</span>
        </h2>

        <p className="text-xl mb-12 text-white/90 italic">
          Your love story deserves a special place of its own
        </p>

        <Link
          href="/quiz"
          className="inline-block bg-white text-[#E91E63] px-14 py-6 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-2xl hover:bg-[#FFF5F7] hover:scale-105 transition-all"
        >
          Start Your Story — Free →
        </Link>
      </motion.div>
    </section>
  );
}
