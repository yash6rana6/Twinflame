import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import TimelineInvite from "@/models/TimelineInvite";
import Timeline from "@/models/Timeline";

export async function POST(req, { params }) {
  try {
    await connectDb();

    const invite = await TimelineInvite.findOne({ token: params.token });

    if (!invite)
      return NextResponse.json({ message: "Invalid token" }, { status: 404 });

    if (invite.expiresAt < new Date())
      return NextResponse.json({ message: "Invite expired" }, { status: 400 });

    const body = await req.json();
    const { userId } = body;

    const timeline = await Timeline.findById(invite.timeline);

    if (!timeline.owners.includes(userId)) {
      timeline.owners.push(userId);
      await timeline.save();
    }

    invite.status = "accepted";
    await invite.save();

    return NextResponse.json({ success: true, timeline });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}