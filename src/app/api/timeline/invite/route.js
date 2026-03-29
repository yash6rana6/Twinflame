import { authOptions } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const userId = session.user.id;

  
    const invitedTimelines = await Timeline.find({
      invitedPartner: email,
      status: "pending",
      partnerId: null
    })
    .populate("owner", "name")
    .lean();

   
    const rejectedTimelines = await Timeline.find({
      owner: userId,
      status: "rejected" 
    })
    .populate("owner", "name")
    .lean();

    return NextResponse.json({
      success: true,
      invitedTimelines,
      rejectedTimelines
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}