"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Brand({ scrolled }) {
  return (
    <Link href="/" className="group relative">
      <div className="flex items-center gap-2">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`
            transition-all duration-400
            ${scrolled ? 'w-7 h-7' : 'w-10 h-10'}
            bg-gradient-to-br from-[#E91E63] to-[#FF80AB] rounded-xl flex items-center justify-center shadow-md
          `}
        >
          <span className="text-white text-lg">❤️</span>
        </motion.div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`
                font-serif font-bold text-[#4A2C2C] tracking-tight group-hover:text-[#E91E63] transition-all duration-400
                ${scrolled ? 'text-lg' : 'text-2xl'}
              `}
            >
              Twinflame
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`
                rounded-full bg-[#E91E63] transition-all duration-400
                ${scrolled ? 'w-1 h-1 mt-0.5' : 'w-1.5 h-1.5 mt-1.5'}
              `}
            />
          </div>
          <span
            className={`${scrolled ? 'text-[7px]' : 'text-[8px]'} uppercase tracking-[0.3em] text-[#E91E63] font-bold`}
          >
            Digital Love Vault
          </span>
        </div>
      </div>
    </Link>
  );
}
