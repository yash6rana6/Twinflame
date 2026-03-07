// components/ComingSoon.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ComingSoon({
  title = "Coming Soon",
  description = "This feature will be available soon. We're working on it and can't wait to share it with you 💕",
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F9] via-[#FFEFF4] to-[#FFF0F6] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Floating hearts & glow background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <motion.div
          animate={{ y: [0, -40, 0], rotate: [-8, 8, -8], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] text-9xl text-pink-300/70 drop-shadow-lg"
        >
          💕
        </motion.div>
        <motion.div
          animate={{ y: [0, -50, 0], rotate: [12, -12, 12], scale: [1, 1.3, 1] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          className="absolute bottom-[20%] right-[15%] text-10xl text-rose-300/60 drop-shadow-lg"
        >
          🌹
        </motion.div>
        <motion.div
          animate={{ y: [0, -35, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 4 }}
          className="absolute top-[45%] left-[35%] text-8xl text-pink-400/50 drop-shadow-lg"
        >
          ❤️
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
        className="relative z-10 text-center max-w-3xl"
      >
        {/* Big Coming Soon Text */}
        <h1 className="text-7xl md:text-9xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 mb-8 drop-shadow-2xl">
          Coming Soon
        </h1>

        {/* Title (customizable) */}
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-rose-800 mb-6">
          {title}
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-rose-700 mb-12 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>

        {/* Cute heart animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="text-9xl mb-10"
        >
          💞
        </motion.div>

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-[0_30px_80px_rgba(233,30,99,0.5)] hover:-translate-y-2 transition-all duration-300"
        >
          Go Back Home
        </Link>

        {/* Small note */}
        <p className="mt-12 text-lg text-rose-600 italic">
          Something nice is on the way — thanks for waiting 💖
        </p>
      </motion.div>
    </div>
  );
}
