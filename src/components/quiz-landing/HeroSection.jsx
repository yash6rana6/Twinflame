import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="text-center mb-16 md:mb-24">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-3 px-6 py-3 mb-10 rounded-full bg-white/30 backdrop-blur-md border border-[#E91E63]/20 shadow-lg mx-auto"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E91E63] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E91E63]"></span>
        </span>
        <span className="text-xs md:text-sm uppercase tracking-[0.35em] font-black text-[#E91E63]">
          15,487+ Couples Already Matched Hearts
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold tracking-tighter leading-none mb-6 text-[#4A2C2C]"
      >
        Kaun Zyada
        <br className="md:hidden" />
        <span className="relative inline-block text-[#E91E63] italic ml-2 md:ml-0">
          Pyaar Karta Hai?
          <motion.span
            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-6 -right-8 md:-right-12 text-6xl md:text-8xl opacity-90"
          >
            😘
          </motion.span>
        </span>
      </motion.h1>
    </div>
  );
}