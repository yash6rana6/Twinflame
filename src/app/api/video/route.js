import { connectDb } from "@/lib/db";
import { findByRoomId, deleteById } from "@/controllers/expiringVideo.controller";
import { deleteFromCloud } from "@/lib/cloudinary-multi";

export async function POST(req) {
  try {
    await connectDb();
    const { roomId } = await req.json();

    if (!roomId) {
      return Response.json({ error: "roomId missing" }, { status: 400 });
    }

    const doc = await findByRoomId(roomId);
    if (!doc) {
      return Response.json({ error: "No video found for this room" }, { status: 404 });
    }

    // ☁️ Cloud se delete karo
    try {
      await deleteFromCloud(doc.cloudIndex, doc.publicId);
    } catch (e) {
      console.error("Cloud delete failed:", e);
    }

    // 🗄️ DB se delete karo
    await deleteById(doc._id);

    return Response.json({ success: true, deleted: doc.publicId });
  } catch (err) {
    console.error("Delete error:", err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}