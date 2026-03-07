// app/api/quiz/session/create/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import QuestionSession from "@/models/QuestionSession";
import Question from "@/models/Question";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ← yeh import zaroori hai

export async function POST(req) {
  try {
    await connectDb();

    // 🔥 NextAuth se session/user le lo
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login required" },
        { status: 401 }
      );
    }

    // User ID string mein rakho (MongoDB ke liye safe)
    const userId = session.user.id; // already string hona chahiye callbacks se

    const body = await req.json();
    const { partnerEmail } = body;

    const cleanEmail = partnerEmail?.trim()?.toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Valid partner email required" },
        { status: 400 }
      );
    }

    // Prevent duplicate active session for same creator + partner
    const existingSession = await QuestionSession.findOne({
      creator: userId,
      partnerEmail: cleanEmail,
      status: { $in: ["created", "invited", "shared", "answering"] }, // "shared" add kiya agar status use ho raha
    });

    if (existingSession) {
      return NextResponse.json(
        { success: false, error: "Active quiz already exists for this partner" },
        { status: 400 }
      );
    }


    const allQuestions = await Question.find({ isActive: true }).sort({ order: 1 });

    if (allQuestions.length === 0) {
      return NextResponse.json({ success: false, error: "No active questions found" }, { status: 500 });
    }

    const questionSession = await QuestionSession.create({
      creator: userId,
      partnerEmail: cleanEmail,
      questions: allQuestions.map(q => q._id),           // saare IDs
      totalQuestions: allQuestions.length,               // 20+
      status: "shared",
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareLink = `${baseUrl}/quiz/questions/${questionSession.shareId}`;

    return NextResponse.json({
      success: true,
      message: "Quiz session created successfully",
      shareLink,
      sessionId: questionSession._id.toString(),
      partnerEmail: cleanEmail,
      totalQuestions: questionSession.totalQuestions,
    });
  } catch (error) {
    console.error("POST /api/quiz/session/create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create quiz session" },
      { status: 500 }
    );
  }
}