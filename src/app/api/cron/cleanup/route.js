import { cleanupExpiredVideos } from "@/controllers/expiringVideo.controller";

export async function GET(req) {

  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  await cleanupExpiredVideos();

  return Response.json({ success: true });
}