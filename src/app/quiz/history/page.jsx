"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Rotating decoration accents
const ACCENTS = ["🌹","💗","❤️","🌸","💕","✨","💖","🌺","💞","🔥"];

// Status config
const STATUS = {
  marked:    { label: "Marked",    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  responded: { label: "Responded", bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-400"  },
  pending:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  shared:    { label: "Shared",    bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     dot: "bg-sky-400"     },
};

function getStatus(s) {
  return STATUS[s] ?? STATUS.pending;
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
            opacity: 0.13,
          }}
          animate={{ y:[0,-22,0], rotate:[-5,5,-5] }}
          transition={{ duration:[11,14,10,15,12,16,13,9][i], repeat:Infinity, repeatType:"reverse", delay:i*0.85 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

export default function QuizHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(null);

  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      try {
        const res  = await fetch("/api/quiz/history", { credentials: "include" });
        const data = await res.json();
        if (data.success) setHistory(data.history);
        else setError(data.error || "Failed to load history");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const handleCopy = (shareId) => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/questions/${shareId}`);
    setCopied(shareId);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── LOADING ──
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center fixed inset-0 z-50">
        <div className="text-center">
          <motion.div
            animate={{ scale:[1,1.2,1], rotate:[0,10,-10,0] }}
            transition={{ repeat:Infinity, duration:2 }}
            className="text-7xl mb-6 drop-shadow-lg"
          >
            💕
          </motion.div>
          <motion.p
            animate={{ opacity:[0.4,1,0.4] }}
            transition={{ repeat:Infinity, duration:1.5 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E91E63]"
          >
            Loading your love moments...
          </motion.p>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-6">
        <Petals />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-24 h-24 bg-[#FADADD] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            💔
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#4A2C2C] mb-4">Oops!</h1>
          <p className="text-[#8B5E66] mb-8 text-sm italic">{error}</p>
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_15px_40px_rgba(233,30,99,0.35)] hover:brightness-105 transition-all"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-x-hidden">
      <Petals />

      <div className="relative z-10 px-4 sm:px-6 py-12 max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white border-2 border-[#FADADD] shadow-sm">
            <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.8 }}
              className="w-2 h-2 rounded-full bg-[#E91E63] inline-block" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E91E63]">
              Your Love Moments
            </span>
          </div>

          <h1 className="font-serif font-bold text-[#4A2C2C] leading-tight" style={{ fontSize:"clamp(2.2rem,6vw,4rem)" }}>
            Quiz History
            <span className="block italic text-[#E91E63] text-[0.6em] mt-1">
              All your memories 💕
            </span>
          </h1>

          {history.length > 0 && (
            <p className="mt-4 text-sm text-[#8B5E66] italic">
              {history.length} quiz{history.length > 1 ? "zes" : ""} played so far
            </p>
          )}
        </motion.div>

        {/* ── EMPTY STATE ── */}
        {history.length === 0 ? (
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }} className="max-w-sm mx-auto">
            <div className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] p-10 text-center shadow-[0_30px_80px_rgba(233,30,99,0.15)] overflow-hidden">
              <motion.div className="text-7xl mb-6">💌</motion.div>
              <h2 className="text-2xl font-serif font-bold text-[#4A2C2C] mb-3">
                No Quizzes Yet
              </h2>
              <p className="text-sm text-[#8B5E66] italic mb-8">
                Create your first quiz for your special someone and it will appear here.
              </p>

              <Link
                href="/quiz/play"
                className="block w-full px-8 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(233,30,99,0.35)] hover:brightness-105 transition-all"
              >
                Create a Quiz ❤️
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ── QUIZ GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((quiz, i) => {
              const st = getStatus(quiz.status);
              const accent = ACCENTS[i % ACCENTS.length];
              const accent2 = ACCENTS[(i + 4) % ACCENTS.length];
              const isCreator = quiz.role === "creator";

              return (
                <motion.div
                  key={quiz.shareId}
                  initial={{ opacity:0, y:30 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i*0.07, type:"spring" }}
                  whileHover={{ y:-6, scale:1.015 }}
                  className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] shadow-[0_12px_45px_rgba(233,30,99,0.1)] overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <div className="p-5 flex flex-col flex-1 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${st.bg} ${st.text} ${st.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot} inline-block`} />
                        {st.label}
                      </span>
                      <span className="text-[10px] font-bold text-[#8B5E66]">
                        {new Date(quiz.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </span>
                    </div>

                    {quiz.status === "marked" && (
                      <div className="bg-gradient-to-r from-[#E91E63] to-[#FF6F91] rounded-2xl p-4 mb-4 text-center text-white">
                        <p className="text-4xl font-black leading-none">
                          {quiz.scorePercentage}%
                        </p>
                        <p className="text-xs font-bold mt-1">
                          {quiz.correctCount} / {quiz.totalQuestions} correct
                        </p>
                      </div>
                    )}

                    <div className="flex-1" />

                    <div className="flex gap-2.5 mt-3">
                      <Link
                        href={`/quiz/results/${quiz.shareId}`}
                        className="flex-1 py-3.5 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-[0_8px_25px_rgba(233,30,99,0.35)] hover:brightness-105 transition-all"
                      >
                        View Details
                      </Link>

                      <motion.button
                        whileTap={{ scale:0.93 }}
                        onClick={() => handleCopy(quiz.shareId)}
                        className={`relative px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all duration-300
                          ${copied === quiz.shareId
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-[#FFF5F7] text-[#E91E63] border-[#FADADD] hover:border-[#E91E63]"
                          }`}
                      >
                        {copied === quiz.shareId ? "✓ Copied" : "🔗"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-14 text-center">
            <Link
              href="/quiz/play"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-black text-xs uppercase tracking-[0.22em] shadow-[0_20px_55px_rgba(233,30,99,0.4)] hover:brightness-105 transition-all"
            >
              <span>✨</span>
              Create a New Quiz
              <motion.span animate={{ x:[0,5,0] }} transition={{ repeat:Infinity, duration:1.5 }}>→</motion.span>
            </Link>

            <div className="mt-6">
              <Link href="/" className="text-[10px] uppercase tracking-widest font-bold text-[#8B5E66] hover:text-[#E91E63] transition-colors">
                ← Go Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
