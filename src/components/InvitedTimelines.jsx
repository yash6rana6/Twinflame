"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, X, AlertCircle, Heart, Calendar } from "lucide-react";

// Theme colors (same as TimelineHomePage)
const THEME_COLORS = {
  romantic: { from: "from-pink-400",    to: "to-rose-500",   emoji: "💕" },
  minimal:  { from: "from-slate-300",   to: "to-gray-400",   emoji: "✨" },
  classic:  { from: "from-amber-400",   to: "to-yellow-500", emoji: "🌹" },
  travel:   { from: "from-sky-400",     to: "to-blue-500",   emoji: "✈️" },
  family:   { from: "from-emerald-400", to: "to-teal-500",   emoji: "👨‍👩‍👧" },
};

function getThemeColor(theme) {
  return THEME_COLORS[theme] ?? THEME_COLORS.romantic;
}

export default function InvitedTimelines() {
  const [invitedTimelines, setInvitedTimelines]     = useState([]);
  const [rejectedTimelines, setRejectedTimelines]   = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [actionLoading, setActionLoading]           = useState(null); // shareId of item being processed
  const router = useRouter();

  useEffect(() => {
    fetchInvitedTimelines();
  }, []);

  const fetchInvitedTimelines = async () => {
    try {
      setLoading(true);
      const res  = await fetch("/api/timeline/invite");
      const data = await res.json();

      console.log(data);

      if (data.success) {
        setInvitedTimelines(data.invitedTimelines || []);
        setRejectedTimelines(data.rejectedTimelines || []); // API should return this
      }
    } catch (err) {
      console.error("Failed to fetch invited timelines", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (shareId) => {
    setActionLoading(shareId);
    try {
      const res = await fetch("/api/timeline/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/timeline/${shareId}`);
      } else {
        alert(data.message || "Failed to accept");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (shareId) => {
    setActionLoading(shareId);
    try {
      const res = await fetch("/api/timeline/invite/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId }),
      });

      const data = await res.json();

      if (data.success) {
        fetchInvitedTimelines(); // refresh both lists
      } else {
        alert(data.message || "Failed to decline");
      }
    } catch {
      alert("Failed to decline");
    } finally {
      setActionLoading(null);
    }
  };

  const dismissRejection = async (shareId) => {
    // Optional: API call to mark rejection as "seen" or just remove from UI
    setRejectedTimelines(prev => prev.filter(t => t.shareId !== shareId));
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <motion.div
          animate={{ rotate:360 }}
          transition={{ repeat:Infinity, duration:1.5, ease:"linear" }}
          className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#E91E63] border-t-transparent"
        />
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66]">
          Loading Invitations...
        </p>
      </div>
    );
  }

  // If no invites and no rejections, don't show anything
  if (invitedTimelines.length === 0 && rejectedTimelines.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 mb-12">

      {/* ── PENDING INVITATIONS ── */}
      {invitedTimelines.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#FADADD] rounded-2xl">
              <Mail size={16} className="text-[#E91E63]" />
              <span className="text-sm font-black uppercase tracking-widest text-[#4A2C2C]">
                Pending Invites
              </span>
              <span className="px-2 py-0.5 bg-[#E91E63] text-white rounded-full text-xs font-black">
                {invitedTimelines.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {invitedTimelines.map((tl, i) => {
                const themeClr = getThemeColor(tl.theme);
                const isProcessing = actionLoading === tl.shareId;

                return (
                  <motion.div
                    key={tl._id}
                    layout
                    initial={{ opacity:0, scale:0.9, y:20 }}
                    animate={{ opacity:1, scale:1, y:0 }}
                    exit={{ opacity:0, scale:0.9, x:-100 }}
                    transition={{ delay: i*0.08, type:"spring" }}
                    whileHover={{ y:-6, scale:1.02 }}
                    className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] overflow-hidden shadow-[0_15px_50px_rgba(233,30,99,0.12)] transition-all duration-300"
                  >
                    {/* Theme gradient header */}
                    <div className={`relative h-28 bg-gradient-to-br ${themeClr.from} ${themeClr.to} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <motion.span
                        animate={{ scale:[1,1.12,1] }}
                        transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}
                        className="text-6xl opacity-50 drop-shadow-2xl"
                      >
                        {themeClr.emoji}
                      </motion.span>

                      {/* "NEW" badge */}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-white/40 shadow-md">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#E91E63]">
                          New Invite
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-[#4A2C2C] mb-2 leading-tight">
                        {tl.title}
                      </h3>

                      <p className="text-sm text-[#8B5E66] line-clamp-2 leading-relaxed mb-4">
                        {tl.description || "No description"}
                      </p>

                      {/* Invited by */}
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#FADADD]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E91E63] to-[#FF6F91] flex items-center justify-center text-white text-xs font-black">
                          {tl.owner?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] uppercase tracking-widest font-bold text-[#8B5E66]">
                            Invited by
                          </p>
                          <p className="text-xs font-bold text-[#4A2C2C] truncate">
                            {tl.owner?.name || "Unknown"}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2.5">
                        <motion.button
                          whileTap={{ scale:0.95 }}
                          onClick={() => handleAccept(tl.shareId)}
                          disabled={isProcessing}
                          className="flex-1 py-3 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_8px_25px_rgba(233,30,99,0.35)] hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:"linear" }}>
                              ⏳
                            </motion.span>
                          ) : (
                            <>
                              <Check size={14} />
                              Accept
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileTap={{ scale:0.95 }}
                          onClick={() => handleDecline(tl.shareId)}
                          disabled={isProcessing}
                          className="flex-1 py-3 bg-[#FFF5F7] text-[#8B5E66] border-2 border-[#FADADD] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          <X size={14} />
                          Decline
                        </motion.button>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-[2.5rem] pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── REJECTED INVITATIONS (Owner View) ── */}
      {rejectedTimelines.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-2xl">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm font-black uppercase tracking-widest text-red-700">
                Invitation Declined
              </span>
              <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-black">
                {rejectedTimelines.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {rejectedTimelines.map((tl, i) => {
                const themeClr = getThemeColor(tl.theme);

                return (
                  <motion.div
                    key={tl._id}
                    layout
                    initial={{ opacity:0, scale:0.9, y:20 }}
                    animate={{ opacity:1, scale:1, y:0 }}
                    exit={{ opacity:0, scale:0.9, x:100 }}
                    transition={{ delay: i*0.08, type:"spring" }}
                    className="relative bg-white rounded-[2.5rem] border-2 border-red-200 overflow-hidden shadow-[0_15px_50px_rgba(239,68,68,0.15)]"
                  >
                    {/* Dimmed theme gradient header */}
                    <div className={`relative h-28 bg-gradient-to-br ${themeClr.from} ${themeClr.to} flex items-center justify-center overflow-hidden opacity-60`}>
                      <div className="absolute inset-0 bg-black/40" />
                      <span className="text-6xl opacity-30 drop-shadow-2xl grayscale">
                        {themeClr.emoji}
                      </span>

                      {/* "REJECTED" badge */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-600 rounded-full shadow-md">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">
                          Declined
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-[#4A2C2C] mb-2 leading-tight">
                        {tl.title}
                      </h3>

                      <p className="text-sm text-[#8B5E66] line-clamp-2 leading-relaxed mb-4">
                        {tl.description || "No description"}
                      </p>

                      {/* Rejected by */}
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-red-200">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-black">
                          {tl.rejectedBy?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] uppercase tracking-widest font-bold text-red-600">
                            Declined by
                          </p>
                          <p className="text-xs font-bold text-[#4A2C2C] truncate">
                            {tl.rejectedBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>

                      {/* Info message */}
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                        <p className="text-xs text-red-700 leading-relaxed">
                          <strong>{tl.rejectedBy?.name || "Your partner"}</strong> has declined
                          this timeline invitation. You can create a new timeline or invite someone else.
                        </p>
                      </div>

                      {/* Dismiss button */}
                      <motion.button
                        whileTap={{ scale:0.95 }}
                        onClick={() => dismissRejection(tl.shareId)}
                        className="w-full py-3 bg-[#FFF5F7] text-[#8B5E66] border-2 border-[#FADADD] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#E91E63] hover:text-[#E91E63] transition-all"
                      >
                        Dismiss Notification
                      </motion.button>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-[2.5rem] pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

    </div>
  );
}