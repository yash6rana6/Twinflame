import { cleanupExpiredVideos } from "@/controllers/expiringVideo.controller";
import { connectDb } from "@/lib/db";

export async function GET() {
  await connectDb();

  await cleanupExpiredVideos();

  return Response.json({ success: true });
}