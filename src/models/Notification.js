import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["timeline_invite", "new_event", "level_up", "quiz_completed", "timeline_accepted", "timeline_declined"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: Object, default: {} },
  timeline: { type: mongoose.Schema.Types.ObjectId, ref: "Timeline" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "TimelineEvent" },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);