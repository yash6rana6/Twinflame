export const detectSource = (url) => {
  if (!url) return { type: "unknown" };
  const ytMatch = url.match(/[?&]v=([^#&?]+)/) || url.match(/youtu\.be\/([^#&?]+)/);
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };
  
  const cleanUrl = url.split("?")[0];
  if (/\.(mp4|webm|ogg)$/i.test(cleanUrl) || /cloudinary\.com.*\/video\/upload\//i.test(url)) {
    return { type: "video", url };
  }
  return { type: "unknown" };
};