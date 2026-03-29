
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Users, Ticket, Tv, Sparkles, ArrowRight, Heart } from "lucide-react";

// Reuse your Petals component for consistency
function Petals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {["🌹","💗","❤️","🌸","✨","💕","💫","🌺"].map((e, i) => (
        <motion.span key={i}
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

export default function WatchHome() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");

  const handleCreateRoom = () => {
    const id = crypto.randomUUID().slice(0, 8);
    router.push(`/watch/${id}?role=host`);
  };

  const handleJoinRoom = () => {
    if (!joinId.trim()) return;
    router.push(`/watch/${joinId.trim()}?role=guest`);
  };

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-hidden flex flex-col items-center justify-center px-6">
      <Petals />

      {/* ── BACKGROUND DECOR ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#E91E63]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF6F91]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* ── HEADER ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FADADD] shadow-sm mb-6"
          >
            <Sparkles size={14} className="text-[#E91E63]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5E66]">Synced Cinema</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-[#4A2C2C] mb-4"
          >
            Movie Night <span className="text-[#E91E63]">Together</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[#8B5E66] text-lg italic"
          >
            Distance means nothing when you're watching the same scene. ❤️
          </motion.p>
        </div>

        {/* ── MAIN ACTIONS ── */}
        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          
          {/* Create Room Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-3 bg-white rounded-[2.5rem] border-2 border-[#FADADD] p-8 shadow-[0_20px_50px_rgba(233,30,99,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5F7] flex items-center justify-center mb-6">
                <Tv className="text-[#E91E63]" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#4A2C2C] mb-2">Host a Session</h3>
              <p className="text-sm text-[#8B5E66] mb-8 leading-relaxed">
                Create a private room and invite your partner to watch movies in perfect sync.
              </p>
            </div>
            
            <button
              onClick={handleCreateRoom}
              className="group flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(233,30,99,0.3)] hover:brightness-105 transition-all"
            >
              Start Movie Night <Play size={16} fill="currentColor" />
            </button>
          </motion.div>

          {/* Join Room Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-[#4A2C2C] rounded-[2.5rem] p-8 shadow-2xl flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Ticket className="text-[#FFC1CC]" size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-6">Join Partner</h3>
            
            <div className="space-y-3 mt-auto">
              <input
                type="text"
                placeholder="Room ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FFC1CC]/50 transition-colors"
              />
              <button
                onClick={handleJoinRoom}
                className="w-full py-4 bg-white text-[#4A2C2C] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FADADD] transition-colors"
              >
                Join Now
              </button>
            </div>
          </motion.div>

        </div>

        {/* ── FOOTER INFO ── */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60"
        >
          <div className="flex items-center gap-3">
            <Users size={18} className="text-[#E91E63]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A2C2C]">Real-time Sync</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#E91E63]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A2C2C]">Private Chat</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-[#E91E63]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A2C2C]">Built for Lovers</span>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
            <button 
                onClick={() => router.push('/')}
                className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] hover:text-[#E91E63] transition-colors inline-flex items-center gap-2"
            >
               <ArrowRight size={12} className="rotate-180" /> Back to Dashboard
            </button>
        </div>
      </div>
    </main>
  );
}