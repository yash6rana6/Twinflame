import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}