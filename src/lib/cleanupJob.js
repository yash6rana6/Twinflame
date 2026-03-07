import cron from "node-cron";
import { cleanupExpiredVideos } from "@/controllers/expiringVideo.controller";

// 🛑 Prevent multiple cron jobs in dev / hot-reload
let started = false;

export function startCleanupJob() {
  if (started) return;
  started = true;

  const SCHEDULE = process.env.CLEANUP_CRON || "*/5 * * * *"; // default: every 5 minutes

  console.log("🕒 Starting cleanup job with schedule:", SCHEDULE);

  // 🔁 Run on schedule
  cron.schedule(SCHEDULE, async () => {
    console.log("🧹 Running cleanup job...");
    try {
      await cleanupExpiredVideos();
    } catch (e) {
      console.error("❌ Cleanup job failed:", e);
    }
  });

  // 🚀 Also run once at startup (useful in dev)
  (async () => {
    try {
      console.log("🚀 Running initial cleanup...");
      await cleanupExpiredVideos();
    } catch (e) {
      console.error("❌ Initial cleanup failed:", e);
    }
  })();
}








