import { authOptions } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Timeline from "@/models/Timeline";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDb();

        const session = await getServerSession(authOptions);
        if(!session?.user?.id) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            )
        }

        const {shareId} = await req.json();

        const timeline = await Timeline.findOne({shareId});
        if(!timeline) {
            return NextResponse.json(
                {message: "Timeline not found"},
                {status: 404}
            )
        }
        if(timeline.invitedPartner !== session.user.email.toLowerCase()){
            return NextResponse.json(
                {message: "This invitation is not for you"},
                {status: 403}
            )
        }

        timeline.invitedPartner = null;
        timeline.status = "declined";
        await timeline.save();

        return NextResponse.json(
            {message: "Invitation declined"},
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