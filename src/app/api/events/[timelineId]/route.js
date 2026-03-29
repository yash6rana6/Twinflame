import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import TimelineEvent from "@/models/TimelineEvent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadWithFallback } from "@/lib/cloudinary-multi";

export async function POST(req, context) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { timelineId } = await context.params;
    if (!timelineId) {
      return NextResponse.json({ message: "Timeline ID is required" }, { status: 400 });
    }

    // Document for saving + modification
    let timeline = await Timeline.findById(timelineId);
    if (!timeline) {
      return NextResponse.json({ message: "Timeline not found" }, { status: 404 });
    }

    // Populated for checks
    const timelinePopulated = await Timeline.findById(timelineId)
      .populate("owner", "_id")
      .populate("partnerId", "_id")
      .populate("nextUploader", "_id");

    const userId = session.user.id;

    const isOwner = timelinePopulated.owner?._id?.toString() === userId;
    const isPartner = timelinePopulated.partnerId?._id?.toString() === userId;
    const isNextUploader = timelinePopulated.nextUploader?._id?.toString() === userId;

    // ====================== TURN-BASED AUTHORIZATION ======================
    // Sirf wohi user upload kar sake jiska abhi turn hai (nextUploader)
    if (!isNextUploader) {
      return NextResponse.json(
        { message: "Today is not your turn. Come back tomorrow!" },
        { status: 403 }
      );
    }

    // Extra safety: nextUploader must be either owner or partner
    if (!isOwner && !isPartner) {
      return NextResponse.json(
        { message: "Invalid uploader" },
        { status: 403 }
      );
    }

    // Expiry check
    if (timeline.expiresAt && timeline.expiresAt < new Date()) {
      return NextResponse.json({ message: "Timeline has expired" }, { status: 400 });
    }

    // ====================== FORM DATA & VALIDATION ======================
    const formData = await req.formData();

    const dateStr = formData.get("date");
    const title = formData.get("title")?.trim();
    const description = formData.get("description")?.trim() || "";
    const eventType = formData.get("eventType") || "instant";
    const caption = formData.get("caption")?.trim() || "";

    if (!dateStr || !title) {
      return NextResponse.json({ message: "Date and title are required" }, { status: 400 });
    }

    const formattedDate = new Date(dateStr);
    if (isNaN(formattedDate.getTime())) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    const dateString = formattedDate.toISOString().slice(0, 10);

    const existingEvent = await TimelineEvent.findOne({
      timeline: timeline._id,
      dateString,
    });

    if (existingEvent) {
      return NextResponse.json({ message: "Event already exists for this date" }, { status: 400 });
    }

    // ====================== MEDIA UPLOAD ======================
    const mediaFiles = formData.getAll("media");
    const uploadedMedia = [];

    for (const file of mediaFiles) {
      if (file instanceof Blob && file.size > 0) {
        if (file.size > 8 * 1024 * 1024) {
          return NextResponse.json({ message: "Max file size is 8 MB per file" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const { cloudIndex, result } = await uploadWithFallback(buffer, {
          folder: "timeline-media",
          mimeType: file.type,
        });

        uploadedMedia.push({
          url: result.secure_url,
          publicId: result.public_id,
          cloudIndex,
          type: file.type.startsWith("video") ? "video" : "image",
          uploadedBy: session.user.id,
          caption,
        });
      }
    }

    // ====================== CREATE EVENT ======================
    const event = await TimelineEvent.create({
      timeline: timeline._id,
      date: formattedDate,
      dateString,
      title,
      description,
      eventType,
      media: uploadedMedia,
    });

    // ====================== SWITCH TURN + GAMIFICATION ======================
    let streakChanged = false;
    let pointsAdded = 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (timeline.lastEventDate === yesterdayStr) {
      timeline.currentStreak = (timeline.currentStreak || 0) + 1;
      streakChanged = true;
    } else {
      timeline.currentStreak = 1;
      streakChanged = true;
    }

    timeline.lastEventDate = dateString;
    timeline.totalEvents = (timeline.totalEvents || 0) + 1;
    timeline.points = (timeline.points || 0) + 10;
    pointsAdded += 10;

    if (timeline.totalEvents === 1) {
      timeline.points += 50;
      pointsAdded += 50;
    }
    if (timeline.totalEvents === 5) {
      timeline.points += 20;
      pointsAdded += 20;
    }

    if (streakChanged) {
      if (timeline.currentStreak === 10) timeline.points += 100, pointsAdded += 100;
      if (timeline.currentStreak === 30) timeline.points += 300, pointsAdded += 300;
    }

    if (timeline.currentStreak > (timeline.longestStreak || 0)) {
      timeline.longestStreak = timeline.currentStreak;
    }

    // Level up
    let newLevel = timeline.level || "Bronze";
    if (timeline.points >= 1500) newLevel = "Platinum";
    else if (timeline.points >= 500) newLevel = "Gold";
    else if (timeline.points >= 100) newLevel = "Silver";

    if (newLevel !== timeline.level) {
      timeline.level = newLevel;
    }

    // 🔥🔥 IMPORTANT: SWITCH THE NEXT UPLOADER 🔥🔥
    if (timeline.nextUploader.toString() === timeline.owner.toString()) {
      // Owner ne upload kiya → ab Partner ka turn
      timeline.nextUploader = timeline.partnerId;
    } else {
      // Partner ne upload kiya → ab Owner ka turn
      timeline.nextUploader = timeline.owner;
    }

    // Last uploaded by update (optional but useful)
    timeline.lastUploadedBy = session.user.id;

    await timeline.save();

    return NextResponse.json({
      success: true,
      event,
      gamification: {
        pointsAdded,
        currentStreak: timeline.currentStreak,
        longestStreak: timeline.longestStreak,
        level: timeline.level,
        totalPoints: timeline.points,
      },
      nextTurn: timeline.nextUploader ? "Partner" : "Owner", // for debugging
    });

  } catch (err) {
    console.error("ADD EVENT ERROR:", err);
    return NextResponse.json(
      { message: "Failed to add event", error: err.message },
      { status: 500 }
    );
  }
}