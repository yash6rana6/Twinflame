"use client";
import { useRef, useState, useEffect } from "react";

const MAX_FREE_SIZE = 1024 * 1024 * 1024;

export default function UploadPanel({ isHost, onSetVideo, roomId }) {
  const fileInputRef = useRef(null);

  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isHost) {
    return <p className="text-gray-500">Sirf host upload kar sakta hai</p>;
  }

  const uploadToCloud = async (file, cloudIndex) => {

    const signRes = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cloudIndex }),
    });

    if (!signRes.ok) throw new Error("Signature failed");

    const signData = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText || "{}");

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.secure_url);
        } else {
          reject(data);
        }
      };

      xhr.onerror = reject;

      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) return alert("File select karo bhai");

    if (file.size > MAX_FREE_SIZE) {
      return alert("1GB se bada file allowed nahi hai");
    }

    setUploading(true);
    setProgress(0);

    try {

      let uploadedUrl = null;

      // MULTI CLOUD FALLBACK
      for (let i = 0; i < 3; i++) {
        try {
          uploadedUrl = await uploadToCloud(file, i);
          break;
        } catch (err) {
          console.log("Cloud failed", i);
        }
      }

      if (!uploadedUrl) throw new Error("All clouds failed");

      setUrl(uploadedUrl);

      alert("Upload success ✅");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-3">

      <div className="flex gap-2">

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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

      </div>

      {uploading && (
        <div className="w-full">
          <div className="h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-3 bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-1">{progress}%</p>
        </div>
      )}

      <div className="flex gap-2">

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Video URL"
          className="border p-3 flex-1 rounded"
        />

        <button
          onClick={() => onSetVideo(url)}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Set Video
        </button>

      </div>

    </div>
  );
}