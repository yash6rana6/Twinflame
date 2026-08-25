import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpiry: Date,
    telegramId: {
      type: String,
      unique: true,
      sparse: true, // allows many docs with no telegramId (non-Telegram users)
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;