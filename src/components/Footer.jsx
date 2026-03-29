"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E9] border-t border-[#E91E63]/20 py-16 px-6 overflow-hidden">
      
      {/* Subtle decorative blur for romantic vibe */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E91E63]/5 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FF6F91]/5 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Brand & Tagline */}
        <div className="flex flex-col items-center mb-12 text-center">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-[#E91E63] to-[#FF6F91] rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="text-white text-2xl">❤️</span>
            </motion.div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#4A2C2C]">
                Twinflame
              </h2>
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#E91E63] font-bold">
                Digital Love Vault
              </p>
            </div>
          </Link>

          <p className="text-sm text-[#8B5E66] max-w-md">
            Small digital surprises for your forever moments.
          </p>
        </div>

        {/* Quick Links - minimal */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12 text-center">
          {[
            { label: "Couple Quiz", href: "/quiz" },
            { label: "Love Timeline", href: "/timeline" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy", href: "/privacy" }
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="text-sm text-[#8B5E66] hover:text-[#E91E63] hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#E91E63]/30 to-transparent mb-10 max-w-md mx-auto" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-[#4A2C2C]/70">
            © {currentYear} Twinflame. Crafted with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[#E91E63] mx-1"
            >
              ❤️
            </motion.span>
            in India
          </p>

          {/* Small badges */}
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#E91E63]/20 text-xs text-[#4A2C2C]/70">
              <span>🔒</span> Private
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#E91E63]/20 text-xs text-[#4A2C2C]/70">
              <span>⚡</span> Instant
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}