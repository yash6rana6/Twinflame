"use client";

// TelegramView — same layout/behavior as MobileView, but this is the
// variant rendered specifically inside the Telegram Mini App (routed from
// WatchRoomUI when isTelegram is true). Kept as a SEPARATE file from
// MobileView on purpose: the chat/media overlay panel here is fully
// transparent (no bg, no blur) so the video shows through underneath,
// matching a live-stream chat overlay feel. Splitting it out means
// normal-website mobile UX and Telegram UX can evolve independently
// without conditional-class spaghetti in one file.

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, PlusCircle, Tv, X } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot
    () => false  // server snapshot
  );
}

export default function TelegramView({
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
  const [openPanel, setOpenPanel] = useState(null);
  const mounted = useMounted();

  const togglePanel = (panel) =>
    setOpenPanel((cur) => (cur === panel ? null : panel));

  const floatingUI = mounted
    ? createPortal(
        <>
          <div className="fixed right-3 bottom-24 z-[9999] flex flex-col gap-3">
            <button
              onClick={() => togglePanel("chat")}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/40 border transition-all active:scale-90 ${
                openPanel === "chat"
                  ? "bg-pink-600 border-pink-400/40 text-white"
                  : "bg-[#16161a]/90 backdrop-blur-xl border-white/10 text-white/70"
              }`}
            >
              <MessageSquare size={18} />
              {unread > 0 && openPanel !== "chat" && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-[#0d0d0f]">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {isHost && (
              <button
                onClick={() => togglePanel("media")}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/40 border transition-all active:scale-90 ${
                  openPanel === "media"
                    ? "bg-pink-600 border-pink-400/40 text-white"
                    : "bg-[#16161a]/90 backdrop-blur-xl border-white/10 text-white/70"
                }`}
              >
                <PlusCircle size={18} />
              </button>
            )}
          </div>

          {/* Fully transparent overlay — no bg, no blur, no border.
              Video underneath stays visible, only text/messages float on top. */}
          {openPanel && (
            <div className="fixed right-3 left-16 bottom-3 top-20 z-[9998] flex flex-col overflow-hidden pointer-events-none">
              <div className="flex-shrink-0 flex items-center justify-end px-1 py-1 pointer-events-auto">
                <button
                  onClick={() => setOpenPanel(null)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-black/30 text-white/70 active:scale-90"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden pointer-events-auto">
                {openPanel === "chat" ? (
                  <ChatPanel roomId={roomId} isHost={isHost} />
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
          )}
        </>,
        document.body
      )
    : null;

  return (
    <div className="relative z-10 flex flex-col bg-[#0d0d0f] overflow-hidden h-full">
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

      <div className="flex-1 min-h-0 px-3 pb-3">
        <div className="relative w-full h-full bg-[#050506] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
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

          {videoSrc && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/50">
                Live
              </span>
            </div>
          )}
        </div>
      </div>

      {floatingUI}
    </div>
  );
}