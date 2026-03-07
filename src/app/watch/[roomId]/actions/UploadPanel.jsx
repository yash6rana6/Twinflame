"use client";
import { useRef, useState, useEffect } from "react";

const MAX_FREE_SIZE = 1024 * 1024 * 1024; // 1GB

export default function UploadPanel({ isHost, onSetVideo, roomId }) {
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  if (!isHost) {
    return (
      <p className="mb-4 text-center text-gray-500">
        Sirf host video control kar sakta hai
      </p>
    );
  }

  // ⏱️ Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Pehle video file select kar bhai 😅");

    // 📦 Client-side size check (Free plan)
    if (file.size > MAX_FREE_SIZE) {
      return alert("Free plan me 1GB se bada file upload nahi kar sakte 😅");
    }

    try {
      setUploading(true);
      setProgress(0);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("roomId", roomId); // 👈 IMPORTANT

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            setUrl(data.url);
            setExpiresAt(data.expiresAt || null);
            alert(`Uploaded via ${data.provider}. Ab "Set Video" dabao ✅`);
          } else {
            throw new Error(data.error || "Upload failed");
          }
        } catch (err) {
          console.error(err);
          alert("Upload failed 😭 Console check karo");
        } finally {
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        alert("Network error during upload 😭");
      };

      xhr.send(fd);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Upload failed 😭");
    }
  };

  // 🗑️ Manual delete
  const handleDeleteNow = async () => {
    if (!confirm("Video delete kar du?")) return;

    try {
      const res = await fetch("/api/video/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      setUrl("");
      setExpiresAt(null);
      setTimeLeft(null);
      alert("Video deleted ✅");
    } catch (e) {
      console.error(e);
      alert("Delete failed 😭");
    }
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          className="border p-2 rounded flex-1"
          disabled={uploading}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full">
          <div className="h-3 w-full bg-gray-200 rounded overflow-hidden">
            <div
              className="h-3 bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}% uploaded</p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube / Cloudinary / MP4 URL"
          className="border p-3 flex-1 rounded"
        />
        <button
          onClick={() => onSetVideo(url)}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Set Video
        </button>
      </div>

      {/* Expiry info + Delete */}
      {expiresAt && (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
          <p className="text-sm text-red-600">
            ⏱️ This video will expire in {timeLeft || "..."}
          </p>
          <button
            onClick={handleDeleteNow}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            🗑️ Delete Now
          </button>
        </div>
      )}
    </div>
  );
}