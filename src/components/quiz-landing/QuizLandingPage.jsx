"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ── IMAGE BANK ──
const IMG = {
  hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
  couple1: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=85",
  couple2: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=85",
  couple3: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=700&q=85",
  couple4: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=85",
  laugh:   "https://images.unsplash.com/photo-1521727857535-28d2047619f8?w=700&q=85",
  roses:   "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=900&q=85",
  candle:  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
};

// ── HERO SECTION ──
function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src={IMG.hero}
          alt="couple"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.55) saturate(1.25) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#FFF5F7]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/20 via-transparent to-[#FF6F91]/15" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
        >
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-white">
            15,000+ Couples Already Played
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
          className="font-serif font-extrabold text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl"
          style={{ fontSize: "clamp(3.8rem, 10vw, 8.5rem)" }}
        >
          Who Loves
          <br />
          <span className="italic text-[#FFC1CC]">You More?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="text-base md:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl drop-shadow-md"
        >
          A private quiz that shows who remembers more — your first meeting,
          the name of that secret crush, and those little details only you both know.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
          <Link href="/quiz/play">
            <button className="px-12 py-5 bg-[#E91E63] text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition">
              Start the Quiz
            </button>
          </Link>
          <Link href="/">
            <button className="px-12 py-5 rounded-2xl border-2 border-white/40 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition">
              Back to Home
            </button>
          </Link>
        </div>

        <p className="text-sm text-white/70 italic">
          ⚠️ Warning: May cause blushing, teasing, and extra love 💕
        </p>
      </div>
    </section>
  );
}

// ── INFO CARDS ──
const INFO_CARDS = [
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
    title: "100% Private",
    desc: "No data is saved — it stays just between the two of you",
  },
];

function InfoCardsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {INFO_CARDS.map((c, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">{c.icon}</div>
            <h4 className="text-xl font-bold mb-2">{c.title}</h4>
            <p className="text-[#6B4A52]">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA SECTION ──
function CTASection() {
  return (
    <section className="py-32 px-6 text-center bg-gradient-to-br from-[#E91E63] via-[#FF6F91] to-[#FFC1CC] text-white">
      <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
        Ready to Find Out <span className="italic">the Truth?</span>
      </h2>
      <p className="text-xl mb-10 italic">
        It’s free, it’s fun, and the results might make you love each other even more 💕
      </p>
      <Link href="/quiz/play">
        <button className="bg-white text-[#E91E63] px-12 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition">
          Start Quiz — It’s Free
        </button>
      </Link>
    </section>
  );
}

// ── MAIN PAGE ──
export default function QuizLandingPage() {
  return (
    <main className="bg-[#FFF5F7]">
      <HeroSection />
      <InfoCardsSection />
      <CTASection />
    </main>
  );
}
