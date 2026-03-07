// app/api/quiz/results/[shareId]/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuestionSession from "@/models/QuestionSession";
import Answer from "@/models/Answer";
import Question from "@/models/Question";  // ← yeh line add kar di!

export async function GET(request, context) {
  try {
    await connectDb();

    const { shareId } = await context.params;

    if (!shareId) {
      return NextResponse.json({ success: false, error: "Share ID required" }, { status: 400 });
    }

    console.log("[RESULTS] Fetching session for shareId:", shareId);

    // Session fetch with populate
    const qSession = await QuestionSession.findOne({ shareId })
      .populate({
        path: "questions",
        select: "text order isPremium",
      })
      .lean();

    if (!qSession) {
      console.log("[RESULTS] Session not found for shareId:", shareId);
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const authSession = await getServerSession(authOptions);
    if (!authSession?.user) {
      return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });
    }

    const userId = authSession.user.id;
    const userEmail = authSession.user.email?.toLowerCase().trim();

    let role = null;
    let creatorName = "Creator";
    let partnerName = qSession.partnerName || qSession.partnerEmail?.split('@')[0] || "Partner";

    if (qSession.creator && userId === qSession.creator.toString()) {
      role = "creator";
    } else if (qSession.responder || userEmail === qSession.partnerEmail?.toLowerCase().trim()) {
      role = "responder";
    } else {
      console.warn("[RESULTS] Access denied:", { userId, userEmail, sessionCreator: qSession.creator?.toString(), sessionPartnerEmail: qSession.partnerEmail });
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
    }

    // Answers only if marked
    let answers = [];
    if (qSession.status === "marked") {
      console.log("[RESULTS] Fetching answers for session:", qSession._id);
      answers = await Answer.find({ sessionId: qSession._id })
        .populate({
          path: "questionId",  // ya "question" agar field naam alag hai
          select: "text",
        })
        .lean()
        .catch(err => {
          console.error("[RESULTS] Answers populate error:", err);
          return [];
        });
    }

    return NextResponse.json({
      success: true,
      role,
      session: {
        _id: qSession._id.toString(),
        status: qSession.status,
        creatorName,
        partnerName,
        totalQuestions: qSession.totalQuestions,
        correctCount: qSession.correctCount,
        scorePercentage: qSession.scorePercentage,
        markedAt: qSession.markedAt,
      },
      answers,
    });
  } catch (error) {
    console.error("[RESULTS ROUTE] Critical error:", error.stack || error);
    return NextResponse.json({ success: false, error: "Server error - check logs" }, { status: 500 });
  }
}