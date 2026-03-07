// import "@/lib/cleanupJob"; 
// import { uploadWithFallback, deleteFromCloud } from "@/lib/cloudinary-multi";
// import { createExpiringVideo, findByRoomId, deleteById } from "@/controllers/expiringVideo.controller";
// import { connectDb } from "@/lib/db";

// const MAX_FREE_SIZE = 1024 * 1024 * 1024; // 1GB

// export async function POST(req) {
//   try {
//     await connectDb();
//     const formData = await req.formData();
//     const file = formData.get("file");

//     const roomId = formData.get("roomId"); // frontend se bhejna hoga

//     if (!file) return Response.json({ error: "No file" }, { status: 400 });
//     if (!roomId) return Response.json({ error: "No roomId" }, { status: 400 });

//     // 🔐 Plan logic (abhi default free maan lete hain)
//     const plan = "free"; // later: session.user.plan

//     if (plan === "free" && file.size > MAX_FREE_SIZE) {
//       return Response.json(
//         { error: "Free plan limit is 1GB. Upgrade to upload bigger videos." },
//         { status: 400 }
//       );
//     }

//     // 🗑️ If room already has a video → delete it first
//     const old = await findByRoomId(roomId);
//     if (old) {
//       try {
//         await deleteFromCloud(old.cloudIndex, old.publicId);
//       } catch (e) {
//         console.error("Failed to delete old cloud video:", e);
//       }
//       await deleteById(old._id);
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const { cloudIndex, result } = await uploadWithFallback(buffer);

//     // ⏱️ Expiry: free = 3 hours
//     const expiresInMs = plan === "free" ? 3 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

//     const doc = await createExpiringVideo({
//       roomId,
//       cloudIndex,
//       publicId: result.public_id,
//       url: result.secure_url,
//       expiresAt: new Date(Date.now() + expiresInMs),
//       plan,
//     });

//     return Response.json({
//       provider: `cloud${cloudIndex + 1}`,
//       url: doc.url,
//       expiresAt: doc.expiresAt,
//     });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
import "@/lib/cleanupJob";
import { uploadWithFallback, deleteFromCloud } from "@/lib/cloudinary-multi";
import {
  createExpiringVideo,
  findByRoomId,
  deleteById,
} from "@/controllers/expiringVideo.controller";
import { connectDb } from "@/lib/db";

const MAX_FREE_SIZE = 1024 * 1024 * 1024; // 1GB

export async function POST(req) {
  try {
    await connectDb();

    const formData = await req.formData();
    const file = formData.get("file");
    const roomId = formData.get("roomId");

    if (!file) return Response.json({ error: "No file" }, { status: 400 });
    if (!roomId) return Response.json({ error: "No roomId" }, { status: 400 });

    const plan = "free";

    if (plan === "free" && file.size > MAX_FREE_SIZE) {
      return Response.json(
        { error: "Free plan limit is 1GB." },
        { status: 400 }
      );
    }

    // 🗑 Delete old if exists
    const old = await findByRoomId(roomId);
    if (old) {
      try {
        await deleteFromCloud(old.cloudIndex, old.publicId, old.type);
      } catch (e) {
        console.error("Delete old failed:", e);
      }
      await deleteById(old._id);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

 const isVideo = file.type.startsWith("video");

    const { cloudIndex, result } = await uploadWithFallback(buffer, {
      folder: "watch-party",
      mimeType: file.type,
      resource_type: "auto", // 👈 important
    });

    const expiresInMs =
      plan === "free"
        ? 3 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;

    const doc = await createExpiringVideo({
      roomId,
      cloudIndex,
      publicId: result.public_id,
      url: result.secure_url,
      type: file.type.startsWith("video") ? "video" : "image",
      expiresAt: new Date(Date.now() + expiresInMs),
      plan,
    });

    return Response.json({
      provider: `cloud${cloudIndex + 1}`,
      url: doc.url,
      expiresAt: doc.expiresAt,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}