// app/api/quiz/answers/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Answer from "@/models/Answer";
import Question from "@/models/Question"; // question text ke liye

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

    // Query param se sessionId le lo
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID required" },
        { status: 400 }
      );
    }

    // Answers fetch karo + question text populate karo
    const answers = await Answer.find({ sessionId })
      .populate({
        path: "questionId",
        select: "text", // sirf text chahiye
      })
      .sort({ createdAt: 1 }) // order mein
      .lean(); // performance ke liye

    // Extra check: sirf creator hi dekh sake (security)
    // Agar tere QuestionSession model mein creator field hai to yeh check add kar sakte ho
    // Abhi simple rakha hai

    return NextResponse.json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error("GET /api/quiz/answer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}