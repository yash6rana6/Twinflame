// models/QuizSession.js
import mongoose from "mongoose";
import crypto from "crypto";

const questionSessionSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(10).toString("hex"),
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    partnerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: ["created", "shared", "responded", "marked", "completed", "expired"],
      default: "created",
      index: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalQuestions: {
      type: Number,
      default: 8,
    },

    // Answers will be stored in Answer model with sessionId
    // Marking will happen in Answer.isCorrect field

    correctCount: {
      type: Number,
      default: 0,
    },

    scorePercentage: {
      type: Number,
      default: 0,
    },

    respondedAt: Date,
    markedAt: Date,
    completedAt: Date,

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: "expiresAt" },
    },
  },
  { timestamps: true }
);

questionSessionSchema.index({ creator: 1, status: 1 });

const QuestionSession = mongoose.models.QuestionSession || mongoose.model("QuestionSession", questionSessionSchema);

export default QuestionSession;