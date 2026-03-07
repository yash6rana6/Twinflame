import mongoose from "mongoose";

const expiringVideoSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true }, 

    cloudIndex: { type: Number, required: true }, 
    publicId: { type: String, required: true },  
    url: { type: String, required: true },      

    expiresAt: { type: Date, required: true }, // ⏱️ expiry time

    plan: { type: String, enum: ["free", "premium"], default: "free" }, 

    uploadedBy: { type: String },
  },
  { timestamps: true }
);

// 1 room = 1 active video
expiringVideoSchema.index({ roomId: 1 }, { unique: true });

// fast cleanup query
expiringVideoSchema.index({ expiresAt: 1 });

export default mongoose.models.ExpiringVideo ||
  mongoose.model("ExpiringVideo", expiringVideoSchema);