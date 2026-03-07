// app/api/quiz/session/[shareId]/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import QuestionSession from "@/models/QuestionSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Question from "@/models/Question";

export async function GET(request, context) {
  try {
    await connectDb();

    // 🔥 Next.js 15+ fix: params Promise hai, isliye await karna zaroori
    const { shareId } = await context.params;

    if (!shareId) {
      return NextResponse.json(
        { success: false, error: "Share ID is required" },
        { status: 400 }
      );
    }

    // 🔥 Quiz session fetch karo
    const session = await QuestionSession.findOne({ shareId })
      .populate("questions", "text order isPremium");

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // ⏰ Expiry check
    if (session.expiresAt && new Date() > session.expiresAt) {
      session.status = "expired";
      await session.save();

      return NextResponse.json(
        { success: false, error: "This quiz link has expired" },
        { status: 403 }
      );
    }

    // 🔐 NextAuth session check
    const authSession = await getServerSession(authOptions);

    if (!authSession?.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please login with the email this link was shared with to access the quiz.",
        },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    const userEmail = authSession.user.email?.toLowerCase();

    // 👑 CASE 1: CREATOR access
    if (userId === session.creator?.toString()) {
      return NextResponse.json({
        success: true,
        role: "creator",
        session: {
          _id: session._id.toString(),
          status: session.status,
          partnerEmail: session.partnerEmail,
          questions: session.questions,
          totalQuestions: session.totalQuestions,
          correctCount: session.correctCount,
          scorePercentage: session.scorePercentage,
          createdAt: session.createdAt,
        },
      });
    }

    // 💌 CASE 2: RESPONDER (partner) access
    if (userEmail === session.partnerEmail?.toLowerCase()) {
      if (!session.responder) {
        session.responder = userId;
        await session.save();
      }

      return NextResponse.json({
        success: true,
        role: "responder",
        session: {
          _id: session._id.toString(),
          status: session.status,
          questions: session.questions,
          totalQuestions: session.totalQuestions,
        },
      });
    }

    // ❌ Wrong user logged in
    return NextResponse.json(
      {
        success: false,
        error: `This link was shared for ${session.partnerEmail}. Please login with the same email.`,
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("GET /api/quiz/session/[shareId] error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong on our end" },
      { status: 500 }
    );
  }
}