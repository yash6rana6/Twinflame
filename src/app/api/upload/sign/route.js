import { v2 as cloudinary } from "cloudinary";

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
].filter(c => c.cloud_name && c.api_key && c.api_secret);

export async function POST(req) {
  const { cloudIndex = 0 } = await req.json();

  const config = configs[cloudIndex];
  if (!config) {
    return Response.json({ error: "Invalid cloud index" }, { status: 400 });
  }

  cloudinary.config(config);

  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "watch-party",
    },
    config.api_secret
  );

  return Response.json({
    cloudName: config.cloud_name,
    apiKey: config.api_key,
    timestamp,
    signature,
    folder: "watch-party",
    cloudIndex
  });
}