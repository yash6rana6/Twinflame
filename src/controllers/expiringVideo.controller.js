import ExpiringVideo from "@/models/ExpiringVideo";
import { deleteFromCloud } from "@/lib/cloudinary-multi";

// ➕ Create or replace expiring video for a room
export async function createExpiringVideo({
  roomId,
  cloudIndex,
  publicId,
  url,
  expiresAt,
  plan = "free",
  uploadedBy,
}) {
  // Because we have unique index on roomId,
  // this will replace existing doc if any
  const doc = await ExpiringVideo.findOneAndUpdate(
    { roomId },
    {
      roomId,
      cloudIndex,
      publicId,
      url,
      expiresAt,
      plan,
      uploadedBy,
    },
    { upsert: true, new: true }
  );

  return doc;
}

// 🔍 Find current video by roomId
export async function findByRoomId(roomId) {
  return ExpiringVideo.findOne({ roomId });
}

// 🗑️ Delete video record by id (DB only)
export async function deleteById(id) {
  return ExpiringVideo.deleteOne({ _id: id });
}

// 🗑️ Delete video by room (cloud + DB)
export async function deleteByRoomId(roomId) {
  const video = await ExpiringVideo.findOne({ roomId });
  if (!video) return null;

  // Delete from cloud
  await deleteFromCloud(video.cloudIndex, video.publicId);

  // Delete from DB
  await ExpiringVideo.deleteOne({ _id: video._id });

  return video;
}

// ⏱️ Extend expiry (for premium)
export async function extendExpiry(roomId, extraMs) {
  const video = await ExpiringVideo.findOne({ roomId });
  if (!video) return null;

  video.expiresAt = new Date(video.expiresAt.getTime() + extraMs);
  await video.save();

  return video;
}

// 🧹 Cleanup expired videos (cron job)
export async function cleanupExpiredVideos() {
  const now = new Date();

  const expired = await ExpiringVideo.find({
    expiresAt: { $lte: now },
  });

  for (const video of expired) {
    try {
      await deleteFromCloud(video.cloudIndex, video.publicId);
      console.log("🗑️ Deleted from cloud:", video.publicId);

      await ExpiringVideo.deleteOne({ _id: video._id });
      console.log("🧾 Removed from DB:", video._id.toString());
    } catch (err) {
      console.error("❌ Failed to delete:", video.publicId, err);
    }
  }
}