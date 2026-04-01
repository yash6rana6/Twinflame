"use client";
import { Tv, MessageSquare, PlusCircle, User, ShieldCheck } from "lucide-react";

export default function DesktopView({ 
  roomId, isHost, videoSrc, playerEl, RoomControls, UploadPanel, 
  ChatPanel, handleSetVideo, desktopTab, setDesktopTab, PlayerPlaceholder 
}) {
  return (
    <div className="relative z-10 flex flex-col h-full pt-16">
      <header className="mx-8 my-3 max-w-[1700px] xl:mx-auto flex items-center justify-between bg-[#16161a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-8 py-3 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20"><Tv size={16} /></div>
          <h1 className="text-base font-black tracking-tighter uppercase italic">TwinFlame <span className="text-pink-500 font-mono ml-2 text-[10px] opacity-50 not-italic">#{roomId}</span></h1>
        </div>
        <RoomControls roomId={roomId} isHost={isHost} />
      </header>

      <main className="flex-1 min-h-0 mx-8 mb-6 max-w-[1700px] xl:mx-auto flex gap-6 overflow-hidden">
        <div className="flex-[3] flex flex-col gap-4">
          <div className="relative flex-1 bg-[#050506] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className={`w-full h-full transition-all duration-700 ${!videoSrc ? "opacity-20 blur-xl scale-105" : ""}`}>{playerEl}</div>
            {!videoSrc && PlayerPlaceholder}
          </div>
          <div className="flex items-center justify-between px-7 py-3 bg-white/[0.025] border border-white/5 rounded-[1.5rem] backdrop-blur-xl">
            <div className="flex items-center gap-5 opacity-35">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><User size={11} /> {isHost ? "Host" : "Guest"}</span>
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 border-l border-white/10 pl-5"><ShieldCheck size={11} /> Encrypted Sync</span>
            </div>
          </div>
        </div>

        <aside className="flex-1 min-w-[360px] max-w-[440px] bg-[#16161a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
          <div className="flex p-2 bg-white/[0.03] border-b border-white/5">
            <button onClick={() => setDesktopTab("chat")} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${desktopTab === "chat" ? "bg-pink-600 text-white" : "text-white/25 hover:text-white/60"}`}>Chat</button>
            {isHost && <button onClick={() => setDesktopTab("media")} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${desktopTab === "media" ? "bg-pink-600 text-white" : "text-white/25 hover:text-white/60"}`}>Media</button>}
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className={`absolute inset-0 transition-opacity ${desktopTab === "chat" ? "opacity-100 z-10" : "opacity-0 z-0"}`}><ChatPanel roomId={roomId} isHost={isHost} /></div>
            {isHost && <div className={`absolute inset-0 p-5 overflow-y-auto transition-opacity ${desktopTab === "media" ? "opacity-100 z-10" : "opacity-0 z-0"}`}><UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} /></div>}
          </div>
        </aside>
      </main>
    </div>
  );
}