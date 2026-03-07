import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const body = await req.json();
    const { title, description, theme, userId } = body;

    const timeline = await Timeline.findById(params.timelineId);

    if (!timeline)
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );

    if (!timeline.owners.some(o => o.toString() === userId))
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );

    if (title) timeline.title = title;
    if (description) timeline.description = description;
    if (theme) timeline.theme = theme;

    await timeline.save();

    return NextResponse.json({ success: true, timeline });
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const { userId } = await req.json();

    const timeline = await Timeline.findById(params.timelineId);

    if (!timeline)
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );

    if (!timeline.owners.some(o => o.toString() === userId))
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );

    await timeline.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Timeline deleted",
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}