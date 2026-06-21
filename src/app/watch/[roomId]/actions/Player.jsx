"use client";

import YouTube from "react-youtube";
import { Youtube, Monitor, Maximize } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ── PlayerWrapper — OUTSIDE to prevent remount on resize ─────────────────────
const PlayerWrapper = ({ children, icon: Icon, onFullscreen }) => (
  <div className="relative w-full h-full bg-black rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.7)] flex items-center justify-center">
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-[5]" />

    {/* Badge */}
    <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-30 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
      <Icon size={12} className="text-pink-400" />
    </div>

    {/* Fullscreen button */}
    <button
      onClick={onFullscreen}
      className="absolute top-3 right-3 sm:top-6 sm:right-6 z-30 p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all active:scale-90"
      aria-label="Fullscreen"
    >
      <Maximize size={14} />
    </button>

    {children}
  </div>
);

export default function Player({
  playerType,
  videoSrc,
  isHost,
  playerRef,
  onYouTubeState,
  onVideoState,
  onPlayerReady,
}) {
  if (!videoSrc) return null;

  const lastSyncRef = useRef(0);
  const containerRef = useRef(null);

  // ── Fullscreen handler ─────────────────────────────────────────────────────
  const handleFullscreen = useCallback(() => {
    // For native video — use the video element's own fullscreen
    if (playerType === "video" && playerRef.current?.requestFullscreen) {
      playerRef.current.requestFullscreen().catch(() => {
        // iOS Safari fallback — webkitEnterFullscreen
        playerRef.current?.webkitEnterFullscreen?.();
      });
      return;
    }

    // For YouTube / mega — fullscreen the wrapper div
    const el = containerRef.current;
    if (!el) return;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    req?.call(el);
  }, [playerType, playerRef]);

  const handleTimeUpdate = useCallback(
    (e) => {
      if (!isHost) return;
      const now = Date.now();
      if (now - lastSyncRef.current < 500) return;
      lastSyncRef.current = now;
      onVideoState?.({ type: "timeupdate", currentTime: e.target.currentTime });
    },
    [isHost, onVideoState]
  );

  // ── YouTube ────────────────────────────────────────────────────────────────
  if (playerType === "youtube") {
    return (
      <div ref={containerRef} className="w-full h-full">
        <PlayerWrapper icon={Youtube} onFullscreen={handleFullscreen}>
          {!isHost && (
            <div className="absolute inset-0 z-20 cursor-not-allowed" />
          )}
          <YouTube
            key={videoSrc}
            videoId={videoSrc}
            containerClassName="absolute inset-0 z-10 w-full h-full"
            className="w-full h-full"
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                controls: isHost ? 1 : 0,
                disablekb: isHost ? 0 : 1,
                rel: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,   // iOS: play inline, not auto-fullscreen
              },
            }}
            onReady={(e) => {
              playerRef.current = e.target;
              onPlayerReady?.();
            }}
            onStateChange={(e) => {
              if (isHost) onYouTubeState?.(e);
            }}
          />
        </PlayerWrapper>
      </div>
    );
  }

  // ── Mega (embed) ───────────────────────────────────────────────────────────
  if (playerType === "mega") {
    return (
      <div ref={containerRef} className="w-full h-full">
        <PlayerWrapper icon={Monitor} onFullscreen={handleFullscreen}>
          {!isHost && (
            <div className="absolute inset-0 z-20 cursor-not-allowed" />
          )}
          <iframe
            key={videoSrc}
            src={videoSrc}
            className="absolute inset-0 w-full h-full z-10"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </PlayerWrapper>
      </div>
    );
  }

  // ── Native video ───────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="w-full h-full">
      <PlayerWrapper icon={Monitor} onFullscreen={handleFullscreen}>
        <video
          key={videoSrc}
          ref={(el) => {
            playerRef.current = el;
            if (el) {
              const onMeta = () => {
                onPlayerReady?.();
                el.removeEventListener("loadedmetadata", onMeta);
              };
              el.addEventListener("loadedmetadata", onMeta);
            }
          }}
          src={videoSrc}
          controls={isHost}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-contain z-10"
          onPlay={() =>
            isHost &&
            onVideoState?.({ type: "play", currentTime: playerRef.current?.currentTime })
          }
          onPause={() =>
            isHost &&
            onVideoState?.({ type: "pause", currentTime: playerRef.current?.currentTime })
          }
          onSeeked={() =>
            isHost &&
            onVideoState?.({ type: "seeked", currentTime: playerRef.current?.currentTime })
          }
          onTimeUpdate={handleTimeUpdate}
        />
        {!isHost && (
          <div className="absolute inset-0 z-20 cursor-not-allowed" />
        )}
      </PlayerWrapper>
    </div>
  );
}