// app/api/quiz/answer/submit/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import QuestionSession from "@/models/QuestionSession";
import Answer from "@/models/Answer"; // jo tune diya

export async function POST(req) {
  try {
    await connectDb();

    // 1. Auth check (responder logged in hona chahiye)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Please login to submit answers" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email?.toLowerCase();

    // 2. Parse request body
    const { sessionId, answers } = await req.json();

    if (!sessionId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session ID and valid answers array required" },
        { status: 400 }
      );
    }

    // 3. Find the QuestionSession
    const questionSession = await QuestionSession.findById(sessionId)
      .populate("questions", "text"); // optional, agar text chahiye to

    if (!questionSession) {
      return NextResponse.json(
        { success: false, error: "Quiz session not found" },
        { status: 404 }
      );
    }

    // 4. Check if this user is the intended responder
    if (userEmail !== questionSession.partnerEmail?.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: `This quiz is for ${questionSession.partnerEmail}. Login with correct email.`,
        },
        { status: 403 }
      );
    }

    // 5. Check if already answered
    if (questionSession.status === "completed" || questionSession.responder) {
      // ya agar already answers exist
      const existingAnswers = await Answer.find({ sessionId: questionSession._id });
      if (existingAnswers.length > 0) {
        return NextResponse.json(
          { success: false, error: "Answers already submitted" },
          { status: 403 }
        );
      }
    }

    // 6. Save each answer
    const answerDocs = [];
    for (const ans of answers) {
      const { questionId, answerText } = ans;

      if (!questionId || !answerText?.trim()) {
        continue; // skip invalid
      }

      // Check if question belongs to this session
      const questionInSession = questionSession.questions.some(
        (q) => q._id.toString() === questionId
      );

      if (!questionInSession) {
        continue; // invalid question
      }

      const newAnswer = await Answer.create({
        sessionId: questionSession._id,
        questionId,
        responder: userId,
        answerText: answerText.trim(),
        // isCorrect: null, // abhi manual grading ke liye, baad mein update kar sakte ho
      });

      answerDocs.push(newAnswer);
    }

    if (answerDocs.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid answers provided" },
        { status: 400 }
      );
    }

    // 7. Update session status
    questionSession.status = "responded";
    questionSession.responder = userId;
    questionSession.answeredAt = new Date();
    questionSession.totalAnswered = answerDocs.length; // optional

    // Agar future mein auto-score chahiye to yahan logic add kar sakte ho
    // example:
    // let correct = 0;
    // for each answer check against question.correctAnswer → correct++
    // questionSession.correctCount = correct;
    // questionSession.scorePercentage = (correct / questionSession.totalQuestions) * 100;

    await questionSession.save();

    return NextResponse.json({
      success: true,
      message: "Answers submitted successfully ❤️",
      answeredCount: answerDocs.length,
      sessionId: questionSession._id.toString(),
    });

  } catch (error) {
    console.error("POST /api/quiz/answer/submit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit answers" },
      { status: 500 }
    );
  }
}