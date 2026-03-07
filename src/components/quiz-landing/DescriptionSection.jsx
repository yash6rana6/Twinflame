import { motion } from "framer-motion";

export default function DescriptionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-center max-w-4xl mx-auto mb-20"
    >
      <p className="text-xl md:text-2xl lg:text-3xl text-[#6B4A52] leading-relaxed mb-10">
        A sweet little quiz to see who remembers more — the outfit from your first meeting, your favorite song, that secret crush, and the tiny moments only the two of you share…
      </p>

      <motion.p
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-2xl md:text-3xl font-medium italic text-[#E91E63]"
      >
        Warning: Results may cause blushing, teasing amd even more love 💕
      </motion.p>
    </motion.div>
  );
}