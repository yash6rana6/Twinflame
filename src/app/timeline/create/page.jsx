"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

// ── IMAGE BANK ──
const IMG = {
  hero:   "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
  roses:  "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=900&q=85",
  sunset: "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=900&q=85",
};

// Theme preview colors
const THEMES = [
  { value: "romantic", label: "Romantic",        emoji: "💖", from: "from-pink-400",    to: "to-rose-500"   },
  { value: "minimal",  label: "Minimal",         emoji: "✨", from: "from-slate-300",   to: "to-gray-400"   },
  { value: "classic",  label: "Classic",         emoji: "🌹", from: "from-amber-400",   to: "to-yellow-500" },
  { value: "travel",   label: "Travel Adventure",emoji: "✈️", from: "from-sky-400",     to: "to-blue-500"   },
  { value: "family",   label: "Family Moments",  emoji: "👨‍👩‍👧", from: "from-emerald-400", to: "to-teal-500"   },
];

// ── AMBIENT PETALS ──
function Petals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {["🌹","💗","❤️","🌸","✨","💕"].map((e, i) => (
        <motion.span key={i}
          className="absolute text-3xl md:text-4xl select-none"
          style={{
            top:  `${[10,25,60,75,40,85][i]}%`,
            left: `${[5,85,8,88,92,10][i]}%`,
            opacity: 0.1,
          }}
          animate={{ y:[0,-18,0], rotate:[-4,4,-4] }}
          transition={{ duration:[10,13,11,14,12,15][i], repeat:Infinity, repeatType:"reverse", delay:i*0.7 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────
export default function CreateTimelinePage() {
  const router = useRouter();

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme]             = useState("romantic");
  const [partnerEmail, setPartnerEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || !description.trim() || !partnerEmail.trim()) {
      setError("Title, description aur partner ID sab bharo");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          theme,
          partnerEmail: partnerEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Kuch galat ho gaya");
        setLoading(false);
        return;
      }

      router.push(`/timeline/${data.timeline.shareId}`);
    } catch {
      setError("Network error – check your connection");
    } finally {
      setLoading(false);
    }
  };

  const selectedTheme = THEMES.find(t => t.value === theme) ?? THEMES[0];

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-hidden">
      <Petals />

      {/* ── BACKGROUND IMAGE ── */}
      <div className="fixed inset-0 z-0">
        <img src={IMG.sunset} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
          style={{ filter:"brightness(0.5) saturate(1.4)" }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">

        {/* Back button */}
        <motion.div
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          className="absolute top-6 left-6"
        >
          <Link href="/timeline"
            className="flex items-center gap-2 text-[#8B5E66] hover:text-[#E91E63] transition-colors text-sm font-bold">
            <ArrowLeft size={16} />
            Back
          </Link>
        </motion.div>

        {/* Form container */}
        <motion.div
          initial={{ opacity:0, scale:0.95, y:30 }}
          animate={{ opacity:1, scale:1, y:0 }}
          transition={{ type:"spring", stiffness:80 }}
          className="relative w-full max-w-lg"
        >
          <div className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] shadow-[0_30px_80px_rgba(233,30,99,0.2)] overflow-hidden">

            {/* Decorative header strip */}
            <div className="relative h-32 bg-gradient-to-br from-[#FFF0F4] via-[#FADADD]/60 to-[#FFF5F7] flex items-center justify-center overflow-hidden">
              <div className="absolute -left-6 -top-6 w-32 h-32 bg-[#E91E63]/8 rounded-full blur-3xl" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FFC1CC]/30 rounded-full blur-2xl" />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-[0.06] select-none pointer-events-none">💕</span>

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate:[0,8,-8,0], scale:[1,1.1,1] }}
                  transition={{ repeat:Infinity, duration:4, ease:"easeInOut" }}
                  className="text-5xl mb-2"
                >
                  💕
                </motion.div>
                <h1 className="text-2xl font-serif font-bold text-[#4A2C2C]">
                  Create Your Timeline
                </h1>
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#E91E63]/25 to-transparent" />
            </div>

            {/* Form body */}
            <form onSubmit={handleCreate} className="p-8">

              {/* Error alert */}
              {error && (
                <motion.div
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm font-medium text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Title */}
              <div className="mb-5">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
                  Timeline Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Our Love Story 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors bg-[#FFF5F7] text-[#4A2C2C] placeholder:text-[#8B5E66]/40"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="A short note about this timeline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors resize-none bg-[#FFF5F7] text-[#4A2C2C] placeholder:text-[#8B5E66]/40"
                  required
                />
              </div>

              {/* Theme selector */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-3">
                  Theme *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map((t) => (
                    <motion.button
                      key={t.value}
                      type="button"
                      whileTap={{ scale:0.95 }}
                      onClick={() => setTheme(t.value)}
                      className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${
                        theme === t.value
                          ? "border-[#E91E63] shadow-[0_8px_25px_rgba(233,30,99,0.25)]"
                          : "border-[#FADADD] hover:border-[#E91E63]/50"
                      }`}
                    >
                      {/* Gradient preview */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${t.from} ${t.to} opacity-20`} />

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-1">{t.emoji}</div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#4A2C2C]">
                          {t.label}
                        </p>
                      </div>

                      {/* Selected checkmark */}
                      {theme === t.value && (
                        <motion.div
                          initial={{ scale:0 }} animate={{ scale:1 }}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E91E63] flex items-center justify-center text-white text-xs"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Theme preview */}
                <div className="mt-4 p-4 rounded-2xl border-2 border-[#FADADD] bg-[#FFF5F7]">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#8B5E66] mb-2">
                    Preview
                  </p>
                  <div className={`h-16 rounded-xl bg-gradient-to-br ${selectedTheme.from} ${selectedTheme.to} flex items-center justify-center`}>
                    <span className="text-4xl opacity-60">{selectedTheme.emoji}</span>
                  </div>
                </div>
              </div>

              {/* Partner ID */}
              <div className="mb-7">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
                  Partner's User ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 67a1b2c3d4e5f6g7h8i9j0"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors bg-[#FFF5F7] text-[#4A2C2C] placeholder:text-[#8B5E66]/40"
                  required
                />
                <p className="text-[10px] text-[#8B5E66]/70 mt-2 italic">
                  (For now enter partner's user ID – baad mein search feature aayega)
                </p>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale:1.02, y:-2 } : {}}
                whileTap={!loading ? { scale:0.98 } : {}}
                className={`relative w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden ${
                  loading
                    ? "bg-[#FADADD] text-[#8B5E66] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white shadow-[0_15px_45px_rgba(233,30,99,0.45)] hover:shadow-[0_20px_55px_rgba(233,30,99,0.55)]"
                }`}
              >
                {!loading && (
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate:360 }}
                        transition={{ repeat:Infinity, duration:1, ease:"linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Create Timeline
                    </>
                  )}
                </span>
              </motion.button>

            </form>

            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FADADD]/20 rounded-bl-[3rem] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#FFF5F7] rounded-tr-[2.5rem] pointer-events-none" />

            {/* Faint watermark */}
            <span className="absolute bottom-4 right-5 text-8xl opacity-[0.03] select-none pointer-events-none">🌹</span>

          </div>
        </motion.div>

        {/* Bottom help text */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.5 }}
          className="mt-8 text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]/60 text-center"
        >
          Your timeline is private • Only you & your partner can see it
        </motion.p>

      </div>
    </main>
  );
}