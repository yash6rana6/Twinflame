"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// ── CINEMATIC IMAGE BANK ──
const IMG = {
  hero:    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&q=90",
  couple1: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=700&q=85",
  couple2: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=85",
  couple3: "https://images.unsplash.com/photo-1521727857535-28d2047619f8?w=700&q=85",
  couple4: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=85",
  hands:   "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=700&q=85",
  roses:   "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=900&q=85",
  petals:  "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=900&q=85",
  candle:  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
  sunset:  "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=900&q=85",
  letters: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&q=85",
  sparkle: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=900&q=85",
};

const CARD_ACCENTS = ["🌹","💗","❤️","🌸","💕","✨","💖","🌺","💞","🔥"];

export default function QuizQuestionsPage() {
  const { shareId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [answersData, setAnswersData] = useState([]);
  const [markings, setMarkings] = useState({});
  const [markingLoading, setMarkingLoading] = useState(false);
  const [markingSubmitted, setMarkingSubmitted] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    async function loadSession() {
      try {
        const res = await fetch(`/api/quiz/session/${shareId}`, { credentials: "include" });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load session");
        const data = await res.json();
        setSession(data.session);
        setRole(data.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [shareId]);

  useEffect(() => {
    if (role !== "creator" || !session?._id) return;
    async function fetchAnswers() {
      try {
        const res = await fetch(`/api/quiz/answers?sessionId=${session._id}`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.answers) {
          setAnswersData(data.answers);
          const preMark = {};
          data.answers.forEach((a) => { if (a.isCorrect != null) preMark[a._id] = a.isCorrect; });
          setMarkings(preMark);
          setMarkingSubmitted(data.answers.every((a) => a.isCorrect != null));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAnswers();
  }, [role, session?._id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/quiz/questions/${shareId}`);
    }
  }, [authLoading, user, router, shareId]);

  const handleChange = (qid, val) => setAnswers((p) => ({ ...p, [qid]: val }));
  const handleMark   = (id, val)  => setMarkings((p) => ({ ...p, [id]: val }));

  const handleSubmit = async () => {
    const missing = session.questions.filter((q) => !answers[q._id]?.trim());
    if (missing.length) return alert("Please answer all the questions first 💔");

    try {
      const res = await fetch("/api/quiz/answer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: session._id,
          answers: Object.entries(answers).map(([qid, text]) => ({ questionId: qid, answerText: text })),
        }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/quiz/results/${shareId}`);
      else alert(data.error || "Failed to submit answers");
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmitMarks = async () => {
    const marked = Object.keys(markings).length;
    if (marked === 0) return alert("Please mark at least one answer 😅");
    if (marked < answersData.length && !confirm(`Only ${marked}/${answersData.length} marked. Submit anyway?`)) return;

    const payload = Object.entries(markings).map(([id, val]) => ({ answerId: id, isCorrect: !!val }));
    setMarkingLoading(true);
    try {
      const res = await fetch("/api/quiz/answer/mark", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId: session._id?.toString(), markings: payload }),
      });
      const data = await res.json();
      if (res.ok) {
        setMarkingSubmitted(true);
        router.push(`/quiz/results/${shareId}`);
      } else {
        alert(data.error || "Failed to save markings");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setMarkingLoading(false);
    }
  };

  // ── LOADING ──
  if (loading || authLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black">
        <motion.div animate={{ scale:[1,1.25,1], rotate:[0,12,-12,0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl">💕</motion.div>
        <p className="text-white text-xs uppercase tracking-[0.4em] mt-6">Loading the love quiz...</p>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] px-6">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6">💔</div>
          <h1 className="text-3xl font-bold mb-3">Oops!</h1>
          <p className="text-sm mb-6 text-[#6B4A52]">{error}</p>
          <Link href="/" className="px-8 py-3 bg-[#E91E63] text-white rounded-xl font-bold">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════
  // ── CREATOR VIEW ──
  // ═════════════════════════════════════
  if (role === "creator") {
    const hasResponses = answersData.length > 0;
    const isMarkingComplete = hasResponses && answersData.every((a) => a.isCorrect !== null && a.isCorrect !== undefined);
    const markedCount = Object.keys(markings).length;

    return (
      <main className="min-h-screen bg-[#FFF5F7] px-4 py-12">
        <div className="max-w-xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {isMarkingComplete ? "Marking Complete ❤️" : hasResponses ? "Answers Are In 💌" : "Waiting for Your Partner 🌹"}
          </h1>
          <p className="text-sm text-[#6B4A52]">
            {isMarkingComplete
              ? "You can now view the final results."
              : hasResponses
              ? "Your partner has answered. Mark each answer as correct or wrong."
              : "Your partner is still filling the quiz. Please wait a bit."}
          </p>
        </div>

        {!hasResponses && (
          <div className="bg-white rounded-3xl p-8 text-center shadow">
            <p className="text-[#6B4A52] italic">
              {session?.partnerEmail || "Your partner"} is answering the quiz right now. Hang tight 💕
            </p>
          </div>
        )}

        {hasResponses && (
          <>
            <div className="space-y-5">
              {answersData.map((ans, i) => (
                <div key={ans._id} className="bg-white rounded-3xl p-6 shadow border">
                  <h3 className="font-bold mb-3">
                    {i+1}. {ans.questionId?.text || "Question"}
                  </h3>
                  <p className="text-sm text-[#4A2C2C] mb-4">{ans.answerText}</p>

                  {!isMarkingComplete ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleMark(ans._id, true)}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          markings[ans._id] === true ? "bg-green-500 text-white" : "bg-green-100 text-green-700"
                        }`}
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => handleMark(ans._id, false)}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          markings[ans._id] === false ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        Wrong
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold">
                      Marked as: {ans.isCorrect ? "Correct ✅" : "Wrong ❌"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              {!isMarkingComplete ? (
                <>
                  <button
                    onClick={handleSubmitMarks}
                    disabled={markingLoading || markedCount === 0}
                    className="px-10 py-4 bg-[#E91E63] text-white rounded-2xl font-bold disabled:opacity-50"
                  >
                    {markingLoading ? "Saving..." : "Submit Marks"}
                  </button>
                  <p className="text-xs mt-2 text-[#6B4A52]">
                    {markedCount}/{answersData.length} marked
                  </p>
                </>
              ) : (
                <Link
                  href={`/quiz/results/${shareId}`}
                  className="inline-block px-10 py-4 bg-[#E91E63] text-white rounded-2xl font-bold"
                >
                  View Full Results 💌
                </Link>
              )}
            </div>
          </>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-xs font-bold text-[#6B4A52] hover:text-[#E91E63]">
            ← Go Home
          </Link>
        </div>
      </main>
    );
  }

  // ═════════════════════════════════════
  // ── RESPONDER VIEW ──
  // ═════════════════════════════════════
  if (role === "responder") {
    const canAnswer = session?.status === "pending" || session?.status === "shared" || !session?.status;

    if (!canAnswer) {
      return (
        <main className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 text-center shadow max-w-sm">
            <h2 className="text-2xl font-bold mb-3">Answers Submitted ❤️</h2>
            <p className="text-sm text-[#6B4A52] mb-6">
              Your partner is reviewing your answers. Results will be ready soon!
            </p>
            <Link
              href={`/quiz/results/${shareId}`}
              className="block w-full px-6 py-3 bg-[#E91E63] text-white rounded-xl font-bold"
            >
              Check Results 💌
            </Link>
            <div className="mt-6">
              <Link href="/" className="text-xs font-bold text-[#6B4A52] hover:text-[#E91E63]">
                ← Go Home
              </Link>
            </div>
          </div>
        </main>
      );
    }

    const answeredCount  = Object.values(answers).filter((v) => v?.trim()).length;
    const totalQuestions = session?.questions?.length || 0;
    const pct = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    return (
      <main className="min-h-screen bg-[#FFF5F7] px-4 py-10">
        <div className="max-w-xl mx-auto">

          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-[#6B4A52] mb-2">
              <span>Progress</span>
              <span>{answeredCount}/{totalQuestions} · {pct}%</span>
            </div>
            <div className="h-3 bg-[#FADADD] rounded-full overflow-hidden">
              <div className="h-full bg-[#E91E63]" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="space-y-5">
            {session?.questions?.map((q, i) => (
              <div key={q._id} className="bg-white rounded-3xl p-6 shadow border">
                <h3 className="font-bold mb-4">
                  {i+1}. {q.text}
                </h3>
                <textarea
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  placeholder="Write your answer from the heart... 💌"
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 text-sm resize-none"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#E91E63] text-white rounded-2xl font-bold flex items-center justify-center gap-3"
            >
              Submit Answers 💕
            </button>
            <p className="text-xs mt-3 text-[#6B4A52]">
              {answeredCount}/{totalQuestions} answered
            </p>
          </div>

          <div className="text-center mt-10">
            <Link href="/" className="text-xs font-bold text-[#6B4A52] hover:text-[#E91E63]">
              ← Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
