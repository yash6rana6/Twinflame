// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import QuestionSession from "@/models/QuestionSession";
import Answer from "@/models/Answer";

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });
    }

    const userId = session.user.id;

    // Total quizzes banaye (creator)
    const createdQuizzes = await QuestionSession.countDocuments({ creator: userId });

    // Shared quizzes (partnerEmail se)
    const sharedQuizzes = await QuestionSession.countDocuments({
      creator: userId,
      status: { $in: ["shared", "responded", "marked", "completed"] },
    });

    // Received answers (partner ne diye)
    const receivedAnswers = await QuestionSession.countDocuments({
      creator: userId,
      responder: { $ne: null },
    });

    // Average score (marked quizzes ka)
    const markedSessions = await QuestionSession.find({
      creator: userId,
      status: "marked",
    }).select("scorePercentage");

    const avgScore = markedSessions.length > 0
      ? markedSessions.reduce((sum, s) => sum + s.scorePercentage, 0) / markedSessions.length
      : 0;

    return NextResponse.json({
      success: true,
      profile: {
        name: session.user.name || "User",
        email: session.user.email,
        createdQuizzes,
        sharedQuizzes,
        receivedAnswers,
        averageScore: Math.round(avgScore),
        totalMarked: markedSessions.length,
      },
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}