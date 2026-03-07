import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuestionSession from "@/models/QuestionSession";

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });
    }

    const userId = session.user.id;

    const history = await QuestionSession.find({
      $or: [
        { creator: userId },
        { responder: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("shareId status createdAt partnerEmail responder scorePercentage correctCount totalQuestions creator")
      .lean();

    const formattedHistory = history.map((quiz) => {
      const isCreator = quiz.creator && quiz.creator.toString() === userId;
      return {
        ...quiz,
        _id: quiz._id.toString(),
        role: isCreator ? "creator" : "responder",
        partner: isCreator 
          ? (quiz.partnerEmail || "Unknown Partner") 
          : "You (as responder)",
        date: quiz.createdAt.toISOString().split("T")[0],
      };
    });

    return NextResponse.json({
      success: true,
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Quiz History API error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}