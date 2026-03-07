"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const floatSlow = {
  animate: {
    y: [0, -18, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
};

const floatMedium = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, -4, 4, 0],
    transition: { duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
};

export default function QuizPlayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [answerAllowed, setAnswerAllowed] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, authLoading, router]);

  // Fetch questions after login
  useEffect(() => {
    if (!user || authLoading) return;

    async function fetchQuestions() {
      try {
        const res = await fetch("/api/quiz", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions || []);
          setAnswerAllowed(data.answerAllowed || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [user, authLoading]);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    alert("Answers submitted! (Demo mode) ❤️");
  };

  const handleGenerateLink = async () => {
    if (!partnerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
      setShareError("Please enter a valid email address");
      return;
    }
    setShareError("");
    setShareLoading(true);
    try {
      const res = await fetch("/api/quiz/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ partnerEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");
      setShareLink(data.shareLink);
    } catch (err) {
      setShareError(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <motion.div animate={{ scale: [1, 1.15, 1] }} className="text-rose-500 text-2xl font-semibold">
          Checking your login... 💕
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-rose-500 text-2xl font-semibold flex items-center gap-3"
        >
          Loading the questions... 💕🌹
        </motion.span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF5F9] via-[#FFEFF4] to-[#FFF0F6] px-5 sm:px-8 py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <motion.div variants={floatSlow} animate="animate" className="absolute top-[5%] left-[5%] text-8xl text-pink-300/70">🌹</motion.div>
        <motion.div variants={floatMedium} animate="animate" className="absolute top-[12%] left-[18%] text-6xl text-rose-200/80 rotate-12">💗</motion.div>
        <motion.div variants={floatSlow} animate="animate" className="absolute top-[8%] right-[10%] text-9xl text-pink-400/60">❤️</motion.div>
        <motion.div variants={floatMedium} animate="animate" className="absolute top-[22%] right-[15%] text-7xl text-rose-300/70">🌸</motion.div>
        <motion.div variants={floatMedium} animate="animate" className="absolute top-[40%] left-[8%] text-7xl text-pink-200/75">💞</motion.div>
        <motion.div variants={floatSlow} animate="animate" className="absolute top-[50%] left-[35%] text-5xl text-rose-400/65">🌹</motion.div>
        <motion.div variants={floatMedium} animate="animate" className="absolute top-[55%] right-[40%] text-6xl text-pink-300/70">❤️</motion.div>
        <motion.div variants={floatSlow} animate="animate" className="absolute bottom-[10%] left-[12%] text-10xl text-pink-400/55 -rotate-6">💖</motion.div>
        <motion.div variants={floatMedium} animate="animate" className="absolute bottom-[18%] right-[8%] text-8xl text-rose-200/80">🌹</motion.div>
        <motion.div variants={floatSlow} animate="animate" className="absolute bottom-[25%] left-[45%] text-7xl text-pink-300/65">💕</motion.div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-bold font-serif text-center text-rose-800 mb-16 drop-shadow-lg flex items-center justify-center gap-4"
        >
          Answer With <span className="text-rose-600 text-7xl">❤️</span>
        </motion.h1>

        <div className="space-y-12">
          {questions.map((q, i) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 90 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.4 } }}
              className="relative bg-white/97 backdrop-blur-md rounded-3xl p-8 sm:p-10 border-2 border-pink-200/70 shadow-2xl shadow-rose-300/30 hover:shadow-rose-400/50 hover:border-pink-300/90 transition-all duration-400 overflow-hidden"
            >
              <div className="flex items-start gap-5 mb-7 pb-5 border-b border-pink-100/80">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
                  {i + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-rose-900 leading-tight">
                  {q.text}
                </h3>
              </div>

              {answerAllowed ? (
                <textarea
                  className="w-full min-h-[160px] rounded-2xl bg-gradient-to-b from-pink-50/90 to-white/95 border border-pink-300/50 px-7 py-6 text-base text-rose-950 placeholder-rose-400/80 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-transparent transition resize-none shadow-inner"
                  placeholder="Write from the heart... 💌"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                />
              ) : (
                <div className="text-base italic text-rose-700/90 bg-pink-50/80 px-7 py-6 rounded-2xl border border-pink-200/60 flex items-center gap-4 shadow-sm">
                  <span className="text-3xl">🔐</span>
                  <span>Only your partner can answer these using the shared link 💕</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20 space-y-8">
          {answerAllowed && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-16 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:brightness-105 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              Submit Your Answers 💌
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowShareModal(true)}
            className="bg-gradient-to-r from-amber-300 to-yellow-400 text-rose-900 px-12 sm:px-16 py-6 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 mx-auto"
          >
            Share with Your Special One 💕
          </motion.button>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 60 }}
              className="bg-white rounded-3xl p-9 md:p-11 max-w-lg w-full relative shadow-2xl border border-pink-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-5 right-6 text-4xl text-rose-400 hover:text-rose-600 transition"
              >
                ×
              </button>

              <h2 className="text-4xl font-bold text-rose-600 mb-8 text-center">
                Share the Quiz ❤️
              </h2>

              <input
                type="email"
                placeholder="Enter your partner’s email 💕"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="w-full px-7 py-5 rounded-2xl border-2 border-pink-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-200/40 text-lg outline-none transition"
              />

              {shareError && <p className="text-red-600 text-center mt-4 font-medium">{shareError}</p>}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerateLink}
                disabled={shareLoading}
                className="w-full mt-7 py-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-3xl font-bold text-xl shadow-lg disabled:opacity-60 transition"
              >
                {shareLoading ? "Creating your link..." : "Create Share Link 🌸"}
              </motion.button>

              {shareLink && (
                <div className="mt-9">
                  <p className="text-center text-rose-700/90 mb-4 text-base">Here’s your special link:</p>
                  <div className="flex flex-col sm:flex-row gap-4 bg-pink-50/80 p-5 rounded-2xl border border-pink-200">
                    <span className="flex-1 break-all text-rose-800 self-center">{shareLink}</span>
                    <button
                      onClick={copyToClipboard}
                      className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-semibold hover:bg-rose-600 transition"
                    >
                      {copied ? "Copied! 💖" : "Copy"}
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hey love! Let’s see how well you know me 😘❤️\n${shareLink}`
                    )}`}
                    target="_blank"
                    className="block mt-6 text-center text-green-600 font-semibold hover:underline text-lg"
                  >
                    Send on WhatsApp 💚
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
