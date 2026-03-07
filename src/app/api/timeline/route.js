import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, theme } = body;

    if (!title || !theme) {
      return NextResponse.json(
        { message: "Title and theme required" },
        { status: 400 }
      );
    }

    const timeline = await Timeline.create({
      shareId: nanoid(10),
      owners: [session.user.id], // 👈 only creator
      title,
      description,
      theme,
    });

    return NextResponse.json({ success: true, timeline });

  } catch (err) {
    console.error("CREATE TIMELINE ERROR:", err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}