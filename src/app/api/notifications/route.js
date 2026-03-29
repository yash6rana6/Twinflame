import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await Notification.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: session.user.id,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (err) {
    console.error("NOTIFICATIONS API ERROR:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch notifications",
        error: err.message 
      },
      { status: 500 }
    );
  }
}