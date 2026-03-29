"use client";

import YouTube from "react-youtube";
import { motion } from "framer-motion";
import { Youtube, Monitor } from "lucide-react";

export default function Player({
  playerType,     // "youtube" ya "video"
  videoSrc,
  isHost,
  playerRef,
  onYouTubeState,
  onVideoState,
}) {
  if (!videoSrc) return null;

  const PlayerWrapper = ({ children, icon: Icon, label }) => (
    <div className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.7)] group">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 z-0" />

      {/* Status Badge */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
        <Icon size={14} className="text-pink-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-white/70">{label}</span>
      </div>

      {children}
    </div>
  );

 // Replace react-youtube entirely with a plain iframe for host
if (playerType === "youtube") {
  return (
    <PlayerWrapper icon={Youtube} label="YouTube Sync">
      {!isHost && <div className="absolute inset-0 z-10" />}

      {isHost ? (
        <iframe
          key={videoSrc}
          src={`https://www.youtube.com/embed/${videoSrc}?autoplay=1&controls=1&rel=0&iv_load_policy=3`}
          className="absolute inset-0 w-full h-full z-[5]"
          allow="autoplay; fullscreen"
          allowFullScreen
          ref={(el) => {
            // can't use playerRef directly with iframe, handle separately
          }}
        />
      ) : (
        <YouTube
          key={videoSrc}
          videoId={videoSrc}
          containerClassName="absolute inset-0 z-[5]"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: { autoplay: 1, controls: 0, disablekb: 1 },
          }}
          onReady={(e) => { playerRef.current = e.target; }}
        />
      )}
    </PlayerWrapper>
  );
}
  // Native Video Player
  return (
    <PlayerWrapper icon={Monitor} label="Custom Video">
      <video
        key={videoSrc}                       // ← Yeh bhi zaroori hai
        ref={playerRef}
        src={videoSrc}
        controls={isHost}
        autoPlay
        className="w-full h-full object-contain bg-black"
        onPlay={() => isHost && onVideoState()}
        onPause={() => isHost && onVideoState()}
        onSeeked={() => isHost && onVideoState()}
      />
    </PlayerWrapper>
  );
}