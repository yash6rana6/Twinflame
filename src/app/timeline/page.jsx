// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Plus, Calendar, Flame, Heart } from "lucide-react"; // Heart icon add ki divider ke liye
// import InvitedTimelines from "@/components/InvitedTimelines";

// // ... (IMG Bank aur THEME_COLORS same rahenge)
// const IMG = {
//   hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
//   couple1: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=85",
//   couple2: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=700&q=85",
//   couple3: "https://images.unsplash.com/photo-1521727857535-28d2047619f8?w=700&q=85",
// };

// const THEME_COLORS = {
//   romantic: { from: "from-pink-400",    to: "to-rose-500",   emoji: "💕" },
//   minimal:  { from: "from-slate-300",   to: "to-gray-400",   emoji: "✨" },
//   classic:  { from: "from-amber-400",   to: "to-yellow-500", emoji: "🌹" },
//   travel:   { from: "from-sky-400",     to: "to-blue-500",   emoji: "✈️" },
//   family:   { from: "from-emerald-400", to: "to-teal-500",   emoji: "👨‍👩‍👧" },
// };

// function getThemeColor(theme) {
//   return THEME_COLORS[theme] ?? THEME_COLORS.romantic;
// }

// function Petals() {
//   return (
//     <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//       {["🌹","💗","❤️","🌸","✨","💕","💫","🌺"].map((e, i) => (
//         <motion.span key={i}
//           className="absolute text-3xl md:text-4xl select-none"
//           style={{
//             top:  `${[7,18,52,70,33,80,44,62][i]}%`,
//             left: `${[4,87,3,90,93,5,47,77][i]}%`,
//             opacity: 0.12,
//           }}
//           animate={{ y:[0,-20,0], rotate:[-5,5,-5] }}
//           transition={{ duration:[11,14,10,15,12,16,13,9][i], repeat:Infinity, repeatType:"reverse", delay:i*0.8 }}
//         >
//           {e}
//         </motion.span>
//       ))}
//     </div>
//   );
// }

// export default function TimelineHomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [timelines, setTimelines] = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [error, setError]         = useState(null);

//   useEffect(() => {
//     if (status === "authenticated") fetchUserTimelines();
//     else setLoading(false);
//   }, [status]);

//   const fetchUserTimelines = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res  = await fetch("/api/timeline/user");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch timelines");
//       setTimelines(data.timelines || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = () => router.push("/timeline/create");

//   if (status === "loading" || loading) {
//     return (
//       <div className="fixed inset-0 z-50 overflow-hidden">
//         <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover scale-105"
//           style={{ filter:"brightness(0.4) saturate(1.2)" }} />
//         <div className="absolute inset-0 bg-gradient-to-b from-[#E91E63]/30 via-black/20 to-black/60" />
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
//           <motion.div animate={{ scale:[1,1.2,1], rotate:[0,10,-10,0] }} transition={{ repeat:Infinity, duration:2 }} className="text-7xl drop-shadow-2xl">💕</motion.div>
//           <motion.p animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.5 }} className="text-white text-[10px] font-black uppercase tracking-[0.45em]">Loading Love Stories...</motion.p>
//         </div>
//       </div>
//     );
//   }

//   const isLoggedIn = status === "authenticated";

//   return (
//     <main className="min-h-screen bg-[#FFF5F7] relative overflow-x-hidden">
//       <Petals />

//       {/* ── HERO SECTION ── */}
//       <div className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
//         <div className="absolute inset-0">
//           <motion.img
//             src={IMG.hero} alt=""
//             initial={{ scale:1.08, opacity:0 }} animate={{ scale:1.02, opacity:1 }}
//             transition={{ duration:1.6, ease:"easeOut" }}
//             className="absolute inset-0 w-full h-full object-cover object-center"
//             style={{ filter:"brightness(0.52) saturate(1.3) contrast(1.05)" }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#FFF5F7]" />
//         </div>

//         <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto py-24">
//           <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
//             <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.8 }} className="w-2 h-2 rounded-full bg-white inline-block" />
//             <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white">Love Timeline</span>
//           </motion.div>

//           <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, type:"spring", stiffness:70 }} className="font-serif font-bold text-white drop-shadow-2xl leading-[0.92] mb-6" style={{ fontSize:"clamp(2.5rem,8vw,5.5rem)" }}>
//             Preserve Your <br /><span className="italic text-[#FFC1CC]">Love Story</span> Forever <span className="inline-block ml-2 text-[0.5em]">💕</span>
//           </motion.h1>

//           <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="text-base md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl drop-shadow">
//             Create a private timeline with your partner. Add daily moments, photos, videos and build your beautiful journey together.
//           </motion.p>

//           <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }} className="flex items-end justify-center gap-3 mb-10">
//             {[ { src: IMG.couple1, deg: -7, h: 88, zIndex: 10 }, { src: IMG.couple2, deg: 0, h: 110, zIndex: 30 }, { src: IMG.couple3, deg: 7, h: 88, zIndex: 10 } ].map((p, i) => (
//               <motion.div key={i} whileHover={{ scale:1.1, rotate:0, y:-8, zIndex:40 }} transition={{ type:"spring", stiffness:300 }} className="bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden flex-shrink-0" style={{ width:72, height:p.h, rotate:`${p.deg}deg`, zIndex:p.zIndex }}>
//                 <img src={p.src} alt="" className="w-full h-full object-cover rounded-xl" />
//               </motion.div>
//             ))}
//           </motion.div>

//           <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
//             <motion.button whileHover={{ scale:1.05, y:-4 }} whileTap={{ scale:0.96 }} onClick={handleCreate} className="px-12 py-5 bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_20px_60px_rgba(194,24,91,0.65)] relative group overflow-hidden">
//                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
//                <span className="relative z-10 flex items-center gap-3">{isLoggedIn ? "Create New Timeline" : "Start Your Timeline"} <Plus size={16} /></span>
//             </motion.button>
//             <Link href="/about">
//               <button className="px-12 py-5 rounded-2xl border-2 border-white/35 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm">Learn More</button>
//             </Link>
//           </motion.div>
//         </div>
//       </div>

//       {/* ── USER TIMELINES & INVITED TIMELINES ── */}
//       {isLoggedIn && (
//         <div className="relative z-10 px-4 sm:px-6 py-16 max-w-6xl mx-auto space-y-20">
          
//           {/* Section 1: My Timelines */}
//           <section>
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
//               <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A2C2C] mb-4 sm:mb-0">
//                 Your Timelines <span className="inline-block ml-2 text-2xl">💞</span>
//               </h2>
//               <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_12px_35px_rgba(233,30,99,0.4)]">
//                 <Plus size={16} /> Create New
//               </motion.button>
//             </div>

//             {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl mb-8 text-center">{error}</div>}

//             {timelines.length === 0 ? (
//               <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] p-12 text-center shadow-[0_30px_80px_rgba(233,30,99,0.15)]">
//                 <div className="text-7xl mb-5">💌</div>
//                 <h3 className="text-2xl font-serif font-bold text-[#4A2C2C] mb-3">No Timelines Yet</h3>
//                 <p className="text-sm text-[#8B5E66] italic mb-8">Start capturing your love story today!</p>
//                 <button onClick={handleCreate} className="px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest">Create Your First Timeline</button>
//               </motion.div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {timelines.map((tl, i) => {
//                   const themeClr = getThemeColor(tl.theme);
//                   return (
//                     <motion.div key={tl._id} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }} onClick={() => router.push(`/timeline/${tl.shareId}`)} whileHover={{ y:-8 }} className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] overflow-hidden shadow-[0_15px_50px_rgba(233,30,99,0.12)] cursor-pointer group">
//                       <div className={`relative h-36 bg-gradient-to-br ${themeClr.from} ${themeClr.to} flex items-center justify-center`}>
//                         <div className="absolute inset-0 bg-black/20" />
//                         <span className="text-7xl opacity-40">{themeClr.emoji}</span>
//                         <div className="absolute bottom-3 left-4 right-4 text-white">
//                           <h3 className="text-lg font-serif font-bold truncate">{tl.title}</h3>
//                           <p className="text-xs opacity-90">{tl.theme} Theme</p>
//                         </div>
//                       </div>
//                       <div className="p-5">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center gap-2">
//                             <Flame size={18} className="text-orange-500" />
//                             <span className="text-sm font-black text-[#4A2C2C]">{tl.currentStreak || 0} days</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF5F7] rounded-full border border-[#FADADD]">
//                             <Calendar size={12} className="text-[#E91E63]" />
//                             <span className="text-[10px] font-bold text-[#8B5E66]">{tl.totalEvents || 0} moments</span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-[#8B5E66] line-clamp-2 mb-3">{tl.description || "Our journey..."}</p>
//                         <p className="text-[10px] uppercase font-bold text-[#8B5E66]/60">Created {new Date(tl.createdAt).toLocaleDateString()}</p>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>

//           {/* ── FLOW DIVIDER ── */}
//           <div className="flex items-center gap-4 opacity-30">
//             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E91E63]" />
//             <Heart size={20} className="text-[#E91E63] fill-[#E91E63]" />
//             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E91E63]" />
//           </div>

//           {/* Section 2: Invited Timelines */}
//           <section className="pb-10">
//              <InvitedTimelines />
//           </section>
//         </div>
//       )}

//       {/* ── FEATURES SECTION ── */}
//       <div className="relative z-10 py-20 px-6 bg-white/50 backdrop-blur-sm">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-14">
//              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E91E63]">Why Timeline</span>
//              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A2C2C]">Capture Every <span className="italic text-[#E91E63]">Special Moment</span></h2>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { emoji: "📸", title: "Upload Memories", desc: "Add photos and videos with Cloudinary storage." },
//               { emoji: "🔥", title: "Daily Streak", desc: "Stay consistent and grow your love streak together." },
//               { emoji: "🎁", title: "Export Memories", desc: "Download your love story as PDF or beautiful recap." },
//             ].map((feat, i) => (
//               <motion.div key={i} whileHover={{ y:-6 }} className="bg-white rounded-[2.5rem] border-2 border-[#FADADD] p-8 text-center shadow-[0_12px_40px_rgba(233,30,99,0.1)]">
//                 <div className="text-5xl mb-4">{feat.emoji}</div>
//                 <h3 className="text-xl font-serif font-bold text-[#4A2C2C] mb-3">{feat.title}</h3>
//                 <p className="text-sm text-[#8B5E66] leading-relaxed">{feat.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <footer className="relative z-10 text-center py-8 border-t border-[#FADADD]">
//         <p className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]/60">© {new Date().getFullYear()} Love Timeline • Made with ❤️ in India</p>
//       </footer>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Flame, Trophy, Award, Heart, Clock, AlertCircle, CheckCircle2, Calendar } from "lucide-react"; 
import InvitedTimelines from "@/components/InvitedTimelines";

// ── IMAGE BANK ──
const IMG = {
  hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
};

export default function TimelineHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (status === "authenticated") fetchUserTimelines();
    else if (status === "unauthenticated") setLoading(false);
  }, [status]);

  const fetchUserTimelines = async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch("/api/timeline/user");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch timelines");
      setTimelines(data.timelines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => router.push("/timeline/create");

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <motion.div animate={{ scale:[1,1.2,1], rotate:[0,10,-10,0] }} transition={{ repeat:Infinity, duration:2 }} className="text-7xl">💕</motion.div>
          <motion.p animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.5 }} className="text-white text-[10px] font-black uppercase tracking-[0.45em]">Loading Love Stories...</motion.p>
        </div>
      </div>
    );
  }

  const isLoggedIn = status === "authenticated";

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-x-hidden">

      {/* ── HERO SECTION ── */}
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={IMG.hero} alt=""
            initial={{ scale:1.08, opacity:0 }} animate={{ scale:1.02, opacity:1 }}
            transition={{ duration:1.6, ease:"easeOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter:"brightness(0.52) saturate(1.3) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#FFF5F7]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto py-24">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.8 }} className="w-2 h-2 rounded-full bg-white inline-block" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white">Love Timeline</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, type:"spring", stiffness:70 }} className="font-serif font-bold text-white drop-shadow-2xl leading-[0.92] mb-6" style={{ fontSize:"clamp(2.5rem,8vw,5.5rem)" }}>
            Preserve Your <br /><span className="italic text-[#FFC1CC]">Love Story</span> Forever <span className="inline-block ml-2 text-[0.5em]">💕</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="text-base md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl drop-shadow">
            Create a private timeline with your partner. Add daily moments, photos, videos and build your beautiful journey together.
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <motion.button whileHover={{ scale:1.05, y:-4 }} whileTap={{ scale:0.96 }} onClick={handleCreate} className="px-12 py-5 bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_20px_60px_rgba(194,24,91,0.65)] relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
               <span className="relative z-10 flex items-center gap-3">{isLoggedIn ? "Create New Timeline" : "Start Your Timeline"} <Plus size={16} /></span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── USER TIMELINES & INVITED TIMELINES ── */}
      {isLoggedIn && (
        <div className="relative z-10 px-4 sm:px-6 py-16 max-w-6xl mx-auto space-y-20">
          
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A2C2C] mb-4 sm:mb-0">
                Your Timelines <span className="inline-block ml-2 text-2xl">💞</span>
              </h2>
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_12px_35px_rgba(233,30,99,0.4)]">
                <Plus size={16} /> Create New
              </motion.button>
            </div>

            {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl mb-8 text-center">{error}</div>}

            {timelines.length === 0 ? (
              <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] p-12 text-center shadow-[0_30px_80px_rgba(233,30,99,0.15)]">
                <div className="text-7xl mb-5">💌</div>
                <h3 className="text-2xl font-serif font-bold text-[#4A2C2C] mb-3">No Timelines Yet</h3>
                <p className="text-sm text-[#8B5E66] italic mb-8">Start capturing your love story today!</p>
                <button onClick={handleCreate} className="px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest">Create Your First Timeline</button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timelines.map((tl, i) => {


                  // Status Configuration
                  const statusConfig = {
                    active:   { label: "Active",   bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
                    pending:  { label: "Pending",  bg: "bg-amber-100",   text: "text-amber-700",  icon: Clock },
                    declined: { label: "Declined", bg: "bg-rose-100",    text: "text-rose-700",   icon: AlertCircle },
                  };

                  const currentStatus = statusConfig[tl.status] || statusConfig.active;
                  const StatusIcon = currentStatus.icon;

                  return (
                    <motion.div 
                      key={tl._id} 
                      initial={{ opacity:0, y:30 }} 
                      animate={{ opacity:1, y:0 }} 
                      transition={{ delay: i*0.08 }} 
                      onClick={() => router.push(`/timeline/${tl.shareId}`)} 
                      whileHover={{ y:-8 }} 
                      className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] overflow-hidden shadow-[0_15px_50px_rgba(233,30,99,0.12)] cursor-pointer group"
                    >
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${currentStatus.bg} ${currentStatus.text}`}>
                        <StatusIcon size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{currentStatus.label}</span>
                      </div>

                      <div className="relative h-36 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="text-7xl opacity-40">💕</span>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-serif font-bold truncate">{tl.title}</h3>
                          <p className="text-xs opacity-90 capitalize">{tl.theme} Theme</p>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Flame size={18} className="text-orange-500" />
                            <span className="text-sm font-black text-[#4A2C2C]">{tl.currentStreak || 0} days</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF5F7] rounded-full border border-[#FADADD]">
                            <Calendar size={12} className="text-[#E91E63]" />
                            <span className="text-[10px] font-bold text-[#8B5E66]">{tl.totalEvents || 0} moments</span>
                          </div>
                        </div>

                        <p className="text-sm text-[#8B5E66] line-clamp-2 mb-4">
                          {tl.status === 'pending' 
                            ? "Waiting for partner to join..." 
                            : tl.status === 'declined' 
                            ? "Invitation was declined" 
                            : (tl.description || "Capture every special moment together.")}
                        </p>

                        <div className="pt-3 border-t border-[#FADADD]/50 text-[10px] text-[#8B5E66]/70">
                          Added {new Date(tl.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Separator */}
          <div className="flex items-center gap-4 opacity-30">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E91E63]" />
            <Heart size={20} className="text-[#E91E63] fill-[#E91E63]" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E91E63]" />
          </div>

          {/* Invited Timelines */}
          <section className="pb-10">
            <InvitedTimelines />
          </section>
        </div>
      )}

      {/* Features Section */}
      <div className="relative z-10 py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E91E63]">Why Timeline</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A2C2C]">Capture Every <span className="italic text-[#E91E63]">Special Moment</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: "📸", title: "Upload Memories", desc: "Add photos and videos to relive your favorite days." },
              { emoji: "🔥", title: "Daily Streak", desc: "Stay consistent and grow your love streak together." },
              { emoji: "🔒", title: "Private & Secure", desc: "Your memories are private between you and your partner." },
            ].map((feat, i) => (
              <motion.div key={i} whileHover={{ y:-6 }} className="bg-white rounded-[2.5rem] border-2 border-[#FADADD] p-8 text-center shadow-[0_12px_40px_rgba(233,30,99,0.1)]">
                <div className="text-5xl mb-4">{feat.emoji}</div>
                <h3 className="text-xl font-serif font-bold text-[#4A2C2C] mb-3">{feat.title}</h3>
                <p className="text-sm text-[#8B5E66] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center py-8 border-t border-[#FADADD]">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]/60">© {new Date().getFullYear()} Love Timeline • Crafted with ❤️</p>
      </footer>
    </main>
  );
}