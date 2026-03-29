"use client";

import { motion } from "framer-motion";
import { LogIn, Sparkles, Heart, Ticket } from "lucide-react";
import { signIn } from "next-auth/react";

// Consistency ke liye petals component yahan bhi
function Petals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {["🌹","💗","❤️","🌸","✨","💕","💫","🌺"].map((e, i) => (
        <motion.span key={i}
          className="absolute text-3xl md:text-4xl select-none"
          style={{
            top:  `${[10,25,45,75,30,85,15,65][i]}%`,
            left: `${[5,85,10,90,95,8,50,80][i]}%`,
            opacity: 0.1,
          }}
          animate={{ y:[0,-20,0], rotate:[-5,5,-5] }}
          transition={{ duration:[12,15,11,16,13,17,14,10][i], repeat:Infinity, repeatType:"reverse", delay:i*0.5 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

export default function SignInToWatch() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 relative overflow-hidden">
      <Petals />

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E91E63]/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white border-2 border-[#FADADD] rounded-[3rem] p-10 flex flex-col items-center max-w-sm w-full shadow-[0_30px_100px_rgba(233,30,99,0.12)]"
      >
        {/* Animated Icon Header */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#E91E63] to-[#FF6F91] flex items-center justify-center shadow-xl shadow-[#E91E63]/20"
          >
            <Ticket size={40} className="text-white -rotate-12" />
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-[#FADADD]">
            <Heart size={14} className="text-[#E91E63] fill-[#E91E63]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F7] border border-[#FADADD] mb-4">
            <Sparkles size={12} className="text-[#E91E63]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#8B5E66]">Exclusive Access</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A2C2C] mb-3 leading-tight">
            Your Cinema Seat <br /> Awaits
          </h2>
          <p className="text-[#8B5E66] text-sm leading-relaxed italic">
            Sign in to join the room and experience synchronized movie nights with your favorite person.
          </p>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => signIn("google")} // Ya jo bhi aapka provider hai
          className="group relative w-full py-5 bg-[#4A2C2C] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl overflow-hidden transition-all hover:bg-[#362020]"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-3">
            Secure Sign In <LogIn size={16} />
          </span>
        </motion.button>

        {/* Footer Note */}
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E66]/40">
          Private • Encrypted • Synced
        </p>
      </motion.div>
    </div>
  );
}