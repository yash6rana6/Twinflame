"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AuthCTA from "./AuthCTA";

export default function DesktopNav({ scrolled, user, loading, onLogout }) {
  return (
    <div className="hidden md:flex items-center gap-6">
      {/* Logged In */}
      {!loading && user && (
        <>
          <Link
            href="/#vault"
            className="relative group text-[10px] uppercase tracking-[0.15em] font-bold text-[#4A2C2C]/70 hover:text-[#E91E63] transition-colors"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E63] group-hover:w-full transition-all duration-300" />
          </Link>
{/* 
          <Link
            href="/timeline"
            className="relative group text-[10px] uppercase tracking-[0.15em] font-bold text-[#4A2C2C]/70 hover:text-[#E91E63] transition-colors"
          >
            Timeline
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E63] group-hover:w-full transition-all duration-300" />
          </Link> */}

          <Link
            href="/quiz"
            className="relative group text-[10px] uppercase tracking-[0.15em] font-bold text-[#4A2C2C]/70 hover:text-[#E91E63] transition-colors"
          >
            Quiz
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E63] group-hover:w-full transition-all duration-300" />
          </Link>

          <Link
            href="/profile"
            className="relative group text-[10px] uppercase tracking-[0.15em] font-bold text-[#4A2C2C]/70 hover:text-[#E91E63] transition-colors"
          >
            Profile
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E63] group-hover:w-full transition-all duration-300" />
          </Link>

          {/* 🆕 Movie Night / Watch */}
          <Link
            href="/watch"
            className="relative group text-[10px] uppercase tracking-[0.15em] font-bold text-[#4A2C2C]/70 hover:text-[#E91E63] transition-colors"
          >
            Watch
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E63] group-hover:w-full transition-all duration-300" />
          </Link>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLogout}
            className={`
              relative px-7 py-3 rounded-full text-white text-xs font-bold uppercase tracking-[0.22em]
              bg-gradient-to-r from-[#FFD700] via-[#F4C430] to-[#DAA520] hover:from-[#FFEA70] hover:via-[#FFFACD] hover:to-[#FFE135]
              shadow-[0_8px_32px_rgba(255,215,0,0.4)] hover:shadow-[0_20px_60px_rgba(255,215,0,0.6)]
              transition-all duration-400 border border-[#FFD700]/30
              ${scrolled ? "px-5 py-2 text-xs" : "px-7 py-3 text-sm"}
            `}
          >
            Logout
          </motion.button>
        </>
      )}

      {/* Logged Out */}
      {!loading && !user && <AuthCTA scrolled={scrolled} />}
    </div>
  );
}