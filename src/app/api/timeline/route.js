import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import User from "@/models/User";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Import Notification Service
import { createNotification } from "@/lib/notifications";
import { notificationTemplates } from "@/lib/notificationTemplates";

export async function POST(req) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, theme, partnerEmail } = body;

    if (!title?.trim() || !theme?.trim() || !partnerEmail?.trim()) {
      return NextResponse.json(
        { message: "Title, theme and partner email are required" },
        { status: 400 }
      );
    }

    const email = partnerEmail.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Owner ka data le lo (name ke liye)
    const owner = await User.findById(session.user.id).select("name");

    // Timeline Create
    const timeline = await Timeline.create({
      shareId: nanoid(10),
      owner: session.user.id,                    // ← Yeh ObjectId hona chahiye, array nahi
      title: title.trim(),
      description: description?.trim() || "",
      theme: theme.trim(),
      invitedPartner: email,
      // partnerId abhi null rahega jab tak invite accept nahi hota
    });

    // ====================== NOTIFICATION LOGIC ======================
    
    // Invited user ko dhundo (agar already registered hai)
    const invitedUser = await User.findOne({ email: email });

    if (invitedUser) {
      const template = notificationTemplates.timeline_invite(
        owner?.name || "Someone",
        title.trim()
      );

      await createNotification({
        userId: invitedUser._id,
        type: "timeline_invite",
        title: template.title,
        message: template.message,
        timelineId: timeline._id,
        metadata: {
          ownerName: owner?.name,
          timelineTitle: title.trim(),
          shareId: timeline.shareId,
        },
      });
    }

    // Populate kar ke response bhejo
    const populatedTimeline = await Timeline.findById(timeline._id)
      .populate("owner", "name email")
      .populate("partnerId", "name email")
      .lean();

    return NextResponse.json(
      { 
        success: true, 
        timeline: populatedTimeline,
        message: invitedUser 
          ? "Timeline created and invitation sent!" 
          : "Timeline created. Invitation will be sent when user registers."
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("CREATE TIMELINE ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create timeline" },
      { status: 500 }
    );
  }
}