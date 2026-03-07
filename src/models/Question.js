import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["user", "system"],
      default: "system",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizSession",
      default: null,
    },
    isPremium :{
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;