import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import os from "os";

const configs = [
  {
    cloud_name: process.env.CLOUD1_NAME,
    api_key: process.env.CLOUD1_KEY,
    api_secret: process.env.CLOUD1_SECRET,
  },
  {
    cloud_name: process.env.CLOUD2_NAME,
    api_key: process.env.CLOUD2_KEY,
    api_secret: process.env.CLOUD2_SECRET,
  },
  {
    cloud_name: process.env.CLOUD3_NAME,
    api_key: process.env.CLOUD3_KEY,
    api_secret: process.env.CLOUD3_SECRET,
  },
].filter(
  (c) => c.cloud_name && c.api_key && c.api_secret
);

if (configs.length === 0) {
  console.error("❌ No Cloudinary configs found in env!");
}

// Helper: upload with fallback (FILE-BASED, stable for big files)
export async function uploadWithFallback(buffer, options = {}) {
  const ext = options.mimeType?.split("/")[1] || "tmp";

  const tmpPath = path.join(
    os.tmpdir(),
    `upload-${Date.now()}-${Math.random()}.${ext}`
  );

  await fs.promises.writeFile(tmpPath, buffer);

  let lastError = null;

  try {
    for (let i = 0; i < configs.length; i++) {
      try {
        console.log(`☁️ Trying Cloud ${i + 1}...`);
        cloudinary.config(configs[i]);

        const res = await cloudinary.uploader.upload(tmpPath, {
          resource_type: "auto",
          chunk_size: 6 * 1024 * 1024,
          folder: options.folder || "watch-party",
        });

        console.log(`✅ Uploaded to Cloud ${i + 1}`);
        return { cloudIndex: i, result: res };
      } catch (e) {
        lastError = e;
        console.error(`❌ Cloud ${i + 1} upload failed:`, e?.message || e);
      }
    }

    throw lastError || new Error("All Cloudinary accounts failed");
  } finally {
    try {
      await fs.promises.unlink(tmpPath);
    } catch (_) {}
  }
}

// Helper: delete from specific cloud
export async function deleteFromCloud(cloudIndex, publicId) {
  if (!configs[cloudIndex]) {
    throw new Error("Invalid cloudIndex for delete");
  }

  cloudinary.config(configs[cloudIndex]);

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true, // CDN cache clear
  });
}

