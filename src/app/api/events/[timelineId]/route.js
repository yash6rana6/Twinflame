import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import TimelineEvent from "@/models/TimelineEvent";
import { uploadWithFallback } from "@/lib/cloudinary-multi";

export const dynamic = "force-dynamic";

export async function POST(req, context) {
  try {
    await connectDb();

    const { timelineId } = await context.params;

    const timeline = await Timeline.findById(timelineId);
    if (!timeline)
      return NextResponse.json({ message: "Timeline not found" }, { status: 404 });

    if (timeline.expiresAt < new Date())
      return NextResponse.json({ message: "Timeline expired" }, { status: 400 });

    const formData = await req.formData();

    const date = formData.get("date");
    const title = formData.get("title");
    const description = formData.get("description");
    const eventType = formData.get("eventType") || "instant";

    const file = formData.get("media");

    console.log("file:", file);

    console.log(formData)

    const formattedDate = new Date(date);
    const dateString = formattedDate.toISOString().slice(0, 10);

    const existing = await TimelineEvent.findOne({
      timeline: timeline._id,
      dateString,
    });

    if (existing)
      return NextResponse.json(
        { message: "Event already exists for this date" },
        { status: 400 }
      );

    const uploadedMedia = [];

    console.log("files:", file);

    if (file && file.size > 0) {
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
      });
    }

    const event = await TimelineEvent.create({
      timeline: timeline._id,
      date: formattedDate,
      dateString,
      title,
      description,
      eventType,
      media: uploadedMedia,
    });

    console.log('event:', event);

    if (eventType === "daily") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      timeline.currentStreak =
        timeline.lastEventDate === yesterdayStr
          ? timeline.currentStreak + 1
          : 1;

      timeline.lastEventDate = dateString;
      timeline.points += 10;
      timeline.totalEvents += 1;

      await timeline.save();
    }

    return NextResponse.json({ success: true, event });

  } catch (err) {
    console.error("ADD EVENT ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}