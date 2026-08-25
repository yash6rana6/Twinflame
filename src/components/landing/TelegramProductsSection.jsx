import { motion } from "framer-motion";
import TelegramCard from "../TelegramCard";

export default function TelegramProductsSection() {
  return (
    <section
      id="vault"
      className="relative py-8 px-4 bg-[#0d0d0f] min-h-screen"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-block text-[9px] font-black text-[#E91E63] uppercase tracking-[0.3em] mb-2">
            The Magic Trio
          </span>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-white">
            Pick Your{" "}
            <span className="relative inline-block text-[#E91E63]">
              Magic
              <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#FFC1CC]/30 -z-10" />
            </span>
          </h2>
          <p className="text-xs text-white/50 italic max-w-xs mx-auto">
            Three digital experiences to make your love even more special
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TelegramCard
              title="Watch movies together"
              description="Share the screen and watch movies together, no matter the distance."
              icon="🎬"
              badge="Most Popular"
              href="/watch"
            />
          </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <TelegramCard
              title="Couple Quiz"
              description="See who remembers more — from your first date to your favorite Maggi flavor!"
              icon="💞"
              badge="Free to Play"
              href="/quiz"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TelegramCard
              title="Love Timeline"
              description="A beautiful, scrollable story of your best memories — photos, notes, and emotions."
              icon="🌹"
              badge="lovers' favorite"
              featured={true}
              href="/timeline"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}