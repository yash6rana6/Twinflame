// // Timeline events

// const timelineEventSchema = new mongoose.Schema(
//     {date: {
//       type: Date,
//       required: true,
//       index: true,
//     },
// dateString: {
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
//         uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         uploadedAt: { type: Date, default: Date.now },
//       },
//     ],

//     mood: {
//       type: String,
//       enum: ["happy", "romantic", "funny", "adventurous", "cozy", "emotional", "surprised"],
//     },})

import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    timeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timeline",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    dateString: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    title: {
      type: String,
      maxlength: 100,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 2000,
    },

    eventType: {
      type: String,
      enum: ["instant", "daily"],
      default: "instant",
    },

    mood: {
      type: String,
      enum: [
        "happy",
        "romantic",
        "funny",
        "adventurous",
        "cozy",
        "emotional",
        "surprised",
      ],
    },

    media: [
      {
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
        caption: { type: String, maxlength: 200 },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate date per timeline */
timelineEventSchema.index(
  { timeline: 1, dateString: 1 },
  { unique: true }
);

export default mongoose.models.TimelineEvent || mongoose.model("TimelineEvent", timelineEventSchema);