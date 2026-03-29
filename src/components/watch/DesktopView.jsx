"use client";
import { useState } from "react";
import { Tv, MessageSquare, PlusCircle, MonitorPlay } from "lucide-react";

export default function DesktopView({ roomId, isHost, videoSrc, playerEl, RoomControls, UploadPanel, ChatPanel, handleSetVideo }) {
  const [tab, setTab] = useState("chat");

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] text-white flex flex-col p-4 lg:p-6 gap-4 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#16161a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20"><Tv size={20}/></div>
          <h1 className="font-black uppercase italic tracking-tighter">TwinFlame <span className="text-pink-500 ml-2 opacity-50 text-[10px]">#{roomId}</span></h1>
        </div>
        <RoomControls roomId={roomId} isHost={isHost} />
      </header>

      <main className="flex-1 flex gap-6 min-h-0">
        {/* Left: Player Section */}
        <div className="flex-[3] flex flex-col gap-4">
          <div className="flex-1 bg-black rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
            <div className={`w-full h-full ${!videoSrc ? "opacity-20 blur-2xl scale-110" : ""}`}>{playerEl}</div>
            {!videoSrc && <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30"><MonitorPlay size={48} className="text-pink-500 mb-4"/><span className="font-black uppercase tracking-[0.3em]">Waiting for Cinema</span></div>}
          </div>
        </div>

        {/* Right: Interaction Sidebar */}
        <aside className="flex-1 max-w-[450px] min-w-[380px] bg-[#16161a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex p-2 bg-white/[0.03] border-b border-white/5">
            <button onClick={() => setTab("chat")} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === "chat" ? "bg-pink-600 text-white" : "text-white/30 hover:text-white/60"}`}>Chat</button>
            {isHost && <button onClick={() => setTab("media")} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === "media" ? "bg-pink-600 text-white" : "text-white/30 hover:text-white/60"}`}>Media</button>}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             {tab === "chat" ? <ChatPanel roomId={roomId} isHost={isHost} /> : <div className="p-6"><UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} /></div>}
          </div>
        </aside>
      </main>
    </div>
  );
}