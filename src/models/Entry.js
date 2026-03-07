import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    timeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timeline",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxLength: 500,
    },

    imageUrl: String,
  },
  { timestamps: true }
);

// Prevent duplicate entry per day per timeline
entrySchema.index(
  { timeline: 1, date: 1 },
  { unique: true }
);

const Entry =
  mongoose.models.Entry ||
  mongoose.model("Entry", entrySchema);

export default Entry;