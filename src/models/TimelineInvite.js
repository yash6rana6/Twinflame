import mongoose from "mongoose";

const timelineInviteSchema = new mongoose.Schema(
  {
    timeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timeline",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TimelineInvite", timelineInviteSchema);