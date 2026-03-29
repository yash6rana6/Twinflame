import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import TimelineEvent from "@/models/TimelineEvent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, context) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { shareId } = await context.params;

    const timeline = await Timeline.findOne({
      shareId: shareId,
    }).populate("owner", "name");

    if (!timeline) {
      return NextResponse.json(
        { message: "Timeline not found" },
        { status: 404 }
      );
    }

    console.log(timeline);
    const userId = session.user.id;

    const isOwner = timeline.owner._id.toString() === userId.toString();
    

    const isPartner = timeline.partnerId?.toString() === userId.toString();

    console.log("isOwner :" + isOwner);

    if (!isOwner && !isPartner) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    


    if (timeline.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Timeline expired" },
        { status: 400 }
      );
    }

    const events = await TimelineEvent.find({
      timeline: timeline._id,
    }).sort({ date: 1 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    todayStart.setDate(todayStart.getDate());

    const hasEventToday = events.some(event => {
  const eventDate = new Date(event.date);
  return eventDate.toDateString() === todayStart.toDateString();
});

    return NextResponse.json({
      success: true,
      timeline,
      events,
      hasEventToday
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    await connectDb();
    const session = getServerSession(authOptions);

    if(!session?.user?.id){
      return NextResponse.json(
        {message: "Unauthorized"},
        {status: 401}
      )
    }

    const {shareId} = await context.params;
    const body = await req.json();
    const {title, description, theme} = body;

    const timeline = await Timeline.findOne({shareId});
    if(!timeline){
      return NextResponse.json(
        {message: "Timeline not found"},
        {status: 403}
      )
    }

    if(title) timeline.title = title;
    if(description) timeline.description = description;
    if(theme) timeline.theme = theme;

    await timeline.save();

    return NextResponse.json(
      {success: true},
      timeline
    )

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message: "Server Error"},
      {status: 500}
    )
  }
}

export async function DELETE(req, context) {
  try {
    await connectDb();
    const session = getServerSession(authOptions);

    if(!session?.user?.id) {
      return NextResponse.json(
        {message: "Unauthorized"},
        {status: 401}
      )
    }

    const {shareId} = await context.params;

    const timeline = await Timeline.findOne({shareId});

    if(!timeline){
      return NextResponse.json(
        {message: "Timeline not found"},
        {status: 404}
      )
    }

    if(!timeline.owners.some(o => o.toString() === session.user.id)){
      return NextResponse.json(
        {message: "Not authorized to delete"},
        {status: 403}
      )
    }

    await TimelineEvent.deleteMany({timeline: timeline._id});

    await Timeline.deleteOne({_id: timeline._id});

    return NextResponse.json(
      {success: true},
      {message: "Timeline deleted"}
    )
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {message: "Server Error"},
      {status: 500}
    )
  }
}