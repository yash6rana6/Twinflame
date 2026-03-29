import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Timeline from "@/models/Timeline";
import { connectDb } from "@/lib/db";

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const timelines = await Timeline.find({
      $or: [
        { owner: userId },           
        { partnerId: userId }         
      ]
    })
      .sort({ createdAt: -1 })
      .select("shareId title theme description createdAt currentStreak totalEvents status pendingPartnerEmail")
      .populate("owner", "name email")
      .populate("partnerId", "name email")
      .lean();

    return NextResponse.json({ 
      success: true, 
      timelines 
    });

  } catch (err) {
    console.error("FETCH USER TIMELINES ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}