// const timelineEventSchema = new mongoose.Schema(
//   {
//     timeline: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Timeline",
//       required: true,
//       index: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//       index: true,
//     },

//     dateString: {
//       type: String, // "2025-02-14"
//       required: true,
//       index: true,
//     },

//     title: {
//       type: String,
//       maxlength: 100,
//       trim: true,
//     },

//     description: {
//       type: String,
//       maxlength: 2000,
//     },

//     media: [
//       {
//         url: { type: String, required: true },
//         type: { type: String, enum: ["image", "video"], default: "image" },
//         caption: { type: String, maxlength: 200 },
//         uploadedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         uploadedAt: { type: Date, default: Date.now },
//       },
//     ],

//     mood: {
//       type: String,
//       enum: [
//         "happy",
//         "romantic",
//         "funny",
//         "adventurous",
//         "cozy",
//         "emotional",
//         "surprised",
//       ],
//     },

//     isLocked: { type: Boolean, default: false }, 
//   },
//   { timestamps: true }
// );

// timelineSchema.pre("save", function (next) {
//   if (!this.expiresAt) {
//     this.expiresAt = new Date(
//       Date.now() + this.validityDays * 24 * 60 * 60 * 1000
//     );
//   }
//   next();
// });

import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

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
      enum: ["active", "expired", "paused"],
      default: "active",
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
      type: String, // YYYY-MM-DD
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

    /* ---------------- Export ---------------- */

    lastExportedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* Auto expiry setup */
timelineSchema.pre("save", function () {
  if (!this.expiresAt) {
    this.expiresAt = new Date(
      Date.now() + this.validityDays * 24 * 60 * 60 * 1000
    );
  }
});

export default mongoose.models.Timeline || mongoose.model("Timeline", timelineSchema);