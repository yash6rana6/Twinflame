import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";

export async function PATCH(req, { params }) {
  try {
    await connectDb();

    const timeline = await Timeline.findById(params.timelineId);

    if (!timeline)
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );

    timeline.status = "active";
    timeline.expiresAt = new Date(
      Date.now() + timeline.validityDays * 24 * 60 * 60 * 1000
    );

    await timeline.save();

    return NextResponse.json({ success: true, timeline });
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}