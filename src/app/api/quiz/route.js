// app/api/questions/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ← yahan se authOptions import karo (jo tere [...nextauth]/route.ts mein hai)

import {
  getPublicQuestionsController,
  createQuestionController,
  getQuestionsForUserController,
} from "@/controllers/question.controller";

// Helper to get user from session (optional, clean code ke liye)
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function GET(req) {
  try {
    const user = await getCurrentUser();

    // Agar logged in hai → user ke private + public/system questions
    if (user) {
      const result = await getQuestionsForUserController(user);
      return NextResponse.json(result);
    }

    // Nahi toh sirf public/system questions
    const result = await getPublicQuestionsController();
    return NextResponse.json(result);

  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Controller ko user pass kar rahe hain (agar zarurat ho toh)
    const result = await createQuestionController(req, user);

    return NextResponse.json(result.body || result, {
      status: result.status || 201,
    });

  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    );
  }
}