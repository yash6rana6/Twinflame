import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Choose Your Kit",
    desc: "Pick from our three magic tools — the Quiz, Timeline, or Bot. Choose what fits you best.",
    emoji: "🎨",
    color: "from-[#E91E63] to-[#FF6F91]"
  },
  {
    step: "02",
    title: "Personalize It",
    desc: "Add your photos, inside jokes, and special dates. Make it truly yours.",
    emoji: "✍️",
    color: "from-[#FFC1CC] to-[#E91E63]"
  },
  {
    step: "03",
    title: "Surprise Them",
    desc: "Share a private link and watch them smile. That’s the magic moment!",
    emoji: "🎁",
    color: "from-[#FF6F91] to-[#E91E63]"
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-40 px-6 bg-[#FFF5F7] z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <span className="inline-block text-[10px] font-black text-[#E91E63] uppercase tracking-[0.5em] mb-6">
            Simple & Seamless
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#4A2C2C]">
            How it{" "}
            <span className="relative inline-block italic text-[#E91E63]">
              Works
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
              </svg>
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-40">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`relative flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 md:gap-20`}
            >
              {/* Giant Step Number */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <span className="text-[25rem] font-serif font-black leading-none">{item.step}</span>
              </div>

              {/* Emoji Card */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative z-10 w-48 h-48 bg-gradient-to-br from-white to-[#FFF5F7] rounded-[3rem] shadow-[0_30px_80px_rgba(233,30,99,0.15)] flex items-center justify-center text-7xl border-2 border-[#FADADD]"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-[3rem]" style={{ backgroundImage: `linear-gradient(135deg, ${item.color})` }} />
                {item.emoji}
              </motion.div>

              {/* Content */}
              <div className="relative z-10 flex-1 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="text-6xl font-serif font-black text-[#E91E63]/20">{item.step}</span>
                  <div className="w-20 h-px bg-gradient-to-r from-[#E91E63]/50 to-transparent" />
                </div>
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-[#4A2C2C] mb-6 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xl text-[#8B5E66] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}