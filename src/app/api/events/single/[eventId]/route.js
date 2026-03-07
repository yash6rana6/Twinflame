import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import TimelineEvent from "@/models/TimelineEvent";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const event = await TimelineEvent.findById(params.eventId)
      .populate("timeline", "title shareId")
      .populate("media.uploadedBy", "name");

    if (!event)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}