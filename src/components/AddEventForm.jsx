"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Film, Flame } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AddEventForm({ timeline, refresh }) {

  const { data: session } = useSession();



  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile]               = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const isMyTurn = () => {
    if (!session?.user?.id || !timeline?.nextUploader) return false;

    const nextUploaderId = 
      typeof timeline.nextUploader === "object" 
        ? timeline.nextUploader._id || timeline.nextUploader 
        : timeline.nextUploader;

    return nextUploaderId?.toString() === session.user.id;
  };

  // Agar turn nahi hai toh form mat dikhao
  if (!isMyTurn()) {
    return (
     <div className="relative bg-white p-12 text-center overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FADADD]/20 rounded-bl-[3rem] -z-10" />
  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#E91E63]/5 rounded-full blur-2xl" />

  <motion.div 
    animate={{ 
      y: [0, -12, 0],
      rotate: [0, 5, -5, 0] 
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity,
      ease: "easeInOut" 
    }}
    className="text-7xl mb-8 filter drop-shadow-xl"
  >
    ⏳
  </motion.div>

  <h3 className="text-3xl font-serif font-bold text-[#4A2C2C] mb-4 tracking-tight">
    It's Your Partner's Turn!
  </h3>
  
  <p className="text-[#8B5E66] text-lg leading-relaxed max-w-sm mx-auto italic font-medium">
    Today is all about your partner's perspective. ❤️<br />
    <span className="text-sm not-italic font-bold text-[#E91E63]/70 uppercase tracking-widest block mt-4">
      Your turn begins tomorrow
    </span>
  </p>

  <div className="mt-10 flex flex-col items-center gap-4">
    {/* Streak Badge */}
    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFF5F7] to-white border border-[#FADADD] px-8 py-4 rounded-2xl shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#FF6F91] flex items-center justify-center shadow-lg shadow-[#E91E63]/20">
        <Flame className="text-white" size={20} />
      </div>
    </div>

    <p className="text-[10px] uppercase font-bold text-[#8B5E66]/50 tracking-[0.3em] mt-2">
      Patience is a form of love ✨
    </p>
  </div>
</div>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (3.5MB limit as per API)
    if (selectedFile.size > 3.5 * 1024 * 1024) {
      setError("File size must be under 3.5 MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("date", new Date().toISOString());
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("eventType", "daily");

      if (file) {
        formData.append("media", file);
      }

      const res = await fetch(`/api/events/${timeline._id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add event");
      }

      // Success - reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setFilePreview(null);
      refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isVideo = file?.type?.startsWith("video");
  const isImage = file?.type?.startsWith("image");

  return (
    <div className="space-y-5">

      {/* Error alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title input */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
          Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Our first date"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors bg-[#FFF5F7] text-[#4A2C2C] placeholder:text-[#8B5E66]/40"
          disabled={loading}
        />
      </div>

      {/* Description textarea */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
          Description
        </label>
        <textarea
          placeholder="Tell the story of this moment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border-2 border-[#FADADD] p-3.5 rounded-2xl focus:outline-none focus:border-[#E91E63] transition-colors resize-none bg-[#FFF5F7] text-[#4A2C2C] placeholder:text-[#8B5E66]/40"
          disabled={loading}
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#8B5E66] mb-2">
          Photo / Video (Optional)
        </label>

        {!file ? (
          /* Upload area */
          <label className="relative block cursor-pointer group">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={loading}
              className="sr-only"
            />
            <div className="relative border-2 border-dashed border-[#FADADD] rounded-2xl p-8 text-center hover:border-[#E91E63] transition-colors bg-[#FFF5F7] group-hover:bg-white overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#E91E63]/5 rounded-full blur-2xl" />
              <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-[#FFC1CC]/20 rounded-full blur-xl" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale:1.1 }}
                  className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#FF6F91] flex items-center justify-center shadow-[0_8px_20px_rgba(233,30,99,0.3)]"
                >
                  <Upload size={24} className="text-white" />
                </motion.div>

                <p className="text-sm font-bold text-[#4A2C2C] mb-1">
                  Click to upload
                </p>
                <p className="text-[10px] text-[#8B5E66] uppercase tracking-widest">
                  Image or Video • Max 3.5 MB
                </p>
              </div>
            </div>
          </label>
        ) : (
          /* File preview */
          <div className="relative border-2 border-[#FADADD] rounded-2xl overflow-hidden bg-white">
            <div className="relative aspect-video">
              {isImage && (
                <img src={filePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {isVideo && (
                <video src={filePreview} className="absolute inset-0 w-full h-full object-cover" controls />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* File type badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-[#FADADD] shadow-md flex items-center gap-2">
                {isImage && <ImageIcon size={14} className="text-[#E91E63]" />}
                {isVideo && <Film size={14} className="text-[#E91E63]" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4A2C2C]">
                  {isImage ? "Image" : "Video"}
                </span>
              </div>

              {/* Remove button */}
              <motion.button
                whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* File info */}
            <div className="p-3 bg-[#FFF5F7] border-t border-[#FADADD]">
              <p className="text-xs font-bold text-[#4A2C2C] truncate">{file.name}</p>
              <p className="text-[10px] text-[#8B5E66]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <motion.button
        type="button"
        onClick={handleAdd}
        disabled={loading || !title.trim()}
        whileHover={!loading && title.trim() ? { scale:1.02, y:-2 } : {}}
        whileTap={!loading && title.trim() ? { scale:0.98 } : {}}
        className={`relative w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden group ${
          loading || !title.trim()
            ? "bg-[#FADADD] text-[#8B5E66] cursor-not-allowed"
            : "bg-gradient-to-r from-[#E91E63] to-[#FF6F91] text-white shadow-[0_12px_40px_rgba(233,30,99,0.4)] hover:shadow-[0_18px_50px_rgba(233,30,99,0.5)]"
        }`}
      >
        {!loading && (
          <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
        )}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <motion.span
                animate={{ rotate:360 }}
                transition={{ repeat:Infinity, duration:1, ease:"linear" }}
                className="inline-block"
              >
                ⏳
              </motion.span>
              Adding Memory...
            </>
          ) : (
            <>
              ✨ Add This Memory
            </>
          )}
        </span>
      </motion.button>

      {/* Helper text */}
      <p className="text-[10px] text-center text-[#8B5E66]/60 italic">
        This moment will be added to today's date
      </p>

    </div>
  );
}