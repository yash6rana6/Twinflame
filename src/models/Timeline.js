import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    owner: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    theme: {
      type: String,
      required: true,
      enum: ["romantic", "minimal", "classic", "travel", "family"],
    },

    /* ---------------- Partner System ---------------- */
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    invitedPartner: {        
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    /* ---------------- Alternate Upload ---------------- */
    nextUploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastUploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ---------------- Plan & Access ---------------- */
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    maxEvents: {
      type: Number,
      default: 50,
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "expired", "paused", "declined"],
      default: "pending",
    },

    validityDays: {
      type: Number,
      default: 30,
    },

    expiresAt: {
      type: Date,
      index: true,
    },

    /* ---------------- Gamification ---------------- */
    points: {
      type: Number,
      default: 0,
    },

    level: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    lastEventDate: {
      type: String,
      default: null,
    },

    /* ---------------- Analytics ---------------- */
    viewCount: {
      type: Number,
      default: 0,
    },

    totalEvents: {
      type: Number,
      default: 0,
    },

    lastExportedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* Auto expiry setup - Correct way */
timelineSchema.pre("save", async function () {
  if (!this.expiresAt) {
    this.expiresAt = new Date(
      Date.now() + this.validityDays * 24 * 60 * 60 * 1000
    );
  }
});

export default mongoose.models.Timeline || mongoose.model("Timeline", timelineSchema);