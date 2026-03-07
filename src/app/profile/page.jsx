"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trophy, Share2, Send, BarChart2, LogOut, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// ── IMAGE BANK ──
const IMG = {
  hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
  roses:   "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=900&q=85",
  couple1: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&q=80",
  couple2: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80",
  sunset:  "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=900&q=85",
  petals:  "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=900&q=85",
};

// ── STAT CONFIG ──
const STAT_CONFIG = [
  {
    key:   "createdQuizzes",
    label: "Quizzes Banaye",
    icon:  Trophy,
    emoji: "🏆",
    color: "from-amber-400 to-orange-400",
    glow:  "rgba(251,191,36,0.3)",
  },
  {
    key:   "sharedQuizzes",
    label: "Shared",
    icon:  Share2,
    emoji: "💌",
    color: "from-[#E91E63] to-[#FF6F91]",
    glow:  "rgba(233,30,99,0.3)",
  },
  {
    key:   "receivedAnswers",
    label: "Jawab Mile",
    icon:  Send,
    emoji: "💬",
    color: "from-violet-500 to-purple-400",
    glow:  "rgba(139,92,246,0.3)",
  },
  {
    key:   "averageScore",
    label: "Avg Score",
    icon:  BarChart2,
    emoji: "📊",
    suffix: "%",
    color: "from-emerald-500 to-teal-400",
    glow:  "rgba(16,185,129,0.3)",
  },
];

// ── QUICK LINKS ──
const QUICK_LINKS = [
  { label: "Start new quiz",     href: "/quiz/play",    emoji: "✨" },
  { label: "Your quizes",  href: "/quiz/history", emoji: "📋" },
  { label: "Home",           href: "/",             emoji: "🏠" },
];

// ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login?redirect=/profile"); return; }

    const fetchProfile = async () => {
      try {
        const res  = await fetch("/api/user/profile", { credentials: "include" });
        if (!res.ok) throw new Error((await res.json()).error || "Profile load failed");
        const data = await res.json();
        if (data.success) setProfile(data.profile);
      } catch (err) {
        setError(err.message || "an error accured");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  // ── LOADING ──
  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: "brightness(0.4) saturate(1.2)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E91E63]/30 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl drop-shadow-2xl"
          >
            💕
          </motion.div>
          <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white text-[10px] font-black uppercase tracking-[0.45em]">
            Loading Profile...
          </motion.p>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error || !profile) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <img src={IMG.roses} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.3)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#E91E63]/40" />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-sm">
            <div className="text-7xl mb-6 drop-shadow-2xl">💔</div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4 drop-shadow-lg">Arre!</h1>
            <p className="text-white/80 mb-8 text-sm italic">{error || "Profile load nahi hua"}</p>
            <Link href="/"
              className="inline-block px-10 py-4 bg-white text-[#E91E63] rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-[#FADADD] transition-all">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = profile.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-x-hidden">

      {/* ── AMBIENT FLOATING PETALS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {["🌹","💗","❤️","🌸","✨","💕"].map((e, i) => (
          <motion.span key={i}
            className="absolute text-3xl md:text-4xl select-none"
            style={{ top:`${[8,20,55,72,35,82][i]}%`, left:`${[4,88,3,91,94,6][i]}%`, opacity: 0.13 }}
            animate={{ y:[0,-22,0], rotate:[-5,5,-5] }}
            transition={{ duration:[11,14,10,15,12,16][i], repeat:Infinity, repeatType:"reverse", delay:i*0.9 }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      {/* ── CINEMATIC HEADER BANNER ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "min(380px, 52vw)", minHeight: 260 }}>
        <motion.img
          src={IMG.hero}
          alt=""
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1.01, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.48) saturate(1.35) contrast(1.05)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/40 via-transparent to-[#FF6F91]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FFF5F7]" />

        {/* Ambient petals on banner */}
        {["🌹","💕","✨"].map((e, i) => (
          <motion.span key={i}
            className={`absolute text-4xl md:text-5xl select-none opacity-20`}
            style={{ top:["15%","60%","30%"][i], right:["8%","12%","20%"][i] }}
            animate={{ y:[0,-15,0], rotate:[-4,4,-4] }}
            transition={{ duration:[8,11,9][i], repeat:Infinity, repeatType:"reverse", delay:i*1.2 }}
          >
            {e}
          </motion.span>
        ))}

        {/* Banner text — top left */}
        <div className="absolute bottom-20 left-6 md:left-12 z-10">
          <motion.p
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2"
          >
            My Profile
          </motion.p>
          <motion.h1
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, type:"spring" }}
            className="font-serif font-bold text-white drop-shadow-2xl leading-tight"
            style={{ fontSize:"clamp(2rem,5vw,3.5rem)" }}
          >
            {profile.name}
            <span className="block italic text-[#FFC1CC] text-[0.6em] font-semibold mt-1">
              {profile.email}
            </span>
          </motion.h1>
        </div>

        {/* Floating couple photos on banner */}
        <motion.div
          initial={{ opacity:0, x:40, rotate:8 }} animate={{ opacity:1, x:0, rotate:6 }}
          transition={{ delay:0.5, type:"spring", stiffness:80 }}
          className="absolute bottom-16 right-6 md:right-14 bg-white p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          style={{ width:70, height:84, zIndex:20 }}
        >
          <img src={IMG.couple1} alt="" className="w-full h-full object-cover rounded-xl" />
        </motion.div>
        <motion.div
          initial={{ opacity:0, x:40, rotate:-5 }} animate={{ opacity:1, x:0, rotate:-4 }}
          transition={{ delay:0.65, type:"spring", stiffness:80 }}
          className="absolute bottom-10 right-20 md:right-32 bg-white p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          style={{ width:60, height:72, zIndex:10 }}
        >
          <img src={IMG.couple2} alt="" className="w-full h-full object-cover rounded-xl" />
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 px-4 sm:px-6 pb-20 -mt-6 max-w-xl mx-auto">

        {/* ── AVATAR CARD ── */}
        <motion.div
          initial={{ opacity:0, y:30, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.3, type:"spring", stiffness:80 }}
          className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] shadow-[0_30px_80px_rgba(233,30,99,0.16)] overflow-hidden mb-5"
        >
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FADADD]/30 rounded-bl-[3rem]" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#FFF5F7] rounded-tr-[2.5rem]" />

          {/* Faint watermark */}
          <span className="absolute bottom-4 right-6 text-9xl opacity-[0.04] select-none pointer-events-none">❤️</span>

          <div className="relative z-10 p-8 flex items-center gap-6">
            {/* Avatar circle */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#E91E63] to-[#FF6F91]
                flex items-center justify-center text-white font-black text-2xl md:text-3xl
                shadow-[0_15px_40px_rgba(233,30,99,0.45)] border-4 border-white">
                {initials}
              </div>
              {/* Online dot */}
              <motion.div
                animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:2 }}
                className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-md"
              />
            </div>

            {/* Name & email */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4A2C2C] leading-tight mb-1 truncate">
                {profile.name}
              </h2>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#E91E63] flex-shrink-0" />
                <p className="text-xs text-[#8B5E66] truncate">{profile.email}</p>
              </div>
              {/* Member since badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF5F7] rounded-full border border-[#FADADD]">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E91E63]">
                  Active Member 💕
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {STAT_CONFIG.map((stat, i) => {
            const val = stat.key === "averageScore"
              ? `${profile[stat.key] ?? 0}${stat.suffix}`
              : (profile[stat.key] ?? 0);

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.4 + i*0.08, type:"spring" }}
                whileHover={{ y:-4, scale:1.02 }}
                className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] overflow-hidden
                  shadow-[0_12px_40px_rgba(233,30,99,0.1)] transition-all duration-300"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FADADD]/30 rounded-bl-[2.5rem]" />

                {/* Gradient top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${stat.color}`} />

                <div className="p-5 relative z-10">
                  {/* Icon circle */}
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4
                    shadow-lg`} style={{ boxShadow: `0 8px 20px ${stat.glow}` }}>
                    <stat.icon size={18} className="text-white" />
                  </div>

                  <p className="text-3xl font-black text-[#4A2C2C] leading-none mb-1">{val}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]">{stat.label}</p>
                </div>

                {/* Faint bg emoji */}
                <span className="absolute bottom-3 right-4 text-5xl opacity-[0.07] select-none pointer-events-none">
                  {stat.emoji}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ── QUICK LINKS CARD ── */}
        <motion.div
          initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.7, type:"spring" }}
          className="bg-white rounded-[2.5rem] border-2 border-[#FADADD] shadow-[0_12px_40px_rgba(233,30,99,0.1)] overflow-hidden mb-5"
        >
          {/* Rose image strip at top */}
          <div className="relative h-24 overflow-hidden">
            <img src={IMG.petals} alt="" className="absolute inset-0 w-full h-full object-cover"
              style={{ filter:"brightness(0.6) saturate(1.3)" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/20 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 pb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white drop-shadow">
                Quick Actions
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#FADADD]/60">
            {QUICK_LINKS.map((link, i) => (
              <Link key={i} href={link.href}>
                <motion.div
                  whileHover={{ x:4, backgroundColor:"#FFF5F7" }}
                  transition={{ duration:0.2 }}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{link.emoji}</span>
                    <span className="text-sm font-bold text-[#4A2C2C] group-hover:text-[#E91E63] transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[#E91E63]/40 group-hover:text-[#E91E63] transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── LOGOUT BUTTON ── */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.85 }}
        >
          {/* Sunset image behind logout */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(233,30,99,0.25)]">
            <div className="absolute inset-0">
              <img src={IMG.sunset} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter:"brightness(0.4) saturate(1.5)" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/60 to-[#c2185b]/50" />
            </div>

            <div className="relative z-10 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60 mb-0.5">
                  Account
                </p>
                <p className="text-base font-serif font-bold text-white">Click to logout</p>
              </div>

              <motion.button
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2.5 px-6 py-3 bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#E91E63] shadow-lg disabled:opacity-60 hover:bg-[#FFF5F7] transition-all"
              >
                {loggingOut ? (
                  <motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.9, ease:"linear" }}
                    className="inline-block">⏳</motion.span>
                ) : (
                  <LogOut size={14} />
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── BOTTOM TRUST ── */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
          className="text-center text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]/60 mt-8"
        >
          Made with ❤️ for you & your partner
        </motion.p>

      </div>
    </main>
  );
}