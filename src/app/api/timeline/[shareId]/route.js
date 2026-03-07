import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import TimelineEvent from "@/models/TimelineEvent";

export async function GET(req, context) {
  try {
    await connectDb();

    const { shareId } = await context.params; // 👈 FIX

    const timeline = await Timeline.findOne({
      shareId: shareId,
    }).populate("owners", "name");

    if (!timeline) {
      return NextResponse.json(
        { message: "Timeline not found" },
        { status: 404 }
      );
    }

    if (timeline.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Timeline expired" },
        { status: 400 }
      );
    }

    const events = await TimelineEvent.find({
      timeline: timeline._id,
    }).sort({ date: 1 });

    return NextResponse.json({
      success: true,
      timeline,
      events,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}