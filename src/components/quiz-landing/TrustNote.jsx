import { motion } from "framer-motion";

export default function TrustNote() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="text-center text-base md:text-lg text-[#8B5E66] italic max-w-3xl mx-auto"
    >
     No ads • No data saved •
Just love, laughter, and a little bit of blush 😘
    </motion.p>
  );
}