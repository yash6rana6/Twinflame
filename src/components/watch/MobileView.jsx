"use client";
import { useState } from "react";
import { MessageSquare, PlusCircle, Tv } from "lucide-react";

export default function MobileView({ 
  roomId, isHost, videoSrc, playerEl, RoomControls, UploadPanel, 
  ChatPanel, handleSetVideo, PlayerPlaceholder 
}) {
  // Local state for tabs since it's UI specific
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="relative z-10 flex flex-col h-full pt-14 bg-[#0d0d0f]">
      
      {/* 1. Header */}
      <header className="mx-4 my-2 flex items-center justify-between bg-[#16161a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-2 shadow-xl">
        <h1 className="text-xs font-black uppercase italic truncate tracking-tighter">
          TwinFlame <span className="text-pink-500 font-mono text-[9px] opacity-50 ml-1">#{roomId}</span>
        </h1>
        <div className="scale-75 origin-right"><RoomControls roomId={roomId} isHost={isHost} /></div>
      </header>

      {/* 2. Video Player Section (Fixed Height/Aspect) */}
      <div className="px-4 flex-shrink-0">
        <div className="relative aspect-video bg-[#050506] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className={`w-full h-full transition-all duration-700 ${!videoSrc ? "opacity-20 blur-xl scale-105" : ""}`}>
            {playerEl}
          </div>
          {!videoSrc && PlayerPlaceholder}
        </div>
      </div>

      {/* 3. Tabs Switcher */}
      <div className="mt-4 flex border-b border-white/5 bg-white/[0.02]">
        <button 
          onClick={() => setActiveTab("chat")} 
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
            ${activeTab === "chat" ? "text-pink-500 border-b-2 border-pink-500 bg-pink-500/5" : "text-white/20"}`}
        >
          <MessageSquare size={14} />
          Chat
        </button>
        
        {isHost && (
          <button 
            onClick={() => setActiveTab("media")} 
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === "media" ? "text-pink-500 border-b-2 border-pink-500 bg-pink-500/5" : "text-white/20"}`}
          >
            <PlusCircle size={14} />
            Media
          </button>
        )}
      </div>

      {/* 4. Content Area (Scrollable) */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 flex flex-col">
          {activeTab === "chat" ? (
            <ChatPanel roomId={roomId} isHost={isHost} />
          ) : (
            <div className="p-5 h-full overflow-y-auto pb-20 custom-scrollbar">
              <UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}