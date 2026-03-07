"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function QuizResultsPage() {
  const { shareId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!shareId) return;

    async function loadResults() {
      try {
        const res = await fetch(`/api/quiz/results/${shareId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to load results");
        }

        const data = await res.json();
        setRole(data.role);
        setSessionData(data.session);
        setAnswers(data.answers || []);
      } catch (err) {
        console.error("Results load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [shareId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/quiz/results/${shareId}`);
    }
  }, [authLoading, user, router, shareId]);

  // ── LOADING ──
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] fixed inset-0 z-50">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-6xl mb-6"
          >
            💕
          </motion.div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#E91E63]">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] px-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-[#FADADD] rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
            💔
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#4A2C2C] mb-4">
            Oops!
          </h1>
          <p className="text-[#8B5E66] mb-8 leading-relaxed">{error}</p>
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!sessionData) return null;

  const isMarked = sessionData.status === "marked";
  const score = sessionData.scorePercentage || 0;
  const correct = sessionData.correctCount || 0;
  const total = sessionData.totalQuestions || 0;

  const getScoreMessage = () => {
    if (score >= 80) return "Wow! You stole my heart 🔥❤️";
    if (score >= 50) return "You're so sweet 💕";
    return "We'll do better next time 😘";
  };

  const getScoreEmoji = () => {
    if (score >= 80) return "🏆";
    if (score >= 50) return "💕";
    return "😊";
  };

  // ── FLOATING DECORATIONS ──
  const Decorations = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[
        { emoji: "🌹", top: "8%", left: "5%", duration: 12, delay: 0 },
        { emoji: "💗", top: "20%", right: "8%", duration: 14, delay: 1 },
        { emoji: "❤️", bottom: "15%", left: "8%", duration: 10, delay: 2 },
        { emoji: "🌸", bottom: "30%", right: "6%", duration: 16, delay: 0.5 },
        { emoji: "💞", top: "50%", left: "3%", duration: 11, delay: 1.5 },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          animate={{ y: [0, -20, 0], rotate: [-3, 3, -3] }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: item.delay,
          }}
          className="absolute text-5xl md:text-6xl opacity-20"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FFF5F7] relative overflow-hidden">
      <Decorations />

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6">

        {/* ── PAGE HEADING ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 max-w-2xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white border-2 border-[#FADADD] shadow-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-[#E91E63]"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E91E63]">
              Quiz Results
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A2C2C] mb-4 leading-tight">
            {role === "creator"
              ? `${sessionData.responderName || "Your love"}'s Result`
              : `${sessionData.creatorName || "Your partner"} made this for you`}
            <span className="block text-[#E91E63] italic mt-1">
              {role === "creator" ? "❤️" : "💕"}
            </span>
          </h1>

          <p className="text-sm text-[#8B5E66] leading-relaxed italic">
            {role === "creator" ? (
              <>
                <span className="font-bold text-[#E91E63] not-italic">
                  {sessionData.responderName || "Your partner"}
                </span>{" "}
                answered your {total} questions
              </>
            ) : (
              <>
                <span className="font-bold text-[#E91E63] not-italic">
                  {sessionData.creatorName || "They"}
                </span>{" "}
                created a lovely quiz just for you
              </>
            )}
          </p>
        </motion.div>

        {/* ── BIG SCORE CARD ── */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.3 }}
          className="relative mx-auto max-w-sm md:max-w-xl mb-12 rounded-[3rem] overflow-hidden"
        >
          <div className="relative bg-white rounded-[3rem] border-2 border-[#FADADD] shadow-[0_30px_80px_rgba(233,30,99,0.2)] overflow-hidden">

            {/* ── PHOTO STRIP ── */}
            <div className="relative h-48 md:h-60 w-full overflow-hidden rounded-t-[3rem]">
              <div className="absolute inset-0 flex gap-0.5">
                <div className="flex-1 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg border border-[#FADADD] text-lg"
              >
                💕
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg border border-[#FADADD] text-lg"
              >
                ✨
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg border border-[#FADADD]"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E91E63]">
                  Quiz Complete!
                </span>
              </motion.div>
            </div>

            {/* ── CARD CONTENT ── */}
            <div className="relative px-5 md:px-8 pb-8 pt-2">

              <div className="flex justify-center -mt-10 mb-5 relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
                  className="relative"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#E91E63] to-[#FF6F91] p-1 shadow-[0_15px_40px_rgba(233,30,99,0.4)]">
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-2xl md:text-3xl font-black text-[#E91E63] leading-none">
                        {score}%
                      </span>
                      <span className="text-[8px] uppercase tracking-widest text-[#8B5E66] font-bold">
                        Score
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#E91E63] to-[#FF6F91] rounded-full flex items-center justify-center shadow-lg text-sm"
                  >
                    {getScoreEmoji()}
                  </motion.div>
                </motion.div>
              </div>

              <div className="text-center mb-5">
                <p className="text-sm text-[#8B5E66]">
                  <span className="text-2xl font-black text-[#E91E63]">{correct}</span>
                  <span className="text-[#FADADD] mx-2 text-lg">/</span>
                  <span className="text-lg font-bold text-[#4A2C2C]">{total}</span>
                  <span className="text-sm text-[#8B5E66] ml-2">correct answers</span>
                </p>
              </div>

              {isMarked && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative mb-6"
                >
                  <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FADADD]/30 rounded-3xl p-5 border-2 border-[#FADADD] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FADADD]/50 rounded-bl-[2rem]" />
                    <p className="relative z-10 text-base md:text-lg font-semibold text-[#4A2C2C] leading-relaxed">
                      {getScoreMessage()}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#8B5E66]">
                    Performance
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#E91E63]">
                    {score}%
                  </span>
                </div>
                <div className="h-2.5 bg-[#FADADD]/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#E91E63] to-[#FF6F91]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-[#FFF5F7] rounded-2xl p-3 text-center border border-[#FADADD]">
                  <div className="text-xl mb-1">✅</div>
                  <div className="text-lg font-black text-[#E91E63]">{correct}</div>
                  <div className="text-[9px] uppercase tracking-widest text-[#8B5E66] font-bold">Correct</div>
                </div>
                <div className="bg-gradient-to-br from-[#E91E63] to-[#FF6F91] rounded-2xl p-3 text-center shadow-lg transform scale-105">
                  <div className="text-xl mb-1">🎯</div>
                  <div className="text-lg font-black text-white">{score}%</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/80 font-bold">Score</div>
                </div>
                <div className="bg-[#FFF5F7] rounded-2xl p-3 text-center border border-[#FADADD]">
                  <div className="text-xl mb-1">❓</div>
                  <div className="text-lg font-black text-[#E91E63]">{total}</div>
                  <div className="text-[9px] uppercase tracking-widest text-[#8B5E66] font-bold">Total</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Couple Quiz Score!",
                      text: `I scored ${score}%! Want to try? 💕`,
                      url: window.location.href,
                    });
                  }
                }}
                className="w-full bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(233,30,99,0.3)] flex items-center justify-center gap-2 mb-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Share Your Score
              </motion.button>

            </div>
          </div>
        </motion.div>

        {/* ── ANSWERS SECTION ── */}
        {!isMarked ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-sm md:max-w-xl mx-auto mb-12"
          >
            <div className="bg-white rounded-[3rem] border-2 border-[#FADADD] p-8 md:p-12 text-center shadow-[0_20px_60px_rgba(233,30,99,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FADADD]/30 rounded-bl-[3rem]" />
              <div className="text-5xl mb-6">
                {role === "creator" ? "⏳" : "💌"}
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A2C2C] mb-3">
                {role === "creator"
                  ? "Marking is still pending..."
                  : "Waiting for the results"}
              </h3>
              <p className="text-sm text-[#8B5E66] leading-relaxed italic">
                {role === "creator"
                  ? "Hurry up and mark it! 😏"
                  : "Full results will appear once they mark it 💌"}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-sm md:max-w-xl mx-auto mb-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#E91E63] mb-2">
                Detailed Results
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4A2C2C]">
                All Answers
              </h2>
            </motion.div>

            {answers.map((ans, i) => (
              <motion.div
                key={ans._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.5 }}
                className="relative bg-white rounded-[2.5rem] border-2 border-[#FADADD] shadow-[0_15px_50px_rgba(233,30,99,0.08)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#FADADD]/30 rounded-bl-[2.5rem]" />

                <div className="p-6 md:p-8">

                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E63] to-[#FF6F91] text-white font-black flex items-center justify-center text-sm shadow-md">
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest
                        ${ans.isCorrect
                          ? "bg-green-50 text-green-700 border-2 border-green-200"
                          : "bg-[#FFF5F7] text-[#E91E63] border-2 border-[#FADADD]"
                        }`}
                    >
                      {ans.isCorrect ? "Correct ✅" : "Wrong ❌"}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-[#4A2C2C] mb-3 text-lg md:text-xl leading-relaxed">
                    {ans.questionId?.text || "Question missing"}
                  </h3>

                  <div className="bg-[#FFF5F7] rounded-2xl px-5 py-4 border border-[#FADADD]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#E91E63] mb-1">
                      Your Answer
                    </p>
                    <p className="text-sm text-[#4A2C2C] font-medium leading-relaxed">
                      {ans.answerText || "Answer will appear here..."}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-[#FADADD] text-[#4A2C2C] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:border-[#E91E63] hover:text-[#E91E63] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to Home 💕
          </Link>
        </motion.div>

      </div>
    </main>
  );
}