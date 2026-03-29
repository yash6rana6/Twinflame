import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await Notification.updateMany(
      { user: session.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark all read error:", err);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}