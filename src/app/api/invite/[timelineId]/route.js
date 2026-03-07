import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import TimelineInvite from "@/models/TimelineInvite";
import { nanoid } from "nanoid";

export async function POST(req, { params }) {
  try {
    await connectDb();

    const token = nanoid(20);

    const invite = await TimelineInvite.create({
      timeline: params.timelineId,
      token,
      invitedBy: null, // later auth se set karenge
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({
      success: true,
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}