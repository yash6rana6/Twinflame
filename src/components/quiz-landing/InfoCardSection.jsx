import { motion } from "framer-motion";

const cards = [
  {
    icon: "⏱️",
    title: "Just 2–3 Minutes",
    desc: "It won’t even take as long as a quick kiss 😘",
  },
  {
    icon: "💑",
    title: "Made for Couples",
    desc: "Play together or keep it secret — either way, it’s fun",
  },
  {
    icon: "🔒",
    title: "100% Private & Safe",
    desc: "We don’t save your data — it stays just between the two of you",
  },
];

export default function InfoCardsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + idx * 0.15 }}
          whileHover={{ y: -12, scale: 1.04 }}
          className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[#FADADD]/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          {/* Heart shape background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M100 30 C40 0, 0 60, 0 100 C0 140, 40 170, 100 170 C160 170, 200 140, 200 100 C200 60, 160 0, 100 30 Z"
                fill="#E91E63"
              />
            </svg>
          </div>

          <div className="relative z-10 text-center">
            <div className="text-6xl md:text-7xl mb-6">{card.icon}</div>
            <h4 className="text-xl md:text-2xl font-bold text-[#4A2C2C] mb-3">
              {card.title}
            </h4>
            <p className="text-base md:text-lg text-[#8B5E66]">{card.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}