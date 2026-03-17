"use client";
import { useRef, useState } from "react";

const MAX_FREE_SIZE = 1024 * 1024 * 1024;

export default function UploadPanel({ isHost, onSetVideo, roomId }) {
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isHost) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 text-center text-sm italic">
          Sirf host upload kar sakta hai
        </p>
      </div>
    );
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
    <div className="w-full max-w-4xl mx-auto space-y-4 p-2 md:p-0">
      
      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          className="border p-2 rounded flex-1 text-sm bg-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
          disabled={uploading}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-medium transition-colors w-full sm:w-auto"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-100 rounded-lg p-3 border border-gray-200">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-bold text-gray-600 mt-2 text-right">{progress}% complete</p>
        </div>
      )}

      {/* Horizontal Divider with Text */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">OR</span></div>
      </div>

      {/* URL Input Section */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Video URL here..."
          className="border p-3 flex-1 rounded text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
        />
        <button
          onClick={() => onSetVideo(url)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded font-medium transition-colors w-full sm:w-auto"
        >
          Set Video
        </button>
      </div>
      
    </div>
  );
}