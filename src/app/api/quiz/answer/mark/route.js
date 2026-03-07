// app/api/quiz/answer/mark/route.js   (ya app/api/quiz/mark/route.js)
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuestionSession from "@/models/QuestionSession";
import Answer from "@/models/Answer";

export async function PATCH(req) {   // ← POST ki jagah PATCH
  try {
    await connectDb();

    const authSession = await getServerSession(authOptions);
    if (!authSession?.user) {
      return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });
    }

    const userId = authSession.user.id;

    let body;
    try {
      body = await req.json();
      console.log("[MARK PATCH] Received:", JSON.stringify(body, null, 2));
    } catch (err) {
      console.error("[MARK PATCH] Parse error:", err);
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    const { sessionId, markings } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ success: false, error: "sessionId required (string)" }, { status: 400 });
    }

    if (!Array.isArray(markings) || markings.length === 0) {
      return NextResponse.json({ success: false, error: "markings must be non-empty array" }, { status: 400 });
    }

    const qSession = await QuestionSession.findById(sessionId);
    if (!qSession) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    if (qSession.creator.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Only creator can mark" }, { status: 403 });
    }

    if (qSession.status === "marked" || qSession.status === "completed") {
      return NextResponse.json({ success: false, error: "Already marked/completed" }, { status: 400 });
    }

    let correctCount = 0;

    for (const mark of markings) {
      const { answerId, isCorrect } = mark;

      if (!answerId || typeof isCorrect !== "boolean") continue;

      const answer = await Answer.findById(answerId);
      if (!answer || answer.sessionId.toString() !== sessionId) continue;

      answer.isCorrect = isCorrect;
      await answer.save();

      if (isCorrect) correctCount++;
    }

    qSession.correctCount = correctCount;
    qSession.scorePercentage = Math.round((correctCount / qSession.totalQuestions) * 100);
    qSession.status = "marked";
    qSession.markedAt = new Date();
    await qSession.save();

    return NextResponse.json({
      success: true,
      message: "Marking done! ❤️",
      correctCount,
      scorePercentage: qSession.scorePercentage,
    });
  } catch (error) {
    console.error("[MARK PATCH] Error:", error);
    return NextResponse.json({ success: false, error: "Marking failed" }, { status: 500 });
  }
}