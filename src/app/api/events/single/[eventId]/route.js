import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import TimelineEvent from "@/models/TimelineEvent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const event = await TimelineEvent.findById(params.eventId)
      .populate("timeline", "title shareId")
      .populate("media.uploadedBy", "name");

    if (!event)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
      return NextResponse.json(
        {message: "Unauthorized"},
        {status: 401}
      )
    }

    const {eventId} = await context.params;

    const body = await req.json();

    const {title, description} = body;

    const event = await TimelineEvent.findById(eventId);

    if(!event){
      return NextResponse.json(
        {message: "Event not found"},
        {status: 404}
      )
    }

    if(title) event.title = title;
    if(description) event.description = description;

    await event.save();

    return NextResponse.json(
      {message: "Event updated successfully"},
      {status: 200}
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message: "Server error"},
      {status: 500}
    )
  }
}