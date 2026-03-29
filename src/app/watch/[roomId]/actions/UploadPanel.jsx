"use client";

import { useRef, useState, useCallback } from "react";
import { Link2, UploadCloud, Film, CheckCircle2, AlertCircle, Loader2, X, FileVideo, AlertTriangle, Cloud } from "lucide-react";

const MAX_SIZE = 1024 * 1024 * 1024; // 1 GB

export default function UploadPanel({ isHost, onSetVideo, roomId }) {
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const uploading = status === "uploading";

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setErrorMsg("File too big (Max 1GB)");
      setStatus("error");
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const uploadToCloud = useCallback(async (file, cloudIndex) => {
    const signRes = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cloudIndex }),
    });
    const { apiKey, timestamp, signature, folder, cloudName } = await signRes.json();
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);
    form.append("folder", folder);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => resolve(JSON.parse(xhr.responseText).secure_url);
      xhr.onerror = () => reject();
      xhr.send(form);
    });
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    try {
      const uploadedUrl = await uploadToCloud(selectedFile, 0);
      setStatus("done");
      onSetVideo(uploadedUrl);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Upload Failed");
    }
  };

  if (!isHost) return (
    <div className="flex flex-col items-center justify-center p-10 opacity-20">
      <AlertCircle size={30} />
      <p className="text-[10px] font-black uppercase mt-2">Host Only Section</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      
      {/* 1. COMPACT FILE SELECTOR */}
      <div className="relative">
        <input type="file" accept="video/*" ref={fileInputRef} className="hidden" id="v-up" onChange={handleFileChange} disabled={uploading} />
        
        {!selectedFile ? (
          <label htmlFor="v-up" className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/80">Local Storage</p>
              <p className="text-[9px] text-white/20 uppercase tracking-tighter">Select movie file (Max 1GB)</p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500">
              <FileVideo size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-white truncate uppercase italic">{selectedFile.name}</p>
              <p className="text-[9px] text-pink-500/50">{(selectedFile.size / (1024*1024)).toFixed(1)} MB</p>
            </div>
            {!uploading && <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={16} className="text-white/20" /></button>}
          </div>
        )}
      </div>

      {/* 2. DYNAMIC ACTION AREA (Upload Button or Progress) */}
      {selectedFile && (
        <div className="space-y-3">
          {!uploading && status !== "done" && (
            <button onClick={handleUpload} className="w-full py-4 bg-pink-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-600/20 active:scale-95 transition-all">
              Start Cloud Sync
            </button>
          )}

          {uploading && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase text-white/40 animate-pulse">Uploading to Cloud...</span>
                <span className="text-xs font-mono text-pink-500">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {status === "done" && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Cinema is Live!</span>
        </div>
      )}

      {/* 3. URL SECTION (Minimalist) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3 opacity-20">
          <div className="h-[1px] flex-1 bg-white" />
          <span className="text-[8px] font-black">REMOTE LINK</span>
          <div className="h-[1px] flex-1 bg-white" />
        </div>

        <div className="relative">
          <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="YouTube, Drive, or Direct MP4..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white focus:border-pink-500/50 outline-none transition-all placeholder:text-white/5"
          />
        </div>

        <button 
          onClick={() => url.trim() && onSetVideo(url.trim())}
          className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          Initialize From URL
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-4 opacity-10">
        <Cloud size={10} />
        <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Encrypted Pipeline V1</span>
      </div>

    </div>
  );
}