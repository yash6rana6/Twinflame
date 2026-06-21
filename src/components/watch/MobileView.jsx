"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, PlusCircle, Tv } from "lucide-react";

export default function MobileView({
  roomId,
  isHost,
  videoSrc,
  playerEl,
  RoomControls,
  UploadPanel,
  ChatPanel,
  handleSetVideo,
  unread,
  PlayerPlaceholder,
}) {
  const [activeTab, setActiveTab] = useState("chat");
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setViewportHeight(vv.height);
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  return (
    <div
      className="relative z-10 flex flex-col bg-[#0d0d0f] overflow-hidden"
      style={{ height: `${viewportHeight}px` }}
    >
      {/* ── Header ── */}
      <header className="flex-shrink-0 mx-3 mt-3 mb-2 flex items-center justify-between bg-[#16161a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
            <Tv size={12} className="text-white" />
          </div>
          <h1 className="text-xs font-black uppercase italic tracking-tighter text-white truncate">
            TwinFlame
          </h1>
          <span className="font-mono text-[9px] text-white/25 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
            #{roomId}
          </span>
        </div>
        <div className="flex-shrink-0 scale-[0.72] origin-right -mr-1">
          <RoomControls roomId={roomId} isHost={isHost} />
        </div>
      </header>

      {/* ── Video Player ─────────────────────────────────────────────────────
           KEY FIX:
           - aspect-video sets 16:9 ratio correctly
           - w-full ensures it fills horizontal space
           - The inner div is position:relative so Player's absolute children work
           - Player component itself uses absolute inset-0 for YouTube/video
      ── */}
      <div className="flex-shrink-0 px-3">
        <div
          className="relative w-full bg-[#050506] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl"
          style={{ aspectRatio: "16 / 9" }}
        >
          {/* Player fills the 16:9 box completely */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              !videoSrc ? "opacity-20 blur-xl scale-105" : "opacity-100"
            }`}
          >
            {playerEl}
          </div>

          {!videoSrc && (
            <div className="absolute inset-0">
              {PlayerPlaceholder}
            </div>
          )}

          {/* Live dot */}
          {videoSrc && (
            <div className="absolute top-3 right-12 z-40 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/50">
                Live
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex-shrink-0 flex mt-3 mx-3 gap-1 bg-white/[0.03] border border-white/5 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab("chat")}
          className={`relative flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "chat"
              ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
              : "text-white/25"
          }`}
        >
          <MessageSquare size={13} />
          Chat
          {unread > 0 && activeTab !== "chat" && (
            <span className="absolute top-1.5 right-2.5 w-4 h-4 bg-pink-400 rounded-full text-[8px] font-black flex items-center justify-center text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {isHost && (
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "media"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                : "text-white/25"
            }`}
          >
            <PlusCircle size={13} />
            Media
          </button>
        )}
      </div>

      {/* ── Content (Chat / Media) ── */}
      <div className="flex-1 min-h-0 mt-2 mx-3 mb-3 overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#16161a]/60">
        {activeTab === "chat" ? (
          <div className="h-full flex flex-col overflow-hidden">
            <ChatPanel roomId={roomId} isHost={isHost} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto overscroll-contain">
            <div className="p-4 pb-6">
              <UploadPanel
                isHost={isHost}
                onSetVideo={handleSetVideo}
                roomId={roomId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}