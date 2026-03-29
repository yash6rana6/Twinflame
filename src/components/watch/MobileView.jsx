"use client";
import { useState, useEffect } from "react";
import { Tv, MessageSquare, PlusCircle } from "lucide-react";

export default function MobileView({ roomId, isHost, videoSrc, playerEl, RoomControls, UploadPanel, ChatPanel, handleSetVideo }) {
  const [tab, setTab] = useState("chat");
  const [vHeight, setVHeight] = useState("100dvh");

  useEffect(() => {
    if (!window.visualViewport) return;
    const updateHeight = () => setVHeight(`${window.visualViewport.height}px`);
    window.visualViewport.addEventListener("resize", updateHeight);
    return () => window.visualViewport.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] text-white flex flex-col overflow-hidden" style={{ height: vHeight }}>
      {/* Mini Header */}
      <header className="p-3 border-b border-white/5 flex items-center justify-between bg-black/50">
        <div className="flex items-center gap-2">
          <Tv size={14} className="text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-tighter">#{roomId}</span>
        </div>
        <div className="scale-75 origin-right"><RoomControls roomId={roomId} isHost={isHost} /></div>
      </header>

      {/* Fixed Aspect Ratio Video */}
      <div className="w-full aspect-video bg-black border-b border-white/10 relative">
        <div className={`w-full h-full ${!videoSrc ? "opacity-10 blur-xl" : ""}`}>{playerEl}</div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/5 bg-white/[0.02]">
        <button onClick={() => setTab("chat")} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${tab === "chat" ? "text-pink-500 border-b-2 border-pink-500" : "text-white/20"}`}>Chat</button>
        {isHost && <button onClick={() => setTab("media")} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${tab === "media" ? "text-pink-500 border-b-2 border-pink-500" : "text-white/20"}`}>Media</button>}
      </div>

      {/* Interaction Area (Scrollable) */}
      <div className="flex-1 relative min-h-0 bg-[#0d0d0f]">
        <div className="absolute inset-0 flex flex-col">
          {tab === "chat" ? (
            <ChatPanel roomId={roomId} isHost={isHost} />
          ) : (
            <div className="p-5 h-full overflow-y-auto pb-24">
              <UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}