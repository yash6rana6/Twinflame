"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthCTA({ scrolled }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  // jis page pe ho, wahi CTA hide
  const showRegister = !isRegisterPage;
  const showLogin = !isLoginPage;

  return (
    <div className="flex items-center gap-4">

      {/* REGISTER */}
      {showRegister && !scrolled && (
        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/register"
            className="group relative px-8 py-3.5 rounded-full text-white text-xs font-bold uppercase tracking-[0.22em]
              bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63]
              shadow-[0_8px_32px_rgba(194,24,91,0.4)] hover:shadow-[0_20px_60px_rgba(194,24,91,0.6)]
              transition-all duration-400 overflow-hidden border-2 border-white/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800" />
            <span className="relative z-10 flex items-center gap-2">
              Register →
            </span>
          </Link>
        </motion.div>
      )}

      {showRegister && scrolled && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-full text-[#E91E63] text-xs font-bold uppercase tracking-[0.22em]
              bg-white border-2 border-[#E91E63]/50 hover:bg-[#E91E63] hover:text-white transition"
          >
            Register
          </Link>
        </motion.div>
      )}

      {/* LOGIN */}
      {showLogin && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/login"
            className={`rounded-full text-[#E91E63] font-bold uppercase tracking-[0.22em]
              bg-white border-2 border-[#E91E63]/50 hover:bg-[#E91E63] hover:text-white transition
              ${scrolled ? "px-5 py-2.5 text-xs" : "px-7 py-3 text-sm"}`}
          >
            Login
          </Link>
        </motion.div>
      )}

    </div>
  );
}
