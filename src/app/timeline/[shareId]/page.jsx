"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Calendar, Heart, Trophy, Flame, Award, Edit2, Trash2, X, Hourglass, RefreshCcw, HeartOff } from "lucide-react";
import AddEventForm from "@/components/AddEventForm";

// ── IMAGE BANK ──
const IMG = {
  hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
  couple1: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=85",
  couple2: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=700&q=85",
  roses:   "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=900&q=85",
  sunset:  "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=900&q=85",
  petals:  "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=900&q=85",
  candle:  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
};

// Level config
const LEVELS = {
  Bronze:   { color: "from-amber-700 to-amber-500",   glow: "rgba(180,83,9,0.4)",   emoji: "🥉" },
  Silver:   { color: "from-slate-400 to-slate-300",   glow: "rgba(148,163,184,0.4)", emoji: "🥈" },
  Gold:     { color: "from-yellow-500 to-amber-400",  glow: "rgba(234,179,8,0.4)",   emoji: "🥇" },
  Platinum: { color: "from-cyan-400 to-blue-500",     glow: "rgba(34,211,238,0.5)",  emoji: "💎" },
};

function getLevelConfig(level) {
  return LEVELS[level] ?? LEVELS.Bronze;
}

// ── AMBIENT PETALS ──
function Petals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {["🌹","💗","❤️","🌸","✨","💕","💫","🌺"].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl md:text-4xl select-none"
          style={{
            top:  `${[7,18,52,70,33,80,44,62][i]}%`,
            left: `${[4,87,3,90,93,5,47,77][i]}%`,
            opacity: 0.12,
          }}
          animate={{ y:[0,-20,0], rotate:[-5,5,-5] }}
          transition={{ duration:[11,14,10,15,12,16,13,9][i], repeat:Infinity, repeatType:"reverse", delay:i*0.8 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────
export default function TimelinePage() {
  const { shareId } = useParams();
  const router = useRouter();

  const [timeline, setTimeline]       = useState(null);
  const [events, setEvents]           = useState([]);
  const [hasEventToday, setHasEventToday] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Edit modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading]     = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch(`/api/timeline/${shareId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load timeline");
      if (data.success) {
        setTimeline(data.timeline);
        setEvents(data.events || []);
        setHasEventToday(data.hasEventToday || false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shareId]);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const formData = new FormData(e.target);
    const updatedEvent = {
      title:       formData.get("title"),
      description: formData.get("description"),
      mood:        formData.get("mood"),
    };

    try {
      const res = await fetch(`/api/events/single/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to update memory");
        return;
      }
      fetchData();
      closeModal();
    } catch {
      alert("Network error while updating");
    } finally {
      setEditLoading(false);
    }
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: "brightness(0.4) saturate(1.2)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E91E63]/30 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <motion.div
            animate={{ scale:[1,1.2,1], rotate:[0,10,-10,0] }}
            transition={{ repeat:Infinity, duration:2 }}
            className="text-7xl drop-shadow-2xl"
          >
            💕
          </motion.div>
          <motion.p animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.5 }}
            className="text-white text-[10px] font-black uppercase tracking-[0.45em]">
            Loading Timeline...
          </motion.p>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error || !timeline) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <img src={IMG.roses} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.3)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#E91E63]/40" />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-sm">
            <div className="text-7xl mb-6 drop-shadow-2xl">💔</div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4 drop-shadow-lg">Oops!</h1>
            <p className="text-white/80 mb-8 text-sm italic">{error || "Timeline not found or expired"}</p>
            <button
              onClick={fetchData}
              className="inline-block px-10 py-4 bg-white text-[#E91E63] rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-[#FADADD] transition-all">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 1. PENDING STATE (Waiting for Partner) ──
  if (timeline.status === "pending") {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-6 relative overflow-hidden">
        <Petals />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[3rem] border-2 border-[#FADADD] p-12 text-center shadow-[0_30px_80px_rgba(233,30,99,0.15)] relative z-10"
        >
          <motion.div 
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-24 h-24 bg-gradient-to-br from-[#FFC1CC] to-[#FADADD] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <Hourglass size={40} className="text-[#E91E63]" />
          </motion.div>
          <h2 className="text-3xl font-serif font-bold text-[#4A2C2C] mb-4">Waiting for Magic</h2>
          <p className="text-[#8B5E66] text-sm leading-relaxed mb-8 italic">
            "Patience is a virtue when it comes to love." <br/>
            Your partner hasn't accepted the invitation yet. Please wait patiently for them to join the journey.
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={fetchData} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
              <RefreshCcw size={16} /> Check Status
            </button>
            <Link href="/" className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]">Back to Dashboard</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── 2. DECLINED STATE ──
  if (timeline.status === "declined" || timeline.status === "rejected") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FFF5F7] opacity-50" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center relative z-10"
        >
          <div className="relative inline-block mb-8">
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
              className="text-8xl"
            >
              🥀
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
              <HeartOff size={24} />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#4A2C2C] mb-4">Invitation Declined</h2>
          <p className="text-red-600/70 text-sm font-medium leading-relaxed mb-10">
            Looks like your partner wasn't ready for this journey just yet. <br/>
            <span className="text-[10px] uppercase tracking-widest mt-2 block opacity-60">(Aapko gaali deke bhaga diya hai, kripya dubara koshish karein!)</span>
          </p>
          <div className="space-y-4">
            <button onClick={() => router.push("/timeline/create")} className="w-full py-5 bg-[#4A2C2C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              Create New Timeline
            </button>
            <Link href="/" className="block py-4 border-2 border-[#FADADD] text-[#8B5E66] rounded-2xl font-black text-xs uppercase tracking-widest">
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const levelCfg = getLevelConfig(timeline.level);

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-x-hidden">
      <Petals />

      {/* ── CINEMATIC HEADER BANNER ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "min(360px, 50vw)", minHeight: 240 }}>
        <motion.img
          src={IMG.hero}
          alt=""
          initial={{ scale:1.06, opacity:0 }}
          animate={{ scale:1.01, opacity:1 }}
          transition={{ duration:1.4, ease:"easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter:"brightness(0.48) saturate(1.35) contrast(1.05)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/40 via-transparent to-[#FF6F91]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FFF5F7]" />

        {/* Floating roses */}
        {["🌹","💕","✨"].map((e, i) => (
          <motion.span key={i}
            className="absolute text-4xl md:text-5xl select-none opacity-20"
            style={{ top:["15%","60%","30%"][i], right:["8%","12%","20%"][i] }}
            animate={{ y:[0,-15,0], rotate:[-4,4,-4] }}
            transition={{ duration:[8,11,9][i], repeat:Infinity, repeatType:"reverse", delay:i*1.2 }}
          >
            {e}
          </motion.span>
        ))}

        {/* Title */}
        <div className="absolute bottom-16 left-6 md:left-12 z-10 max-w-2xl">
          <motion.p
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2"
          >
            Love Timeline
          </motion.p>
          <motion.h1
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, type:"spring" }}
            className="font-serif font-bold text-white drop-shadow-2xl leading-tight"
            style={{ fontSize:"clamp(2rem,5vw,3.5rem)" }}
          >
            {timeline.title}
            <span className="inline-block ml-2 text-[0.6em]">💕</span>
          </motion.h1>
          {timeline.description && (
            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
              className="text-white/75 text-sm md:text-base mt-2 italic drop-shadow">
              {timeline.description}
            </motion.p>
          )}
        </div>

        {/* Floating couple photos */}
        <motion.div
          initial={{ opacity:0, x:40, rotate:8 }} animate={{ opacity:1, x:0, rotate:6 }}
          transition={{ delay:0.5, type:"spring", stiffness:80 }}
          className="absolute bottom-14 right-6 md:right-14 bg-white p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          style={{ width:64, height:76, zIndex:20 }}
        >
          <img src={IMG.couple1} alt="" className="w-full h-full object-cover rounded-xl" />
        </motion.div>
        <motion.div
          initial={{ opacity:0, x:40, rotate:-5 }} animate={{ opacity:1, x:0, rotate:-4 }}
          transition={{ delay:0.65, type:"spring", stiffness:80 }}
          className="absolute bottom-8 right-18 md:right-28 bg-white p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          style={{ width:56, height:68, zIndex:10 }}
        >
          <img src={IMG.couple2} alt="" className="w-full h-full object-cover rounded-xl" />
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 px-4 sm:px-6 pb-20 -mt-4 max-w-4xl mx-auto">

        {/* ── GAMIFICATION BADGES ── */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Streak",  val: `${timeline.currentStreak || 0} days`, icon: Flame,     color: "from-orange-500 to-red-500",      glow: "rgba(249,115,22,0.35)", emoji: "🔥" },
            { label: "Longest", val: `${timeline.longestStreak || 0} days`, icon: Trophy,    color: "from-amber-500 to-yellow-400",    glow: "rgba(245,158,11,0.35)", emoji: "🏆" },
            { label: "Level",   val: timeline.level || "Bronze",            icon: Award,     color: levelCfg.color,                    glow: levelCfg.glow,           emoji: levelCfg.emoji },
            { label: "Points",  val: timeline.points || 0,                  icon: Heart,     color: "from-[#E91E63] to-[#FF6F91]",     glow: "rgba(233,30,99,0.35)",  emoji: "💖" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.4 + i*0.08, type:"spring" }}
              whileHover={{ y:-4, scale:1.03 }}
              className="relative bg-white rounded-[2rem] border-2 border-[#FADADD] overflow-hidden shadow-[0_10px_35px_rgba(233,30,99,0.12)]"
            >
              {/* Gradient top bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`} />

              <div className="p-4 text-center relative">
                {/* Emoji icon */}
                <div className={`w-9 h-9 mx-auto mb-2 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  style={{ boxShadow: `0 6px 18px ${stat.glow}` }}>
                  <span className="text-lg">{stat.emoji}</span>
                </div>

                <p className="text-xl md:text-2xl font-black text-[#4A2C2C] leading-none mb-0.5">{stat.val}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8B5E66]">{stat.label}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#FADADD]/20 rounded-bl-[2rem]" />
            </motion.div>
          ))}
        </motion.div>

        {/* ── ADD EVENT SECTION ── */}
        <motion.div
          initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5 }}
          className="mb-10"
        >
          {hasEventToday ? (
            /* Already added today */
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_25px_70px_rgba(233,30,99,0.2)]">
              <div className="absolute inset-0">
                <img src={IMG.sunset} alt="" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter:"brightness(0.4) saturate(1.5)" }} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/60 to-[#c2185b]/50" />
              </div>

              <div className="relative z-10 p-10 text-center">
                <motion.div
                  animate={{ scale:[1,1.12,1], rotate:[0,8,-8,0] }}
                  transition={{ repeat:Infinity, duration:4, ease:"easeInOut" }}
                  className="text-6xl mb-4 drop-shadow-2xl"
                >
                  🎉✨
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-white mb-3">
                  Today's Memory Already Added!
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5 max-w-md mx-auto">
                  You're on fire! Keep the streak alive 💖<br />
                  Come back tomorrow for the next moment.
                </p>
                <p className="text-white font-bold text-base mb-6">
                  Current streak: {timeline.currentStreak || 0} days 🔥
                </p>
                <button
                  onClick={fetchData}
                  className="px-10 py-4 bg-white text-[#E91E63] rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#FADADD] transition-all">
                  Refresh Timeline
                </button>
              </div>
            </div>
          ) : (
            /* Add event form */
            <div className="bg-white rounded-[3rem] border-2 border-[#FADADD] shadow-[0_20px_60px_rgba(233,30,99,0.15)] overflow-hidden">
              {/* Form header strip */}
              <div className="relative h-20 bg-gradient-to-br from-[#FFF0F4] via-[#FADADD]/50 to-[#FFF5F7] flex items-center px-6 overflow-hidden">
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#E91E63]/7 rounded-full blur-2xl" />
                <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-[#FFC1CC]/25 rounded-full blur-xl" />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-6xl opacity-[0.08] select-none pointer-events-none">✨</span>

                <div className="relative z-10 flex items-center gap-3">
                  <Calendar size={20} className="text-[#E91E63]" />
                  <h3 className="text-base font-serif font-bold text-[#4A2C2C]">
                    Add Today's Special Memory
                  </h3>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#E91E63]/20 to-transparent" />
              </div>

              <div className="p-6">
                <AddEventForm timeline={timeline} refresh={fetchData} />
              </div>
            </div>
          )}
        </motion.div>

        {/* ── TIMELINE EVENTS ── */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.6 }}
            className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] p-12 text-center shadow-[0_25px_70px_rgba(233,30,99,0.12)] overflow-hidden mb-10"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FADADD]/30 rounded-bl-[3rem]" />
            <span className="absolute bottom-5 right-6 text-9xl opacity-[0.04] select-none pointer-events-none">💞</span>

            <motion.div
              animate={{ scale:[1,1.08,1] }}
              transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}
              className="text-7xl mb-5 relative z-10"
            >
              💞
            </motion.div>
            <h2 className="relative z-10 text-2xl font-serif font-bold text-[#4A2C2C] mb-3">
              No Memories Yet
            </h2>
            <p className="relative z-10 text-sm text-[#8B5E66] italic">
              Start capturing your love story! Add your first moment above ↑
            </p>
          </motion.div>
        ) : (
          /* Alternating Timeline Structure */
          <div className="relative mb-10">
            {/* Center vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E91E63]/40 via-[#FF6F91]/30 to-[#E91E63]/40 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-16">
              {events.map((event, i) => {
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity:0, x: isLeft ? -40 : 40, y:20 }}
                    animate={{ opacity:1, x:0, y:0 }}
                    transition={{ delay:0.6 + i*0.08, type:"spring", stiffness:80 }}
                    className={`relative flex items-center ${
                      isLeft 
                        ? "md:justify-start md:pr-[calc(50%+2.5rem)]" 
                        : "md:justify-end md:pl-[calc(50%+2.5rem)]"
                    }`}
                  >
                    {/* Center dot on line */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <motion.div
                        whileHover={{ scale:1.3 }}
                        className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E91E63] to-[#FF6F91] ring-4 ring-white shadow-[0_4px_15px_rgba(233,30,99,0.4)]"
                      />
                    </div>

                    {/* Event Card */}
                    <motion.div
                      onClick={() => handleEditClick(event)}
                      whileHover={{ y:-6, scale:1.02 }}
                      className="relative w-full bg-white rounded-[2.5rem] border-2 border-[#FADADD] overflow-hidden shadow-[0_12px_45px_rgba(233,30,99,0.1)] cursor-pointer transition-all duration-300 group"
                    >
                      {/* Event image strip (if has media) */}
                      {event.media?.length > 0 && (
                        <div className="relative h-36 overflow-hidden">
                          <img src={event.media[0].url} alt="" className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter:"brightness(0.6) saturate(1.3)", transform:"scale(1.05)" }} />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/20 to-transparent" />

                          {/* Media count badge */}
                          {event.media.length > 1 && (
                            <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-widest text-[#E91E63] shadow-md">
                              {event.media.length} Photos
                            </div>
                          )}

                          {/* Date badge on image */}
                          <div className="absolute bottom-3 left-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#FADADD] shadow-md">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8B5E66]">
                              {event.dateString}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Card content */}
                      <div className={`p-6 ${!event.media?.length ? "pt-8" : "pt-4"}`}>
                        {/* Corner accent (if no media) */}
                        {!event.media?.length && (
                          <div className="absolute top-0 right-0 w-20 h-20 bg-[#FADADD]/30 rounded-bl-[2.5rem]" />
                        )}

                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h2 className="flex-1 text-xl md:text-2xl font-serif font-bold text-[#4A2C2C] leading-tight">
                            {event.title}
                          </h2>

                          {/* Date pill (only if no media) */}
                          {!event.media?.length && (
                            <span className="flex-shrink-0 px-4 py-1.5 bg-[#FFF5F7] border border-[#FADADD] rounded-full text-[10px] font-bold text-[#8B5E66]">
                              {event.dateString}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-sm text-[#8B5E66] leading-relaxed mb-4">
                            {event.description}
                          </p>
                        )}

                        {event.mood && (
                          <span className="inline-block px-4 py-1.5 bg-pink-50 text-[#E91E63] rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-200">
                            {event.mood}
                          </span>
                        )}

                        {/* Edit icon on hover */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 size={16} className="text-[#E91E63]" />
                        </div>

                        {/* Faint watermark emoji bottom right */}
                        <span className="absolute bottom-3 right-4 text-5xl opacity-[0.04] select-none pointer-events-none">
                          {["🌹","💕","✨","💗","🌸","💖"][i % 6]}
                        </span>
                      </div>

                      {/* Connecting line from card to center dot (desktop only) */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r ${
                        isLeft 
                          ? "right-0 translate-x-full from-[#E91E63]/30 to-transparent" 
                          : "left-0 -translate-x-full from-transparent to-[#E91E63]/30"
                      }`} />
                    </motion.div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E91E63]/40" />
            <span className="text-xl">🌹</span>
            <span className="text-2xl">💕</span>
            <span className="text-xl">🌹</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E91E63]/40" />
          </div>

          <Link href="/"
            className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] hover:text-[#E91E63] transition-colors">
            ← Home Jaao
          </Link>
        </motion.div>

      </div>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {showEditModal && selectedEvent && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal header */}
              <div className="relative h-20 bg-gradient-to-br from-[#FFF0F4] via-[#FADADD]/50 to-[#FFF5F7] flex items-center justify-between px-6 border-b border-[#FADADD]">
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#E91E63]/7 rounded-full blur-2xl" />
                <h2 className="relative z-10 text-xl font-serif font-bold text-[#4A2C2C]">Edit Memory</h2>
                <button
                  onClick={closeModal}
                  className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-[#FADADD] flex items-center justify-center hover:border-[#E91E63] transition-colors"
                >
                  <X size={16} className="text-[#8B5E66]" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
                <form onSubmit={handleEditSubmit} className="space-y-5">

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedEvent.title || ""}
                      className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors bg-[#FFF5F7] text-[#4A2C2C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedEvent.description || ""}
                      rows={4}
                      className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors resize-none bg-[#FFF5F7] text-[#4A2C2C]"
                    />
                  </div>

                  {/* Current Media */}
                  {selectedEvent.media?.length > 0 && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] mb-3">Current Media</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedEvent.media.map((m, idx) => (
                          <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-[#FADADD]">
                            {m.type === "image" ? (
                              <img src={m.url} alt="" className="w-full aspect-square object-cover" />
                            ) : (
                              <video src={m.url} className="w-full aspect-square object-cover" />
                            )}
                            {m.caption && (
                              <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 text-center">
                                {m.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-[#FADADD]">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-4 bg-[#FFF5F7] text-[#8B5E66] border-2 border-[#FADADD] rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#E91E63] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(233,30,99,0.4)] disabled:opacity-60 hover:brightness-105 transition-all"
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}