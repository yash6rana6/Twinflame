"use client";

import YouTube from "react-youtube";
import { Youtube, Monitor } from "lucide-react";
import { useCallback, useRef } from "react";

export default function Player({
  playerType,     // "youtube" | "video" | "mega"
  videoSrc,
  isHost,
  playerRef,
  onYouTubeState,
  onVideoState,
}) {
  if (!videoSrc) return null;

  // Debounce timeUpdate — max 2× per second to avoid sync flood
  const lastSyncRef = useRef(0);
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

  // ─── Wrapper ────────────────────────────────────────────────────────────────
const PlayerWrapper = ({ children, icon: Icon }) => (
  <div className="relative w-full h-full min-h-[300px] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.7)] group flex items-center justify-center">
    
    {/* Gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-[5]" />

    {/* Badge */}
    <div className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
      <Icon size={14} className="text-pink-400" />
    </div>

    {children}
  </div>
);

  // ─── YouTube ─────────────────────────────────────────────────────────────
  if (playerType === "youtube") {
    return (
      <PlayerWrapper icon={Youtube}>
        {/* Viewer click-blocker (sits above YouTube iframe) */}
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
            },
          }}
          onReady={(e) => {
            playerRef.current = e.target;
          }}
          onStateChange={(e) => onYouTubeState?.(e)}
        />
      </PlayerWrapper>
    );
  }

  // ─── Mega (embed URL) ─────────────────────────────────────────────────────
  if (playerType === "mega") {
    return (
      <PlayerWrapper icon={Monitor}>
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
    );
  }

  // ─── Native video (Streamable, direct file URL, etc.) ───────────────────
  return (
    <PlayerWrapper icon={Monitor}>
      {/*
        z-10 ensures the video (and its native controls bar) sits ABOVE
        the decorative gradient overlay. Without this the controls are
        invisible / unclickable.
      */}
    <video
  key={videoSrc}
  ref={playerRef}
  src={videoSrc}
  controls={isHost}
  autoPlay
  playsInline
  className="max-w-full max-h-full object-contain z-10"
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

      {/* Viewer overlay — pointer-events-auto blocks viewer from right-clicking etc. */}
      {!isHost && (
        <div className="absolute inset-0 z-20 cursor-not-allowed" />
      )}
    </PlayerWrapper>
  );
}