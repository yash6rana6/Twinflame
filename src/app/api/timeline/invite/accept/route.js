import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shareId } = await req.json();

    const timeline = await Timeline.findOne({ shareId });

    if (!timeline) {
      return NextResponse.json({ message: "Timeline not found" }, { status: 404 });
    }

    if (timeline.invitedPartner !== session.user.email?.toLowerCase()) {
      return NextResponse.json({ message: "This invitation is not for you" }, { status: 403 });
    }

    if (timeline.partnerId) {
      return NextResponse.json({ message: "Partner already added" }, { status: 400 });
    }

    // Accept kar do
    timeline.partnerId = new mongoose.Types.ObjectId(session.user.id);
    timeline.invitedPartner = null;
    timeline.nextUploader = timeline.owner;
    timeline.status = "active";

    await timeline.save();

    const updatedTimeline = await Timeline.findById(timeline._id)
      .populate("owner", "name email")
      .populate("partnerId", "name email")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully! You are now a partner 💕",
      timeline: updatedTimeline
    });

  } catch (err) {
    console.error("ACCEPT INVITE ERROR:", err);
    return NextResponse.json({ message: "Failed to accept invitation" }, { status: 500 });
  }
}