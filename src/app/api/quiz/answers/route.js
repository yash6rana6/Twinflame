// app/api/quiz/answers/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Answer from "@/models/Answer";
import QuestionSession from "@/models/QuestionSession";

export async function GET(req) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Query param se sessionId
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId required" },
        { status: 400 }
      );
    }

    // Session check + creator permission check
    const qSession = await QuestionSession.findById(sessionId);
    if (!qSession) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    if (qSession.creator.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Only creator can view answers" },
        { status: 403 }
      );
    }

    // Answers fetch + question text populate
    const answers = await Answer.find({ sessionId })
      .populate({
        path: "questionId",
        select: "text order isPremium",
      })
      .sort({ createdAt: 1 }) // chronological order
      .lean(); // fast

    return NextResponse.json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error("GET /api/quiz/answers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}